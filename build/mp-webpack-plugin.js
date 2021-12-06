const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin')
const MultiEntryPlugin = require('webpack/lib/MultiEntryPlugin')
const path = require('path')
const fs = require('fs')
const replaceExt = require('replace-ext')
const { noNeedCompile, uiComponents, usingComponentsAlias } = require('./config')

const assetsChunkName = '__assets_chunk_name__'

const noNeedCompileEntryList = []

function itemToPlugin(context, item, name) {
  if (Array.isArray(item)) {
    return new MultiEntryPlugin(context, item, name)
  }
  return new SingleEntryPlugin(context, item, name)
}

function _inflateEntries(entries = [], dirname, entry) {
  const configFile = replaceExt(entry, '.json')
  const content = fs.readFileSync(configFile, 'utf8')
  const config = JSON.parse(content);
  const { subpackages = [] } = config;
  // 主包页面和组件
  ['pages', 'usingComponents'].forEach(key => {
    const items = config[key]
    if (typeof items === 'object') {
      Object.values(items).forEach(item => inflateEntries(entries, dirname, item))
    }
  })
  // 子包页面和组件
  if (subpackages.length) {
    subpackages.forEach(subPackage => {
      ['pages', 'usingComponents'].forEach(key => {
        const { root } = subPackage
        const items = subPackage[key]
        if (typeof items === 'object') {
          Object.values(items).forEach(item => inflateEntries(entries, dirname, `${root}/${item}`))
        }
      })
    })
  }
}

function inflateEntries(entries, dirname, entry) {
  entry = path.resolve(dirname, entry)
  // noNeedCompile配置中的不需要编译
  noNeedCompile && noNeedCompile.length && noNeedCompile.forEach(item => {
    if (entry.indexOf(item) > -1) {
      noNeedCompileEntryList.push(entry)
    }
  })

  uiComponents && uiComponents.length && uiComponents.forEach(item => {
    if (entry.indexOf(item) > -1) {
      noNeedCompileEntryList.push(entry)
    }
  })

  if (entry != null && !entries.includes(entry) && !noNeedCompileEntryList.includes(entry)) {
    const usingComponentsAliasKeys = Object.keys(usingComponentsAlias)
    const flag = usingComponentsAliasKeys.some(key => {
      if (entry.indexOf(key) > -1) {
        return true
      }
      return false
    })
    if (!flag) {
      entries.push(entry)
      _inflateEntries(entries, path.dirname(entry), entry)
    }
  }
}

function first(entry, extensions) {
  for (const ext of extensions) {
    const file = replaceExt(entry, ext)
    if (fs.existsSync(file)) {
      return file
    }
  }
  return null
}

function all(entry, extensions) {
  const items = []
  for (const ext of extensions) {
    const file = replaceExt(entry, ext)
    if (fs.existsSync(file)) {
      items.push(file)
    }
  }
  return items
}

class MpWebpackPlugin {
  constructor(options = {}) {
    this.scriptExtensions = options.scriptExtensions || ['.ts', '.js']
    this.assetExtensions = options.assetExtensions || []
    this.entries = []
  }

  applyEntry(compiler, done) {
    const { context } = compiler.options

    this.entries
      .map(item => first(item, this.scriptExtensions))
      .map(item => path.relative(context, item))
      .forEach(item => itemToPlugin(context, './' + item, replaceExt(item, '')).apply(compiler))

    // 把所有的非 js 文件都合到同一个 entry 中，交给 MultiEntryPlugin 去处理
    const assets = this.entries
      .reduce((items, item) => [...items, ...all(item, this.assetExtensions)], [])
      .map(item => './' + path.relative(context, item))
    itemToPlugin(context, assets, assetsChunkName).apply(compiler)

    if (done) {
      done()
    }
  }

  apply(compiler) {
    const { context, entry } = compiler.options
    inflateEntries(this.entries, context, entry)

    compiler.hooks.entryOption.tap('MpWebpackPlugin', () => {
      this.applyEntry(compiler)
      return true
    })

    compiler.hooks.watchRun.tap('MpWebpackPlugin', (compiler, done) => {
      this.applyEntry(compiler, done)
    })

    compiler.hooks.compilation.tap('MpWebpackPlugin', compilation => {
      // beforeChunkAssets 事件在 compilation.createChunkAssets 方法之前被触发
      compilation.hooks.beforeChunkAssets.tap('MpWebpackPlugin', () => {
        const assetsChunkIndex = compilation.chunks.findIndex(({ name }) => name === assetsChunkName)
        if (assetsChunkIndex > -1) {
          // 移除该 chunk, 使之不会生成对应的 asset，也就不会输出文件
          // 如果没有这一步，最后会生成一个 __assets_chunk_name__.js 文件
          compilation.chunks.splice(assetsChunkIndex, 1)
        }
      })
    })

    // 构建产物输出前判断小程序组件是否有别名，有就替换别名路径
    compiler.hooks.emit.tapAsync('MyWebpackPlugin', (compilation, callback) => {
      this.entries.forEach(item => {
        const configFilePath = replaceExt(item, '.json')
        const newConfigFilePath = configFilePath.replace(/\\/g, '/')
        const keys = newConfigFilePath.match(/\/src\/(.*$)/)
        const key = keys && keys.length && keys[1]
        if (key) {
          const content = compilation.assets[key]._value
          const contentObj = JSON.parse(content.toString() || '{}')
          const { usingComponents } = contentObj
          Object.keys(usingComponents).forEach(key => {
            Object.keys(usingComponentsAlias).forEach(alias => {
              const reg = new RegExp(`(${alias})(/.*$)`)
              const regArr = usingComponents[key].match(reg)
              if (regArr && regArr.length) {
                let path = regArr[2]
                path = `${usingComponentsAlias[alias]}${path}`
                usingComponents[key] = path
              }
            })
          })
          compilation.assets[key] = {
            source() {
              return JSON.stringify(contentObj, null, '\t')
            },
            size() {
              return this.source().length
            }
          }
        }
      })
      callback()
    })
  }
}

module.exports = MpWebpackPlugin

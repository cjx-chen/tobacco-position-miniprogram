module.exports = {
  // 不需要编译的文件夹名称
  noNeedCompile: [
    // 'vant-weapp',
    // 'parser-min'
  ],
  uiComponents: [
    '@vant/weapp'
  ],
  usingComponentsAlias: {
    '~vant': '/pages/uiComponents/@vant/weapp'
  }
}

const pxtransform = require('postcss-pxtransform')

module.exports = {
  plugins: [
    pxtransform({
      platform: 'weapp',
      designWidth: 414,
      deviceRatio: { 414: 414 / 750 },
      unitPrecision: 0,
    })
  ]
}
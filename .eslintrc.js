module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: 'standard',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  globals: {
    __DEV__: true,
    __WECHAT__: true,
    __ALIPAY__: true,
    App: true,
    Page: true,
    Component: true,
    Behavior: true,
    wx: true,
    getApp: true,
    getCurrentPages: true
  },
  rules: {
    'space-before-function-paren': 'off',
    semi: ['error', 'always'],
    'no-useless-escape': 'off',
    'no-useless-call': 'off'
  }
}

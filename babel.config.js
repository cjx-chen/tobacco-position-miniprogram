module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets:
				{
				  browsers: 'last 2 versions',
				  node: 'current'
				}
      }
    ]
  ],
  plugins: ['@babel/plugin-transform-runtime'],
  compact: false
}

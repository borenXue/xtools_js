module.exports = {
  plugins: [
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread'
  ],
  presets: [
    [
      '@babel/env',
      {
        useBuiltIns: 'usage',
        targets: '> 0.25%, not dead',
        corejs: { version: '3.8' }
      },
    ],
    '@babel/typescript',
  ]
}

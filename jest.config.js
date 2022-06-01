// https://jestjs.io/docs/configuration

module.exports = {
  coverageProvider: "v8",

  projects: [
    {
      displayName: '单元测试',
      testMatch: [
        "**/?(*.)+(spec|test).[tj]s?(x)",
        "!**/?(*.)*\.e2e\.(spec|test).[tj]s?(x)", // 排除 e2e 测试用例
      ],
    },
    {
      displayName: '浏览器测试',
      preset: 'jest-puppeteer',
      testMatch: [
        '**/*.e2e.spec.ts',
      ],
    },
  ],

  reporters: [
    // 'default',
    [
      "jest-junit",
      {
        "outputDirectory": "_docs/jest",
        "outputName": "jest-report.xml"
      },
    ],
    [ // https://www.npmjs.com/package/jest-html-reporters
      'jest-html-reporters',
      {
        publicPath: "./_docs/jest",
        filename: 'jest-report.html'
      },
    ],
    'jest-silent-reporter', 'summary',
  ],
};

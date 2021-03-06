const path = require('path');
const glob = require('glob');

const { babel } = require('@rollup/plugin-babel');
const { terser } = require('rollup-plugin-terser');

// 查找和打包node_modules中的第三方模块
const { nodeResolve } = require('@rollup/plugin-node-resolve');

// 将 CommonJS 转换成 ES2015 模块供 Rollup 处理
const commonjs = require('@rollup/plugin-commonjs');



const pkg = require('./package.json');

const extensions = ['.js', '.ts'];

const resolve = function(...args) {
  return path.resolve(__dirname, ...args);
};




/**
 * 浏览器环境专用
 */
const configBrowserUmd = {
  input: resolve('./src/index.ts'),
  output: [
    { file: resolve(pkg.browser.replace('.min', '')), format: 'umd', name: 'xtools' },
    { file: resolve(pkg.browser), format: 'umd', name: 'xtools', plugins: [terser()] }
  ],
  plugins: [
    nodeResolve({ extensions }),
    commonjs(), // 将第三方依赖打包进 dist/index.js 文件内
    babel({ exclude: ['node_modules/**'], extensions }),
  ],
};

/**
 * NodeJS 环境专用: commonjs + es module
 */
const configMainCjsAndModuleEsList = []
const entries = glob.sync('src/**/*[!(.spec)].ts');
for (const file of entries) {
  let outputMainCjs = pkg.main.substring(0, pkg.main.lastIndexOf('/')) + '/' + file.replace(/src\//, '');
  let outputModuleEs = pkg.module.substring(0, pkg.module.lastIndexOf('/')) + '/' + file.replace(/src\//, '');
  outputMainCjs = outputMainCjs.replace(/\.ts$/, '.js')
  outputModuleEs = outputModuleEs.replace(/\.ts$/, '.js')

  console.log(outputModuleEs, outputMainCjs, file);
  configMainCjsAndModuleEsList.push({
    external: [/\.\//], // 所有项目内相对引用的文件都会被排除
    input: resolve(file),
    output: [
      { file: resolve(outputMainCjs), format: 'cjs' },
      { file: resolve(outputModuleEs), format: 'es' }
    ],
    plugins: [
      nodeResolve({ extensions, modulesOnly: true }),
      babel({ exclude: ['node_modules/**'], extensions }),
    ]
  });

}


module.exports = [
  configBrowserUmd,

  ...configMainCjsAndModuleEsList,
];


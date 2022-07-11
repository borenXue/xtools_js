const path = require('path');
const glob = require('glob');

const { babel } = require('@rollup/plugin-babel');
const { terser } = require('rollup-plugin-terser');

const json = require('@rollup/plugin-json');
const alias = require('@rollup/plugin-alias');

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
 * 浏览器环境专用 - UMD
 */
// const configBrowserUmd = {
//   input: resolve('./src/index.ts'),
//   output: [
//     { file: resolve(pkg.browser.replace('.min', '')), format: 'umd', name: 'xtools' },
//     { file: resolve(pkg.browser), format: 'umd', name: 'xtools', plugins: [terser()] }
//   ],
//   plugins: [
//     alias({
//       entries: [{ find: /^axios$/, replacement: 'axios/dist/axios.js' }]
//     }),
//     json(),
//     nodeResolve({ extensions }),
//     commonjs(), // 将第三方依赖打包进 dist/index.js 文件内
//     babel({ exclude: ['node_modules/**'], extensions }),
//   ],
// };

/**
 * NodeJS 环境专用: commonjs + es module
 */
const configMainCjsAndModuleEsList = []

// TODO: glob 过滤有bug: 没有列出全部的文件, eg: src/tree/array-to-tree.ts
// const entries = glob.sync('src/**/*[!(.spec)].ts');
const entries = glob.sync('src/**/*.ts').filter(it => !it.endsWith('.spec.ts'));
// console.log('entries: ', entries)

for (const file of entries) {
  let outputMainCjs = pkg.main.substring(0, pkg.main.lastIndexOf('/')) + '/' + file.replace(/src\//, '');
  let outputModuleEs = pkg.module.substring(0, pkg.module.lastIndexOf('/')) + '/' + file.replace(/src\//, '');
  outputMainCjs = outputMainCjs.replace(/\.ts$/, '.js')
  outputModuleEs = outputModuleEs.replace(/\.ts$/, '.js')

  // console.log(outputModuleEs, outputMainCjs, file);
  configMainCjsAndModuleEsList.push({
    external: [/\.\//], // 所有项目内相对引用的文件都会被排除
    input: resolve(file),
    output: [
      { file: resolve(outputMainCjs), format: 'cjs' },
      { file: resolve(outputModuleEs), format: 'es' }
    ],
    plugins: [
      json(),
      nodeResolve({ extensions, modulesOnly: true }),
      babel({ exclude: ['node_modules/**'], extensions }),
    ]
  });

}


module.exports = [
  // configBrowserUmd,

  ...configMainCjsAndModuleEsList,
];


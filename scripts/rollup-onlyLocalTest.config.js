const { babel } = require('@rollup/plugin-babel');
const { terser } = require('rollup-plugin-terser');
const extensions = ['.js', '.ts'];


module.exports = [
  {
    input: 'src/FileSystemDirectoryHandle/index.ts',
    output: {
      file: 'dist/myfs-v1.js',
      format: 'iife',
      plugins: [terser()],
    },
    plugins: [
      babel({ extensions }),
    ],
  },
  {
    input: 'src/FileSystemDirectoryHandle/v2.ts',
    output: {
      file: 'dist/myfs-v2.js',
      format: 'iife',
      plugins: [terser()],
    },
    plugins: [
      babel({ extensions }),
    ],
  },
];


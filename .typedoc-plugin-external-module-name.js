
// let justOne = false

module.exports = function customMappingFunction(explicitModuleAnnotation, implicitFromDirectory, path, reflection, context) {
  // if (!justOne) {
  //   console.log('----------------------- start')
  //   console.log(typeof path, path) // /Users/xueboren/MyDream/abcdefg/my-npm-packages/front-packages/packages/xtools.js/src/china/idcard.ts
  //   console.log(typeof explicitModuleAnnotation) // undefined
  //   console.log(typeof implicitFromDirectory, implicitFromDirectory) // string src/china
  //   console.log(typeof reflection) // object: https://typedoc.org/api/classes/reflection.html
  //   console.log(typeof context) // object: https://typedoc.org/api/classes/context.html
  //   console.log('----------------------- end')
  // }
  // justOne = true;

  console.log(explicitModuleAnnotation, implicitFromDirectory, path)

  if (explicitModuleAnnotation === 'IdCard') return 'IdCard 身份证号';

  if (explicitModuleAnnotation === 'Url') return 'Url HTTP请求链接';

  if (explicitModuleAnnotation === 'File') return 'File 文件';

  if (explicitModuleAnnotation) return explicitModuleAnnotation;

  if (implicitFromDirectory.startsWith('src/arithmetic')) {
    return 'GeometryAndArithmetic 几何 && 算法'
  }
  if (implicitFromDirectory.startsWith('src/date')) {
    return 'Date 日期 && 时间'
  }
  if (implicitFromDirectory.startsWith('src/number')) {
    return 'Math 数学'
  }
  if (implicitFromDirectory.startsWith('src/tree')) {
    return 'ArrayAndTree 数组 && 树'
  }

  return "Other 其他辅助工具"
}

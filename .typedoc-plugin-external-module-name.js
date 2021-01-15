
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

  if (explicitModuleAnnotation) return explicitModuleAnnotation;

  if (implicitFromDirectory.startsWith('src/date')) {
    return 'Date Helper'
  }
  if (implicitFromDirectory.startsWith('src/number')) {
    return 'Math Helper'
  }
  if (implicitFromDirectory.startsWith('src/tree')) {
    return 'Array && Tree Helper'
  }
  return "Others"
}

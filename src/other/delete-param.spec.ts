import { expect } from 'chai';
import deleteParamsRecursion from './delete-param';

describe('deleteParamsRecursion 基本场景测试', () => {

  it('普通对象', () => {
    expect(deleteParamsRecursion({
      id: undefined, name: null, desc: '', age: 0,
    })).deep.equal({desc: '', age: 0})
  })

  it('复杂对象 - 内嵌复杂数组', () => {
    expect(deleteParamsRecursion({
      id: undefined, name: null, desc: '', age: 0,
      arr: [{ id: null }, null, '']
    })).deep.equal({desc: '', age: 0, arr: [{}, null, '']})
  })

  it('复杂数组', () => {
    expect(deleteParamsRecursion([{
      id: undefined, name: null, desc: '', age: 0,
      arr: [],
    }, 0, undefined])).deep.equal([{desc: '', age: 0, arr: []}, 0, undefined])
  })

});




describe('deleteParamsRecursion 复杂场景测试 - 自定义选项', () => {
  it('普通对象 - 自定义 delete 选项 - 数组形式', () => {
    expect(deleteParamsRecursion({
      id: undefined, name: null, desc: '', age: 0,
    }, [0, ''])).deep.equal({id: undefined, name: null})
  })

  it('普通对象 - 自定义 delete 选项 - 函数形式', () => {
    expect(deleteParamsRecursion({
      id: undefined, name: null, desc: '', age: 0,
    }, (val) => [0, ''].includes(val))).deep.equal({id: undefined, name: null})
  })


  it('普通数组 - 自定义 array 选项', () => {
    expect(deleteParamsRecursion(
      [1, undefined, '', null],
      { array: [undefined] }
    )).deep.equal([1, '', null]);
  })


  it('复杂数组 - 深层 - 自定义 array 选项', () => {
    expect(deleteParamsRecursion(
      [1, undefined, '', null, { id: undefined, name: 'name', arr: ['abc', undefined, 234] }],
      { array: [undefined, ''] }
    )).deep.equal([1, null, { name: 'name', arr: ['abc', 234] }]);
  })


  it('复杂数组 - 自定义 objectInArray 选项 - false', () => {
    expect(deleteParamsRecursion([
      { id: undefined, age: null }
    ], { objectInArray: false })).deep.equal([{ id: undefined, age: null }]);
  })

  it('复杂数组 - 自定义 objectInArray 选项 - [null]', () => {
    expect(deleteParamsRecursion([
      { id: undefined, age: null }
    ], { objectInArray: [null] })).deep.equal([{ id: undefined }]);
  })

});

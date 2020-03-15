import { expect } from 'chai'
import treeFilter from './tree-filter'

interface TreeItem {
  id: number;
  children?: TreeItem[];
  childList?: TreeItem[];
  [key: string]: any;
}

describe('treeFilter 测试用例', () => {

  it('基本用法', () => {
    expect(treeFilter<TreeItem>([
      { id: 100 }, { id: 200 }, { id: 300 },
      {
        id: 400,
        children: [
          { id: 401 }, { id: 402 }, { id: 403 }
        ],
      },
    ], (currentItem) => (currentItem.id & 1) === 0)).is.deep.equal([
      { id: 100 }, { id: 200 }, { id: 300 },
      {
        id: 400,
        children: [{ id: 402 }],
      },
    ])
  })

  it('参数: childrenKey=childList', () => {
    expect(treeFilter<TreeItem>(
      [
        { id: 100 }, { id: 200 }, { id: 300 },
        {
          id: 400,
          childList: [
            { id: 401 }, { id: 402 }, { id: 403 }
          ],
        },
      ],
      (currentItem) => (currentItem.id & 1) === 0,
      'childList',
    )).is.deep.equal([
      { id: 100 }, { id: 200 }, { id: 300 },
      {
        id: 400,
        childList: [{ id: 402 }],
      },
    ])
  })

  it('回调函数的参数检测', () => {
    const data = [
      { id: 100 }, { id: 200 }, { id: 300 },
      {
        id: 400,
        childList: [
          { id: 401 }, { id: 402 }, { id: 403 }
        ],
      },
    ]
    expect(treeFilter<TreeItem>(
      data,
      (currentItem, index, currentArray, level, globalIndex, originParent, originTree) => {
        if (currentItem.id === 200) return false
        const arrIds = currentArray.map(i => i.id)
        if (currentItem.id === 401) {
          if (
            index === 0 && globalIndex === 4 && level === 2
            // 检测 currentArray
            && arrIds[0] === 401 && arrIds[1] === 402 && arrIds[2] === 403
            // 检测 originParent
            && originParent && originParent.id === 400
            // 检测 originTree 为原始数据 && 值检测
            && originTree === data && originTree[1].id === 200
          ) return false
        }
        return true
      },
      'childList',
    )).is.deep.equal([
      { id: 100 }, { id: 300 },
      {
        id: 400,
        childList: [{ id: 402 }, { id: 403 }],
      },
    ])
  })

})

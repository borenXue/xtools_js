import { expect } from 'chai'
import treeForEach, {
  TreeForEachCallback,
} from './tree-for-each'

interface TreeItem {
  id?: number;
  children?: TreeItem[];
  childList?: TreeItem[];
  [key: string]: any;
}

function wrapper(
  tree: TreeItem[],
  fn: TreeForEachCallback<TreeItem>,
  childrenKey: keyof TreeItem = 'children',
) {
  treeForEach<TreeItem>(
    tree, fn, childrenKey,
  )
  return tree
}

describe('treeForEach 测试用例', () => {

  it('基本功能测', () => {
    expect(wrapper([
      { id: 100 }, { id: 200 }, { id: 300 },
      {
        id: 400,
        children: [{ id: 401 },{ id: 402 },{ id: 403 }]
      },
    ], (currentItem) => {
      currentItem.newId = (currentItem.id || 0) + 1
      delete currentItem.id
    })).is.deep.equal([
      { newId: 101 }, { newId: 201 }, { newId: 301 },
      {
        newId: 401,
        children: [{ newId: 402 },{ newId: 403 },{ newId: 404 }]
      },
    ]);
  })

  it('自定义参数 childrenKey=childs', () => {
    expect(wrapper([
      { id: 100 }, { id: 200 }, { id: 300 },
      {
        id: 400,
        childs: [{ id: 401 },{ id: 402 },{ id: 403 }]
      },
    ], (currentItem) => {
      currentItem.newId = (currentItem.id || 0) + 1
      delete currentItem.id
    }, 'childs')).is.deep.equal([
      { newId: 101 }, { newId: 201 }, { newId: 301 },
      {
        newId: 401,
        childs: [{ newId: 402 },{ newId: 403 },{ newId: 404 }]
      },
    ]);
  })

  it('回调函数的参数验证', () => {
    expect(wrapper([
      { id: 100 }, { id: 200 }, { id: 300 },
      {
        id: 400,
        childs: [{ id: 401 },{ id: 402 },{ id: 403 }]
      },
    ], (currentItem, index, level, globalIndex, parent) => {
      currentItem.newId = (currentItem.id || 0) + 1
      currentItem.index = index
      currentItem.level =  level
      currentItem.parentId = parent ? parent.id : '-pid-'
      currentItem.globalIndex = globalIndex
      // delete currentItem.id
    }, 'childs')).is.deep.equal([
      {
        id: 100,
        newId: 101,
        index: 0,
        level: 1,
        parentId: '-pid-',
        globalIndex: 0,
      }, {
        id: 200,
        newId: 201,
        index: 1,
        level: 1,
        parentId: '-pid-',
        globalIndex: 1,
      }, {
        id: 300,
        newId: 301,
        index: 2,
        level: 1,
        parentId: '-pid-',
        globalIndex: 2,
      },
      {
        id: 400,
        newId: 401,
        index: 3,
        level: 1,
        parentId: '-pid-',
        globalIndex: 3,
        childs: [
          {
            id: 401,
            newId: 402,
            index: 0,
            level: 2,
            parentId: 400,
            globalIndex: 4,
          },
          {
            id: 402,
            newId: 403,
            index: 1,
            level: 2,
            parentId: 400,
            globalIndex: 5,
          },
          {
            id: 403,
            newId: 404,
            index: 2,
            level: 2,
            parentId: 400,
            globalIndex: 6,
          },
        ]
      },
    ]);
  })

})

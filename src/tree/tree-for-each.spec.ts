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
  fnNeedOriginParent: boolean = false,
  fnNeedOriginTree: boolean = false,
) {
  treeForEach<TreeItem>(
    tree, fn, childrenKey,
    fnNeedOriginParent,
    fnNeedOriginTree,
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
    ], (currentItem, index, level, globalIndex, parent, originTree) => {
      currentItem.newId = (currentItem.id || 0) + 1
      delete currentItem.id
      currentItem.index = index
      currentItem.level =  level
      currentItem.parentId = parent ? parent.id : '-pid-'
      currentItem.globalIndex = globalIndex
      currentItem.originTreeIdList = originTree ? originTree.map(i => i.id) : null
    }, 'childs', true, true)).is.deep.equal([
      {
        newId: 101,
        index: 0,
        level: 1,
        parentId: '-pid-',
        globalIndex: 0,
        originTreeIdList: [100, 200, 300, 400],
      }, {
        newId: 201,
        index: 1,
        level: 1,
        parentId: '-pid-',
        globalIndex: 1,
        originTreeIdList: [100, 200, 300, 400],
      }, {
        newId: 301,
        index: 2,
        level: 1,
        parentId: '-pid-',
        globalIndex: 2,
        originTreeIdList: [100, 200, 300, 400],
      },
      {
        newId: 401,
        index: 3,
        level: 1,
        parentId: '-pid-',
        globalIndex: 3,
        originTreeIdList: [100, 200, 300, 400],
        childs: [
          {
            newId: 402,
            index: 0,
            level: 2,
            parentId: 400,
            globalIndex: 4,
            originTreeIdList: [100, 200, 300, 400],
          },
          {
            newId: 403,
            index: 1,
            level: 2,
            parentId: 400,
            globalIndex: 5,
            originTreeIdList: [100, 200, 300, 400],
          },
          {
            newId: 404,
            index: 2,
            level: 2,
            parentId: 400,
            globalIndex: 6,
            originTreeIdList: [100, 200, 300, 400],
          },
        ]
      },
    ]);
  })

  it('回调函数的参数验证 - 不返回 parent 和 originTree', () => {
    expect(wrapper([
      { id: 100 }, { id: 200 }, { id: 300 },
      {
        id: 400,
        childs: [{ id: 401 },{ id: 402 },{ id: 403 }]
      },
    ], (currentItem, index, level, globalIndex, parent, originTree) => {
      currentItem.newId = (currentItem.id || 0) + 1
      delete currentItem.id
      currentItem.index = index
      currentItem.level =  level
      currentItem.parentId = parent ? parent.id : '-pid-'
      currentItem.globalIndex = globalIndex
      currentItem.originTreeIdList = originTree ? originTree.map(i => i.id) : null
    }, 'childs', false, false)).is.deep.equal([
      {
        newId: 101,
        index: 0,
        level: 1,
        parentId: '-pid-',
        globalIndex: 0,
        originTreeIdList: null,
      }, {
        newId: 201,
        index: 1,
        level: 1,
        parentId: '-pid-',
        globalIndex: 1,
        originTreeIdList: null,
      }, {
        newId: 301,
        index: 2,
        level: 1,
        parentId: '-pid-',
        globalIndex: 2,
        originTreeIdList: null,
      },
      {
        newId: 401,
        index: 3,
        level: 1,
        parentId: '-pid-',
        globalIndex: 3,
        originTreeIdList: null,
        childs: [
          {
            newId: 402,
            index: 0,
            level: 2,
            parentId: '-pid-',
            globalIndex: 4,
            originTreeIdList: null,
          },
          {
            newId: 403,
            index: 1,
            level: 2,
            parentId: '-pid-',
            globalIndex: 5,
            originTreeIdList: null,
          },
          {
            newId: 404,
            index: 2,
            level: 2,
            parentId: '-pid-',
            globalIndex: 6,
            originTreeIdList: null,
          },
        ]
      },
    ]);
  })

})

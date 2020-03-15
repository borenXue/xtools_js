import { expect } from 'chai'
import treeMap from './tree-map'

interface TreeItem {
  id?: number;
  children?: TreeItem[];
  childList?: TreeItem[];
}

describe('treeMap 测试用例', () => {
  it('默认用法', () => {
    expect(treeMap<TreeItem>([
      { id: 100 }, { id: 200 }, { id: 300 },
      { id: 400 , children: [{id: 401}, {id: 402}, {id: 403}]},
    ], (item) => {
      return item.id === 100 ? undefined : { desc: `id=${item.id}` }
    })).is.deep.equal([
      { desc: 'id=200' }, { desc: 'id=300' },
      {
        desc: 'id=400',
        children: [{ desc: 'id=401' }, { desc: 'id=402' }, { desc: 'id=403' }],
      },
    ]);
  })

  it('参数: deleteUndefined=true', () => {
    expect(treeMap<TreeItem>([
      { id: 100 }, { id: 200 }, { id: 300 },
      { id: 400 , children: [{id: 401}, {id: 402}, {id: 403}]},
    ], (item) => {
      return item.id === 402 || item.id === 100 ? undefined : { desc: `id=${item.id}` }
    }, true)).is.deep.equal([
      { desc: 'id=200' }, { desc: 'id=300' },
      {
        desc: 'id=400',
        children: [{ desc: 'id=401' }, { desc: 'id=403' }],
      },
    ]);
  })

  it('参数: deleteUndefined=false', () => {
    expect(treeMap<TreeItem>([
      { id: 100 }, { id: 200 }, { id: 300 },
      { id: 400 , children: [{id: 401}, {id: 402}, {id: 403}]},
    ], (item) => {
      return item.id === 402 || item.id === 100 ? undefined : { desc: `id=${item.id}` }
    }, false)).is.deep.equal([
      undefined, { desc: 'id=200' }, { desc: 'id=300' },
      {
        desc: 'id=400',
        children: [{ desc: 'id=401' }, undefined, { desc: 'id=403' }],
      },
    ]);
  })

  it('参数: deleteUndefined=false', () => {
    expect(treeMap<TreeItem>([
      { id: 100 }, { id: 200 }, { id: 300 },
      { id: 400 , childList: [{id: 401}, {id: 402}, {id: 403}]},
    ], (item) => {
      return item.id === 402 || item.id === 100 ? undefined : { desc: `id=${item.id}` }
    }, true, 'childList')).is.deep.equal([
      { desc: 'id=200' }, { desc: 'id=300' },
      {
        desc: 'id=400',
        childList: [{ desc: 'id=401' }, { desc: 'id=403' }],
      },
    ]);
  })

  it(`回调参数测试: {
        currentItem,
        index,
        parent,
        extra {
          previousItem, // 源数据中的上一项
          nextItem, // 源数据中的下一项
          level,
          globalIndex,
          originTree,
        }
  }`, () => {
    expect(treeMap<TreeItem>([
      { id: 100 }, { id: 200 }, { id: 300 },
      { id: 400 , childList: [{id: 401}, {id: 402}, {id: 403}]},
    ], (currentItem, index, parent, extra) => {
      return currentItem.id === 402 || currentItem.id === 100 ? undefined : {
        desc: `id=${currentItem.id}`,
        index,
        parentId: parent ? parent.id : '--',
        globalIndex: extra.globalIndex,
        level: extra.level,
        nextItemId: extra.nextItem ? extra.nextItem.id : '-nextId-',
        previousItemId: extra.previousItem ? extra.previousItem.id : '-previousId-',
        originTreeIdList: extra.originTree.map(item => item.id)
      }
    }, true, 'childList')).is.deep.equal([
      {
        desc: 'id=200',
        index: 1,
        parentId: '--',
        globalIndex: 1,
        level: 1,
        nextItemId: 300,
        previousItemId: 100,
        originTreeIdList: [100, 200, 300, 400],
      }, {
        desc: 'id=300',
        index: 2,
        parentId: '--',
        globalIndex: 2,
        level: 1,
        nextItemId: 400,
        previousItemId: 200,
        originTreeIdList: [100, 200, 300, 400],
      },
      {
        desc: 'id=400',
        index: 3,
        parentId: '--',
        globalIndex: 3,
        level: 1,
        nextItemId: '-nextId-',
        previousItemId: 300,
        originTreeIdList: [100, 200, 300, 400],
        childList: [
          {
            desc: 'id=401',
            index: 0,
            parentId: 400,
            globalIndex: 4,
            level: 2,
            nextItemId: 402,
            previousItemId: '-previousId-',
            originTreeIdList: [100, 200, 300, 400],
          }, {
            desc: 'id=403',
            index: 2,
            parentId: 400,
            globalIndex: 6,
            level: 2,
            nextItemId: '-nextId-',
            previousItemId: 402,
            originTreeIdList: [100, 200, 300, 400],
          }
        ],
      },
    ]);
  })
})

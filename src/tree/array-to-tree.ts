import nestedProperty from 'nested-property'
import {
  ArrayToTreeOptions,
  OrphansStore,
  sortType,
  TreeItemLike,
} from './types'
import treeForEach from './tree-for-each'
import treeSort from './tree-sort'

export interface ArrayItemLike {
  [key: string]: any
  // [key: number]: any
}

export interface TreeItemStore<T extends ArrayItemLike> {
  [key: string]: T
}


const defaultOptions: ArrayToTreeOptions<TreeItemLike> = {
  // 基本参数
  idKey: 'id',
  parentIdKey: 'parentId',
  dataFieldKey: null,
  childrenKey: 'children',
  rootIdValue: undefined,
  // 高级玩法 - 孤儿相关参数
  orphansHandleType: 'root-warning',
  orphansFlagKey: '__is_orphans',
  orphansParent: 'ignore',
  orphansPosition: 'tail',
  // 高级玩法 - 排序相关参数
  sort: null,
}

/**
 * 将数组转化为树形结构
 *
 * @param array 源数据, 对象格式的数组
 * @param options 自定义配置对象
 * 
 */
export default function arrayToTree<
  ArrayItem extends ArrayItemLike,
  TreeItem extends TreeItemLike,
>(
  array: ArrayItem[],
  options?: Partial<ArrayToTreeOptions<TreeItem>>,
): TreeItem[] {
  const opts: ArrayToTreeOptions<TreeItem> = Object.assign({}, defaultOptions, options)

  // 仅存放一级节点
  const rootList: TreeItem[] = []

  // 用于存储所有的孤儿节点
  //  循环过程中也会存储其他非孤儿节点, 但循环终止时只会有孤儿节点
  // 'error' | 'ignore' | 'ignore-warning' | 'root' | 'root-warning'
  const orphanStore: OrphansStore<TreeItem> | undefined = opts.orphansHandleType === 'ignore' ? undefined : {}
  const orphansTempFlagKey = '$$$$$needCheckForOrphans'

  // 用于临时存储所有节点
  //  rootList 与 orphanStore 中存储的都是 该store 中节点的引用
  const store: TreeItemStore<TreeItem> = {}

  for (const item of array) {
    if (!store[item[opts.idKey]]) {
      store[item[opts.idKey]] = {
        [opts.idKey]: item[opts.idKey],
        [opts.childrenKey]: [],
      } as TreeItem;
    } else {
      delete store[item[opts.idKey]][orphansTempFlagKey]
    }
    if (orphanStore) delete orphanStore[item[opts.idKey]]

    // 1、确保该 item 在 store 中对应的记录必须包含该 item 自带的所有属性
    // 2、dataFieldKey 参数处理
    if (opts.dataFieldKey) {
      (store[item[opts.idKey]] as any)[opts.dataFieldKey] = item;
    } else {
      store[item[opts.idKey]] = ({
        ...item,
        [opts.childrenKey]: store[item[opts.idKey]][opts.childrenKey]
      }) as any;
    }


    // 1、rootList && store 中保存该 item 时, 统一使用 store[item.id] 的引用
    // 2、rootList 中的所有对象, 均为 store 中的引用
    if (isRootNode<ArrayItem>(item, opts.parentIdKey, opts.rootIdValue)) {
      rootList.push(store[item[opts.idKey]])
    } else {
      // 非 root 节点的 parentId 不可能为 null、undefined、''
      const parentId = getProperty<ArrayItem>(item, opts.parentIdKey)
      if (!store[parentId] || store[parentId][orphansTempFlagKey]) { // 父节点不存在 或 还没遍历到
        store[parentId] = store[parentId] || { [opts.idKey]: parentId, [opts.childrenKey]: [], [orphansTempFlagKey]: true }
        if (orphanStore) andOrphanItem<TreeItem>(orphanStore, parentId, store[item[opts.idKey]])
      }
      store[parentId][opts.childrenKey].push(store[item[opts.idKey]])
    }
  }

  // 处理孤儿节点 (此时 orphanStore 中数据格式为: { parentId: [{}, {}] })
  if (orphanStore && Object.keys(orphanStore).length > 0) {
    // 报错与警告处理: 生成提示信息, 并抛异常 或 打印警告
    if (opts.orphansHandleType === 'error' || opts.orphansHandleType === 'ignore-warning' || opts.orphansHandleType === 'root-warning') {
      let str = ''
      let count = 0
      for (const key in orphanStore) {
        count += orphanStore[key].length
        const ids = orphanStore[key].map(item => item[opts.idKey])
        str += `\t孤儿项: ${ids} - 对应的父节点不存在: ${key}`
      }
      str = `孤儿元素 (共${count}个):\n` + str
      if (opts.orphansHandleType === 'error') throw new Error(str)
      console.warn(str)
    }
    // 1、孤儿标识字段处理
    // 2、将孤儿项设置为一级节点, 或为其他创建父节点并将父节点作为一级节点(orphansParent)
    if (opts.orphansHandleType === 'root' || opts.orphansHandleType === 'root-warning') {
      for (const objKey in orphanStore) {
        const key = getProperty<TreeItem>(
          orphanStore[objKey][0],
          opts.dataFieldKey ? `${opts.dataFieldKey}.${opts.parentIdKey}` : opts.parentIdKey,
        )
        // currentItem[opts.orphansFlagKey] = true
        // const xxx = 
        // 孤儿标识字段处理
        if (opts.orphansFlagKey) {
          treeForEach<TreeItem>(orphanStore[objKey], (currentItem) => {
            if (opts.orphansFlagKey && typeof opts.orphansFlagKey == 'string') {
              // @ts-ignore
              currentItem[opts.orphansFlagKey] = true;
            }
          }, opts.childrenKey)
        }
        // 是否创建父节点 && 将孤儿项设置为一级节点
        if (opts.orphansParent === 'create') {
          const nItem = opts.dataFieldKey ? {
            [opts.idKey]: key,
            [opts.dataFieldKey]: { [opts.idKey]: key },
            [opts.childrenKey]: orphanStore[objKey],
          } : {
            [opts.idKey]: key,
            [opts.childrenKey]: orphanStore[objKey],
          }
          if (opts.orphansFlagKey) nItem[opts.orphansFlagKey] = true
          rootAddOrphansItem(rootList, nItem, opts.orphansPosition)
        } else {
          orphanStore[objKey].forEach((it) => rootAddOrphansItem(rootList, it, opts.orphansPosition))
        }
      }
    }
  }

  /**
   * 排序处理 (孤儿节点的 head 或 tail 已处理过了)
   *    孤儿节点不参与排序(因为父节点不正常, 所以排序意义不大)
   */
  // 普通节点不需要排序
  if (!opts.sort) return rootList

  if (typeof opts.sort === 'function') return treeSort<TreeItem>(
    rootList, opts.sort, undefined,
    opts.childrenKey as string,
  )


  let sortType: sortType = 'asc'
  let sortKey: string = ''
  if (typeof opts.sort === 'string') {
    sortKey = opts.sort;
  }
  if (opts.sort instanceof Array && opts.sort.length  === 1) {
    sortKey = opts.sort[0] as string;
  }
  if (opts.sort instanceof Array && opts.sort.length > 1) {
    sortKey = (opts.sort as string[])[0]
    sortType = ((opts.sort as string[])[1] || 'asc') as any
  }

  const sortFn = (a: TreeItem, b: TreeItem) => {
    if (opts.orphansFlagKey) {
      if (a[opts.orphansFlagKey] && b[opts.orphansFlagKey]) return 0
      if (a[opts.orphansFlagKey] && !b[opts.orphansFlagKey]) return opts.orphansPosition === 'head' ? -1 : 1
      if (!a[opts.orphansFlagKey] && b[opts.orphansFlagKey]) return opts.orphansPosition === 'head' ? 1 : -1
    }
    const aKey = opts.dataFieldKey ? a[opts.dataFieldKey][sortKey] : a[sortKey]
    const bKey = opts.dataFieldKey ? b[opts.dataFieldKey][sortKey] : b[sortKey]
    if (sortType === 'asc') {
      return aKey > bKey ? 1 : -1
    } else {
      return aKey > bKey ? -1 : 1
    }
  }

  return treeSort<TreeItem>(rootList, sortFn, sortType, opts.childrenKey as string)
}

/**
 * 将孤儿节点添加到 orphansStore 中
 * 1、如果
 *
 * @param orphansStore
 * @param parentId 
 * @param obj 
 */
function andOrphanItem<TTreeItem>(
  orphansStore: OrphansStore<TTreeItem>,
  parentId: number,
  obj: TTreeItem,
) {
  if (!orphansStore[parentId]) {
    orphansStore[parentId] = []
  }
  orphansStore[parentId].push(obj)
}

function rootAddOrphansItem<TTreeItem>(
  rootList: TTreeItem[],
  item: TTreeItem,
  orphansPosition: typeof defaultOptions.orphansPosition,
) {
  if (orphansPosition === 'head') {
    rootList.unshift(item)
  } else {
    rootList.push(item)
  }
}

/**
 * 该节点是否为一级节点, 满足以下任一条件即可: (不包含孤儿节点的处理)
 *  1、parentId 等于 rootIdValue
 *  2、parentId 为 undefined 或 null 或 空字符串
 *
 * @param obj
 * @param parentIdKey
 * @param rootIdValue
 */
function isRootNode<TArrayItem>(
  obj: TArrayItem,
  parentIdKey: typeof defaultOptions.parentIdKey,
  rootIdValue: typeof defaultOptions.rootIdValue,
): boolean {
  const parentId = getProperty<TArrayItem>(obj, parentIdKey)
  if (parentId === rootIdValue) return true
  if (parentId === null || parentId === undefined || parentId === '') return true
  return false
}

function getProperty<Item>(obj: Item, key: string): any {
  if (key.indexOf('.') >= 0) {
    return nestedProperty.get(obj, key)
  } else {
    // @ts-ignore
    return obj[key]
  }
}

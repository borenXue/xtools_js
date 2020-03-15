import { TreeItemLike } from "./types"

export interface TreeMapCallback<TreeItem> {
  (
    /**
     * 当前项
     */
    currentItem: TreeItem,
    /**
     * 当前项在其他父节点的 children 数组中的索引
     */
    index: number,
    /**
     * 父节点
     */
    parent: TreeItem | undefined,
    extra: {
      previousItem: TreeItem | undefined;
      nextItem: TreeItem | undefined;
      /**
       * 当前项所在层级, 从 1 开始
       */
      level: number;
      /**
       * 全局索引
       */
      globalIndex: number,
      /**
       * 源数据
       */
      originTree: TreeItem[],
    },
  ): TreeItem | undefined | any
}

export default function treeMap<TreeItem extends TreeItemLike>(
  tree: TreeItem[],
  fn: TreeMapCallback<TreeItem>,
  deleteUndefined: boolean = true,
  childrenKey: keyof TreeItem = 'children',
): TreeItem[] {
  if (typeof childrenKey !== 'string') return tree
  const [newTree, thisNeedDelete] = handler<TreeItem>({
    tree,
    fn,
    childrenKey,
    parent: undefined,
    globalIndex: 0,
    originTree: tree.slice(),
    level: 1,
    deleteUndefined,
  })
  if (deleteUndefined === true && thisNeedDelete) return newTree.filter(i => i !== undefined)
  return newTree
}

function handler<TreeItem>(params: {
  tree: TreeItem[],
  fn: TreeMapCallback<TreeItem>,
  childrenKey: keyof TreeItem,
  parent: TreeItem | undefined,
  globalIndex: number,
  originTree: TreeItem[],
  level: number,
  deleteUndefined: boolean,
}): [TreeItem[], boolean] {

  // 标识该数组是否含有 undefined, 减少不必要的 filter 消耗
  let needDelete = false

  // 用来确保回调函数 fn 中的参数 previousItem 为处理前的数据
  let originPreviousItem = undefined

  // 遍历数组 tree, 对每个 item 执行 fn 操作
  for (let i = 0; i < params.tree.length; i++) {
    const childs = params.tree[i][params.childrenKey] || []
    const originParent = params.tree[i]
    const tempItemResult = params.fn(
      params.tree[i],
      i,
      params.parent,
      {
        previousItem: originPreviousItem || undefined,
        nextItem: i < params.tree.length ? params.tree[i + 1] : undefined,
        level: params.level,
        globalIndex: params.globalIndex++,
        originTree: params.originTree,
      },
    )
    originPreviousItem = params.tree[i]
    params.tree[i] = tempItemResult
    // 如果 fn 返回 undefined, 则标识 needDelete 为 true
    if (params.tree[i] === undefined) needDelete = true

    // 循环处理 children 项
    if (childs && childs instanceof Array && childs.length > 0) {
      const result = handler({
        tree: childs as TreeItem[],
        fn: params.fn,
        childrenKey: params.childrenKey,
        parent: originParent,
        globalIndex: params.globalIndex++,
        originTree: params.originTree,
        level: params.level + 1,
        deleteUndefined: params.deleteUndefined
      });
      params.tree[i][params.childrenKey] = result[0] as any;
      if (params.deleteUndefined === true && result[1] === true) {
        params.tree[i][params.childrenKey] = (params.tree[i][params.childrenKey] as any).filter((i: any) => i !== undefined)
      }
    }
  }

  return [params.tree, needDelete]
}
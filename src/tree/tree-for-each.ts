import { TreeItemLike } from "./types";

export interface TreeForEachCallback<TreeItem extends TreeItemLike> {
  (
    currentItem: TreeItem,
    index: number,
    level: number,
    globalIndex: number,
    parent?: TreeItem,
    originTree?: TreeItem[],
  ): void
}

export default function treeForEach<TreeItem extends TreeItemLike>(
  tree: TreeItem[],
  fn: TreeForEachCallback<TreeItem>,
  childrenKey: keyof TreeItem = 'children',
  fnNeedOriginParent: boolean = false,
  fnNeedOriginTree: boolean = false,
): void {
  handler(
    tree,
    fn,
    childrenKey,
    0,
    1,
    fnNeedOriginParent,
    undefined,
    // TODO: 按需深度复制
    fnNeedOriginTree === true ? JSON.parse(JSON.stringify(tree)) : undefined,
  )
}

function handler<TreeItem extends TreeItemLike>(
  tree: TreeItem[],
  fn: TreeForEachCallback<TreeItem>,
  childrenKey: keyof TreeItem = 'children',
  globalIndex: number,
  level: number,
  fnNeedOriginParent: boolean,
  parent: TreeItem | undefined,
  originTree?: TreeItem[],
): void {
  if (!tree || !(tree instanceof Array) || tree.length === 0) return;

  for (let i = 0; i < tree.length; i++) {
    // TODO: 按需深度复制
    const currentItem = fnNeedOriginParent === true ? JSON.parse(JSON.stringify(tree[i])) : undefined
    fn(tree[i], i, level, globalIndex++, parent, originTree)

    // TODO: childs 应该读取 currentItem 还是 tree[i](有可能已经删除了 children 字段)
    if (!tree[i] || typeof childrenKey !== 'string' || !tree[i][childrenKey]) continue;
    const childs: TreeItem[] = tree[i][childrenKey] || []
    if (childs.length === 0) continue;

    handler(
      childs, fn, childrenKey,
      globalIndex++, level + 1, fnNeedOriginParent,
      currentItem,
      originTree,
    )
  }
}

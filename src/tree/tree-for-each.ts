import { TreeItemLike } from "./types";

export interface TreeForEachCallback<TreeItem extends TreeItemLike> {
  (
    currentItem: TreeItem,
    index: number,
    level: number,
    globalIndex: number,
    parent?: TreeItem,
  ): void
}

export default function treeForEach<TreeItem extends TreeItemLike>(
  tree: TreeItem[],
  fn: TreeForEachCallback<TreeItem>,
  childrenKey: keyof TreeItem = 'children',
): void {
  handler(
    tree,
    fn,
    childrenKey,
    0,
    1,
    undefined,
  )
}

function handler<TreeItem extends TreeItemLike>(
  tree: TreeItem[],
  fn: TreeForEachCallback<TreeItem>,
  childrenKey: keyof TreeItem = 'children',
  globalIndex: number,
  level: number,
  parent?: TreeItem,
): void {
  if (!tree || !(tree instanceof Array) || tree.length === 0) return;

  for (let i = 0; i < tree.length; i++) {
    const key = typeof childrenKey === 'string' ? childrenKey : 'children'

    // 确保 fn 中不可修改 children
    const childs: TreeItem[] = tree[i][key] || []
    fn(tree[i], i, level, globalIndex++, parent)

    if (!tree[i] || !tree[i][childrenKey]) continue;
    if (childs.length === 0) continue;

    handler(
      childs, fn, childrenKey,
      globalIndex++, level + 1,
      tree[i],
    )
  }
}

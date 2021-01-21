import { TreeItemLike } from "./types";

/**
 * {@link treeForEach} 的回调函数
 */
export interface TreeForEachCallback<TreeItem extends TreeItemLike> {
  (
    /**
     * 当前遍历到的项
     */
    currentItem: TreeItem,
    /**
     * 当前遍历到的项, 在其父节点的 children 数组中的序号
     */
    index: number,
    /**
     * 当前遍历到的项, 所在的层级
     */
    level: number,
    /**
     * 当前遍历到的项, 在整个树中的序号 (深度优先)
     */
    globalIndex: number,
    /**
     * 当前遍历到的项, 的父节点
     */
    parent?: TreeItem,
  ): void
}

/**
 * 遍历树中的每个节点, 深度优先原则
 *
 * @param tree 树结构数组
 * @param fn 回调函数
 * @param childrenKey 子节点集合的属性名, 默认为'children'
 */
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

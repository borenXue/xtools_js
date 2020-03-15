import { TreeItemLike } from "./types";

export interface TreeFilterCallback<TreeItem> {
  (
    currentItem: TreeItem,
    index: number,
    currentArray: TreeItem[],
    level: number,
    globalIndex: number,
    originParent?: TreeItem,
    originTree?: TreeItem[],
  ): boolean
}

export default function treeFilter<TreeItem extends TreeItemLike>(
  tree: TreeItem[],
  fn: TreeFilterCallback<TreeItem>,
  childrenKey: keyof TreeItem = 'children',
  // fnNeedOriginParent: boolean = false,
  // fnNeedOriginTree: boolean = false,
): TreeItem[] {

  return handlerFilter(
    tree.slice(),
    fn,
    childrenKey,
    0,
    1,
    undefined,
    tree,
  );

}

function handlerFilter<TreeItem>(
  tree: TreeItem[],
  fn: TreeFilterCallback<TreeItem>,
  childrenKey: keyof TreeItem,
  globalIndex: number,
  level: number,
  // fnNeedOriginParent: boolean,
  parent: TreeItem | undefined,
  originTree: TreeItem[],
): TreeItem[] {

  const newTree = tree.filter((currentItem, index, currentArray) => fn(
    currentItem,
    index,
    currentArray,
    level,
    globalIndex++,
    parent,
    // fnNeedOriginParent ? parent : undefined,
    originTree
  ));

  if (typeof childrenKey !== 'string') return newTree

  for (let i = 0; i < tree.length; i++) {
    const childs = tree[i][childrenKey]
    if (!childs || !(childs instanceof Array) || childs.length === 0) continue;

    tree[i][childrenKey] = handlerFilter(
      childs, fn, childrenKey,
      globalIndex++, level + 1,
      tree[i], originTree,
    ) as any
  }

  return newTree
}

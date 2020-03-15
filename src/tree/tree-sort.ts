import { TreeItemLike, SortFunction } from "./types"

export default function treeSort<TreeItem extends TreeItemLike>(
  tree: TreeItem[],
  sortBy: SortFunction<TreeItem> | string = 'id',
  sortType: 'desc' | 'asc' = 'asc',
  childrenKey: string = 'children',
): TreeItem[] {

  let sortFn = null
  if (typeof sortBy === 'string') {
    sortFn = (a: TreeItem, b: TreeItem) => {
      if (a[sortBy] === b[sortBy]) return 0
      if (sortType === 'asc') {
        return a[sortBy] > b[sortBy] ? 1 : -1
      } else {
        return a[sortBy] > b[sortBy] ? -1 : 1
      }
    }
  } else if (typeof sortBy === 'function') {
    sortFn = sortBy
  }

  if (typeof sortFn !== 'function') return tree

  tree.sort(sortFn as any)
  for (const item of tree) {
    if (item[childrenKey] && item[childrenKey].length > 0) {
      treeSort(item[childrenKey], sortFn, sortType, childrenKey)
    }
  }

  return tree
}

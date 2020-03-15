
export interface TreeItemLike {
  children?: TreeItemLike[]
  [key: string]: any
}

export interface OrphansStore<T> {
  [key: string]: T[]
}



export type sortType = 'desc' | 'asc'
export type sortKey = keyof TreeItemLike

export type orphansHandleType = 'error' | 'ignore' | 'ignore-warning' | 'root' | 'root-warning'

export interface SortFunction<T extends TreeItemLike> {
  (a: T, b: T): number
}

export interface ArrayToTreeOptions<T> {
  /**
   * id 的属性名
   * 
   * 默认值: 'id'
   */
  idKey: string,

  /**
   * 父 id 的属性名【支持 nested 语法】
   * 
   * eg: 'parent.id'、'parentId'
   * 
   * 默认值: 'parentId'
   */
  parentIdKey: string,

  /**
   * 下级节点数组所在的属性名
   *
   * 默认值: 'children'
   */
  childrenKey: keyof T,

  /**
   * 根节点的 ID 值
   * 
   * 只有当某个普通节点的 parentId 为 null 或 undefined 或 rootIdValue 时, 该节点才会被判定为一级节点
   * 
   * 默认值: undefined
   */
  rootIdValue: null | string | number | undefined,

  /**
   * 是否将数据放到 tree 中的指定字段中, null 代表不放, string 类型代表所放的字段名
   *
   * 默认值: null
   */
  dataFieldKey: string | null,



  /**
   * 指定排序规则, 默认值: null
   * 
   * 
   * 默认设置: 孤儿项自动设置为一级节点, 并且放到所有普通节点的后面, 普通节点不排序
   * 
   * 
   * 有关孤儿节点的排序的前提是:
   *    只有当 孤儿节点的处理方式 orphansHandleType 为 root 或 root-warning 时才会生效
   *      因为其他情况下, 孤儿节点会被丢弃, 不包含在结果树中
   * 多个孤儿节点之间不会相互排序, 只支持使用源数组数据中的默认顺序
   * 
   * 
   * null: 不排序, 使用原始数据数组中的顺序, 仅孤儿项后置为一级节点
   * 
   * SortFunction: 自定义排序函数, 注: 也需要处理孤儿项的排序规则 (__is_orphans=true, 代表为孤儿节点)
   * 
   * sortKey: 任意非空字符串, 指定根据哪个属性的值来进行排序
   * 
   * sortType: 'desc' 或 'asc', 配合 sortSortKey 指定的属性名, 来决定是降序 或者 升序, 默认为 asc 即升序
   * 
   *
   * eg:
   *    sort = null: 代表使用默认排序规则, 即普通节点不排序 + 孤儿节点放到所有普通节点的后面
   *    sort = function: 代表排序处理完全交由该 function 来进行处理, 包括孤儿节点的排序
   *    sort = 'order': 代表使用属性 order 的值进行排序处理(默认升序) + 孤儿节点放到所有普通节点的后面
   *          等效于: sort=['order']、sort=['order', 'asc]
   *    sort = ['order', 'asc']  与 sort='order' 效果完全一致
   *    sort = ['order', 'desc'] 与 sort='order' 效果一致, 唯一不同点: 普通节点按降序处理外
   */
  sort: null
    | SortFunction<T>
    | sortKey
    | [sortKey]
    | [sortKey, sortType],



  /**
   * 孤儿节点的处理方式即检测到源数据中包含孤儿节点时 如何处理这些节点
   *
   * 默认值为 'root-warning'
   *
   *    error: 程序抛出异常
   *
   *    ignore: 直接忽略孤儿节点, 不抛异常、不警告、不返回
   * 
   *    ignore-warning: 不抛异常、不返回, 但会在控制台警告(console.warn)
   * 
   *    root: 不抛异常、不警告、但会作为一级节点返回
   *        通过 orphansParent 参数可控制, 该节点作为一级节点, 还是使用空的父节点包装后, 父节点作为一级节点
   * 
   *    root-warning: 不抛异常、但会在控制台警告(console.warn)、且会作为一级节点返回
   *        通过 orphansParent 参数可控制, 该节点作为一级节点, 还是使用空的父节点包装后, 父节点作为一级节点
   * 
   * 
   * 孤儿节点: 指某个节点的父节点非空, 且不等于根节点, 且源数组中不包含其父节点的数据
   *    额外说明: 返回结果中包含的孤儿节点 也是允许有 下级节点的
   */
  orphansHandleType: orphansHandleType,
  /**
   * 标记某个节点为孤儿节点时 使用的属性名 (相当于给该节点添加一个新的属性, 用来标记是否是孤儿节点, 值为 true 或 false)
   *
   *    string: 属性名, 为空字符串时等同于 null
   * 
   *    null: 不添加标记
   * 
   * 
   * 默认值: '__is_orphans'
   * 
   * 
   * 孤儿节点: 指某个节点的父节点非空, 且不等于根节点, 且源数组中不包含其父节点的数据
   *    额外说明: 返回结果中包含的孤儿节点 也是允许有 下级节点的
   */
  orphansFlagKey: string | null | undefined,
  /**
   * 返回孤儿节点的方式
   * 
   *    ignore: 直接将孤儿节点作为一级节点返回
   * 
   *    create: 创建一个父节点, 将孤儿节点放到 children 数组中, 并将创建的父节点作为一级节点返回
   * 
   * 
   * 默认值: 'ignore'
   * 
   * 
   * 孤儿节点: 指某个节点的父节点非空, 且不等于根节点, 且源数组中不包含其父节点的数据
   *    额外说明: 返回结果中包含的孤儿节点 也是允许有 下级节点的
   * 
   * eg:
   *    源数据: [ ..., { id: 1, parentId: 1234 } ]
   *      当源数据中不包含 parentId 为 1234 节点时, id=1的这个节点即为孤儿节点
   *    当 orphansParent='ignore' 时, 返回结果示例如下: (该节点被作为一级节点返回)
   *        [
   *          ...,
   *          { id: 1, parentId: 1234 }
   *        ]
   *    当 orphansParent='create' 时, 返回结果示例如下: (该节点的父节点被创建 并 作为一级节点返回)
   *        [
   *          ...,
   *          {
   *            id: 1234,
   *            children: [ { id: 1, parentId: 1234 } ]
   *          }
   *        ]
   */
  orphansParent: 'ignore' | 'create',
  /**
   * 孤儿元素们在树结构中的位置 (孤儿元素之前不支持排序)
   *  
   *  head: 孤儿元素放到所有普通元素的前面
   * 
   *  tail: 孤儿元素放到所有普通元素的后面
   * 
   * 默认值: 'tail'
   */
  orphansPosition: 'head' | 'tail',
}

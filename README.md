# `xtools.js`

## 功能概览

* 数学计算
  - `accAdd(n1, n2, n3, ...)`: 将参数依次相加, n1 + n2 + n3 + ...
  - `accSub(n1, n2, n3, ...)`: 将参数依次相减, n1 - n2 - n3 -...
  - `accMulti(n1, n2, n3, ...)`: 将参数依次相乘, n1 * n2 * n3 * ...
  - `accDiv(n1, n2, n3, ...)`: 将参数依次相除, n1 / n2 / n3 / ...
* 数组与树
  - `arrayToTree(arrData, options)`: 将数组转化为树
  - `treeForEach(tree, callback, childrenKey)`: 依顺序遍历树中的第一项, 并执行 callback
* 日期相关
  - `timeBetweenMonth(startTime, endTime): [number, number]`: 返回两个时间所在月份区间的第一毫秒与最后一毫秒 (时间戳)
  - `timeBetweenDay(startTime, endTime): [number, number]`: 返回两个时间所在日期区间的第一毫秒与最后一毫秒 (时间戳)
  - `timeDayStart(time): number`: 该时间当天的第一毫秒
  - `timeDayEnd(time): number`: 该时间当天的最后一毫秒
  - `formatDate(time, 'YYYY-MM-DD HH:mm:ss')`: 格式化该时间
* `validIdCard(idCardString): boolean`: 校验身份证是否合法
* `formatMoney(money)`: 格式化金额, 返回格式后的字符串


## 数组 && 树 操作

### `arrayToTree(arrData, options)` 数组转树

`options` 参数用法, 请参考 [ArrayToTreeOptions 定义](src/tree/types.ts)

```javascript
import { arrayToTree } from 'xtools_js'

const arr = [
  { id: 1, parentId: 0 },
  { id: 2, parentId: 1 },
  { id: 3, parentId: 1 },
  { id: 4, parentId: 2 },
]
const tree = arrayToTree(arr, { rootIdValue: 0 })

// tree 结果如下:
// [
//   { "id": 1, "parentId": 0,
//     "children": [
//         { "id": 2, "parentId": 1,
//           "children": [
//               { "id": 4, "parentId": 2, "children": [] }
//           ],
//         },
//         { "id": 3, "parentId": 1, "children": [] }
//     ],
//   }
// ]
```

### `treeForEach(tree, callback, childrenKey)` 遍历树并今次执行 callback

* 遍历的顺序: 将 tree 转为格式化的 json 文件后, 从上往下阅读的顺序即是遍历顺序
* tree 为数组格式
* childrenKey 为可选参数, 默认值为 `'children'`
* 回调函数中的 parent: 因父节点先于子节点被遍历, 所以该 parent 为 callback 函数中修改后值

```javascript
treeForEach(tree, (item, index, level, globalIndex, parent) => {
  // item: 当前项
  // index: 当前项在同级中的顺序
  // level: 当前项所在层级, 从1开始
  // globalIndex: 当前项在 forEach 中的遍历顺序, 从0开始
  // parent: 当前项的父节点
})

```
 

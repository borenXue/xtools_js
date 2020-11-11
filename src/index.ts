/**
 * 参考:
 *    array-to-tree: https://github.com/alferov/array-to-tree/blob/master/index.js
 *    performant-array-to-tree: https://github.com/philipstanislaus/performant-array-to-tree/blob/master/src/arrayToTree.ts
 *    array-tree-filter: https://github.com/afc163/array-tree-filter/blob/master/index.ts
 *
 * TODO: tree 相关的函数
 *  原始数据是否改变应与 Array 中对应的方式一致
 *  originParent、originTree 是否是原对象、还是引用、仅仅是值一致？
 *  函数中不定义 TreeItem, 而是全部替换为泛型
 *  treeMap 函数 fn 中的参数 originTree: 深度复制+函数属性兼容 or ===原始数据
 */

// tree
import arrayToTree from './tree/array-to-tree'
import treeForEach from './tree/tree-for-each'
import treeMap from './tree/tree-map'
import treeSort from './tree/tree-sort'
import treeFilter from './tree/tree-filter'

// number
import { accAdd, accSub, accMulti, accDiv } from './number/index';

// china
import { validIdCard } from './china/idcard';

// date
import formatDate from './date/format-date';
import { timeBetweenMonth, timeBetweenDay, timeMonthStart, timeMonthEnd, timeDayStart, timeDayEnd, timeLastMonth, timeIsBetweenMonth } from './date/index';

// other
import { fileDownload } from './other/file-download';
import formatMoney from './other/format-money';
import heartCheck from './other/heart-check'
import { urlAddParams, urlGetFileName, urlGetParams  } from './other/url';
import { padLeft } from './utils/index';

export {
  // tree
  arrayToTree,
  treeForEach,
  treeMap,
  treeSort,
  treeFilter,
  // number
  accAdd, accSub, accMulti, accDiv,
  // china
  validIdCard,
  // date
  formatDate,
  timeBetweenMonth, timeBetweenDay,
  timeMonthStart, timeMonthEnd,
  timeDayStart, timeDayEnd,
  timeLastMonth, timeIsBetweenMonth,
  // other
  fileDownload,
  urlAddParams, urlGetFileName, urlGetParams,
  padLeft,
  formatMoney,
  heartCheck,
}

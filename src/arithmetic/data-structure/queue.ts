
export type PriorityQueueItem = any;

export class PriorityQueue {

  data: PriorityQueueItem[];
  compare: Function;

  constructor(compare: Function) {
    if (typeof compare !=='function') throw new Error('compare function required!')
    this.data = [];
    this.compare = compare;
  }

  isEmpty() { return this.data.length === 0;}

  /** 添加元素 */
  push(element: PriorityQueueItem) {
    let index = this.search(element);
    this.data.splice(index, 0, element);
    return this.data.length;
  }

  /** 取出最优元素 */
  pop() {
    return this.data.pop()
  }

  /** 查看最优元素 */
  peek() {
    return this.data[this.data.length - 1];
  }

  /** 二分查找 寻找插入位置 */
  search(target: PriorityQueueItem) {
    let low = 0, high = this.data.length
    while (low < high) {
      // >> 1 相当于 %2 后取商, 忽略余数
      let mid = low + ((high - low) >> 1)
      if (this.compare(this.data[mid], target) > 0) {
        high = mid
      }
      else {
        low = mid + 1
      }
    }
    return low;
  }
}

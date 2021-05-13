// 全局 loading 管理器
let loadingTimes = 0;
export function showLoading(fn) {
  if (loadingTimes === 0) {
    typeof fn === 'function' && fn();
  }
  loadingTimes++;
}
export function closeLoading(fn) {
  loadingTimes--;
  if (loadingTimes == 0) {
    typeof fn === 'function' && fn();
  }
}


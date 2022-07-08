/**
 * 心跳检测, 按心跳策略执行某个函数, 直至该函数返回 true, 超时则 reject
 * 
 * @param checkSyncFn 检测方法-只能返回 true or false
 * @param heartTime 心跳间隔, 单位毫秒 - 默认 500ms
 * @param timeout 超时时间, 单位毫秒 - 默认 30000ms, 即30秒
 */
export default function hearCheck(checkSyncFn: () => boolean, heartTime = 500, timeout = 30000): Promise<Boolean> {
  return new Promise((resolve, reject) => {
    if (checkSyncFn()) {
      resolve(true)
      return
    }
    const startTime = new Date().getTime()
    const intervalId = window.setInterval(() => {
      if (checkSyncFn()) {
        window.clearInterval(intervalId)
        resolve(true)
      } else if (new Date().getTime() - startTime >= timeout) {
        window.clearInterval(intervalId)
        reject(new Error(`timeout - ${timeout}: 用时 ${new Date().getTime() - startTime}`))
      }
    }, heartTime)
  })
}


export function hearCheckAsync(checkAsyncFn: () => Promise<boolean>, heartTime = 1000, timeout = 30000): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const startTime = new Date().getTime();
    let intervalId: number;

    function checkTimeout() {
      const costTime = new Date().getTime() - startTime;
      if (costTime >= timeout) {
        window.clearInterval(intervalId);
        reject(new Error(`timeout - ${timeout}: 用时 ${costTime}`));
        return true;
      }
      return false;
    }

    function run() {
      if (checkTimeout()) return;
      checkAsyncFn().then(res => {
        // 检测到成功时, 则 resolve
        if (res) {
          window.clearInterval(intervalId);
          resolve(true);
          return;
        }
        // 检测不成功时, 校验是否超时
        if (checkTimeout()) return;
      }).catch(err => { throw err });
    }

    run();
    intervalId = window.setInterval(run, heartTime);
  })
}

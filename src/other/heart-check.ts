/**
 * 心跳检测, 按心跳策略执行某个函数, 直至该函数返回 true, 超时则 reject
 * 
 * @param checkSyncFn 检测方法-只能返回 true or false
 * @param heartTime 心跳间隔, 单位毫秒 - 默认 500ms
 * @param timeout 超时时间, 单位毫秒 - 默认 30000ms, 即30秒
 */
export function heartCheck(checkSyncFn: Function, heartTime = 500, timeout = 30000): Promise<Boolean> {
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
        reject(`timeout - ${timeout}: 用时 ${new Date().getTime() - startTime}`)
      }
    }, heartTime)
  })
}

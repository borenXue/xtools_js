/**
 * 
 * @param checkSyncFn 检测方法-只能返回 true or false
 * @param heartTime 心跳间隔, 单位毫秒 - 默认 500ms
 * @param timeout 超时时间, 单位毫秒 - 默认 30000ms, 即30秒
 */
export default function hearCheck(checkSyncFn: Function, heartTime = 500, timeout = 30000) {
  return new Promise((resolve, reject) => {
    if (checkSyncFn()) {
      resolve()
      return
    }
    const startTime = new Date().getTime()
    const intervalId = window.setInterval(() => {
      if (checkSyncFn()) {
        window.clearInterval(intervalId)
        resolve()
      } else if (new Date().getTime() - startTime >= timeout) {
        reject(`timeout - ${timeout}: 用时 ${new Date().getTime() - startTime}`)
      }
    }, heartTime)
  })
}

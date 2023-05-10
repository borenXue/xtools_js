/**
 * 浏览器缩放的三种方式: 该函数只处理前两种, 第三种无法禁止
 *  1、ctrl+、ctrl-
 *  2、滚轮缩放
 *  3、浏览器右上角工具栏中的缩放按钮【无法禁止】
 *
 * 参考: https://zhuanlan.zhihu.com/p/151766303
 */
export function disableZoom() {
  // a. head meta
  const head = document.head;
  if (!head) return;
  let meta = head.querySelector("meta[name='viewport']");
  if (!meta) {
    meta = document.createElement("meta");
    head.appendChild(meta);
  }
  meta.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0;");

  function keydownHandler(event: KeyboardEvent) {
    if ((event.ctrlKey === true || event.metaKey === true)
      && (event.keyCode === 61 || event.keyCode === 107
        || event.keyCode === 173 || event.keyCode === 109
        || event.keyCode === 187 || event.keyCode === 189)) {
      event.preventDefault();
    }
  }
  function mousewheelHandler(e: any) {
    const env = e || window.event;
    if ((env.wheelDelta && env.ctrlKey) || e.detail) {
      env.preventDefault();
    }
  }

  // b. 禁用 ctrl+ 放大, ctrl- 缩小
  document.addEventListener('keydown', keydownHandler, false);
  // c. 禁用滚轮缩放
  document.addEventListener('mousewheel', mousewheelHandler, { capture: false, passive: false });

  return () => {
    document.removeEventListener('keydown', keydownHandler);
    document.removeEventListener('mousewheel', mousewheelHandler);
  };  
}

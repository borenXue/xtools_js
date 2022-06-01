export function classAdd(ele: Element, cls: string) {
  if (!cls || cls === '') return;
  const clsVal = cls.trim();

  let oldCls = ele.getAttribute('class') || '';
  oldCls = oldCls
    .replace(new RegExp(`\\b${clsVal}\\b`, 'g'), '')
    .replace(/\s{1,}/g, ' ');

  ele.setAttribute('class', `${oldCls.trim()} ${clsVal}`);  
}

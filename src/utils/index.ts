
export function padLeft(origin: string | number, digit: number, holder: string = ' ') {
  const str = typeof origin === 'string' ? origin : origin.toString()

  if (str.length >= digit) return str;

  let prefix = '';
  for (let i = 0; i < digit - str.length; i++) {
    prefix += holder
  }

  return `${prefix}${str}`;
}

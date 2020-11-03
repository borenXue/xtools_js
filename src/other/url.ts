/**
 * 获取最终文件名
 *
 * @param url 文件的 url 地址
 * @param name 指定文件名(可选)
 *
 */
export function urlGetFileName(urlOrFileName: string, name?: string) {
  const pathname = urlOrFileName.indexOf('/') >= 0 ? new URL(urlOrFileName).pathname : urlOrFileName;

  const lastDotIdx = pathname.lastIndexOf('.');
  const ext = lastDotIdx >= 0 ? pathname.substring(lastDotIdx + 1) : '';
  const pureName = pathname.substring(pathname.lastIndexOf('/') + 1, lastDotIdx >= 0 ? lastDotIdx : pathname.length);
  if (!name) return `${pureName}${ext ? '.' : ''}${ext || ''}`

  const nameLastDotIdx = name.lastIndexOf('.');
  let nameExt = nameLastDotIdx >= 0 ? name.substring(nameLastDotIdx + 1) : '';
  if (nameExt) {
    nameExt = nameExt.replace(/#{ext}/g, ext || '');
    nameExt = nameExt.replace(/#{ext(:([-\w]+)){0,1}}/g, ext || '$2');
  } else if (ext) {
    nameExt = ext;
  }
  let namePureName = name.substring(0, nameLastDotIdx >= 0 ? nameLastDotIdx : name.length);
  namePureName = namePureName.replace('#{name}', pureName);
  namePureName = namePureName.replace(/#{ext}/g, ext || '');
  namePureName = namePureName.replace(/#{ext(:([-\w]+)){0,1}}/g, ext || '$2');
  return `${namePureName}${nameExt ? '.' : ''}${nameExt}`;
}

export function urlAddParams(url: string, param: {
  [key: string]: string | number | boolean | string[] | number[]
} = {}) {
  const questionMarkIdx = url.indexOf('?');
  const safeUrl = questionMarkIdx > 0 ? url.substring(0, questionMarkIdx) : url;
  let search = '';
  if (questionMarkIdx >= 0) {
    search = url.substring(questionMarkIdx + 1) || '';
  }

  search = search.replace(/&$/g, '');
  for (const key in param) {
    if (param[key] instanceof Array) {
      // TODO: 此处 typescript 应该是可以自动推断出类型的
      (param[key] as Array<string | number | boolean>).forEach((item) => {
        search += `&${key}=${item}`
      });
    } else {
      search += `&${key}=${param[key]}`;
    }
  }
  search = search.replace(/^&/g, '').replace(/&&/g, '&');

  return `${safeUrl}${search ? '?' : ''}${search}`;
}

export function urlGetParams(url?: string) {
  const nUrl = url || window.location.href;

  const questionMarkIdx = nUrl.indexOf('?');
  if (questionMarkIdx < 0) return {};

  const search = nUrl.substring(questionMarkIdx + 1);
  if (!search) return {};

  const params: { [key: string]: string[] } = {};
  const list = search.split('&');
  for (const item of list) {
    const kv = item.split('=');
    if (!params[kv[0]]) params[kv[0]] = [];
    params[kv[0]].push(kv[1] || '')
  }

  const result: { [key: string]: string | string[] } = {};
  for (const key in params) {
    result[key] = params[key].length <= 1 ? params[key][0] || '' : params[key];
  }

  return result;
}

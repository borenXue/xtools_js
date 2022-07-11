/**
 * url 辅助工具
 *
 * @packageDocumentation
 * @module Url
 */

/**
 * 获取最终文件名, 支持变量替换
 * 
 * @param url 文件的 url 地址 或 url中的 path 部分
 * @param name 指定文件名(可选), 支持内置变量语法 `#{name}`、`#{ext}`、`#{ext:xxx}`, 具体用法参考下面的示例
 * @returns 文件名
 * 
 * ```javascript
 * // 返回 c.txt
 * urlGetFileName('http://a/b/c.txt')
 * 
 * // 返回 new.jpe
 * urlGetFileName('http://a/b/c.txt', 'new.jpe')
 * 
 * // 返回 c.txt
 * urlGetFileName('http://a/b/c', '#{name}.txt')
 * 
 * // 返回 c-1.txt-new
 * urlGetFileName('http://a/b/c.txt', '#{name}-1.#{ext}-new')
 * 
 * // 返回 c-1.txt
 * // #{ext:pdf}: 代表, 如果 url 中已有后缀则使用url中的, 没有的时候使用 pdf
 * urlGetFileName('http://a/b/c.txt', '#{name}-1.#{ext:pdf}')
 * 
 * // 返回 c-1.pdf
 * urlGetFileName('http://a/b/c', '#{name}-1.#{ext:pdf}')
 * ```
 */
export function urlGetFileName(urlOrFileName: string, name?: string) {
  let pathname = '';
  if (urlOrFileName.indexOf('/') >= 0) {
    try {
      pathname = new URL(urlOrFileName).pathname;
    } catch(err) {
      pathname = urlOrFileName;
    }
  } else {
    pathname = urlOrFileName;
  }

  const lastDotIdx = pathname.lastIndexOf('.');
  const ext = lastDotIdx >= 0 ? pathname.substring(lastDotIdx + 1) : '';
  const pureName = pathname.substring(pathname.lastIndexOf('/') + 1, lastDotIdx >= 0 ? lastDotIdx : pathname.length);
  if (!name) return `${decodeURI(pureName)}${ext ? '.' : ''}${ext || ''}`

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
  return `${decodeURI(namePureName)}${nameExt ? '.' : ''}${nameExt}`;
}

/**
 * url 添加参数
 *
 * @param url 要解析的 url 字符串
 * @param param 要添加的参数对象, 可一次添加多个
 * @return 最终生成的url
 */
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

/**
 * url 删除参数
 *
 * @param url 要解析的 url 字符串
 * @param paramKeys 要删除的 key 或 key 的数组
 * @return 最终生成的url
 */
 export function urlDeleteParams(url: string, paramKeys: string | string[]) {
  const questionMarkIdx = url.indexOf('?');
  const safeUrl = questionMarkIdx > 0 ? url.substring(0, questionMarkIdx) : url;
  let search = '';
  if (questionMarkIdx >= 0) {
    search = url.substring(questionMarkIdx + 1) || '';
  }

  // 将 url 中的 params 解析为对象
  // search = search.replace(/&$/g, '').replace(/^\?/g, '');
  const kvList = search.replace(/&$/g, '').replace(/^\?/g, '').split('&');
  const paramObj: any = {};
  for (const paramItemStr of kvList) {
    if (!paramItemStr) continue;
    const [key, value] = paramItemStr.split('=');
    paramObj[key] = value;
  }

  // 删除
  if (typeof paramKeys === 'string') {
    delete paramObj[paramKeys];
  }
  if (typeof paramKeys === 'object' && paramKeys instanceof Array) {
    paramKeys.forEach(it => { delete paramObj[it] });
  }

  // 重新生成 search 字符串
  let newSearch = '';
  if (Object.keys(paramObj).length > 0) {
    for (let objKey in paramObj) {
      const objKeyVal = paramObj[objKey];
      if (objKeyVal === undefined) {
        newSearch += `${objKey}&`;
      } else {
        newSearch += `${objKey}=${objKeyVal}&`
      }
    }
    newSearch = newSearch.replace(/&$/, '');
  }

  return `${safeUrl}${newSearch ? '?' : ''}${newSearch}`;
}

/**
 * 获取 url 中的参数, 以对象的形式返回
 *
 * @param url 可选, 默认为`location.href`的值
 * @returns 参数对象
 */
export function urlGetParams(url?: string): UrlParamsObject {
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

export interface UrlParamsObject {
  [key: string]: string | string[]
}

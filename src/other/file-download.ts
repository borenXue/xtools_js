import FileSaver from 'file-saver';
import { urlGetFileName, urlAddParams } from "./url";
import { AbortError, TimeOutError, NotSuccessError } from "../utils/errors";

export type UrlQueryParamValueType = string | number | boolean | string[] | number[];

export interface UrlQueryParams {
  [key: string]: UrlQueryParamValueType;
}

export interface FileDownloadParams {
  url: string;
  params?: UrlQueryParams;
  fileName?: string,
  withCredentials?: boolean;
  headers?: { [key: string]: string },

  successCb?: Function;
  errorCb?: Function;
  finalCb?: Function;

  method?: 'GET' | 'POST';
  data?: Array<any> | { [key: string]: any };
  isFormData?: boolean;
}

export function fileDownload(downloadParams: FileDownloadParams) {
  let { url, params, headers, method, isFormData } = downloadParams;

  /**
   * 参数处理
   */

  // 计算 url: url、params
  if (typeof params === 'object' && !(params instanceof Array)) {
    url = urlAddParams(url, params)
  }

  // 计算 header: headers、method、data、isFormData
  if (typeof headers !== 'object') headers = {};
  if (!headers['Content-Type'] && typeof method === 'string' && method.toUpperCase() === 'POST') {
    headers['Content-Type'] = isFormData ? 'application/x-www-form-urlencoded' : 'application/json';
  }

  const { withCredentials, fileName, successCb, finalCb, errorCb } = downloadParams;

  // 计算最终文件名
  const finalFileName = urlGetFileName(url, fileName)

  requestFileBlob({
    url, method, withCredentials
  }).then(({ blob, suggestFileName }) => {
    try {
      FileSaver.saveAs(blob, finalFileName || suggestFileName);
      if (typeof successCb === 'function') successCb()
    } catch (err) {
      if (typeof errorCb === 'function') errorCb(err)
      if (typeof finalCb === 'function') finalCb(err)  
    }
  }).catch(err => {
    if (typeof errorCb === 'function') errorCb(err)
    if (typeof finalCb === 'function') finalCb(err)
  })
}

export function getSuggestFileName(req: XMLHttpRequest) {
  try {
    const str = req.getResponseHeader('Content-Disposition');
    if (!str) return '';
    let res = /filename\*="(.*?)"/.exec(str);
    if (res && res[1]) return res[1];
    res = /filename="(.*?)"/.exec(str);
    if (res && res[1]) return res[1];
    return '';
  } catch(err) {
    console.log('getSuggestFileName: ', err)
    return '';
  }
}


/**
 * 请求文件内容
 */
function requestFileBlob(params: {
  url: string;
  method?: string;
  withCredentials?: boolean;
  handler401?: Function;
}):Promise<{ blob: Blob, suggestFileName: string }> {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.withCredentials = typeof params.withCredentials === 'boolean' ? params.withCredentials : true;
    req.responseType = 'blob';
    req.open(params.method || 'GET', params.url, true);

    req.onabort = () => reject(new AbortError('请求中断'));
    req.ontimeout = () => reject(new TimeOutError('请求超时'));
    req.onerror = () => reject(new Error('请求报错'));
    req.onload = () => {
      if (req.status === 200) {
        const suggestFileName = getSuggestFileName(req);
        resolve({
          blob: req.response && req.response instanceof Blob ? req.response : new Blob([req.response]),
          suggestFileName,
        });
      } else {
        reject(new NotSuccessError(req.status, '响应码非 200'));
      }
    };
    req.send();
  });
}

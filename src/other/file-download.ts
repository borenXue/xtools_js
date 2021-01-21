/**
 * 文件相关函数: 文件下载、文件上传
 *
 * @packageDocumentation
 * @module File
 */

import FileSaver from 'file-saver';
import { urlGetFileName, urlAddParams } from "./url";
import { AbortError, TimeOutError, NotSuccessError, AjaxError } from "../utils/errors";

/**
 * url 请求参数对象中的 值 的格式
 */
export type UrlQueryParamValueType = string | number | boolean | string[] | number[];

/**
 * url 请求参数对象
 */
export interface UrlQueryParams {
  [key: string]: UrlQueryParamValueType;
}

/**
 * 请求 body 体的数据格式
 */
export type FileDownloadParamsData = Array<any> | { [key: string]: any };
/**
 * 请求头对象
 */
export type FileDownloadParamsHeaders = { [key: string]: string };
/**
 * 动态判断是否需要携带cookie
 */
export type WithCredentialsFunction = (url: string, method: 'GET' | 'POST', isFormData: boolean) => boolean;

/**
 * fileDownload 函数的参数格式
 */
export interface FileDownloadParams {
  /**
   * 下载链接
   */
  url: string;
  /**
   * url 参数, 会自动拼接到 url 中的 `?...` 部分
   */
  params?: UrlQueryParams;
  /**
   * 下载后的文件名
   * 
   * 支持内置动态变量用法 `#{name}`、`#{ext}`、 `#{ext:xxx}`, 具体用法可参考 {@link urlGetFileName}
   */
  fileName?: string,
  /**
   * 请求是否携带 cookie, 支持通过函数动态判断
   */
  withCredentials?: boolean | WithCredentialsFunction;
  /**
   * 请求额外的 headers 配置
   */
  headers?: FileDownloadParamsHeaders,

  /**
   * 下载成功后的回调
   */
  successCb?: Function;
  /**
   * 下载失败后的回调
   */
  errorCb?: (err: AjaxError) => void;
  /**
   * 下载成功及失败后的回调
   */
  finalCb?: (err?: AjaxError) => void;

  /**
   * 请求方法, `GET`, `POST`, post 默认为 `json` 格式, 可通过 `isFormData` 来设置为 `formdata` 格式
   */
  method?: 'GET' | 'POST';
  /**
   * 请求 body 体的数据
   */
  data?: FileDownloadParamsData;
  /**
   * 是否为 formdata 格式, 仅 `method为POST` 时有效
   */
  isFormData?: boolean;
}

/**
 * 文件下载
 * 
 * 文件名规则判断优先级: `fileName` 参数 > 接口response header中指定 > url 中提取
 * 
 * 
 * 
 * @param downloadParams 下载选项配置
 */
export function fileDownload(downloadParams: FileDownloadParams) {
  let { url, params, headers, method, isFormData } = downloadParams;

  // 计算 url: url、params
  if (typeof params === 'object' && !(params instanceof Array)) {
    url = urlAddParams(url, params)
  }

  // 计算 header: headers、method、data、isFormData
  if (typeof headers !== 'object') headers = {};
  if (!headers['Content-Type'] && typeof method === 'string' && method.toUpperCase() === 'POST') {
    headers['Content-Type'] = isFormData ? 'application/x-www-form-urlencoded' : 'application/json';
  }

  const { withCredentials, data, fileName, successCb, finalCb, errorCb } = downloadParams;

  // 计算 withCredentials
  let credentials = undefined;
  if (typeof withCredentials === 'boolean') credentials = withCredentials;
  if (typeof withCredentials === 'function') credentials = withCredentials(url, method || 'GET', isFormData || false);

  requestFileBlob({
    url, method, withCredentials: credentials, headers, isFormData, data,
  }).then(({ blob, suggestFileName }) => {
    try {
      // 计算最终文件名, 优先级: 前端指定 > 接口指定 > url 提取
      let finalFileName = urlGetFileName(suggestFileName || url, fileName);
      finalFileName = fileName ? finalFileName : suggestFileName || finalFileName;
      FileSaver.saveAs(blob, finalFileName);
      if (typeof successCb === 'function') successCb()
      if (typeof finalCb === 'function') finalCb()
    } catch (err) {
      if (typeof errorCb === 'function') errorCb(err)
      if (typeof finalCb === 'function') finalCb(err)  
    }
  }).catch(err => {
    if (typeof errorCb === 'function') errorCb(err)
    if (typeof finalCb === 'function') finalCb(err)
  })
}

/** @ignore */
export function getSuggestFileName(req: XMLHttpRequest) {
  try {
    const headers = req.getAllResponseHeaders();
    if (!headers || headers.indexOf('content-disposition') < 0) return '';
    const str = req.getResponseHeader('Content-Disposition');
    if (!str) return '';

    let finalName = '';

    const list = str.split(';');
    for (const item of list) {
      const ii = item.split('=');
      if (ii && ii.length === 2) {
        if (ii[0] === 'filename*' && ii[1]) {
          finalName = ii[1];
        }
        if (ii[0] === 'filename' && ii[1] && !finalName) {
          finalName = ii[1];
        }
      }
    }
    finalName = finalName.replace(/^["']/, '').replace(/["']$/, '');

    return finalName ? window.decodeURIComponent(finalName) : '';
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
  isFormData?: boolean;
  data?: FileDownloadParamsData;
  headers?: FileDownloadParamsHeaders;
}):Promise<{ blob: Blob, suggestFileName: string }> {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.withCredentials = typeof params.withCredentials === 'boolean' ? params.withCredentials : true;
    req.responseType = 'blob';
    req.open(params.method || 'GET', params.url, true);

    req.onabort = () => reject(new AbortError('请求中断', req, req.status));
    req.ontimeout = () => reject(new TimeOutError('请求超时', req, req.status));
    req.onerror = () => reject(new AjaxError ('请求报错', req, req.status));
    req.onload = () => {
      if (req.status === 200) {
        const suggestFileName = getSuggestFileName(req);
        resolve({
          blob: req.response && req.response instanceof Blob ? req.response : new Blob([req.response]),
          suggestFileName,
        });
      } else {
        reject(new NotSuccessError('响应码非 200', req, req.status));
      }
    };

    for (const key in (params.headers || {})) {
      req.setRequestHeader(key, (params.headers || {})[key]);
    }

    if (params.method && params.method.toLowerCase() === 'post' && params.data) {
      if (params.isFormData) {
        const fd = new FormData();
        for (const key in (params.data || {})) {
          fd.append(key, (params.data || {})[key]);
        }
        req.send(fd);
      } else {
        req.send(params.data ? JSON.stringify(params.data) : '');
      }
    } else {
      req.send();
    }
  });
}

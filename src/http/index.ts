/**
 *
 * 对 axios 的二次封装
 *
 * 1、提供默认的可配置型拦截器
 * 2、ajax 设置: 全局、分组、单个 (配置项都相同,优先级不同)
 *    - loading函数、登出函数、minTime ......
 * 3、提供 httpFormData、httpPost 等快捷入口, 相关的 data 格式转换由内部处理
 * 4、全局 loading 管理器
 * 5、错误提示
 *
 */
import qs from 'qs';
import axios, { AxiosInstance } from 'axios';
import mergeConfig from 'axios/lib/core/mergeConfig.js'
import { ExtraAxiosRequestConfig, LoadingType } from "./types";
import { requestInterceptorFulfilled, requestInterceptorRejected, responseInterceptorFulfilled, responseInterceptorRejected } from './interceptor';

function innerMergeConfig(cfg1: ExtraAxiosRequestConfig, cfg2?:ExtraAxiosRequestConfig): ExtraAxiosRequestConfig {
  const { url, method, data } = { ...cfg1, ...cfg2 };
  const cfg = mergeConfig(cfg1, cfg2);
  if (url) cfg.url = url;
  if (method) cfg.method = method;
  if (data) cfg.data = data;
  return cfg;
}

function getTimeoutErrorMessage(timeout, message) {
  let timeoutErrorMessage = undefined;
  if (timeout > 0 && !message) {
    const sec = Math.round((timeout / 1000) * 100) / 100;
    if (sec < 1) {
      timeoutErrorMessage = `请求已超时 (${timeout}毫秒)`
    } else {
      timeoutErrorMessage = `请求已超时 (${sec}秒)`;
    }
  }
  return timeoutErrorMessage;
}

let globalConfigDefault: ExtraAxiosRequestConfig = {
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
  withCredentials: true,
  extraConfig: {
    showLoading: () => console.warn('showLoading 未配置'),
    closeLoading: () => console.warn('closeLoading 未配置'),
    handler401: () => console.warn('handler401 未配置'),
    handlerTip: () => console.warn('handlerTip 未配置'),
    loading: LoadingType.All,
    minTime: 1000, // 最少 1 秒
    $startTime: 0,
    deleteParams: true,
  },
};

const instanceList = [];

export function globalConfig(config: ExtraAxiosRequestConfig) {
  globalConfigDefault = config || {};
  globalConfigDefault.extraConfig = globalConfigDefault.extraConfig || {};
  for (const item of instanceList) {
    item.globalConfigChanged();
  }
};

class HttpAxios {
  axiosInstance: AxiosInstance;
  constructorConfig: ExtraAxiosRequestConfig;

  constructor(config: ExtraAxiosRequestConfig) {
    this.constructorConfig = config;
    this.globalConfigChanged();
    instanceList.push(this);
  }

  globalConfigChanged() {
    const cfg = innerMergeConfig(globalConfigDefault, this.constructorConfig);
    cfg.extraConfig = cfg.extraConfig || {};

    this.axiosInstance = axios.create(cfg);
    this.axiosInstance.interceptors.request.use(requestInterceptorFulfilled, requestInterceptorRejected);
    this.axiosInstance.interceptors.response.use(responseInterceptorFulfilled, responseInterceptorRejected);
  }

  request(url: string, cfg?: ExtraAxiosRequestConfig) {
    const conn = innerMergeConfig({ url, method: 'get' }, cfg || {});
    const timeout = conn.timeout || this.constructorConfig.timeout;
    const message = conn.timeoutErrorMessage || this.constructorConfig.timeoutErrorMessage;
    conn.timeoutErrorMessage = getTimeoutErrorMessage(timeout, message);
    return this.axiosInstance(conn);
  }

  get(url: string, params?: object, cfg?: ExtraAxiosRequestConfig) {
    return this.request(url, innerMergeConfig({
      method: 'get', params,
    }, cfg || {}));
  }

  postJson(url: string, data?: object, params?:object, cfg?: ExtraAxiosRequestConfig) {
    return this.request(url, innerMergeConfig({
      method: 'post', params, data,
    }, cfg || {}));
  }

  postFormData(url: string, data?: object, params?: object, cfg?: ExtraAxiosRequestConfig) {
    return this.request(url, innerMergeConfig({
      method: 'post', params,
      data: qs.stringify(data || {}),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }, cfg || {}));
  }

  delete(url: string, params?: object, cfg?: ExtraAxiosRequestConfig) {
    return this.request(url, innerMergeConfig({
      method: 'delete', params,
    }, cfg || {}));
  }

  put(url: string, params?: object, cfg?: ExtraAxiosRequestConfig) {
    return this.request(url, innerMergeConfig({
      method: 'put', params,
    }, cfg || {}));
  }

  patch(url: string, params?: object, cfg?: ExtraAxiosRequestConfig) {
    return this.request(url, innerMergeConfig({
      method: 'patch', params,
    }, cfg || {}));
  }
}

export function createHttpInstance(config: ExtraAxiosRequestConfig) {
  return new HttpAxios(config || {});
};

const http = createHttpInstance();

export default http;

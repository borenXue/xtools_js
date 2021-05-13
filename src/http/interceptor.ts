import axios, { AxiosResponse } from "axios";
import { ExtraAxiosRequestConfig, LoadingType } from "./types";
import { showLoading, closeLoading } from './helper';
import deleteParam, { defaultConfig } from '../other/delete-param';

export function requestInterceptorFulfilled(config: ExtraAxiosRequestConfig) {
  const extra = config.extraConfig || {};

  extra.$startTime = new Date().getTime();

  if (extra.loading && [LoadingType.All, LoadingType.Request].includes(extra.loading)) {
    showLoading(extra.showLoading);
  }

  if (extra.deleteParams) {
    deleteParam(config.data || {}, extra.deleteParams === true ? defaultConfig.delete : extra.deleteParams);
  }

  return config;
}

export function requestInterceptorRejected(error: any) { return error; }



export function responseInterceptorFulfilled(response: AxiosResponse<any>) {
  const config = response.config as ExtraAxiosRequestConfig;
  const extra = config.extraConfig || {};

  function handleLoadingAndReturn() {
    if (extra.loading && [LoadingType.All, LoadingType.Response].includes(extra.loading)) {
      closeLoading(extra.closeLoading);
    }

    return response;
  }

  // 处理 minTime 参数
  if (extra.minTime && extra.minTime > 0) {
    const minTime = extra.minTime || 0;
    const $startTime = extra.$startTime || 0;
    const costTime = new Date().getTime() - $startTime;
    if (costTime >= minTime) {
      handleLoadingAndReturn();
    }
    // 实际用时小于 minTime 的处理
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          resolve(handleLoadingAndReturn());
        } catch (err) { reject(err); }
      }, minTime - costTime);
    }); 
  }
}

export function responseInterceptorRejected(error: any) {
  // responseInterceptorRejected:  TypeError [ERR_INVALID_ARG_TYPE]: The "url" argument must be of type string. Received undefined
  // error: { code: 'ERR_INVALID_ARG_TYPE' }
  if (axios.isCancel(error)) {
    return Promise.reject(new Error('request cancel'));
  }

  const keys = Object.keys(error)
  if (error instanceof Error && keys.length === 1 && keys[0] === 'code') {
    return Promise.reject(error)
  }

  const config = error.config as ExtraAxiosRequestConfig;
  const extra = config.extraConfig || {};

  function handleLoadingAndReturn() {
    if (extra.loading && [LoadingType.All, LoadingType.Response].includes(extra.loading)) {
      closeLoading(extra.closeLoading)
    }
    throw error;
  }

  // 处理 minTime 参数
  if (extra.minTime && extra.minTime > 0) {
    const minTime = extra.minTime || 0;
    const $startTime = extra.$startTime || 0;
    const costTime = new Date().getTime() - $startTime;
    if (costTime >= minTime) {
      handleLoadingAndReturn();
    }
    // 实际用时小于 minTime 的处理
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          resolve(handleLoadingAndReturn());
        } catch (err) { reject(err); }
      }, minTime - costTime);
    });
  }
}

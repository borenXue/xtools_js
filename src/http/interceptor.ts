import axios, { AxiosResponse } from "axios";
import { deleteRequestEmptyParams } from "./helper";
import { ExtraAxiosRequestConfig, LoadingType } from "./types";
import { showLoading, closeLoading } from './helper';
import deleteParam, { defaultConfig } from '../other/delete-param';

export function requestInterceptorFulfilled(config: ExtraAxiosRequestConfig) {
  const extra = config.extraConfig;

  extra.$startTime = new Date().getTime();

  if ([LoadingType.All, LoadingType.Request].includes(extra.loading)) {
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
  const extra = config.extraConfig;

  function handleLoadingAndReturn() {
    if ([LoadingType.All, LoadingType.Response].includes(config.extraConfig.loading)) {
      closeLoading(extra.closeLoading);
    }

    return response;
  }

  // 处理 minTime 参数
  const costTime = new Date().getTime() - extra.$startTime;
  if (costTime >= extra.minTime || 0) {
    handleLoadingAndReturn();
  }
  // 实际用时小于 minTime 的处理
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(handleLoadingAndReturn());
      } catch (err) { reject(err); }
    }, extra.minTime - costTime);
  });
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
  const extra = config.extraConfig;

  function handleLoadingAndReturn() {
    if ([LoadingType.All, LoadingType.Response].includes(extra.loading)) {
      closeLoading(extra.closeLoading)
    }
    throw error;
  }

  // 处理 minTime 参数
  const costTime = new Date().getTime() - extra.$startTime;
  if (costTime >= extra.minTime || 0) {
    handleLoadingAndReturn();
  }
  // 实际用时小于 minTime 的处理
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(handleLoadingAndReturn());
      } catch (err) { reject(err); }
    }, extra.minTime - costTime);
  });
}

import { AxiosRequestConfig } from "axios";
import { DeleteRule, DeleteRecursionConfig } from '../other/delete-param';

export enum LoadingType { All = 'ALL', Request = 'REQUEST', Response = 'RESPONSE', None = 'NONE' }

export type ExtraConfig = {
  /**
   * 展示 loading
   */
  showLoading: () => {},
  /**
   * 关闭 loading
   */
  closeLoading: () => {},
  /**
   * 接口 401 的处理器
   */
  handler401: () => {},
  /**
   * 提示函数
   */
  handlerTip: (err: any) => {},


  /**
   * 请求的 loading 处理
   */
  loading: LoadingType;

  /**
   * 请求最少要耗时 minTime ms 后才可以返回
   */
  minTime: number;

  /**
   * 是否删除请求参数中为 undefined 或 null 的参数
   */
  deleteParams: boolean | DeleteRule | DeleteRecursionConfig;

  /**
   * 不需要设置, 内部的一个变量
   */
  $startTime: number;
}

export interface ExtraAxiosRequestConfig extends AxiosRequestConfig {
  extraConfig: ExtraConfig;
}

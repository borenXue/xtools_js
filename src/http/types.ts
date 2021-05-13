import { AxiosRequestConfig } from "axios";
import { DeleteRule, DeleteRecursionConfig } from '../other/delete-param';

export enum LoadingType { All = 'ALL', Request = 'REQUEST', Response = 'RESPONSE', None = 'NONE' }

export type ExtraConfig = {
  /**
   * 展示 loading
   */
  showLoading: () => void,
  /**
   * 关闭 loading
   */
  closeLoading: () => void,
  /**
   * 接口 401 的处理器
   */
  handler401: () => void,
  /**
   * 提示函数
   */
  handlerTip: (err: Error) => void,


  /**
   * 请求的 loading 处理
   */
  loading: LoadingType;

  /**
   * 请求最少要耗时 minTime ms 后才可以返回, 默认 undefined
   * 
   * 小于等于 0: 代表不设置
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
  extraConfig?: Partial<ExtraConfig>;
}

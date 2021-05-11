import { isArray, isFunction, isObject } from '../utils/others';

/**
 * 删除规则
 *
 * Array:   进行删除处理, 删除规则使用该数组 (===判断)
 * 函数:     进行删除处理, 删除规则使用该函数 (返回 true/false)
 */
export type DeleteRuleFunction = (propValue: any) => boolean
export type DeleteRule = Array<any> | DeleteRuleFunction;
export type AnyPlainObject = { [k: string]: any };

export interface DeleteRecursionConfig {
  /**
   * 是否删除某个属性的判断规则
   *
   * 默认值: [undefined, null]
   */
  delete?: DeleteRule;

  /**
   * 如何处理数组, 默认为 undefined
   */
  array?: DeleteRule;

  /**
   * 如何处理数组内的对象, 默认为 true
   * 
   * true: 代表使用 delete 选项配置的删除规则
   * false: 不处理
   */
  objectInArray?: boolean | DeleteRule;
}

const defaultConfig: DeleteRecursionConfig = {
  delete: [undefined, null],
  array: undefined,
  objectInArray: true,
}


/**
 * 递归删除特定属性
 *
 * @param params object
 */
export default function deleteParamsRecursion(params: AnyPlainObject | Array<any>, configOrDelete?: DeleteRule | DeleteRecursionConfig) {

  // 合并配置项 --> cfg
  let cfg = { ...defaultConfig };
  if (isArray(configOrDelete)) {
    cfg.delete = configOrDelete;
  }
  if (isFunction(configOrDelete)) {
    cfg.delete = configOrDelete;
  }
  if (isObject(configOrDelete)) {
    cfg = { ...cfg, ...configOrDelete };
  }

  if (isArray(params)) {
    params = deleteArrayPropIfNeed(params, cfg);
  }
  if (isObject(params)) {
    deleteObjectPropIfNeed(params, false, cfg);
  }

  return params;
}

function shouldDelete(val: any, del?: DeleteRule) {
  if (!del) return true;
  let res = false;
  if (isArray(del)) {
    res = del.includes(val);
  }
  if (isFunction(del)) {
    res = del(val);
  }
  return res;
}

function deleteObjectPropIfNeed(obj: AnyPlainObject, isInArray: boolean, cfg: DeleteRecursionConfig) {
  // 不处理的情况: obj 是数组内对象 + cfg.objectInArray 为 false
  if (isInArray && !cfg.objectInArray) return;

  const del = isInArray ? (cfg.objectInArray === true ? cfg.delete : cfg.objectInArray) : cfg.delete;

  if (!del) return;

  for (const prop in obj) {
    if (shouldDelete(obj[prop], del)) {
      delete obj[prop];
      continue;
    }
    // 递归处理: obj[prop] 的值为数组或对象
    if (isObject(obj[prop])) {
      deleteObjectPropIfNeed(obj, isInArray, cfg);
    }
    if (isArray(obj[prop])) {
      obj[prop] = deleteArrayPropIfNeed(obj[prop], cfg)
    }
  }
}

function deleteArrayPropIfNeed(arr: Array<any>, cfg: DeleteRecursionConfig) {
  let resArr = arr;
  if (cfg.array) {
    resArr = resArr.filter(item => !shouldDelete(item, cfg.array));
  }
  for (let i = 0; i < resArr.length; i++) {
    if (isArray(resArr[i])) {
      resArr[i] = deleteArrayPropIfNeed(resArr[i], cfg);
    }
    if (isObject(resArr[i])) {
      deleteObjectPropIfNeed(resArr[i], true, cfg);
    }
  }
  return resArr;
}

import { accAdd, accDiv, accMulti, accSub } from "../number";

function getDecimalCount(num: number): number {
  const str = String(num);
  const idx = str.indexOf('.');
  if (idx === -1) return 0;
  return Math.max(str.length - idx - 1, 0);
}

/**
 * 从 [min, max] 数字区间中, 按指定步长获取下一个值。
 * 支持 区间循环、负数、小数、逆向、自定义步长。
 * 
 * @param _currentValue 当前值。。支持正负整数、正负小数、0
 * @param _minValue 最小值。。支持正负整数、正负小数、0
 * @param _maxValue 最大值。。支持正负整数、正负小数、0
 * @param _step 步长, 默认值为1。。支持正负整数、正负小数、0。。负数=逆序。。0=不变
 * @returns 下个值
 */
export function nextNumber(_currentValue: number, _minValue: number, _maxValue: number, _step: number = 1): number {
  if (_minValue > _maxValue) throw new Error('minValue is greater than maxValue');
  if (_currentValue < _minValue || _currentValue > _maxValue) throw new Error('currentValue is out of range');
  if (_step === 0) return _currentValue;

  const decimal = Math.max(getDecimalCount(_currentValue), getDecimalCount(_minValue), getDecimalCount(_maxValue), getDecimalCount(_step));
  const multiple = Math.pow(10, decimal);

  const [currentValue, minValue, maxValue, step] = [_currentValue*multiple, _minValue*multiple, _maxValue*multiple, _step*multiple];

  const rangeValue = maxValue - minValue + 1;
  // 处理 step 的异常情况
  let finalStep = typeof step !== 'number' ? 1 : step;
  if (Math.abs(finalStep) > rangeValue) {
    finalStep = finalStep % rangeValue;
  }
  if (finalStep === 0) return currentValue/multiple;

  if (finalStep < 0) {
    finalStep = (maxValue - minValue) + finalStep + 1;
  }

  let nextValue = currentValue + finalStep;


  if (nextValue > maxValue) {
    nextValue = nextValue - maxValue + minValue - 1;
  }

  return nextValue/multiple;
}

/**
 * 生成随机数字, 支持 设置区间、自定义小数位数、decimal支持负数
 *
 * @param start 区间开始值
 * @param end 区间最大值
 * @param decimal 小数位数。为负数时代表十位、百位、千位等为0, eg: decimal=-1时, 生成的随机数645会自动转换为650
 * @returns 
 */
export function randomNumber(start: number, end: number, decimal?: number) {
  const diff = accSub(end, start);

  let result = accAdd(start, Math.random() * diff);

  if (typeof decimal === 'number') {
    result = +result.toFixed(decimal >= 0 ? decimal : 0);

    // decimal 为负数的情况
    if (decimal < 0) {
      const powVal = Math.pow(10, Math.abs(decimal));
      const temp = +accDiv(result, powVal).toFixed(0);
      result = accMulti(temp, powVal);
    }
  }
  return result
}

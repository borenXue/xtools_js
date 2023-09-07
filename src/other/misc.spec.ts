import { expect } from 'chai';
import { nextNumber } from './misc';


describe('nextNumber 函数', () => {

  describe('step 为正整数: [0, range+2]', () => {
    const datas: ({step: number, currentValue: number, nextValue: number})[] = [];
    const [minValue, currentValue, maxValue] = [3, 4, 8];
    const count = maxValue - minValue + 1;

    let val = currentValue;
    for (let step = 0; step < count+2; step++) {
      if (val > maxValue) val = minValue;
      datas.push({ step, currentValue, nextValue: val++ });
    }

    for (const item of datas) {
      it(`step=${item.step}、当前值为${item.currentValue}: next值为 ${item.nextValue}`, () => {
        expect(nextNumber(item.currentValue,minValue,maxValue,item.step)).deep.equal(item.nextValue);
      });
    }
  });
  describe('step 为负整数(逆向): [-range-2, 0]', () => {
    const datas: ({step: number, currentValue: number, nextValue: number})[] = [];
    const [minValue, currentValue, maxValue] = [3, 6, 8];
    const count = maxValue - minValue + 1;

    let val = currentValue;
    for (let step = 0; step > -count-2; step--) {
      if (val < minValue) val = maxValue;
      datas.push({ step, currentValue, nextValue: val-- });
    }

    for (const item of datas) {
      it(`step=${item.step}、当前值为${item.currentValue}: next值为 ${item.nextValue}`, () => {
        expect(nextNumber(item.currentValue,minValue,maxValue,item.step)).deep.equal(item.nextValue);
      });
    }
  });

  describe('当前值、区间范围都为正整数, step=正负整数', () => {
    const datas = [
      /**
       * 当前值、区间范围都为正整数
       */
      // step=正整数
      { step: 1, currentValue: 16, nextValue: 17, minValue: 3, maxValue: 18 },
      { step: 2, currentValue: 16, nextValue: 18, minValue: 3, maxValue: 18 },
      { step: 3, currentValue: 16, nextValue: 3, minValue: 3, maxValue: 18 },
      // step=负整数
      { step: -1, currentValue: 5, nextValue: 4, minValue: 3, maxValue: 18 },
      { step: -2, currentValue: 5, nextValue: 3, minValue: 3, maxValue: 18 },
      { step: -3, currentValue: 5, nextValue: 18, minValue: 3, maxValue: 18 },
      // step >= maxValue-minValue [正、负整数]
      { step: 16, currentValue: 3, nextValue: 3, minValue: 3, maxValue: 18 },
      { step: 17, currentValue: 3, nextValue: 4, minValue: 3, maxValue: 18 },
      { step: -16, currentValue: 3, nextValue: 3, minValue: 3, maxValue: 18 },
      { step: -17, currentValue: 3, nextValue: 18, minValue: 3, maxValue: 18 },
    ];
    for (const item of datas) {
      it(`step=${item.step}、当前值为${item.currentValue}: next值为 ${item.nextValue}`, () => {
        expect(nextNumber(item.currentValue,item.minValue,item.maxValue,item.step)).deep.equal(item.nextValue);
      });
    }
  });

  describe('当前值=负整数、区间范围=[-15,-10], step=正负整数', () => {
    const datas = [
      /**
       * 当前值、区间范围都为负整数
       */
      // step=正整数
      { step: 1, currentValue: -11, nextValue: -10, minValue: -15, maxValue: -10 },
      { step: 2, currentValue: -11, nextValue: -15, minValue: -15, maxValue: -10 },
      { step: 3, currentValue: -11, nextValue: -14, minValue: -15, maxValue: -10 },
      // step=负整数
      { step: -1, currentValue: -14, nextValue: -15, minValue: -15, maxValue: -10 },
      { step: -2, currentValue: -14, nextValue: -10, minValue: -15, maxValue: -10 },
      { step: -3, currentValue: -14, nextValue: -11, minValue: -15, maxValue: -10 },
      // step >= maxValue-minValue
      { step: 6, currentValue: -11, nextValue: -11, minValue: -15, maxValue: -10 },
      { step: 7, currentValue: -11, nextValue: -10, minValue: -15, maxValue: -10 },
      { step: -6, currentValue: -11, nextValue: -11, minValue: -15, maxValue: -10 },
      { step: -7, currentValue: -11, nextValue: -12, minValue: -15, maxValue: -10 },
    ];
    for (const item of datas) {
      it(`step=${item.step}、当前值为${item.currentValue}: next值为 ${item.nextValue}`, () => {
        expect(nextNumber(item.currentValue,item.minValue,item.maxValue,item.step)).deep.equal(item.nextValue);
      });
    }
  });

  describe('区间范围=[-4,4], step=正负整数', () => {
    const datas = [
      // currentValue=负整数、step=正整数
      { step: 1, currentValue: -3, nextValue: -2, minValue: -4, maxValue: 4 },
      { step: 8, currentValue: -3, nextValue: -4, minValue: -4, maxValue: 4 },
      { step: 10, currentValue: -3, nextValue: -2, minValue: -4, maxValue: 4 },
      // currentValue=负整数、step=负整数
      { step: -1, currentValue: -3, nextValue: -4, minValue: -4, maxValue: 4 },
      { step: -8, currentValue: -3, nextValue: -2, minValue: -4, maxValue: 4 },
      { step: -10, currentValue: -3, nextValue: -4, minValue: -4, maxValue: 4 },
      // currentValue=正整数、step=负整数
      // currentValue=正整数、step=正整数
    ];
    for (const item of datas) {
      it(`step=${item.step}、当前值为${item.currentValue}: next值为 ${item.nextValue}`, () => {
        expect(nextNumber(item.currentValue,item.minValue,item.maxValue,item.step)).deep.equal(item.nextValue);
      });
    }
  });

  describe('区间范围=[-4.3,4.3], step=正负小数', () => {
    const datas = [
      // currentValue=负整数、step=正整数
      { step: 0.02, currentValue: 1.01, nextValue: 1.03, minValue: -4.3, maxValue: 4.3 },
    ];
    for (const item of datas) {
      it(`step=${item.step}、当前值为${item.currentValue}: next值为 ${item.nextValue}`, () => {
        expect(nextNumber(item.currentValue,item.minValue,item.maxValue,item.step)).deep.equal(item.nextValue);
      });
    }
  });


  describe('异常、边界 情况', () => {
    it(`报错: 数字区间为 [4,3] 时`, () => {
      expect(() => nextNumber(4,4,3,1)).to.throw(Error, "minValue is greater than maxValue");
    });
    it(`报错: 当前值 < 最小值`, () => {
      expect(() => nextNumber(1,2,5,1)).to.throw(Error, "currentValue is out of range");
    });
    it(`报错: 当前值 > 最大值`, () => {
      expect(() => nextNumber(8,2,5,1)).to.throw(Error, "currentValue is out of range");
    });

    // 不报错的边界情况
    it(`不报错: 当前值 === 最大值`, () => {
      expect(() => nextNumber(5,2,5,1)).to.not.throw();
    });
    it(`不报错: 当前值 === 最小值`, () => {
      expect(() => nextNumber(2,2,5,1)).to.not.throw();
    });
    it(`不报错: 数字区间为 [4,4]`, () => {
      expect(() => nextNumber(4,4,4,1)).to.not.throw();
    });
  });
});




import { expect } from 'chai';
import formatMoney from './format-money';

describe('formatMoney 测试用例', () => {

  it('0 --> 0.00', () => {
    expect(formatMoney(0)).equal('0.00')
  })

  it('-0 --> 0.00', () => {
    expect(formatMoney(-0)).equal('0.00')
  })

  it('-1 --> -1.00', () => {
    expect(formatMoney(-1)).equal('-1.00')
  })

  it('1 --> 1.00', () => {
    expect(formatMoney(1)).equal('1.00')
  })

  it('1.2 --> 1.20', () => {
    expect(formatMoney(1.2)).equal('1.20')
  })

  it('.2 --> 0.20', () => {
    expect(formatMoney(.2)).equal('0.20')
  })

  it('100.348 --> -100.35', () => {
    expect(formatMoney(-100.345)).equal('-100.35')
  })

  it('-100.348 --> -100.35', () => {
    expect(formatMoney(-100.345)).equal('-100.35')
  })

  it('-123456789.348 --> -123,456,789.35', () => {
    expect(formatMoney(-123456789.348)).equal('-123,456,789.35')
  })

  it('-23456789.348 --> -23,456,789.35', () => {
    expect(formatMoney(-23456789.348)).equal('-23,456,789.35')
  })

  it('5123456789.348 --> 5,123,456,789.35', () => {
    expect(formatMoney(5123456789.348)).equal('5,123,456,789.35')
  })

})

describe('formatMoney 参数 decimal 测试 ', () => {
  it('34.45 (decimal: 1) --> 34.5', () => {
    expect(formatMoney(34.45, { decimal: 1 })).equal('34.5')
  })

  it('34.04 (decimal: 1) --> 34.0', () => {
    expect(formatMoney(34.04, { decimal: 1 })).equal('34.0')
  })

  it('34.12345 (decimal: 4) --> 34.1235', () => {
    expect(formatMoney(34.12345, { decimal: 4 })).equal('34.1235')
  })

  it('-34.12345 (decimal: 4) --> -34.1235', () => {
    expect(formatMoney(-34.12345, { decimal: 4 })).equal('-34.1235')
  })

  it('34.05 (decimal: 5) --> 34.05000', () => {
    expect(formatMoney(34.05, { decimal: 5 })).equal('34.05000')
  })

  it('34.05 (decimal: 0) --> 34', () => {
    expect(formatMoney(34.05, { decimal: 0 })).equal('34')
  })

  // 异常参数处理
  it('34.05 (decimal: -1) --> 34', () => {
    expect(formatMoney(34.05, { decimal: -1 })).equal('34')
  })
  it('34.05 (decimal: 2.5) --> 34.050', () => {
    expect(formatMoney(34.05, { decimal: 2.5 })).equal('34.050')
  })
  it('34.05 (decimal: 2.45) --> 34.05', () => {
    expect(formatMoney(34.05, { decimal: 2.45 })).equal('34.05')
  })
});

describe('formatMoney 参数 trim 测试 ', () => {
  it('34.45 (decimal: 1, trim: true) --> 34.5', () => {
    expect(formatMoney(34.45, { decimal: 1, trim: true })).equal('34.5')
  })

  it('34.04 (decimal: 1, trim: true) --> 34', () => {
    expect(formatMoney(34.04, { decimal: 1, trim: true })).equal('34')
  })

  it('34.12345 (decimal: 4, trim: true) --> 34.1235', () => {
    expect(formatMoney(34.12345, { decimal: 4, trim: true })).equal('34.1235')
  })

  it('-34.12345 (decimal: 4, trim: true) --> -34.1235', () => {
    expect(formatMoney(-34.12345, { decimal: 4, trim: true })).equal('-34.1235')
  })

  it('34.05 (decimal: 5, trim: true) --> 34.05', () => {
    expect(formatMoney(34.05, { decimal: 5, trim: true })).equal('34.05')
  })

  it('34.05 (decimal: 0, trim: true) --> 34', () => {
    expect(formatMoney(34.05, { decimal: 0, trim: true })).equal('34')
  })

  // 异常参数处理
  it('34.05 (decimal: -1, trim: true) --> 34', () => {
    expect(formatMoney(34.05, { decimal: -1, trim: true })).equal('34')
  })
  it('34.05 (decimal: 2.5, trim: true) --> 34.05', () => {
    expect(formatMoney(34.05, { decimal: 2.5, trim: true })).equal('34.05')
  })
  it('34.05 (decimal: 2.45, trim: true) --> 34.05', () => {
    expect(formatMoney(34.05, { decimal: 2.45, trim: true })).equal('34.05')
  })
});

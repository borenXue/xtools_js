import { expect } from 'chai';
import formatMoney from './format-money';

describe('formatMoney 测试用例', () => {

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

  it('5123456789.348 --> 5,123,456,789.35', () => {
    expect(formatMoney(0)).equal('0')
  })

})


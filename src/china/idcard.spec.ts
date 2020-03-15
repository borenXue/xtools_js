import { expect } from 'chai';
import { validIdCard } from './idcard';

describe('idcard 测试用例', () => {

  it('合法: 513436201901019465', () => {
    expect(validIdCard('513436201901019465')).equals(true);
  })

  it('合法: 513436201901013549', () => {
    expect(validIdCard('513436201901013549')).equals(true);
  })

  it('合法: 513436201901016723', () => {
    expect(validIdCard('513436201901016723')).equals(true);
  })

  it('合法: 51343620190101324X', () => {
    expect(validIdCard('51343620190101324X')).equals(true);
  })

  it('合法: 513436201901014242', () => {
    expect(validIdCard('513436201901014242')).equals(true);
  })

  it('合法: 51343620190101156X', () => {
    expect(validIdCard('51343620190101156X')).equals(true);
  })

  // 日期不对, 但校验码正确
  // 318 = 1*7 + 4*9 + 2*10 + 7*5 + 2*8 + 5*4 + 1*2 + 9*1 + 8*6 + 3*3 + 0*7 + 8*9 + 1*10 + 0*5 + 2*8 + 4*4 + 1*2
  it('非法: 142725198308102412', () => {
    expect(validIdCard('142725198308102412')).equals(false);
  })

  // 仅校验码不正确
  it('非法: 513436201901016108', () => {
    expect(validIdCard('513436201901016109')).equals(true);
    expect(validIdCard('513436201901016108')).equals(false);
  })

})

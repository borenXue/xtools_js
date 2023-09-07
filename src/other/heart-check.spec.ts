import { use, expect } from 'chai';
import chaiPromised from 'chai-as-promised';
import hearCheck, { hearCheckAsync } from './heart-check';

use(chaiPromised);

describe('hearCheck 函数', () => {

  it('最简心跳函数: () => true', () => {
    expect(hearCheck(() => true, 200, 1000)).be.eventually.equal(true);
  });

  it('最简心跳函数: () => false', () => {
    expect(hearCheck(() => false, 200, 1000)).be.rejected;
  });

  it('最简心跳函数: () => 执行5次后返回true', () => {
    let time = 0;
    expect(hearCheck(() => time++ === 5, 200, 1000)).be.eventually.equal(true);
  });

  it('最简心跳函数: () => 执行6次后返回true (但执行5次后就超时了)', () => {
    let time = 0;
    expect(hearCheck(() => time++ === 6, 200, 1000)).be.rejected;
  });

});

describe('hearCheckAsync 函数', () => {
  it('最简心跳函数: () => Promise.resolve(true)', () => {
    expect(hearCheckAsync(() => Promise.resolve(true), 200, 1000)).be.eventually.equal(true);
  });

  it('最简心跳函数: () => Promise.resolve(false)', () => {
    expect(hearCheckAsync(() => Promise.resolve(false), 200, 1000)).be.rejected;
  });

  it('最简心跳函数: () => 执行5次后返回true', () => {
    let time = 0;
    expect(hearCheckAsync(() => Promise.resolve(time++ === 5), 200, 1010)).be.eventually.equal(true);
  });

  it('最简心跳函数: () => 执行6次后返回true (但执行5次后就超时了)', () => {
    let time = 0;
    expect(hearCheckAsync(() => Promise.resolve(time++ === 6), 200, 1010)).be.rejected;
  });
});

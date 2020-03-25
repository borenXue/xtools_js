import { expect } from 'chai';
import { timeBetweenMonth, timeBetweenDay } from '.';

describe('timeBetweenMonth 测试用例', () => {

  it('startTime > endTime 的场景: 3月 和 2月', () => {
    expect(timeBetweenMonth("2020-03-25 10:25:30", "2020-02-25 10:25:30")).to.deep.equal([
      new Date('2020-02-01 00:00:00').getTime(),
      +(String(new Date('2020-03-31 23:59:59').getTime()).replace(/000$/, '999')),
    ]);
  })

  it('startTime < endTime 的场景: 2月 和 3月', () => {
    expect(timeBetweenMonth("2020-02-25 10:25:30", "2020-03-25 10:25:30")).to.deep.equal([
      new Date('2020-02-01 00:00:00').getTime(),
      +(String(new Date('2020-03-31 23:59:59').getTime()).replace(/000$/, '999')),
    ]);
  })

  it('startTime === endTime 的场景: 2020年2月(29天)', () => {
    expect(timeBetweenMonth("2020-02-25 10:25:30", "2020-02-25 10:25:30")).to.deep.equal([
      new Date('2020-02-01 00:00:00').getTime(),
      +(String(new Date('2020-02-29 23:59:59').getTime()).replace(/000$/, '999')),
    ]);
  })

  it('startTime === endTime 的场景: 2019年2月(28天)', () => {
    expect(timeBetweenMonth("2019-02-25 10:25:30", "2019-02-25 10:25:30")).to.deep.equal([
      new Date('2019-02-01 00:00:00').getTime(),
      +(String(new Date('2019-02-28 23:59:59').getTime()).replace(/000$/, '999')),
    ]);
  })

  it('startTime < endTime 的场景: 1月 和 12月', () => {
    expect(timeBetweenMonth("2020-01-25 10:25:30", "2020-12-25 10:25:30")).to.deep.equal([
      new Date('2020-01-01 00:00:00').getTime(),
      +(String(new Date('2020-12-31 23:59:59').getTime()).replace(/000$/, '999')),
    ]);
  })

})

describe('timeBetweenDay 测试用例', () => {

  it('startTime > endTime 的场景: 3月10号 和 2月20号', () => {
    expect(timeBetweenDay("2020-03-10 10:25:30", "2020-02-20 10:25:30")).to.deep.equal([
      new Date('2020-02-20 00:00:00').getTime(),
      +(String(new Date('2020-03-10 23:59:59').getTime()).replace(/000$/, '999')),
    ]);
  })

  it('startTime < endTime 的场景: 2月20号 和 3月10号', () => {
    expect(timeBetweenDay("2020-02-20 10:25:30", "2020-03-10 10:25:30")).to.deep.equal([
      new Date('2020-02-20 00:00:00').getTime(),
      +(String(new Date('2020-03-10 23:59:59').getTime()).replace(/000$/, '999')),
    ]);
  })

})

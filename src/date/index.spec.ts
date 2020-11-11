import { expect } from 'chai';
import { timeBetweenMonth, timeBetweenDay, timeDayStart, timeDayEnd, timeMonthEnd, timeMonthStart, timeLastMonth, timeIsBetweenMonth } from '.';

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

describe('timeMonthEnd 测试用例', () => {

  it('2020-03-10 10:25:30', () => {
    expect(timeMonthEnd("2020-03-10 10:25:30")).to.deep.equal(new Date('2020-04-01 00:00:00').getTime() - 1);
  })

  it('2020-02-10 10:25:30', () => {
    expect(timeMonthEnd("2020-02-10 10:25:30")).to.deep.equal(new Date('2020-03-01 00:00:00').getTime() - 1);
  })

  it('2020-11-10 10:25:30', () => {
    expect(timeMonthEnd("2020-11-10 10:25:30")).to.deep.equal(new Date('2020-12-01 00:00:00').getTime() - 1);
  })

  it('2020-12-10 10:25:30', () => {
    expect(timeMonthEnd("2020-12-10 10:25:30")).to.deep.equal(new Date('2021-01-01 00:00:00').getTime() - 1);
  })

})

describe('timeMonthStart 测试用例', () => {

  it('2020-03-10 10:25:30', () => {
    expect(timeMonthStart("2020-03-10 10:25:30")).to.deep.equal(new Date('2020-03-01 00:00:00').getTime());
  })

  it('2020-02-10 10:25:30', () => {
    expect(timeMonthStart("2020-02-10 10:25:30")).to.deep.equal(new Date('2020-02-01 00:00:00').getTime());
  })

  it('2020-11-10 10:25:30', () => {
    expect(timeMonthStart("2020-11-10 10:25:30")).to.deep.equal(new Date('2020-11-01 00:00:00').getTime());
  })

  it('2020-12-10 10:25:30', () => {
    expect(timeMonthStart("2020-12-10 10:25:30")).to.deep.equal(new Date('2020-12-01 00:00:00').getTime());
  })

})

describe('timeDayStart 测试用例', () => {

  it('2020-03-10 10:25:30', () => {
    expect(timeDayStart("2020-03-10 10:25:30")).equal(new Date('2020-03-10 00:00:00').getTime());
  })

  it('2019-11-30 10:25:30', () => {
    expect(timeDayStart("2019-11-30 10:25:30")).equal(new Date('2019-11-30 00:00:00').getTime());
  })

})


describe('timeDayEnd 测试用例', () => {

  it('2020-03-10 10:25:30', () => {
    expect(timeDayEnd("2020-03-10 10:25:30")).to.deep.equal(+(String(new Date('2020-03-10 23:59:59').getTime()).replace(/000$/, '999')));
  })

  it('2019-11-30 10:25:30', () => {
    expect(timeDayEnd("2019-11-30 10:25:30")).to.deep.equal(+(String(new Date('2019-11-30 23:59:59').getTime()).replace(/000$/, '999')));
  })

  it('2020-02-29 10:25:30', () => {
    expect(timeDayEnd("2020-02-29 10:25:30")).to.deep.equal(+(String(new Date('2020-02-29 23:59:59').getTime()).replace(/000$/, '999')));
  })

  it('2019-02-28 10:25:30', () => {
    expect(timeDayEnd("2019-02-28 10:25:30")).to.deep.equal(+(String(new Date('2019-02-28 23:59:59').getTime()).replace(/000$/, '999')));
  })

})


describe('timeLastMonth 测试用例', () => {

  it('2020-03-10 10:25:30.666', () => {
    expect(timeLastMonth("2020-03-10 10:25:30.666").getTime()).to.deep.equal(new Date('2020-02-10 10:25:30.666').getTime());
  })

  it('2020-02-10 10:25:30.777', () => {
    expect(timeLastMonth("2020-02-10 10:25:30.777").getTime()).to.deep.equal(new Date('2020-01-10 10:25:30.777').getTime());
  })

  it('2020-01-10 10:25:30.888', () => {
    expect(timeLastMonth("2020-01-10 10:25:30.888").getTime()).to.deep.equal(new Date('2019-12-10 10:25:30.888').getTime());
  })

})

describe('timeIsBetweenMonth 测试用例', () => {

  it('2020-02-10 10:25:30.666  ~~  2020-03-10 10:25:30.666', () => {
    expect(timeIsBetweenMonth("2020-02-10 10:25:30.666", "2020-03-10 10:25:30.666")).to.deep.equal(true);
  })

  it('2020-02-10 10:25:30.667  ~~  2020-03-10 10:25:30.666', () => {
    expect(timeIsBetweenMonth("2020-02-10 10:25:30.667", "2020-03-10 10:25:30.666")).to.deep.equal(true);
  })

  it('2020-02-10 10:25:30.665  ~~  2020-03-10 10:25:30.666', () => {
    expect(timeIsBetweenMonth("2020-02-10 10:25:30.665", "2020-03-10 10:25:30.666")).to.deep.equal(false);
  })

})

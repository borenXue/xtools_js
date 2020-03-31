import { expect } from 'chai';
import formatDate from './format-date';

describe('formatDate 测试用例', () => {

  it('默认格式为 YYYY-MM-DD HH:mm:ss', () => {
    expect(formatDate('2012-08-10 4:9:10'))
      .equal('2012-08-10 04:09:10')
  })

  it('自定义格式 YYYYMMDD HH:mm:ss', () => {
    expect(formatDate('2012-08-10 4:9:10', 'YYYYMMDD HH:mm:ss'))
      .equal('20120810 04:09:10')
  })

  it('自定义格式 YY-M-D H:m:s', () => {
    expect(formatDate('0212-08-04 4:9:7', 'YY-M-D H:m:s'))
      .equal('12-8-4 4:9:7')
  })

  it('异常检测: null --> ""', () => {
    // @ts-ignore
    expect(formatDate(null))
      .equal('')
  })
  it('异常检测: undefined --> ""', () => {
    // @ts-ignore
    expect(formatDate(undefined))
      .equal('')
    // @ts-ignore
    expect(formatDate())
      .equal('')
  })
  it('异常检测: "" --> ""', () => {
    expect(formatDate(''))
      .equal('')
  })
  it('异常检测: "-" --> "-"', () => {
    expect(formatDate('-'))
      .equal('-')
  })
  it('异常检测: " " --> " "', () => {
    expect(formatDate(' '))
      .equal(' ')
  })

})

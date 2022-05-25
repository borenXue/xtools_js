import { padLeft } from '.';

describe('padLeft 测试用例', () => {

  it('"123"  --->  "   123"', () => {
    expect(padLeft('123', 6)).toEqual('   123');
  })

  it('"123"  --->  "$$$123"', () => {
    expect(padLeft('123', 6, '$')).toEqual('$$$123');
  })

})

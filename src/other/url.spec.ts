import { urlGetFileName, urlAddParams, urlGetParams } from './url';



describe('urlGetParams 测试用例', () => {
  it(`urlGetParams('http://a/b') = {}`, () => {
    expect(urlGetParams('http://a/b')).toEqual({});
  });
  it(`urlGetParams('http://a/b?') = {}`, () => {
    expect(urlGetParams('http://a/b?')).toEqual({});
  });

  it(`urlGetParams('http://a/b?k1=1&k2&k3=3&k1=4') = {k1: ['1', '4'], k2: '', k3: '3'}`, () => {
    expect(urlGetParams('http://a/b?k1=1&k2&k3=3&k1=4')).toEqual({
      k1: ['1', '4'], k2: '', k3: '3',
    });
  });
});



describe('urlAddParams 测试用例', () => {
  describe('无新增参数的情况', () => {
    it(`urlAddParams('http://a/b') = http://a/b`, () => {
      expect(urlAddParams('http://a/b')).toEqual('http://a/b');
    });

    it(`urlAddParams('http://a/b?') = http://a/b'`, () => {
      expect(urlAddParams('http://a/b?')).toEqual('http://a/b');
    });

    it(`urlAddParams('http://a/b?d=2') = http://a/b?d=2`, () => {
      expect(urlAddParams('http://a/b?d=2')).toEqual('http://a/b?d=2');
    });
  })

  describe('有新增参数的情况 && 数组参数', () => {
    it(`urlAddParams('http://a/b', {type:'1'}) = http://a/b?type=1`, () => {
      expect(urlAddParams('http://a/b', {type: 1})).toEqual('http://a/b?type=1');
    });

    it(`urlAddParams('http://a/b?', {type:'1'}) = http://a/b?type=1`, () => {
      expect(urlAddParams('http://a/b?', {type: 1})).toEqual('http://a/b?type=1');
    });

    it(`urlAddParams('http://a/b?d=2', {type:'1'}) = http://a/b?d=2&type=1`, () => {
      expect(urlAddParams('http://a/b?d=2', {type: 1})).toEqual('http://a/b?d=2&type=1');
    });

    it(`urlAddParams('http://a/b?d=2', {type:[1,2]}) = http://a/b?d=2&type=1&type=2`, () => {
      expect(urlAddParams('http://a/b?d=2', {type:[1,2]})).toEqual('http://a/b?d=2&type=1&type=2');
    });
  })
});



describe('getFileName 测试用例', () => {

  describe('只设 url, 不设 name', () => {
    it(`urlGetFileName('http://a/b/c/def') = def`, () => {
      expect(urlGetFileName('http://a/b/c/def')).toEqual('def');
    });

    it(`urlGetFileName('http://a/b/c/%E4%B8%AD%E6%96%87') = 中文`, () => {
      expect(urlGetFileName('http://a/b/c/%E4%B8%AD%E6%96%87')).toEqual('中文');
    });

    it(`urlGetFileName('http://a/b/c/def.txt') = def.txt`, () => {
      expect(urlGetFileName('http://a/b/c/def.txt')).toEqual('def.txt');
    });

    it(`urlGetFileName('http://a/b/c/def.txt?type=file') = def.txt`, () => {
      expect(urlGetFileName('http://a/b/c/def.txt?type=file')).toEqual('def.txt');
    });

    it(`urlGetFileName('http://a/def.txt?type=file') = def.txt`, () => {
      expect(urlGetFileName('http://a/def.txt?type=file')).toEqual('def.txt');
    });
  })

  describe('测试 name 基本用法', () => {
    it(`urlGetFileName('http://a/b/c/def.txt', 'abc') = `, () => {
      expect(urlGetFileName('http://a/b/c/def.txt', 'abc')).toEqual('abc.txt');
    });

    it(`urlGetFileName('http://a/b/c/def.txt', 'abc.pdf') = abc.pdf`, () => {
      expect(urlGetFileName('http://a/b/c/def.txt', 'abc.pdf')).toEqual('abc.pdf');
    });
  })

  describe('测试 name 高级用法: #{name} 和 #{ext} 以及 ${ext:xxx}', () => {
    it(`urlGetFileName('http://a/b/c/def.txt', '#{name}.pdf') = def.pdf`, () => {
      expect(urlGetFileName('http://a/b/c/def.txt', '#{name}.pdf')).toEqual('def.pdf');
    });

    it(`urlGetFileName('http://a/b/c/def.txt', 'new-#{name}.#{ext}') = new-def.txt`, () => {
      expect(urlGetFileName('http://a/b/c/def.txt', 'new-#{name}.#{ext}')).toEqual('new-def.txt');
    });

    it(`urlGetFileName('http://a/b/c/def.txt', 'new-#{name}-#{ext}.#{ext}') = new-def-txt.txt`, () => {
      expect(urlGetFileName('http://a/b/c/def.txt', 'new-#{name}-#{ext}.#{ext}')).toEqual('new-def-txt.txt');
    });

    it(`urlGetFileName('http://a/b/c/def.txt', '#{name}-#{ext}.#{ext:pdf}') = def-txt.txt`, () => {
      expect(urlGetFileName('http://a/b/c/def.txt', '#{name}-#{ext}.#{ext:pdf}')).toEqual('def-txt.txt');
    });

    it(`urlGetFileName('http://a/b/c/def', '#{name}-#{ext}.#{ext:pdf}') = def-.pdf`, () => {
      expect(urlGetFileName('http://a/b/c/def', '#{name}-#{ext}.#{ext:pdf}')).toEqual('def-.pdf');
    });

    it(`urlGetFileName('http://a/b/c/def', '#{name}-#{ext}.#{ext:new-pdf}) = def-.new-pdf`, () => {
      expect(urlGetFileName('http://a/b/c/def', '#{name}-#{ext}.#{ext:new-pdf}')).toEqual('def-.new-pdf');
    });
  })

  describe('测试 urlOrFileName 为 fileName 的场景', () => {
    it(`urlGetFileName('a/b/c/def') = def`, () => {
      expect(urlGetFileName('a/b/c/def')).toEqual('def');
    });
  })

});

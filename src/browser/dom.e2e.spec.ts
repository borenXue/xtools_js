import { globalSetup, globalTeardown } from '../../config/jest-e2e';

beforeAll(async () => {
  await globalSetup();
  await page.goto('http://localhost:3999');
});
afterAll(async () => {
  await globalTeardown();
})

describe('class 相关函数测试', () => {
  beforeAll(async () => {
    await page.$eval('body', body => {
      // console.log('window.xtoolsDom: ', window.xbr, window.xtoolsDom);
      body.innerHTML = `
        <div id="test-div" class=" defalut-class ">abcdefg</div>
      `;
    });
  });

  it('classAdd 函数', async () => {
    const finalCls = await page.$eval('#test-div', ele => {
      window.xtoolsDom.classAdd(ele, ' new-cls ');
      return ele.getAttribute('class');
    });
    // await page.evaluate(() => {
    //   const ele = document.querySelector('#test-div');
    //   // classAdd(ele, 'xbr');
    // });    
    // const ele = await page.$('#test-div');
    // const finalCls = await ele.getProperty('class');
    await expect(finalCls).toEqual('defalut-class new-cls');
    // console.log('finalCls: ', finalCls)
  });
});

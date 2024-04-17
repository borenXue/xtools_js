/**
 * TODO:
 *  1、fastmock 改为本地启动 express 接口来进行测试
 *  2、timeoutErrorMessage 在 nodejs 环境下不生效: https://github.com/axios/axios/issues/3580
 *  3、测试 loading、tip 等, 基于事件的方式来测试
 */

import { expect } from 'chai';
import http, { globalConfig, createHttpInstance } from './index';

const urlPrefix = 'https://www.fastmock.site/mock/28fe77d6a36e84c6b77de22754abfb47/xtools_js'
const params = { abc: 123, def: '4', c: '', d: ['1', '2'] };
const postData = { age: 18, name: 'xtools_js' };

const http2 = createHttpInstance({ baseURL: urlPrefix });
const postData2 = { age: 18, name: 'xtools_js', key1: undefined, key2: null, key3: ''};

// describe('HttpAxios 测试', () => {
//   describe('默认 HttpAxios 实例 - 常规请求', () => {

//     it('默认 HttpAxios 实例 - get 请求', () => {
//       http.get(`${urlPrefix}/get`, params).then(({ data: res }) => {
//         const { data } = res;
//         expect(data.method).equal('GET');
//         expect(data.params).deep.equal({ ...params, abc: '123' });
//         expect(data.path).match(/xtools_js\/get$/);
//         expect(data.headers.accept).equal('application/json, text/plain, */*');
//         expect(data.headers['content-type']).equal('application/json');
//       })
//     });
  
//     it('默认 HttpAxios 实例 - post 请求 - json 格式', () => {
//       http.postJson(`${urlPrefix}/post`, postData, params).then(({ data: res }) => {
//         const { data } = res;
//         expect(data.method).equal('POST');
//         expect(data.params).deep.equal({ ...params, abc: '123' });
//         expect(data.headers.accept).equal('application/json, text/plain, */*');
//         expect(data.headers['content-type']).equal('application/json');
//         expect(data.body).deep.equal(postData);
//       })
//     });
  
//     it('默认 HttpAxios 实例 - post 请求 - formdata 格式', () => {
//       http.postFormData(`${urlPrefix}/post`, postData, params).then(({ data: res }) => {
//         const { data } = res;
//         expect(data.method).equal('POST');
//         expect(data.params).deep.equal({ ...params, abc: '123' });
//         expect(data.headers.accept).equal('application/json, text/plain, */*');
//         expect(data.headers['content-type']).equal('application/x-www-form-urlencoded');
//         expect(data.body).deep.equal({ ...postData, age: '18' });
//       })
//     });
  
//   });
  
//   describe('默认 HttpAxios 实例 - config 等参数测试', () => {
//     it('默认 HttpAxios 实例 - get 请求 - params 选项', () => {
//       http.get(`${urlPrefix}/get`, { abc: '123', def: '4', c: '', d: ['1', '2'] }).then(({ data: res }) => {
//         const { data } = res;
//         expect(data.params).deep.equal({ abc: '123', def: '4', c: '', d: ['1', '2'] });
//       })
//     })
  
//     it('默认 HttpAxios 实例 - get 请求 - config 选项', () => {
//       http.get(`${urlPrefix}/get`, undefined, {
//         headers: {
//           'abc': '1',
//           Cookie: 'cookie1=value1; cookie2=value2;'
//         },
//         withCredentials: true,
//       }).then(({ data: res }) => {
//         const { data } = res;
//         expect(data.headers.abc).equal('1');
//         expect(data.cookies).deep.equal({ cookie1: 'value1', cookie2: 'value2' });
//       })
//     })
//   });
  
//   describe('自定义 HttpAxios 实例 - baseUrl、deleteParams', () => {
//     it('默认 HttpAxios 实例 - deleteParams=true', () => {
//       http2.postJson('/post', { age: 18, key2: null, key3: ''}, undefined, {
//         extraConfig: { deleteParams: true }
//       }).then(({ data: res }) => {
//         expect(res.data.body).deep.equal({ age: 18, key3: ''});
//       })
//     });
  
//     it('默认 HttpAxios 实例 - deleteParams=[null, \'\']', () => {
//       http2.postJson('/post', { age: 18, key2: null, key3: ''}, undefined, {
//         extraConfig: { deleteParams: [null, ''] }
//       }).then(({ data: res }) => {
//         expect(res.data.body).deep.equal({ age: 18 });
//       })
//     });
//   });
  
//   describe('自定义 HttpAxios 实例 - 超时配置', () => {
//     const http3 = createHttpInstance({ baseURL: urlPrefix,  timeout: 100 });
//     it('默认 HttpAxios 实例 - deleteParams=true', () => {
//       http3.get('/get').catch(err => {
//         // TODO: timeoutErrorMessage 在 nodejs 环境下不生效: https://github.com/axios/axios/issues/3580
//         // expect(function () { throw err }).to.throw(Error, '请求已超时 (100毫秒)');
//         expect(function () { throw err }).to.throw(Error, 'timeout of 100ms exceeded');
//       })
//     });
//   });

//   describe('默认 HttpAxios 实例 - globalConfig 函数测试', () => {
  
//     it('选项 timeout', () => {
//       globalConfig({ timeout: 4 });
//       http.get(`${urlPrefix}/get?abc=123`)
//         .catch(err => {
//           expect(function () { throw err })
//             .to.throw(Error, 'timeout of 4ms exceeded');
//         })
//     });
  
//   });
// });

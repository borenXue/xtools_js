import { expect } from 'chai'
import treeSort from './tree-sort'

describe('treeSort 测试用例', () => {
  it('使用默认配置参数:', () => {
      expect(treeSort([
        { id: 200, name: 'item-200' },
        { 
          id: 100, name: 'item-100',
          children: [
            { id: 103 },
            { id: 101 },
            { id: 102 },
          ],
        },
        {
          id: 400, name: 'item-400',
          children: [
            { id: 403 },
            { id: 401 },
            {
              id: 409,
              children: [
                { id: 400001 },
                { id: 400008 },
                { id: 400004 },
                { id: 400002 },
              ],
            },
            { id: 402 },
          ],
        },
        { id: 300, name: 'item-300' },
      ])).to.deep.equal([
        {
          id: 100, name: 'item-100',
          children: [
            { id: 101 },
            { id: 102 },
            { id: 103 },
          ],
        },
        { id: 200, name: 'item-200' },
        { id: 300, name: 'item-300' },
        {
          id: 400, name: 'item-400',
          children: [
            { id: 401 },
            { id: 402 },
            { id: 403 },
            {
              id: 409,
              children: [
                { id: 400001 },
                { id: 400002 },
                { id: 400004 },
                { id: 400008 },
              ],
            },
          ],
        },
      ])
  })

  it('自定义参数: sortBy=newId  sortType=desc  childrenKey=childs', () => {
    expect(treeSort([
      { newId: 200, name: 'item-200' },
      {
        newId: 100, name: 'item-100',
        childs: [
          { newId: 103 },
          { newId: 101 },
          { newId: 102 },
        ],
      },
      {
        newId: 400, name: 'item-400',
        childs: [
          { newId: 403 },
          { newId: 401 },
          {
            newId: 409,
            childs: [
              { newId: 400001 },
              { newId: 400008 },
              { newId: 400004 },
              { newId: 400002 },
            ],
          },
          { newId: 402 },
        ],
      },
      { newId: 300, name: 'item-300' },
    ], 'newId', 'desc', 'childs')).to.deep.equal([
      {
        newId: 400, name: 'item-400',
        childs: [
          {
            newId: 409,
            childs: [
              { newId: 400008 },
              { newId: 400004 },
              { newId: 400002 },
              { newId: 400001 },
            ],
          },
          { newId: 403 },
          { newId: 402 },
          { newId: 401 },
        ],
      },
      { newId: 300, name: 'item-300' },
      { newId: 200, name: 'item-200' },
      {
        newId: 100, name: 'item-100',
        childs: [
          { newId: 103 },
          { newId: 102 },
          { newId: 101 },
        ],
      },
    ])
})
})

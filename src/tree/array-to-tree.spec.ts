import { expect } from 'chai'

import arrayToTree from './array-to-tree'

describe('arrayToTree 基本用法 - 默认参数 (不含排序与孤儿的处理)', () => {
    it(`使用默认参数:(不设置任何参数)`, () => {
        expect(arrayToTree([
            { id: 400, parentId: undefined, value: 'item-400' },
            { id: 500, parentId: '', value: 'item-500' },
            { id: 101, parentId: 100, value: 'item-101' },
            { id: 100, parentId: null, value: 'item-100' },
            { id: 200, parentId: 100, value: 'item-200' },
            { id: 300, parentId: 100, value: 'item-300' },
        ])).to.deep.equal([
            { id: 400, parentId: undefined, value: 'item-400', children: [] },
            { id: 500, parentId: '', value: 'item-500', children: [] },
            {
                id: 100, parentId: null, value: 'item-100',
                children: [
                    { id: 101, parentId: 100, value: 'item-101', children: [] },
                    { id: 200, parentId: 100, value: 'item-200', children: [] },
                    { id: 300, parentId: 100, value: 'item-300', children: [] },
                ],
            },
        ])
    })

    it(`使用默认参数:(参数重新设置为默认值) {
        idKey: 'id',
        parentIdKey: 'parentId',
        childrenKey: 'children',
        rootIdValue: undefined,
        dataFieldKey: null,
    }`, () => {
        expect(arrayToTree([
            { id: 400, parentId: undefined, value: 'item-400' },
            { id: 500, parentId: '', value: 'item-500' },
            { id: 101, parentId: 100, value: 'item-101' },
            { id: 100, parentId: null, value: 'item-100' },
            { id: 200, parentId: 100, value: 'item-200' },
            { id: 300, parentId: 100, value: 'item-300' },
        ], {
            idKey: 'id',
            parentIdKey: 'parentId',
            childrenKey: 'children',
            rootIdValue: undefined,
            dataFieldKey: null,
        })).to.deep.equal([
            { id: 400, parentId: undefined, value: 'item-400', children: [] },
            { id: 500, parentId: '', value: 'item-500', children: [] },
            {
                id: 100, parentId: null, value: 'item-100',
                children: [
                    { id: 101, parentId: 100, value: 'item-101', children: [] },
                    { id: 200, parentId: 100, value: 'item-200', children: [] },
                    { id: 300, parentId: 100, value: 'item-300', children: [] },
                ],
            },
        ])
    })
})


describe('arrayToTree 基本用法 - 自定义参数值 (不含排序与孤儿的处理)', () => {
    it(`自定义参数值: {idKey: 'newId'}`, () => {
        expect(arrayToTree([
            { newId: 101, parentId: 100, value: 'item-101' },
            { newId: 100, parentId: null, value: 'item-100' },
            { newId: 200, parentId: 100, value: 'item-200' },
            { newId: 300, parentId: 100, value: 'item-300' },
        ], { idKey: 'newId' })).to.deep.equal([
            {
                newId: 100, parentId: null, value: 'item-100',
                children: [
                    { children: [], newId: 101, parentId: 100, value: 'item-101' },
                    { children: [], newId: 200, parentId: 100, value: 'item-200' },
                    { children: [], newId: 300, parentId: 100, value: 'item-300' },
                ],
            },
        ])
    })

    it(`自定义参数值: {parentIdKey: 'newParentId'}`, () => {
        expect(arrayToTree([
            { id: 101, newParentId: 100, value: 'item-101' },
            { id: 100, newParentId: null, value: 'item-100' },
            { id: 200, newParentId: 100, value: 'item-200' },
            { id: 300, newParentId: 100, value: 'item-300' },
        ], { parentIdKey: 'newParentId' })).to.deep.equal([
            {
                id: 100, newParentId: null, value: 'item-100',
                children: [
                    { id: 101, newParentId: 100, value: 'item-101', children: [] },
                    { id: 200, newParentId: 100, value: 'item-200', children: [] },
                    { id: 300, newParentId: 100, value: 'item-300', children: [] },
                ],
            },
        ])
    })

    it(`自定义参数值: {parentIdKey: 'parent.id'}`, () => {
        expect(arrayToTree([
            { id: 101, parent: { id: 100 }, value: 'item-101' },
            { id: 100, parent: {}, value: 'item-100' },
            { id: 200, parent: {id: 100}, value: 'item-200' },
            { id: 300, parent: {id: 100}, value: 'item-300' },
        ], { parentIdKey: 'parent.id' })).to.deep.equal([
            {
                id: 100, parent: {}, value: 'item-100',
                children: [
                    { id: 101, parent: {id: 100}, value: 'item-101', children: [] },
                    { id: 200, parent: {id: 100}, value: 'item-200', children: [] },
                    { id: 300, parent: {id: 100}, value: 'item-300', children: [] },
                ],
            },
        ])
    })

    it(`自定义参数值: {childrenKey: 'subLevel'}`, () => {
        expect(arrayToTree([
            { id: 101, parentId: 100, value: 'item-101' },
            { id: 100, parentId: null, value: 'item-100' },
            { id: 200, parentId: 100, value: 'item-200' },
            { id: 300, parentId: 100, value: 'item-300' },
        ], { childrenKey: 'subLevel' })).to.deep.equal([
            {
                id: 100, parentId: null, value: 'item-100',
                subLevel: [
                    { id: 101, parentId: 100, value: 'item-101', subLevel: [] },
                    { id: 200, parentId: 100, value: 'item-200', subLevel: [] },
                    { id: 300, parentId: 100, value: 'item-300', subLevel: [] },
                ],
            },
        ])
    })

    it(`自定义参数值: {childrenKey: 'subLevel'}`, () => {
        expect(arrayToTree([
            { id: 101, parentId: 100, value: 'item-101' },
            { id: 100, parentId: null, value: 'item-100' },
            { id: 200, parentId: 100, value: 'item-200' },
            { id: 300, parentId: 100, value: 'item-300' },
        ], { childrenKey: 'subLevel' })).to.deep.equal([
            {
                id: 100, parentId: null, value: 'item-100',
                subLevel: [
                    { id: 101, parentId: 100, value: 'item-101', subLevel: [] },
                    { id: 200, parentId: 100, value: 'item-200', subLevel: [] },
                    { id: 300, parentId: 100, value: 'item-300', subLevel: [] },
                ],
            },
        ])
    })

    it(`自定义参数值: {dataFieldKey: 'originData'}`, () => {
        expect(arrayToTree([
            { id: 400, parentId: undefined, value: 'item-400' },
            { id: 101, parentId: 100, value: 'item-101' },
            { id: 100, parentId: null, value: 'item-100' },
            { id: 200, parentId: 100, value: 'item-200' },
            { id: 300, parentId: 100, value: 'item-300' },
        ], { dataFieldKey: 'originData' })).to.deep.equal([
            { id: 400, originData: {id: 400, parentId: undefined, value: 'item-400'}, children: [] },
            {
                id: 100,
                originData: {id: 100, parentId: null, value: 'item-100'}, 
                children: [
                    { id: 101, originData: {id: 101, parentId: 100, value: 'item-101'}, children: [] },
                    { id: 200, originData: {id: 200, parentId: 100, value: 'item-200'}, children: [] },
                    { id: 300, originData: {id: 300, parentId: 100, value: 'item-300'}, children: [] },
                ],
            },
        ])
    })

    it(`自定义参数值 - 综合: {
        idKey: 'newId',
        parentIdKey: 'parent.info.id',
        childrenKey: 'newChilds',
        rootIdValue: 1000,
        dataFieldKey: 'newDataField',
    }`, () => {
        expect(arrayToTree([
            { newId: 400, value: 'item-400' },
            { newId: 500, parent: {}, value: 'item-500' },
            { newId: 600, parent: { info: {} }, value: 'item-600' },
            { newId: 700, parent: { info: { id: null } }, value: 'item-700' },
            { newId: 800, parent: { info: { id: '' } }, value: 'item-800' },
            { newId: 900, parent: { info: { id: undefined } }, value: 'item-900' },

            { newId: 101, parent: { info: { id: 100 } }, value: 'item-101' },
            { newId: 100, parent: { info: { id: 1000 } }, value: 'item-100' },
            { newId: 200, parent: { info: { id: 100 } }, value: 'item-200' },
            { newId: 300, parent: { info: { id: 100 } }, value: 'item-300' },
        ], {
            idKey: 'newId',
            parentIdKey: 'parent.info.id',
            childrenKey: 'newChilds',
            rootIdValue: 1000,
            dataFieldKey: 'newDataField',
        })).to.deep.equal([
            { newId: 400,newDataField: { newId: 400, value: 'item-400' }, newChilds: [] },
            { newId: 500, newDataField: { newId: 500, parent: {}, value: 'item-500' }, newChilds: [] },
            { newId: 600, newDataField: { newId: 600, parent: { info: {} }, value: 'item-600' }, newChilds: [] },
            { newId: 700, newDataField: { newId: 700, parent: { info: { id: null } }, value: 'item-700' }, newChilds: [] },
            { newId: 800, newDataField: { newId: 800, parent: { info: { id: '' } }, value: 'item-800' }, newChilds: [] },
            { newId: 900, newDataField: { newId: 900, parent: { info: { id: undefined } }, value: 'item-900' }, newChilds: [] },
            {
                newId: 100, 
                newDataField: {newId: 100, parent: { info: { id: 1000 } }, value: 'item-100'}, 
                newChilds: [
                    { newId: 101, newDataField: {newId: 101, parent: { info: { id: 100 } }, value: 'item-101'}, newChilds: [] },
                    { newId: 200, newDataField: {newId: 200, parent: { info: { id: 100 } }, value: 'item-200'}, newChilds: [] },
                    { newId: 300,newDataField: {newId: 300, parent: { info: { id: 100 } }, value: 'item-300'}, newChilds: [] },
                ],
            },
        ])
    })
})


describe('arrayToTree 高级用法-孤儿处理 - 默认参数', () => {
    it(`使用默认参数:(不设置任何参数)`, () => {
        expect(arrayToTree([
            { id: 400, parentId: 123456, value: 'item-400' },
            { id: 101, parentId: 100, value: 'item-101' },
            { id: 100, parentId: null, value: 'item-100' },
            { id: 500, parentId: 1234567, value: 'item-500' },
            { id: 200, parentId: 123456, value: 'item-200' },
            { id: 300, parentId: 100, value: 'item-300' },
        ])).to.deep.equal([
            {
                id: 100, parentId: null, value: 'item-100',
                children: [
                    { id: 101, parentId: 100, value: 'item-101', children: [] },
                    { id: 300, parentId: 100, value: 'item-300', children: [] },
                ],
            },
            { id: 400, parentId: 123456, value: 'item-400', children: [], __is_orphans: true },
            { id: 200, parentId: 123456, value: 'item-200', children: [], __is_orphans: true },
            { id: 500, parentId: 1234567, value: 'item-500', children: [], __is_orphans: true },
        ])
    })

    it(`使用默认参数:(参数重新设置为默认值) {
        orphansHandleType: 'root-warning',
        orphansFlagKey: '__is_orphans',
        orphansParent: 'ignore',
        orphansPosition: 'tail',
    }`, () => {
        expect(arrayToTree([
            { id: 400, parentId: 123456, value: 'item-400' },
            { id: 101, parentId: 100, value: 'item-101' },
            { id: 100, parentId: null, value: 'item-100' },
            { id: 500, parentId: 1234567, value: 'item-500' },
            { id: 200, parentId: 123456, value: 'item-200' },
            { id: 300, parentId: 100, value: 'item-300' },
        ], {
            orphansHandleType: 'root-warning',
            orphansFlagKey: '__is_orphans',
            orphansParent: 'ignore',
            orphansPosition: 'tail',
        })).to.deep.equal([
            {
                id: 100, parentId: null, value: 'item-100',
                children: [
                    { id: 101, parentId: 100, value: 'item-101', children: [] },
                    { id: 300, parentId: 100, value: 'item-300', children: [] },
                ],
            },
            { id: 400, parentId: 123456, value: 'item-400', children: [], __is_orphans: true },
            { id: 200, parentId: 123456, value: 'item-200', children: [], __is_orphans: true },
            { id: 500, parentId: 1234567, value: 'item-500', children: [], __is_orphans: true },
        ])
    })
})

describe('arrayToTree 高级用法-孤儿处理 - 自定义参数值', () => {
    it(`自定义参数值: {orphansHandleType: 'error'}`, () => {
        expect(function () {
            arrayToTree([
                { id: 400, parentId: 123456, value: 'item-400' },
                { id: 101, parentId: 100, value: 'item-101' },
                { id: 100, parentId: null, value: 'item-100' },
                { id: 500, parentId: 1234567, value: 'item-500' },
                { id: 200, parentId: 123456, value: 'item-200' },
                { id: 300, parentId: 100, value: 'item-300' },
            ], { orphansHandleType: 'error' })
        }).to.throw(Error, '孤儿元素 (共3个):\n\t孤儿项: 400,200 - 对应的父节点不存在: 123456\t孤儿项: 500 - 对应的父节点不存在: 1234567')
    })
    it(`自定义参数值: {orphansHandleType: 'ignore'}`, () => {
        expect(arrayToTree([
            { id: 400, parentId: 123456, value: 'item-400' },
            { id: 101, parentId: 100, value: 'item-101' },
            { id: 100, parentId: null, value: 'item-100' },
            { id: 500, parentId: 1234567, value: 'item-500' },
            { id: 200, parentId: 123456, value: 'item-200' },
            { id: 300, parentId: 100, value: 'item-300' },
        ], { orphansHandleType: 'ignore' })).to.deep.equal([
            {
                id: 100, parentId: null, value: 'item-100',
                children: [
                    { id: 101, parentId: 100, value: 'item-101', children: [] },
                    { id: 300, parentId: 100, value: 'item-300', children: [] },
                ],
            },
        ])
    })
    it(`自定义参数值: {orphansHandleType: 'ignore-warning'}`, () => {
        expect(arrayToTree([
            { id: 400, parentId: 123456, value: 'item-400' },
            { id: 101, parentId: 100, value: 'item-101' },
            { id: 100, parentId: null, value: 'item-100' },
            { id: 500, parentId: 1234567, value: 'item-500' },
            { id: 200, parentId: 123456, value: 'item-200' },
            { id: 300, parentId: 100, value: 'item-300' },
        ], { orphansHandleType: 'ignore' })).to.deep.equal([
            {
                id: 100, parentId: null, value: 'item-100',
                children: [
                    { id: 101, parentId: 100, value: 'item-101', children: [] },
                    { id: 300, parentId: 100, value: 'item-300', children: [] },
                ],
            },
        ])
    })
    it(`自定义参数值: {orphansHandleType: 'root'}`, () => {
        expect(arrayToTree([
            { id: 400, parentId: 123456, value: 'item-400' },
            { id: 101, parentId: 100, value: 'item-101' },
            { id: 100, parentId: null, value: 'item-100' },
            { id: 500, parentId: 1234567, value: 'item-500' },
            { id: 200, parentId: 123456, value: 'item-200' },
            { id: 300, parentId: 100, value: 'item-300' },
        ], { orphansHandleType: 'root' })).to.deep.equal([
            {
                id: 100, parentId: null, value: 'item-100',
                children: [
                    { id: 101, parentId: 100, value: 'item-101', children: [] },
                    { id: 300, parentId: 100, value: 'item-300', children: [] },
                ],
            },
            { id: 400, parentId: 123456, value: 'item-400', children: [], __is_orphans: true },
            { id: 200, parentId: 123456, value: 'item-200', children: [], __is_orphans: true },
            { id: 500, parentId: 1234567, value: 'item-500', children: [], __is_orphans: true },
        ])
    })


    it(`自定义参数值: {orphansFlagKey: '$orphansFlag'}`, () => {
        expect(arrayToTree([
            { id: 400, parentId: 123456, value: 'item-400' },
            { id: 101, parentId: 100, value: 'item-101' },
            { id: 100, parentId: null, value: 'item-100' },
            { id: 500, parentId: 1234567, value: 'item-500' },
            { id: 200, parentId: 123456, value: 'item-200' },
            { id: 300, parentId: 100, value: 'item-300' },
        ], { orphansFlagKey: '$orphansFlag' })).to.deep.equal([
            {
                id: 100, parentId: null, value: 'item-100',
                children: [
                    { id: 101, parentId: 100, value: 'item-101', children: [] },
                    { id: 300, parentId: 100, value: 'item-300', children: [] },
                ],
            },
            { id: 400, parentId: 123456, value: 'item-400', children: [], $orphansFlag: true },
            { id: 200, parentId: 123456, value: 'item-200', children: [], $orphansFlag: true },
            { id: 500, parentId: 1234567, value: 'item-500', children: [], $orphansFlag: true },
        ])
    })
    it(`自定义参数值: {orphansFlagKey: ''}`, () => {
        expect(arrayToTree([
            { id: 400, parentId: 123456, value: 'item-400' },
            { id: 101, parentId: 100, value: 'item-101' },
            { id: 100, parentId: null, value: 'item-100' },
            { id: 500, parentId: 1234567, value: 'item-500' },
            { id: 200, parentId: 123456, value: 'item-200' },
            { id: 300, parentId: 100, value: 'item-300' },
        ], { orphansFlagKey: '' })).to.deep.equal([
            {
                id: 100, parentId: null, value: 'item-100',
                children: [
                    { id: 101, parentId: 100, value: 'item-101', children: [] },
                    { id: 300, parentId: 100, value: 'item-300', children: [] },
                ],
            },
            { id: 400, parentId: 123456, value: 'item-400', children: [] },
            { id: 200, parentId: 123456, value: 'item-200', children: [] },
            { id: 500, parentId: 1234567, value: 'item-500', children: [] },
        ])
    })
    it(`自定义参数值: {orphansFlagKey: undefined}`, () => {
        expect(arrayToTree([
            { id: 400, parentId: 123456, value: 'item-400' },
            { id: 101, parentId: 100, value: 'item-101' },
            { id: 100, parentId: null, value: 'item-100' },
            { id: 500, parentId: 1234567, value: 'item-500' },
            { id: 200, parentId: 123456, value: 'item-200' },
            { id: 300, parentId: 100, value: 'item-300' },
        ], { orphansFlagKey: undefined })).to.deep.equal([
            {
                id: 100, parentId: null, value: 'item-100',
                children: [
                    { id: 101, parentId: 100, value: 'item-101', children: [] },
                    { id: 300, parentId: 100, value: 'item-300', children: [] },
                ],
            },
            { id: 400, parentId: 123456, value: 'item-400', children: [] },
            { id: 200, parentId: 123456, value: 'item-200', children: [] },
            { id: 500, parentId: 1234567, value: 'item-500', children: [] },
        ])
    })
    it(`自定义参数值: {orphansFlagKey: null}`, () => {
        expect(arrayToTree([
            { id: 400, parentId: 123456, value: 'item-400' },
            { id: 101, parentId: 100, value: 'item-101' },
            { id: 100, parentId: null, value: 'item-100' },
            { id: 500, parentId: 1234567, value: 'item-500' },
            { id: 200, parentId: 123456, value: 'item-200' },
            { id: 300, parentId: 100, value: 'item-300' },
        ], { orphansFlagKey: null })).to.deep.equal([
            {
                id: 100, parentId: null, value: 'item-100',
                children: [
                    { id: 101, parentId: 100, value: 'item-101', children: [] },
                    { id: 300, parentId: 100, value: 'item-300', children: [] },
                ],
            },
            { id: 400, parentId: 123456, value: 'item-400', children: [] },
            { id: 200, parentId: 123456, value: 'item-200', children: [] },
            { id: 500, parentId: 1234567, value: 'item-500', children: [] },
        ])
    })


    it(`自定义参数值: {orphansParent: 'create'}`, () => {
        expect(arrayToTree([
            { id: 400, parentId: 123456, value: 'item-400' },
            { id: 101, parentId: 100, value: 'item-101' },
            { id: 100, parentId: null, value: 'item-100' },
            { id: 500, parentId: 1234567, value: 'item-500' },
            { id: 200, parentId: 123456, value: 'item-200' },
            { id: 300, parentId: 100, value: 'item-300' },
        ], { orphansParent: 'create' })).to.deep.equal([
            {
                id: 100, parentId: null, value: 'item-100',
                children: [
                    { id: 101, parentId: 100, value: 'item-101', children: [] },
                    { id: 300, parentId: 100, value: 'item-300', children: [] },
                ],
            },
            {
                id: 123456, __is_orphans: true,
                children: [
                    { id: 400, parentId: 123456, value: 'item-400', children: [], __is_orphans: true },
                    { id: 200, parentId: 123456, value: 'item-200', children: [], __is_orphans: true },
                ]
            },
            {
                id: 1234567, __is_orphans: true, children: [{ id: 500, parentId: 1234567, value: 'item-500', children: [], __is_orphans: true }]
            },
        ])
    })


    it(`自定义参数值: {orphansPosition: 'head'}`, () => {
        expect(arrayToTree([
            { id: 400, parentId: 123456, value: 'item-400' },
            { id: 101, parentId: 100, value: 'item-101' },
            { id: 100, parentId: null, value: 'item-100' },
            { id: 500, parentId: 1234567, value: 'item-500' },
            { id: 200, parentId: 123456, value: 'item-200' },
            { id: 300, parentId: 100, value: 'item-300' },
        ], { orphansPosition: 'head' })).to.deep.equal([
            { id: 500, parentId: 1234567, value: 'item-500', children: [], __is_orphans: true },
            { id: 200, parentId: 123456, value: 'item-200', children: [], __is_orphans: true },
            { id: 400, parentId: 123456, value: 'item-400', children: [], __is_orphans: true },
            {
                id: 100, parentId: null, value: 'item-100',
                children: [
                    { id: 101, parentId: 100, value: 'item-101', children: [] },
                    { id: 300, parentId: 100, value: 'item-300', children: [] },
                ],
            },
        ])
    })


    it(`自定义参数值 - 综合: {
        orphansPosition: 'head',
        orphansHandleType: 'root',
        orphansFlagKey: '$orphans',
        orphansParent: 'create',
    }`, () => {
        expect(arrayToTree([
            { id: 400, parentId: 123456, value: 'item-400' },
            { id: 101, parentId: 100, value: 'item-101' },
            { id: 100, parentId: null, value: 'item-100' },
            { id: 500, parentId: 1234567, value: 'item-500' },
            { id: 200, parentId: 123456, value: 'item-200' },
            { id: 300, parentId: 100, value: 'item-300' },
        ], {
            orphansPosition: 'head',
            orphansHandleType: 'root',
            orphansFlagKey: '$orphans',
            orphansParent: 'create',
        })).to.deep.equal([
            {
                id: 1234567, $orphans: true, children: [{ id: 500, parentId: 1234567, value: 'item-500', children: [], $orphans: true }]
            },
            {
                id: 123456, $orphans: true,
                children: [
                    { id: 400, parentId: 123456, value: 'item-400', children: [], $orphans: true },
                    { id: 200, parentId: 123456, value: 'item-200', children: [], $orphans: true },
                ]
            },
            {
                id: 100, parentId: null, value: 'item-100',
                children: [
                    { id: 101, parentId: 100, value: 'item-101', children: [] },
                    { id: 300, parentId: 100, value: 'item-300', children: [] },
                ],
            },
        ])
    })
})


describe('arrayToTree 高级用法-排序用法 - 默认参数', () => {
    it(`使用默认参数:(不设置任何参数)`, () => {
        expect(arrayToTree([
            { id: 400, parentId: 200, value: 'item-400', seq: 1 },
            { id: 101, parentId: 100, value: 'item-101', seq: 2 },
            { id: 100, parentId: null, value: 'item-100', seq: 2 },
            { id: 500, parentId: 200, value: 'item-500', seq: 2 },
            { id: 200, parentId: '', value: 'item-200', seq: 1 },
            { id: 300, parentId: 100, value: 'item-300', seq: 1 },
        ])).to.deep.equal([
            {
                id: 100, parentId: null, value: 'item-100', seq: 2,
                children: [
                    { id: 101, parentId: 100, value: 'item-101', seq: 2, children: [] },
                    { id: 300, parentId: 100, value: 'item-300', seq: 1, children: [] },
                ]
            },
            {
                id: 200, parentId: '', value: 'item-200', seq: 1,
                children: [
                    { id: 400, parentId: 200, value: 'item-400', seq: 1, children: [] },
                    { id: 500, parentId: 200, value: 'item-500', seq: 2, children: [] },
                ],
            },
        ])
    })

    it(`使用默认参数:(参数重新设置为默认值) {sort: null}`, () => {
        expect(arrayToTree([
            { id: 400, parentId: 200, value: 'item-400', seq: 1 },
            { id: 101, parentId: 100, value: 'item-101', seq: 2 },
            { id: 100, parentId: null, value: 'item-100', seq: 2 },
            { id: 500, parentId: 200, value: 'item-500', seq: 2 },
            { id: 200, parentId: '', value: 'item-200', seq: 1 },
            { id: 300, parentId: 100, value: 'item-300', seq: 1 },
        ])).to.deep.equal([
            {
                id: 100, parentId: null, value: 'item-100', seq: 2,
                children: [
                    { id: 101, parentId: 100, value: 'item-101', seq: 2, children: [] },
                    { id: 300, parentId: 100, value: 'item-300', seq: 1, children: [] },
                ]
            },
            {
                id: 200, parentId: '', value: 'item-200', seq: 1,
                children: [
                    { id: 400, parentId: 200, value: 'item-400', seq: 1, children: [] },
                    { id: 500, parentId: 200, value: 'item-500', seq: 2, children: [] },
                ],
            },
        ])
    })
})

describe('arrayToTree 高级用法-排序用法 - 自定义参数值', () => {
    it(`自定义参数值: {sort: ''}`, () => {
        expect(arrayToTree([
            { id: 400, parentId: 200, value: 'item-400', seq: 1 },
            { id: 101, parentId: 100, value: 'item-101', seq: 2 },
            { id: 100, parentId: null, value: 'item-100', seq: 2 },
            { id: 500, parentId: 200, value: 'item-500', seq: 2 },
            { id: 200, parentId: '', value: 'item-200', seq: 1 },
            { id: 300, parentId: 100, value: 'item-300', seq: 1 },
        ], { sort: '' })).to.deep.equal([
            {
                id: 100, parentId: null, value: 'item-100', seq: 2,
                children: [
                    { id: 101, parentId: 100, value: 'item-101', seq: 2, children: [] },
                    { id: 300, parentId: 100, value: 'item-300', seq: 1, children: [] },
                ]
            },
            {
                id: 200, parentId: '', value: 'item-200', seq: 1,
                children: [
                    { id: 400, parentId: 200, value: 'item-400', seq: 1, children: [] },
                    { id: 500, parentId: 200, value: 'item-500', seq: 2, children: [] },
                ],
            },
        ])
    })
    it(`自定义参数值: {sort: undefined}`, () => {
        expect(arrayToTree([
            { id: 400, parentId: 200, value: 'item-400', seq: 1 },
            { id: 101, parentId: 100, value: 'item-101', seq: 2 },
            { id: 100, parentId: null, value: 'item-100', seq: 2 },
            { id: 500, parentId: 200, value: 'item-500', seq: 2 },
            { id: 200, parentId: '', value: 'item-200', seq: 1 },
            { id: 300, parentId: 100, value: 'item-300', seq: 1 },
        ], { sort: '' })).to.deep.equal([
            {
                id: 100, parentId: null, value: 'item-100', seq: 2,
                children: [
                    { id: 101, parentId: 100, value: 'item-101', seq: 2, children: [] },
                    { id: 300, parentId: 100, value: 'item-300', seq: 1, children: [] },
                ]
            },
            {
                id: 200, parentId: '', value: 'item-200', seq: 1,
                children: [
                    { id: 400, parentId: 200, value: 'item-400', seq: 1, children: [] },
                    { id: 500, parentId: 200, value: 'item-500', seq: 2, children: [] },
                ],
            },
        ])
    })

    it(`自定义参数值: {sort: 'seq'}`, () => {
        expect(arrayToTree([
            { id: 400, parentId: 200, value: 'item-400', seq: 1 },
            { id: 101, parentId: 100, value: 'item-101', seq: 2 },
            { id: 100, parentId: null, value: 'item-100', seq: 2 },
            { id: 500, parentId: 200, value: 'item-500', seq: 2 },
            { id: 200, parentId: '', value: 'item-200', seq: 1 },
            { id: 300, parentId: 100, value: 'item-300', seq: 1 },
        ], { sort: 'seq' })).to.deep.equal([
            {
                id: 200, parentId: '', value: 'item-200', seq: 1,
                children: [
                    { id: 400, parentId: 200, value: 'item-400', seq: 1, children: [] },
                    { id: 500, parentId: 200, value: 'item-500', seq: 2, children: [] },
                ],
            },
            {
                id: 100, parentId: null, value: 'item-100', seq: 2,
                children: [
                    { id: 300, parentId: 100, value: 'item-300', seq: 1, children: [] },
                    { id: 101, parentId: 100, value: 'item-101', seq: 2, children: [] },
                ]
            },
        ])
    })
    it(`自定义参数值: {sort: ['seq']}`, () => {
        expect(arrayToTree([
            { id: 400, parentId: 200, value: 'item-400', seq: 1 },
            { id: 101, parentId: 100, value: 'item-101', seq: 2 },
            { id: 100, parentId: null, value: 'item-100', seq: 2 },
            { id: 500, parentId: 200, value: 'item-500', seq: 2 },
            { id: 200, parentId: '', value: 'item-200', seq: 1 },
            { id: 300, parentId: 100, value: 'item-300', seq: 1 },
        ], { sort: ['seq'] })).to.deep.equal([
            {
                id: 200, parentId: '', value: 'item-200', seq: 1,
                children: [
                    { id: 400, parentId: 200, value: 'item-400', seq: 1, children: [] },
                    { id: 500, parentId: 200, value: 'item-500', seq: 2, children: [] },
                ],
            },
            {
                id: 100, parentId: null, value: 'item-100', seq: 2,
                children: [
                    { id: 300, parentId: 100, value: 'item-300', seq: 1, children: [] },
                    { id: 101, parentId: 100, value: 'item-101', seq: 2, children: [] },
                ]
            },
        ])
    })
    it(`自定义参数值: {sort: ['seq', 'asc'}`, () => {
        expect(arrayToTree([
            { id: 400, parentId: 200, value: 'item-400', seq: 1 },
            { id: 101, parentId: 100, value: 'item-101', seq: 2 },
            { id: 100, parentId: null, value: 'item-100', seq: 2 },
            { id: 500, parentId: 200, value: 'item-500', seq: 2 },
            { id: 200, parentId: '', value: 'item-200', seq: 1 },
            { id: 300, parentId: 100, value: 'item-300', seq: 1 },
        ], { sort: ['seq', 'asc'] })).to.deep.equal([
            {
                id: 200, parentId: '', value: 'item-200', seq: 1,
                children: [
                    { id: 400, parentId: 200, value: 'item-400', seq: 1, children: [] },
                    { id: 500, parentId: 200, value: 'item-500', seq: 2, children: [] },
                ],
            },
            {
                id: 100, parentId: null, value: 'item-100', seq: 2,
                children: [
                    { id: 300, parentId: 100, value: 'item-300', seq: 1, children: [] },
                    { id: 101, parentId: 100, value: 'item-101', seq: 2, children: [] },
                ]
            },
        ])
    })

    it(`自定义参数值: {sort: ['seq', 'desc']}`, () => {
        expect(arrayToTree([
            { id: 400, parentId: 200, value: 'item-400', seq: 1 },
            { id: 101, parentId: 100, value: 'item-101', seq: 2 },
            { id: 100, parentId: null, value: 'item-100', seq: 2 },
            { id: 500, parentId: 200, value: 'item-500', seq: 2 },
            { id: 200, parentId: '', value: 'item-200', seq: 1 },
            { id: 300, parentId: 100, value: 'item-300', seq: 1 },
        ], { sort: ['seq', 'desc'] })).to.deep.equal([
            {
                id: 100, parentId: null, value: 'item-100', seq: 2,
                children: [
                    { id: 101, parentId: 100, value: 'item-101', seq: 2, children: [] },
                    { id: 300, parentId: 100, value: 'item-300', seq: 1, children: [] },
                ]
            },
            {
                id: 200, parentId: '', value: 'item-200', seq: 1,
                children: [
                    { id: 500, parentId: 200, value: 'item-500', seq: 2, children: [] },
                    { id: 400, parentId: 200, value: 'item-400', seq: 1, children: [] },
                ],
            },
        ])
    })

    it(`自定义参数值: { sort: Function }`, () => {
        expect(arrayToTree([
            { id: 400, parentId: 200, value: 'item-400', seq: 1 },
            { id: 101, parentId: 100, value: 'item-101', seq: 2 },
            { id: 100, parentId: null, value: 'item-100', seq: 2 },
            { id: 500, parentId: 200, value: 'item-500', seq: 2 },
            { id: 200, parentId: '', value: 'item-200', seq: 1 },
            { id: 300, parentId: 100, value: 'item-300', seq: 1 },
        ], { sort: (a, b) => {
            if (a.id === 200) return 1
            if (a.id === 100) return -1

            if (a.id === 101) return 1
            if (a.id === 300) return -1

            if (a.id === 500) return -1
            if (a.id === 400) return 1
            return 0
        } })).to.deep.equal([
            {
                id: 100, parentId: null, value: 'item-100', seq: 2,
                children: [
                    { id: 300, parentId: 100, value: 'item-300', seq: 1, children: [] },
                    { id: 101, parentId: 100, value: 'item-101', seq: 2, children: [] },
                ]
            },
            {
                id: 200, parentId: '', value: 'item-200', seq: 1,
                children: [
                    { id: 500, parentId: 200, value: 'item-500', seq: 2, children: [] },
                    { id: 400, parentId: 200, value: 'item-400', seq: 1, children: [] },
                ],
            },
        ])
    })
})


describe('arrayToTree 综合使用所有参数', () => {
    it(`基本参数 + 排序处理 + 孤儿处理 {
        idKey: 'newId',
        parentIdKey: 'parent.id',
        childrenKey: 'newChilds',
        // rootIdValue: 1000,
        dataFieldKey: 'newDataField',
        // 孤儿
        orphansPosition: 'head',
        orphansHandleType: 'root',
        orphansFlagKey: '$orphans',
        orphansParent: 'create',
        // 排序
        sort: ['newId', 'asc'],
    }`, () => {
        expect(arrayToTree([
            { newId: 400, parent: { id: 123456 }, value: 'item-400' },
            { newId: 101, parent: { id: 100 }, value: 'item-101' },
            { newId: 100, parent: { id: null }, value: 'item-100' },
            { newId: 500, parent: { id: 1234567 }, value: 'item-500' },
            { newId: 200, parent: { id: '' }, value: 'item-200' },
            { newId: 300, parent: { id: 100 }, value: 'item-300' },
            { newId: 600, parent: { id: 1000 }, value: 'item-600' },
        ], {
            idKey: 'newId',
            parentIdKey: 'parent.id',
            childrenKey: 'newChilds',
            rootIdValue: 1000,
            dataFieldKey: 'newDataField',
            // 孤儿
            orphansPosition: 'head',
            orphansHandleType: 'root',
            orphansFlagKey: '$orphans',
            orphansParent: 'create',
            // 排序
            sort: ['newId', 'asc'],
        })).to.deep.equal([
            {
                newId: 1234567,
                $orphans: true,
                newDataField: { newId: 1234567 },
                newChilds: [{
                    newId: 500,
                    newDataField: {newId: 500, parent: { id: 1234567 }, value: 'item-500'},
                    newChilds: [], $orphans: true,
                }]
            },
            {
                newId: 123456,
                $orphans: true,
                newDataField: { newId: 123456 },
                newChilds: [
                    { newId: 400, newDataField: { newId: 400, parent: { id: 123456 }, value: 'item-400' }, newChilds: [], $orphans: true },
                ]
            },
            {
                newId: 100, 
                newDataField: { newId: 100, parent: { id: null }, value: 'item-100' },
                newChilds: [
                    { newId: 101, newDataField: { newId: 101, parent: { id: 100 }, value: 'item-101' }, newChilds: [] },
                    { newId: 300, newDataField: { newId: 300, parent: { id: 100 }, value: 'item-300' }, newChilds: [] },                    
                ],
            },
            { newId: 200, newDataField: { newId: 200, parent: { id: '' }, value: 'item-200' }, newChilds: [] },
            { 
                newId: 600, newChilds: [],
                newDataField: { newId: 600, parent: { id: 1000 }, value: 'item-600' },
            },
        ])
    })

    it(`基本参数 + 排序处理 + 孤儿处理 {
        idKey: 'newId',
        parentIdKey: 'parent.id',
        childrenKey: 'newChilds',
        // rootIdValue: 1000,
        dataFieldKey: 'newDataField',
        // 孤儿
        orphansPosition: 'head',
        orphansHandleType: 'root',
        orphansFlagKey: '$orphans',
        orphansParent: 'ignore',
        // 排序
        sort: ['newId', 'desc'],
    }`, () => {
        expect(arrayToTree([
            { newId: 400, parent: { id: 123456 }, value: 'item-400' },
            { newId: 101, parent: { id: 100 }, value: 'item-101' },
            { newId: 100, parent: { id: null }, value: 'item-100' },
            { newId: 500, parent: { id: 1234567 }, value: 'item-500' },
            { newId: 200, parent: { id: '' }, value: 'item-200' },
            { newId: 300, parent: { id: 100 }, value: 'item-300' },
            { newId: 600, parent: { id: 1000 }, value: 'item-600' },
        ], {
            idKey: 'newId',
            parentIdKey: 'parent.id',
            childrenKey: 'newChilds',
            rootIdValue: 1000,
            dataFieldKey: 'newDataField',
            // 孤儿
            orphansPosition: 'head',
            orphansHandleType: 'root',
            orphansFlagKey: '$orphans',
            orphansParent: 'ignore',
            // 排序
            sort: ['newId', 'desc'],
        })).to.deep.equal([
            {
                newId: 500,
                newDataField: {newId: 500, parent: { id: 1234567 }, value: 'item-500'},
                newChilds: [], $orphans: true,
            },
            { newId: 400, newDataField: { newId: 400, parent: { id: 123456 }, value: 'item-400' }, newChilds: [], $orphans: true },
            { 
                newId: 600, newChilds: [],
                newDataField: { newId: 600, parent: { id: 1000 }, value: 'item-600' },
            },
            { newId: 200, newDataField: { newId: 200, parent: { id: '' }, value: 'item-200' }, newChilds: [] },
            {
                newId: 100, 
                newDataField: { newId: 100, parent: { id: null }, value: 'item-100' },
                newChilds: [
                    { newId: 300, newDataField: { newId: 300, parent: { id: 100 }, value: 'item-300' }, newChilds: [] },
                    { newId: 101, newDataField: { newId: 101, parent: { id: 100 }, value: 'item-101' }, newChilds: [] },
                ],
            },
        ])
    })
})

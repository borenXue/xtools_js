import { use, expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { createGraph, graphData1, graphData2, graphData3, graphData4, graphData5 } from "../datas-for-test.spec";
use(chaiAlmost());

describe('数据结构', () => {
  describe('图', () => {
    it('isDAG - 图1~~图5', () => {
      const graph1 = createGraph(graphData1);
      const graph2 = createGraph(graphData2);
      const graph3 = createGraph(graphData3);
      const graph4 = createGraph(graphData4);
      const graph5 = createGraph(graphData5);

      expect(graph1.isDAG()).to.equal(true);
      expect(graph2.isDAG()).to.equal(true);
      expect(graph3.isDAG()).to.equal(true);
      expect(graph4.isDAG()).to.equal(true);
      expect(graph5.isDAG()).to.equal(false);
    });
    it('查询孤儿节点 getOrphanNodes - 图1~~图5', () => {
      const graph1 = createGraph(graphData1);
      const graph2 = createGraph(graphData2);
      const graph3 = createGraph(graphData3);
      const graph4 = createGraph(graphData4);
      const graph5 = createGraph(graphData5);

      expect(graph1.getOrphanNodes()).to.deep.equal([]);
      expect(graph2.getOrphanNodes()).to.deep.equal([]);
      expect(graph3.getOrphanNodes()).to.deep.equal([
        {id: 'node-7', name: '节点7'},
        {id: 'node-8', name: '节点8'},
      ]);
      expect(graph4.getOrphanNodes()).to.deep.equal([]);
      expect(graph5.getOrphanNodes()).to.deep.equal([]);
    });
    it('删除孤儿节点 removeOrphanNodes - 图3', () => {
      const graph3 = createGraph(graphData3);

      expect(graph3.removeOrphanNodes()).to.deep.equal([
        {id: 'node-7', name: '节点7'},
        {id: 'node-8', name: '节点8'},
      ]);
      expect(graph3.getOrphanNodes()).to.deep.equal([]);
    });
  });
});










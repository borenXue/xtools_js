import { use, expect } from 'chai';
import chaiAlmost from 'chai-almost';
import dijkstra from './shortest-path/dijkstra';
import { longestPath, longestPathSingleSource } from ".";
import bellmanFord from './shortest-path/bellman-ford';
import {
  createGraph,
  graphData1, graphData1_singleSourceShortestPathResult, graphData1_longestPath,
  graphData2, graphData2_singleSourceShortestPathResult, graphData2_longestPath, graphData3_singleSourceShortestPathResult_v2,
  graphData3, graphData3_singleSourceShortestPathResult, graphData3_longestPath,
} from "../datas-for-test.spec";

use(chaiAlmost());

describe('图论与算法', () => {
  describe('单源最短路径算法 dijkstra', () => {
    it('图1 - 4个节点5条边', () => {
      const graph = createGraph(graphData1, false);
      expect(dijkstra(graph, "node-1"))
        .to.deep.equal(graphData1_singleSourceShortestPathResult);
    });
  
    it('图2 - 6个节点9条边', () => {
      const graph = createGraph(graphData2, false);
      const result = dijkstra(graph, "node-1");
      expect(result).to.deep.equal(graphData2_singleSourceShortestPathResult);
    });

    it('图3 - 双起点、含孤儿节点、非连通图', () => {
      const graph = createGraph(graphData3, false);
      expect(function () {
        dijkstra(graph, "node-1")
      }).to.throw(Error, '图中不能存在孤儿节点: node-7,node-8');

      // 删除孤儿节点
      graph.removeOrphanNodes();

      expect(dijkstra(graph, "node-1"))
        .to.deep.equal(graphData3_singleSourceShortestPathResult);
      expect(dijkstra(graph, "node-9"))
        .to.deep.equal(graphData3_singleSourceShortestPathResult_v2);
    });
  });

  describe('单源最短路径算法 bellman-ford', () => {
    it('图1 - 4个节点5条边', () => {
      const graph = createGraph(graphData1, false);
      const result = bellmanFord(graph, "node-1");
      expect(result).to.deep.equal(graphData1_singleSourceShortestPathResult);
    });
  
    it('图2 - 6个节点9条边', () => {
      const graph = createGraph(graphData2, false);
      const result = bellmanFord(graph, "node-1");
      expect(result).to.deep.equal(graphData2_singleSourceShortestPathResult);
    });

    it('图3 - 双起点、含孤儿节点、非连通图', () => {
      const graph = createGraph(graphData3, false);
      expect(bellmanFord(graph, "node-1"))
        .to.deep.equal(graphData3_singleSourceShortestPathResult);
      expect(bellmanFord(graph, "node-9"))
        .to.deep.equal(graphData3_singleSourceShortestPathResult_v2);
    });
  });

  describe('单源最长路径问题 - 基于bellmanFord算法', () => {
    it('图1 - 4个节点5条边', () => {
      const graph = createGraph(graphData1, false);
      const result = longestPathSingleSource(graph, "node-1");
      expect(result).to.deep.equal(graphData1_longestPath);
    });

    it('图2 - 6个节点9条边', () => {
      const graph = createGraph(graphData2, false);
      const result = longestPathSingleSource(graph, "node-1");
      expect(result).to.deep.equal(graphData2_longestPath);
    });

    it('图3 - 双起点、含孤儿节点、非连通图', () => {
      const graph = createGraph(graphData3, false);
      const result1 = longestPathSingleSource(graph, "node-1");
      expect(result1).to.deep.equal([graphData3_longestPath[0]]);
      const result2 = longestPathSingleSource(graph, "node-9");
      expect(result2).to.deep.equal([graphData3_longestPath[1]]);
    });
  });

  describe('多源最长路径问题 - 基于bellmanFord算法', () => {
    it('图1 - 4个节点5条边', () => {
      const graph = createGraph(graphData1, false);
      const result = longestPath(graph);
      expect(result).to.deep.equal(graphData1_longestPath);
    });

    it('图2 - 6个节点9条边', () => {
      const graph = createGraph(graphData2, false);
      const result = longestPath(graph);
      expect(result).to.deep.equal(graphData2_longestPath);
    });

    it('图3 - 双起点、含孤儿节点、非连通图', () => {
      const graph = createGraph(graphData3, false);
      const result = longestPath(graph);
      expect(result).to.deep.equal([graphData3_longestPath[0], graphData3_longestPath[1]]);
    });
  });
});










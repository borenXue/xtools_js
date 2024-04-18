import { DirectedGraph } from "./data-structure/graph";
import datas from "../datas";

export function createGraph(data: any, negativeWeight = false) {
  const graph = new DirectedGraph();
  data.nodeList.forEach((node: any) => graph.addNode(node));
  data.edgeList.forEach((edge: any) => graph.addEdge({
    id: Math.random().toString(16).substring(2),
    ...edge,
    weight: negativeWeight ? -edge.weight : edge.weight,
  }));
  return graph;
}


export const graphData1 = datas.graph1;
export const graphData1_singleSourceShortestPathResult = {
  'node-1': { dist: 0, path: 'node-1', edgeId: '' },
  'node-2': { dist: 2, path: 'node-1', edgeId: 'e1' },
  'node-3': { dist: 4, path: 'node-1', edgeId: 'e2' },
  'node-4': { dist: 5, path: 'node-3', edgeId: 'e4' },
};
export const graphData1_longestPath = [
  {
    nodeIdList: [ 'node-1', 'node-2', 'node-4' ],
    edgeIdList: [ 'e1', 'e3' ]
  },
];


export const graphData2 = datas.graph2;
export const graphData2_singleSourceShortestPathResult = {
  'node-1': { dist: 0, path: 'node-1', edgeId: '' },
  'node-2': { dist: 1, path: 'node-1', edgeId: 'e1' },
  'node-3': { dist: 8, path: 'node-4', edgeId: 'e6' },
  'node-4': { dist: 4, path: 'node-2', edgeId: 'e4' },
  'node-5': { dist: 13, path: 'node-3', edgeId: 'e5' },
  'node-6': { dist: 17, path: 'node-5', edgeId: 'e9' }
};
export const graphData2_longestPath = [
  {
    nodeIdList: [ 'node-1', 'node-3', 'node-5', 'node-6' ],
    edgeIdList: [ 'e2', 'e5', 'e9' ]
  }
];


export const graphData3 = datas.graph3;
export const graphData3_singleSourceShortestPathResult = {
  ...graphData2_singleSourceShortestPathResult,
};
export const graphData3_singleSourceShortestPathResult_v2 = {
  'node-9': { dist: 0, path: 'node-9', edgeId: '' },
  'node-10': { dist: 11, path: 'node-9', edgeId: 'e10' },
  'node-11': { dist: 16, path: 'node-10', edgeId: 'e11' },
  'node-12': { dist: 21, path: 'node-10', edgeId: 'e12' },
  // 'node-12': { dist: 21, path: 'node-11', edgeId: 'e13' },
};
export const graphData3_longestPath = [
  {
    nodeIdList: ['node-1', 'node-3', 'node-5', 'node-6'],
    edgeIdList: ['e2', 'e5', 'e9']
  },
  {
    nodeIdList: ['node-9', 'node-10', 'node-12'],
    edgeIdList: ['e10', 'e12']
  },
  {
    nodeIdList: ['node-9', 'node-10', 'node-11', 'node-12'],
    edgeIdList: ['e10', 'e11', 'e13']
  },
];

// 无环
export const graphData4 = datas.graph4;
// 有环
export const graphData5 = datas.graph5;

export const graphLayout1 = datas.graph6;

import { DirectedGraph } from "../data-structure/graph";

/**
 * 获取某个有向图的 拓扑排序 结果
 *
 * @param graph 
 */
export function topologicalSorting(graph: DirectedGraph) {

  const resultList: string[] = [];

  for (const startNode of graph.getStartNodes()) {
    handler(graph, resultList, startNode.id);
  }

  return resultList;
}

// currentNodeId: 该节点 已经没有入边了
function handler(graph: DirectedGraph, resultList: string[], currentNodeId: string) {

  resultList.push(currentNodeId);

  const nextNodeIds = graph.getNextNodeIds(currentNodeId);

  graph.deleteNode(currentNodeId);

  for (const nextNodeId of nextNodeIds) {
    if (graph.nodeIntoEdge[nextNodeId].length === 0) {
      handler(graph, resultList, nextNodeId);
    }
  }
}

import { Graph, GraphEdge } from "../../data-structure/graph";

export interface BellmanFordResult {
  [nodeId: string]: {
    dist: number;
    path: string;
    edgeId: string;
  }
}

/**
 * BellmanFord 算法: 从起点到终点的最短路径
 * 单源最短路径算法。支持负权边。
 * 从Dijkstra算法引申而来。基于邻接表,从边的角度考量的
 *
 * 参考文章: https://www.cxyxiaowu.com/1172.html
 * 
 *
 */
export default function bellmanFord(graph: Graph, startNodeId: string) {

  const result: BellmanFordResult = {};
  result[startNodeId] = {
    dist: 0,
    path: startNodeId,
    edgeId: '',
  };

  const allEdgeList: GraphEdge[] = [];
  getAllEdgeList(graph, startNodeId, allEdgeList);

  handler(graph, allEdgeList, result);

  return result;

}

function getAllEdgeList(graph: Graph, nodeId: string, allEdgeList: GraphEdge[]) {

  const outEdgeList = graph.getOutEdgeList(nodeId);
  allEdgeList.push(...outEdgeList);

  for (const item of outEdgeList) {
    getAllEdgeList(graph, item.to, allEdgeList);
  }
}

function handler(graph: Graph, allEdgeList: GraphEdge[], result: BellmanFordResult) {
  let resultChanged = false;

  for (const edge of allEdgeList) {
    const dist_old = result[edge.to]?.dist || Number.POSITIVE_INFINITY;
    const dist_new = result[edge.from].dist + edge.weight;
    if (dist_new < dist_old) {
      result[edge.to] = {
        dist: dist_new,
        path: edge.from,
        edgeId: edge.id,
      };
      resultChanged = true;
    }
  }

  if (resultChanged) {
    handler(graph, allEdgeList, result);
  }
}

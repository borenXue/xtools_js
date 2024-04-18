import { DirectedGraph, GraphNode } from "../../data-structure/graph";
import { PriorityQueue } from "../../data-structure/queue";

export interface DijkstraQueueItem {
  nodeId: string;
  edgeWeight: number;
}

export interface DijkstraResult {
  [nodeId: string]: {
    dist: number;
    path: string;
    edgeId: string;
  };
}

/**
 * Dijkstra 算法: 从起点到其他点的最短路径矩阵
 * 单源最短路径算法。不支持负边权
 */
export default function dijkstra(graph: DirectedGraph, startNodeId: string) {
  validParams(graph, startNodeId);

  const queue = new PriorityQueue((node1: DijkstraQueueItem, node2: DijkstraQueueItem) => node1.edgeWeight - node2.edgeWeight);
  queue.push(startNodeId);

  const result: DijkstraResult = {};
  result[startNodeId] = { dist: 0, path: startNodeId, edgeId: '' };


  handleQueue(queue, graph, result);

  return result;
}

function handleQueue(queue: PriorityQueue, graph: DirectedGraph, result: any) {
  const currentNodeId = queue.pop();

  const outEdgeList = graph.getOutEdgeList(currentNodeId);
  for (const outEdge of outEdgeList) {
    result[outEdge.to] = result[outEdge.to] || { dist: Number.POSITIVE_INFINITY, path: '', edgeId: '' };
    const dist_old = result[outEdge.to].dist;
    const dist_new = result[currentNodeId].dist + outEdge.weight;
    if (dist_new < dist_old) {
      result[outEdge.to] = { dist: dist_new, path: currentNodeId, edgeId: outEdge.id };
    }
    queue.push(outEdge.to);
  }

  if (!queue.isEmpty()) {
    handleQueue(queue, graph, result);
  }
}


function validParams(graph: DirectedGraph, startNodeId: string) {
  if (!graph.existNode(startNodeId)) throw new Error(`起点Id(${startNodeId}) 不存在`);

  // 不支持负权边
  for (const edge of graph.edgeList) {
    if (edge.weight < 0) throw new Error('Dijkstra 算法不支持负权边');
  }

  // 检查图中是否存在孤儿节点
  const orphanNodes = graph.getOrphanNodes();
  if (orphanNodes.length > 0) throw new Error(`图中不能存在孤儿节点: ${orphanNodes.map(n => n.id).join(',')}`);

  // TODO: 检查图中是否存在环？？？
}

import { Graph } from "../data-structure/graph";
import bellmanFord from "./shortest-path/bellman-ford";
import dijkstra from "./shortest-path/dijkstra";

export interface LongestPathSingleSourceResultItem {
  nodeIdList: string[],
  edgeIdList: string[],
}
export function longestPathSingleSource(graph: Graph, startNodeId: string): LongestPathSingleSourceResultItem[] {
  const clonedGraph = graph.clone();

  // 删除孤儿节点
  const orphanNodes = graph.getOrphanNodes();
  orphanNodes.forEach(node => clonedGraph.deleteNode(node.id));

  // 边权重 取反
  for (const item of clonedGraph.edgeList) {
    item.weight = -item.weight;
  }

  const result = bellmanFord(clonedGraph, startNodeId);

  const minDist = Math.min(...Object.values(result).map(item => item.dist));
  const endIdList  = Object.entries(result)
    .filter(([, item]) => item.dist === minDist)
    .map(([nodeId,]) => nodeId);
  
  const resultList: LongestPathSingleSourceResultItem[] = [];

  for (const endId of endIdList) {
    const resultItem: LongestPathSingleSourceResultItem = {
      nodeIdList: [endId],
      edgeIdList: [],
    };

    let prevItem = result[endId];
    while (prevItem && prevItem.path) {
      resultItem.nodeIdList.unshift(prevItem.path);
      resultItem.edgeIdList.unshift(prevItem.edgeId);

      if (prevItem.path !== result[prevItem.path].path) {
        prevItem = result[prevItem.path];
      } else {
        prevItem = null as any;
      }
    }

    resultList.push(resultItem);
  }
  return resultList;
}

export function longestPath(graph: Graph) {
  const clonedGraph = graph.clone();

  // 删除孤儿节点
  clonedGraph.removeOrphanNodes();

  const startNodes = clonedGraph.getStartNodes();
  if (!startNodes.length) throw new Error("没有起点节点");
  const endNodes = clonedGraph.getEndNodes();
  if (!endNodes.length) throw new Error("没有终点节点");

  const resultList: LongestPathSingleSourceResultItem[] = [];
  // 对每个节点 求最长路径
  for (const startNode of startNodes) {
    const list = longestPathSingleSource(clonedGraph, startNode.id);
    resultList.push(...list);
  }

  return resultList;
}

function dijkstraForStartNode(graph: Graph, startNodeId: string) {
  dijkstra(graph, startNodeId);
}

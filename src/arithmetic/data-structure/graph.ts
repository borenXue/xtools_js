
export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  weight: number;
}

export interface GraphNode {
  id: string;
  name: string;
  // width: number;
  // height: number;
  [key: string]: any;
}

/** 只包含 图的数据结构、增删改操作、不含查询操作 */
class DirectedGraphBase<MyNode extends GraphNode, MyEdge extends GraphEdge> {
  nodeList: MyNode[] = [];
  edgeList: MyEdge[] = [];

  nodesObject: { [key: string]: MyNode } = {};
  edgesObject: { [key: string]: MyEdge } = {};

  // node节点的 出边。值为边的id数组
  nodeOutEdge: { [nodeId: string]: string[] } = {};
  // node节点的 入边。值为边的id数组
  nodeIntoEdge: { [nodeId: string]: string[] } = {};

  addNode(node: MyNode) {
    if (this.nodeOutEdge[node.id]) throw new Error(`Graph#addNode 节点不允许重复添加: ${node.id}`);
    // if (this.nodeList.find(n => n.id === node.id)) throw new Error(`Graph#addNode 节点不允许重复添加: ${node.id}`);
    this.nodeList.push(node);
    this.nodesObject[node.id] = node;

    this.nodeOutEdge[node.id] = [];
    this.nodeIntoEdge[node.id] = [];
  }

  addEdge(edge: MyEdge) {
    if (this.edgeList.find(e => e.id === edge.id)) throw new Error(`Graph#addEdge 边不允许重复添加: ${edge.id}`);
    this.edgeList.push(edge);
    this.edgesObject[edge.id] = edge;

    this.nodeOutEdge[edge.from].push(edge.id);
    this.nodeIntoEdge[edge.to].push(edge.id);
  }

  deleteNode(nodeId: string) {
    delete this.nodesObject[nodeId];
    this.nodeList = this.nodeList.filter(n => n.id !== nodeId);
    (this.nodeOutEdge[nodeId] || []).forEach(edgeId => this.deleteEdge(edgeId));
    (this.nodeIntoEdge[nodeId] || []).forEach(edgeId => this.deleteEdge(edgeId));
    delete this.nodeOutEdge[nodeId];
    delete this.nodeIntoEdge[nodeId];
  }
  deleteEdge(edgeId: string) {
    delete this.edgesObject[edgeId];
    const edge = this.edgeList.find(e => e.id === edgeId);
    if (!edge) return console.warn(`Graph#deleteEdge 边不存在: ${edgeId}`);

    this.edgeList = this.edgeList.filter(e => e.id !== edgeId);
    if (this.nodeOutEdge[edge.from]) {
      this.nodeOutEdge[edge.from] = this.nodeOutEdge[edge.from].filter(id => id !== edgeId);
    }
    if (this.nodeIntoEdge[edge.to]) {
      this.nodeIntoEdge[edge.to] = this.nodeIntoEdge[edge.to].filter(id => id !== edgeId);
    }
  }

  /** 删除所有的孤儿节点, 并返回删除的节点 */
  removeOrphanNodes() {
    const orphanNodes = getOrphanNodes(this);
    orphanNodes.forEach(node => this.deleteNode(node.id));
    return orphanNodes;
  }
}


export class DirectedGraph<MyNode extends GraphNode = GraphNode, MyEdge extends GraphEdge = GraphEdge> extends DirectedGraphBase<MyNode, MyEdge> {
  getNode(nodeId: string) { return this.nodesObject[nodeId]; }
  getEdge(edgeId: string) { return this.edgesObject[edgeId]; }

  getOutEdgeList(nodeId: string) {
    return (this.nodeOutEdge[nodeId] || []).map(edgeId => this.edgeList.find(e => e.id === edgeId)!);
  }
  getNextNodeIds(nodeId: string) {
    const edgeIds = this.nodeOutEdge[nodeId] || [];
    const nextIds = edgeIds.map(edgeId => this.edgeList.find(e => e.id === edgeId)!.to);
    return nextIds;
  }
  getPrevNodeIds(nodeId: string) {
    const edgeIds = this.nodeIntoEdge[nodeId] || [];
    const prevIds = edgeIds.map(edgeId => this.edgeList.find(e => e.id === edgeId)!.from);
    return prevIds;
  }


  /** 是否存在节点 */
  existNode(nodeId: string) {
    return !!this.nodesObject[nodeId];
  }

  /** 获取孤儿节点集合, 即 没有出边、也没有入边 的节点 */
  getOrphanNodes() { return getOrphanNodes(this); }

  /**
   * 获取起始节点集合。即 没有入边的节点 但有出边的节点
   * @param ignoreOrphan 是否忽略孤儿节点
   * @returns 
   */
  getStartNodes(ignoreOrphan = true) {
    if (ignoreOrphan) {
      return this.nodeList.filter(node => this.nodeIntoEdge[node.id].length === 0 && this.nodeOutEdge[node.id].length > 0);
    }
    return this.nodeList.filter(node => this.nodeIntoEdge[node.id].length === 0);
  }

  /**
   * 获取结束节点集合。即 没有出边的节点 但有入边的节点
   * @param ignoreOrphan 是否忽略孤儿节点
   * @returns 
   */
  getEndNodes(ignoreOrphan = true) {
    if (ignoreOrphan) {
      return this.nodeList.filter(node => this.nodeOutEdge[node.id].length === 0 && this.nodeIntoEdge[node.id].length > 0);
    }
    return this.nodeList.filter(node => this.nodeOutEdge[node.id].length === 0);
  }

  clone() {
    const cloned = new DirectedGraph();
    cloned.nodeList = JSON.parse(JSON.stringify(this.nodeList));
    cloned.edgeList = JSON.parse(JSON.stringify(this.edgeList));
    cloned.nodeOutEdge = JSON.parse(JSON.stringify(this.nodeOutEdge));
    cloned.nodeIntoEdge = JSON.parse(JSON.stringify(this.nodeIntoEdge));
    return cloned;
  }

  /**
   * 是否是 DAG 图: 有向无环图 - 使用拓扑排序法判断
   * 
   * 方法一：【O(e)】拓扑排序
   * 方法二：【O(n*e)】Bellman-ford算法。第二轮对边进行松驰操作时, 如果所有边都不可继续权驰, 则为无环图。。否则为有环图
   *        因访算法 只能判断是否有负环, 所以得将所有边的权重改为-1
   * 方法三：【O(n+e)】使用邻接表的DFS
   */
  isDAG() {
    const clonedGraph = this.clone();
    const resultList: string[] = [];
    for (const startNode of clonedGraph.getStartNodes(false)) {
      isDAG_handler(clonedGraph, resultList, startNode.id);
    }
    // 拓扑排序结果, 如果有节点未被访问, 则说明有环
    return resultList.length === this.nodeList.length;
  }
}


function getOrphanNodes(graph: DirectedGraphBase<GraphNode, GraphEdge>) {
  return graph.nodeList.filter(node => 
    graph.nodeOutEdge[node.id].length === 0 && graph.nodeIntoEdge[node.id].length === 0
  );
}

// currentNodeId: 该节点 已经没有入边了
function isDAG_handler(graph: DirectedGraph, resultList: string[], currentNodeId: string) {

  if (resultList.includes(currentNodeId)) return;

  resultList.push(currentNodeId);

  const nextNodeIds = graph.getNextNodeIds(currentNodeId);

  graph.deleteNode(currentNodeId);

  for (const nextNodeId of nextNodeIds) {
    if (!graph.nodeIntoEdge[nextNodeId] || graph.nodeIntoEdge[nextNodeId].length === 0) {
      isDAG_handler(graph, resultList, nextNodeId);
    }
  }
}

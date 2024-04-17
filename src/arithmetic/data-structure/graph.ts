
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


export class Graph {

  nodeList: GraphNode[] = [];
  // node节点的 出边。值为边的id数组
  nodeOutEdge: { [nodeId: string]: string[] } = {};
  // node节点的 入边。值为边的id数组
  nodeIntoEdge: { [nodeId: string]: string[] } = {};

  edgeList: GraphEdge[] = [];

  addNode(node: GraphNode) {
    if (this.nodeOutEdge[node.id]) throw new Error(`Graph#addNode 节点不允许重复添加: ${node.id}`);
    // if (this.nodeList.find(n => n.id === node.id)) throw new Error(`Graph#addNode 节点不允许重复添加: ${node.id}`);
    this.nodeList.push(node);

    this.nodeOutEdge[node.id] = [];
    this.nodeIntoEdge[node.id] = [];
  }

  addEdge(edge: GraphEdge) {
    if (this.edgeList.find(e => e.id === edge.id)) throw new Error(`Graph#addEdge 边不允许重复添加: ${edge.id}`);
    this.edgeList.push(edge);

    this.nodeOutEdge[edge.from].push(edge.id);
    this.nodeIntoEdge[edge.to].push(edge.id);
  }

  deleteNode(nodeId: string) {
    this.nodeList = this.nodeList.filter(n => n.id !== nodeId);
    this.edgeList = this.edgeList.filter(e => e.from !== nodeId && e.to !== nodeId);
    delete this.nodeOutEdge[nodeId];
    delete this.nodeIntoEdge[nodeId];
  }
  deleteEdge(edgeId: string) {
    const edge = this.edgeList.find(e => e.id === edgeId);
    if (!edge) return console.warn(`Graph#deleteEdge 边不存在: ${edgeId}`);

    this.edgeList = this.edgeList.filter(e => e.id !== edgeId);
    this.nodeOutEdge[edge.from] = this.nodeOutEdge[edge.from].filter(id => id !== edgeId);
    this.nodeIntoEdge[edge.to] = this.nodeIntoEdge[edge.to].filter(id => id !== edgeId);
  }


  getOutEdgeList(nodeId: string) {
    return this.nodeOutEdge[nodeId].map(edgeId => this.edgeList.find(e => e.id === edgeId)!);
  }
  getNextNodeIds(nodeId: string) {
    const edgeIds = this.nodeOutEdge[nodeId];
    const nextIds = edgeIds.map(edgeId => this.edgeList.find(e => e.id === edgeId)!.to);
    return nextIds;
  }


  /** 是否存在节点 */
  existNode(nodeId: string) {
    return !!this.nodeOutEdge[nodeId];
  }

  /** 获取孤儿节点集合, 即 没有出边、也没有入边 的节点 */
  getOrphanNodes() {
    return this.nodeList.filter(node => this.nodeOutEdge[node.id].length === 0 && this.nodeIntoEdge[node.id].length === 0);
  }

  /** 删除所有的孤儿节点, 并返回删除的节点 */
  removeOrphanNodes() {
    const orphanNodes = this.getOrphanNodes();
    orphanNodes.forEach(node => this.deleteNode(node.id));
    return orphanNodes;
  }

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
    const cloned = new Graph();
    cloned.nodeList = JSON.parse(JSON.stringify(this.nodeList));
    cloned.edgeList = JSON.parse(JSON.stringify(this.edgeList));
    cloned.nodeOutEdge = JSON.parse(JSON.stringify(this.nodeOutEdge));
    cloned.nodeIntoEdge = JSON.parse(JSON.stringify(this.nodeIntoEdge));
    return cloned;
  }

}

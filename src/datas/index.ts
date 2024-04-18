const graph1 = {
  nodeList: [
    { id: 'node-1', name: '节点1' },
    { id: 'node-2', name: '节点2' },
    { id: 'node-3', name: '节点3' },
    { id: 'node-4', name: '节点4' },
  ],
  edgeList: [
    { id: 'e1', from: 'node-1', to: 'node-2', weight: 2 },
    { id: 'e2', from: 'node-1', to: 'node-3', weight: 4 },
    { id: 'e3', from: 'node-2', to: 'node-4', weight: 5 },
    { id: 'e4', from: 'node-3', to: 'node-4', weight: 1 },
    { id: 'e5', from: 'node-1', to: 'node-4', weight: 6 },
  ],
};

const graph2 = {
  nodeList: [
    { id: 'node-1', name: '节点1' },
    { id: 'node-2', name: '节点2' },
    { id: 'node-3', name: '节点3' },
    { id: 'node-4', name: '节点4' },
    { id: 'node-5', name: '节点5' },
    { id: 'node-6', name: '节点6' },
  ],
  edgeList: [
    { id: 'e1', from: 'node-1', to: 'node-2', weight: 1 },
    { id: 'e2', from: 'node-1', to: 'node-3', weight: 12 },
    { id: 'e3', from: 'node-2', to: 'node-3', weight: 9 },
    { id: 'e4', from: 'node-2', to: 'node-4', weight: 3 },
    { id: 'e5', from: 'node-3', to: 'node-5', weight: 5 },
    { id: 'e6', from: 'node-4', to: 'node-3', weight: 4 },
    { id: 'e7', from: 'node-4', to: 'node-5', weight: 13 },
    { id: 'e8', from: 'node-4', to: 'node-6', weight: 15 },
    { id: 'e9', from: 'node-5', to: 'node-6', weight: 4 },
  ],
};

const graph3 = {
  nodeList: [
    ...JSON.parse(JSON.stringify(graph2.nodeList)),
    { id: 'node-7', name: '节点7' },
    { id: 'node-8', name: '节点8' },
    { id: 'node-9', name: '节点9' },
    { id: 'node-10', name: '节点10' },
    { id: 'node-11', name: '节点11' },
    { id: 'node-12', name: '节点12' },
  ],
  edgeList: [
    ...JSON.parse(JSON.stringify(graph2.edgeList)),
    { id: 'e10', from: 'node-9', to: 'node-10', weight: 11 },
    { id: 'e11', from: 'node-10', to: 'node-11', weight: 5 },
    { id: 'e12', from: 'node-10', to: 'node-12', weight: 10 },
    { id: 'e13', from: 'node-11', to: 'node-12', weight: 5 },
  ],
};

// 无环
const graph4 = {
  nodeList: [
    { id: 'node-1', name: '节点1' },
    { id: 'node-2', name: '节点2' },
    { id: 'node-3', name: '节点3' },
  ],
  edgeList: [
    { id: 'e1', from: 'node-1', to: 'node-2', weight: 0 },
    { id: 'e2', from: 'node-1', to: 'node-3', weight: 0 },
    { id: 'e3', from: 'node-2', to: 'node-3', weight: 0 },
  ],
};

// 有环
const graph5 = {
  nodeList: [
    { id: 'node-1', name: '节点1' },
    { id: 'node-2', name: '节点2' },
    { id: 'node-3', name: '节点3' },
  ],
  edgeList: [
    { id: 'e1', from: 'node-1', to: 'node-2', weight: 0 },
    { id: 'e2', from: 'node-2', to: 'node-3', weight: 0 },
    { id: 'e3', from: 'node-3', to: 'node-1', weight: 0 },
  ],
};

const graph6 = {
  nodeList: [
    { id: 'v1' }, { id: 'v2' }, { id: 'v3' },
    { id: 'v4' }, { id: 'v5' }, { id: 'v6' }, { id: 'v7' },
    { id: 'v10' }, { id: 'v11' }, { id: 'v12' },
    { id: 'v20' }, { id: 'v21' }, { id: 'v22' },
  ],
  edgeList: [
    // 主轴
    { id: 'e1', from: 'v1', to: 'v2', weight: 1 },
    { id: 'e2', from: 'v2', to: 'v3', weight: 1 },
    { id: 'e3', from: 'v3', to: 'v4', weight: 1 },
    { id: 'e4', from: 'v4', to: 'v5', weight: 1 },
    { id: 'e5', from: 'v5', to: 'v6', weight: 1 },
    { id: 'e6', from: 'v6', to: 'v7', weight: 1 },
    // 主轴 上半部分
    { id: 'e10', from: 'v2', to: 'v10', weight: 1 },
    { id: 'e11', from: 'v10', to: 'v11', weight: 1 },
    { id: 'e12', from: 'v11', to: 'v12', weight: 1 },
    { id: 'e13', from: 'v12', to: 'v5', weight: 1 },
    // 主轴 下半部分
    { id: 'e20', from: 'v2', to: 'v20', weight: 1 },
    { id: 'e21', from: 'v20', to: 'v21', weight: 1 },
    { id: 'e22', from: 'v21', to: 'v22', weight: 1 },
    { id: 'e23', from: 'v22', to: 'v5', weight: 1 },
    { id: 'e24', from: 'v3', to: 'v33', weight: 1 },
  ],
};



export default {
  graph1, graph2, graph3, graph4, graph5, graph6,
}

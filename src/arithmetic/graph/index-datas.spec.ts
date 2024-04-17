
export const graphData1 = {
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


export const graphData2 = {
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


export const graphData3 = {
  nodeList: [
    ...JSON.parse(JSON.stringify(graphData2.nodeList)),
    { id: 'node-7', name: '节点7' },
    { id: 'node-8', name: '节点8' },
    { id: 'node-9', name: '节点9' },
    { id: 'node-10', name: '节点10' },
    { id: 'node-11', name: '节点11' },
    { id: 'node-12', name: '节点12' },
  ],
  edgeList: [
    ...JSON.parse(JSON.stringify(graphData2.edgeList)),
    { id: 'e10', from: 'node-9', to: 'node-10', weight: 11 },
    { id: 'e11', from: 'node-10', to: 'node-11', weight: 5 },
    { id: 'e12', from: 'node-10', to: 'node-12', weight: 10 },
    { id: 'e13', from: 'node-11', to: 'node-12', weight: 5 },
  ],
};
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

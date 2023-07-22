export interface ImageElement {
  name?: string;
  id: string;
  width: number;
  height: number;
  url: string;
}

export class GraphNode {
  id: number;

  cost: number;

  elements: ImageElement[] | undefined;

  contentId: string | undefined;

  parent: GraphNode | undefined;

  constructor(
    id: number,
    cost: number,
    elements: ImageElement[] | undefined = undefined,
    contentId: string | undefined = undefined,
  ) {
    this.id = id;
    this.cost = cost;
    this.elements = elements;
    this.contentId = contentId;
    this.parent = undefined;
  }
}

export class Graph {
  header: number[] = [];

  matrix: GraphNode[][] = [];

  vertex: GraphNode[] = [];

  distance: number[] = [];

  route: GraphNode[] = [];

  count = 0;

  cost = 0;

  createNode(
    cost: number,
    elements: ImageElement[] | undefined = undefined,
    contentId: string | undefined = undefined,
  ) {
    return new GraphNode(this.count++, cost, elements, contentId);
  }

  addEdge(startNode: GraphNode, endNode: GraphNode) {
    // 邻接表头节点处理
    let index = this.header.indexOf(startNode.id);
    if (index < 0) {
      index = this.header.push(startNode.id) - 1;
    }

    // 邻接表处理
    if (!this.matrix[index]) {
      this.matrix[index] = [];
    }

    if (this.matrix[index].findIndex((item) => item.id === endNode.id) < 0) {
      this.matrix[index].push(endNode);
    }

    // 节点集合处理
    this.addVertex(startNode);
    this.addVertex(endNode);
  }

  addVertex(node: GraphNode) {
    if (this.vertex.findIndex((item) => item.id === node.id) < 0) {
      this.vertex.push(node);
    }
  }

  calcShortestRoute() {
    // 初始化起始节点及distance列表
    const startNode = this.vertex[0];
    this.vertex.forEach(({ id }) => {
      if (id === startNode.id) {
        this.distance[id] = 0;
      } else {
        this.distance[id] = Number.POSITIVE_INFINITY;
      }
    });

    const accessed = new Set();
    const accessing = [startNode];

    let node: GraphNode;

    // 计算起始节点到各节点间的最短乱离
    // eslint-disable-next-line no-cond-assign
    while ((node = accessing.shift())) {
      if (accessed.has(node)) {
        // eslint-disable-next-line no-continue
        continue;
      }
      accessed.add(node);
      accessing.unshift(...this.updateCost(node as GraphNode));
      accessing.sort((x, y) => x.cost - y.cost);
    }

    // 指向结束节点，获取起始节点到它的（最短）距离，并获取节点路径
    node = this.vertex[this.vertex.length - 1];
    this.cost = node.cost;

    this.route.unshift(node);
    while (node.parent) {
      this.route.unshift(node.parent);
      node = node.parent;
    }

    return {
      cost: this.cost,
      route: this.route,
    };
  }

  updateCost(node: GraphNode) {
    const index = this.header.indexOf(node.id);
    if (index < 0) {
      return [];
    }
    // 从邻接表中查找可达节点
    const reachableNode = this.matrix[index];
    // 更新距离信息
    reachableNode.forEach((item) => {
      const cost = node.cost + item.cost;
      if (this.distance[item.id] > cost) {
        this.distance[item.id] = cost;
        item.cost = cost;
        item.parent = node;
      }
    });

    return reachableNode;
  }
}

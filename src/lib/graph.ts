export interface GraphNode {
  id: number;
  cost: number;
  parentId: number;
  contentId: string;
  content: Image[] | null;
}

class PriorityQueue {
  constructor(private nodes: GraphNode[] = []) {}
  enqueue(node: GraphNode) {
    this.nodes.push(node);
    this.nodes.sort((x, y) => x.cost - y.cost);
  }
  dequeue(): GraphNode | undefined {
    return this.nodes.shift();
  }
  isEmpty(): boolean {
    return this.nodes.length === 0;
  }
}

export class Graph {
  _uid = 0;
  // 顶点
  vertex: GraphNode[] = [];
  // 邻接矩阵
  matrix: {
    [id: number]: GraphNode[];
  } = {};
  // 用于保存计算得到的到每个节点的最短距离
  distance: GraphNode[] = [];

  // 节点标识
  get uid() {
    return this._uid++;
  }

  createNode(
    cost: number,
    content: Image[] | null = null,
    contentId: string = '',
  ): GraphNode {
    return {
      id: this.uid,
      cost,
      parentId: -1,
      contentId,
      content,
    };
  }

  addEdge(startNode: GraphNode, endNode: GraphNode) {
    this.addVertex(startNode);
    this.addVertex(endNode);

    const id = startNode.id;

    if (!this.matrix[id]) {
      this.matrix[id] = [];
    }

    if (this.matrix[id].findIndex(item => item.id === endNode.id) < 0) {
      this.matrix[id].push(endNode);
    }
  }

  addVertex(node: GraphNode) {
    if (this.vertex.findIndex(item => item.id === node.id) < 0) {
      this.vertex.push(node);
    }
  }

  dijkstra() {
    // 重置
    this.distance.length = 0;
    const queue = new PriorityQueue();
    queue.enqueue(this.vertex[0]);
    // 首顶点的id
    const startId = this.vertex[0].id;
    // 初始化distance，设置首节点到其余各节点的距离为无穷大，不影响原节点
    this.vertex.forEach(node => {
      this.distance[node.id] = {
        ...node,
        cost: node.id === startId ? 0 : Number.POSITIVE_INFINITY,
      };
    });

    let node: GraphNode | undefined;

    while ((node = queue.dequeue())) {
      const adjNodes = this.matrix[node.id];
      if (!adjNodes) continue;
      // 更新与该节点相关的邻接节点的cost
      for (const { id, cost } of adjNodes) {
        const totalCost = node.cost + cost;
        if (totalCost < this.distance[id].cost) {
          this.distance[id].cost = totalCost;
          this.distance[id].parentId = node.id;

          queue.enqueue(this.distance[id]);
        }
      }
    }

    return this;
  }

  getRoute(id: number) {
    let node = this.distance[id];
    if (!node) {
      return null;
    }
    const route = [node];
    const cost = node.cost;
    let parentId = node.parentId;
    while (parentId !== -1) {
      node = this.distance[parentId];
      route.unshift(node);
      parentId = node.parentId;
    }
    return {
      cost,
      route,
    };
  }
}

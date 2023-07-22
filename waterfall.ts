
import { Graph, GraphNode,ImageElement } from './graph';

interface LayoutOption {
  ideaHeight: number;
  maxRadio: number;
  minRadio: number;
}

const defaultLayoutOption: LayoutOption = {
  ideaHeight: 260,
  maxRadio: 1.8,
  minRadio: 0.4,
};

function scaleToRadio(element: ImageElement, radio: number) {
  element.height *= radio;
  element.width *= radio;
}

function scaleToHeight(element: ImageElement, height: number) {
  const radio = height / element.height;
  element.height = height;
  element.width *= radio;
}

export function layout(elements: ImageElement[], viewportWidth: number, options: Partial<LayoutOption> = {}) {
  const { ideaHeight, maxRadio, minRadio } = {
    ...defaultLayoutOption,
    ...options,
  };

  // 所有节点按理想高度进行缩放
  elements.forEach((e) => scaleToHeight(e, ideaHeight));

  // 构建图
  const graph = new Graph();
  const startNode = graph.createNode(0);

  let curNode: GraphNode | undefined;
  let curIndex: number = 0;
  let calcLayout: number = 0;
  let collectedElements = [];

  // 从第一个节点开始处理
  const processingNodes: [GraphNode, number][] = [[startNode, 0]];
  processNextNode();

  while (curNode) {
    let index = curIndex;
    const total = elements.length;
    for (; index < total; index++) {
      const curElement = elements[index];
      calcLayout += curElement.width;
      // 超出可视区域
      if (calcLayout >= viewportWidth) {
        // 单个元素就超过viewport的宽度时，单独生成一个节点
        if (collectedElements.length === 0) {
          collectedElements.push(curElement);
          const node = generateNode(collectedElements);
          graph.addEdge(curNode, node);

          // 设置下次要处理的节点及开始位置
          addProcessingNode(node, index + 1);
        }
        // 否则分别以是否添加了此元素来生成分支节点
        else {
          // 不添加当前元素时生成节点
          const leftNode = generateNode(collectedElements);
          graph.addEdge(curNode, leftNode);
          addProcessingNode(leftNode, index);

          // 添加当前元素生成节点
          collectedElements.push(curElement);
          const rightNode = generateNode(collectedElements);
          graph.addEdge(curNode, rightNode);
          addProcessingNode(rightNode, index + 1);
        }
        break;
      }
      // 未超过可视区域
      else {
        collectedElements.push(curElement);
      }
    }
    // 元素遍历结束时将当前剩余的元素生成节点
    if (index === total && collectedElements.length > 0) {
      const node = generateNode(collectedElements);
      graph.addEdge(curNode, node);
    }

    processNextNode();
  }

  // 结束节点添加
  const endNode = graph.createNode(0);

  graph.matrix.forEach((item) => {
    const node = item[item.length - 1];
    const endElement = elements[elements.length - 1];
    if (node.elements && node.elements.findIndex((item) => item.id === endElement.id) >= 0) {
      graph.addEdge(node, endNode);
    }
  });

  return graph.calcShortestRoute();

  function generateContentId(elements: ImageElement[]) {
    return elements
      .reduce((pre, cur) => {
        return `${pre}|${cur.id}`;
      }, '')
      .substr(1);
  }

  function generateNode(elements: ImageElement[]) {
    const contentId = generateContentId(elements);
    // 节点已经添加到图中
    const node = graph.vertex.find((item) => item.contentId === contentId);
    if (node) {
      return node;
    }

    // 计算宽度及缩放比
    const totalWidth = elements.reduce((pre, cur) => {
      return pre + cur.width;
    }, 0);

    const radio = Math.min(Math.max(viewportWidth / totalWidth, minRadio), maxRadio);

    // 克隆，不影响原节点信息
    const cloneElements = JSON.parse(JSON.stringify(elements)) as ImageElement[];

    cloneElements.forEach((item) => scaleToRadio(item, radio));

    return graph.createNode(calcCost(radio), cloneElements, contentId);
  }

  function calcCost(radio: number) {
    const factor = radio > 1 ? radio : 1 / radio;
    // eslint-disable-next-line no-restricted-properties
    return ideaHeight * Math.pow(factor, 2);
  }

  function processNextNode() {
    collectedElements = [];
    calcLayout = 0;
    [curNode, curIndex] = processingNodes.shift() || [undefined, 0];
  }

  function addProcessingNode(node: GraphNode, index: number) {
    if (processingNodes.findIndex(([item]) => item.id === node.id) < 0 && index >= 0) {
      processingNodes.push([node, index]);
    }
  }
}

import { Graph, GraphNode } from './graph';
// import { GraphImageNode } from '@/lib/node';

interface LayoutOption {
  ideaHeight: number;
  maxRadio: number;
  minRadio: number;
}

const defaultLayoutOption: LayoutOption = {
  ideaHeight: 260,
  maxRadio: 1.6,
  minRadio: 0.6,
};

let ideaHeight: number, maxRadio: number, minRadio: number;

export function layout(
  images: Image[],
  layoutWidth: number,
  option: Partial<LayoutOption> = {},
) {
  ({ ideaHeight, maxRadio, minRadio } = {
    ...defaultLayoutOption,
    ...option,
  });

  const total = images.length;
  // 所有节点按理想高度进行缩放
  images.forEach(img => scaleToHeight(img, ideaHeight));

  const graph = new Graph();
  const startNode = graph.createNode(0, null, '');

  const processingNodes: [GraphNode, number][] = [[startNode, 0]];
  let [curNode, curIndex] = processingNodes.shift() || [undefined, -1];

  let curLayoutWidth = 0;
  let collectedImgs = [];
  let curRadio = 0;

  while (curNode) {
    // 从当前节点开始，不判添加图片并计算宽度
    let index = curIndex;
    for (; index < total; index++) {
      const curImg = images[index];
      // 把当前收集到的图片的总宽度拉伸至全屏，需要缩放的比例
      curRadio = layoutWidth / (curLayoutWidth + curImg.width);
      // 说明当前节点包含的图片太少，即使总宽度放到要求的最大上限也无法铺满
      if (curRadio > maxRadio) {
        curLayoutWidth += curImg.width;
        collectedImgs.push(curImg);
        continue;
      }
      // 当前节点中包含的图片总宽度拉伸的比例在要求的范围，则创建一个有效节点
      if (curRadio >= minRadio && curRadio <= maxRadio) {
        // 说明是一个可能存在的节点
        curLayoutWidth += curImg.width;
        collectedImgs.push(curImg);

        const node = generateNode(graph, collectedImgs, curRadio, layoutWidth);
        graph.addEdge(curNode, node);
        // 节点未处理过，则放入待处理的节点
        if (processingNodes.findIndex(item => item[0].id === node.id) < 0) {
          processingNodes.push([node, index + 1]);
        }

        continue;
      }
      // 说明当前节点包含的图片太多了，即使总宽度缩小到要求的下限也无法铺满，则剩下的图片要另起一行摆放了
      if (curRadio < minRadio) {
        break;
      }
    }

    // 如果已经遍历到结尾处，有尚未处理的图片，则添加节点
    if (index >= total && collectedImgs.length > 0) {
      const node = generateNode(graph, collectedImgs, curRadio, layoutWidth);
      graph.addEdge(curNode, node);
    }

    // 开启一下行的处理
    collectedImgs.length = 0;
    curLayoutWidth = 0;
    [curNode, curIndex] = processingNodes.shift() || [undefined, -1];
  }

  // 结束节点添加
  const endNode = graph.createNode(0);
  const lastImage = images[images.length - 1];

  Object.keys(graph.matrix).forEach(id => {
    const nodes = graph.matrix[Number(id)];
    const lastNode = nodes[nodes.length - 1];
    if (lastNode.contentId.indexOf(lastImage.id) >= 0) {
      graph.addEdge(lastNode, endNode);
    }
  });

  return graph.dijkstra().getRoute(endNode.id);
}

function scaleToHeight(image: Image, height: number) {
  const radio = height / image.height;
  image.height = height;
  image.width *= radio;
}

function generateNode(
  graph: Graph,
  images: Image[],
  radio: number,
  layoutWidth: number,
) {
  const contentId = generateContentId(images);
  const node = graph.vertex.find(item => item.contentId === contentId);
  if (node) {
    return node;
  }

  const cloneImages = JSON.parse(JSON.stringify(images)) as Image[];
  let remain = layoutWidth;
  cloneImages.forEach((item, index) => {
    item.height *= radio;
    if (index < cloneImages.length - 1) {
      item.width = Math.round(item.width * radio);
      remain = remain - item.width;
    } else {
      item.width = remain;
    }
  });

  return graph.createNode(calcCost(radio), cloneImages, contentId);
}

function generateContentId(images: Image[]) {
  return images
    .reduce((pre, cur) => {
      return `${pre}|${cur.id}`;
    }, '')
    .substring(1);
}

function calcCost(radio: number) {
  const factor = radio > 1 ? radio : 1 / radio;
  return ideaHeight * Math.pow(factor, 2);
}

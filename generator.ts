import { readFileSync, writeFileSync } from 'fs';
const data: { vertices: string[], connections: [string, string, number][] } = JSON.parse(readFileSync('./data.json', 'utf-8'))

for (const connection of data.connections) {
  connection.push(Math.ceil(Math.random() * 10));
}

const getNeighbors = (node: string): [string, number][] => {
  const result: [string, number][] = []
  for (const connection of data.connections) {
    const [from, to, cost] = connection;
    if (to === node) {
      result.push([from, cost])
    } else if (from === node) {
      result.push([to, cost])
    }
  }
  return result;
}

interface Path {
  nodes: string[]
  cost: number;
}

const depthFirstSearch = (node: string, target = 'M'): Path => {
  const rootPath = { nodes: [node], cost: 0};
  let fronteir: Path[] = [rootPath];
  const reached: { [key: string]: Path } = {[node]: rootPath}
  while (fronteir.length) {
    const next = fronteir[0];
    fronteir = fronteir.slice(1)
    if (next.nodes[next.nodes.length - 1] === target) return next;
    const neighbors = getNeighbors(next.nodes[next.nodes.length - 1]);
    for (const neighbor of neighbors) {
      const [neighborName, neighborCost] = neighbor;
      const fullNeighborCost = next.cost + neighborCost;
      const isReached = typeof reached[neighborName] !== 'undefined';
      if (!isReached || (isReached && reached[neighborName].cost > fullNeighborCost)) {
        // replace reached with new path
        const neighborPath: Path = { nodes: [...next.nodes, neighborName], cost: fullNeighborCost }
        reached[neighborName] = neighborPath;
        fronteir.push(neighborPath);
      }
    }
  }

  throw new Error(`Could not find target ${target} from ${node}`);
}

const vertexHeuristicMap: { [key: string]: number } = {};

let result = '';

for (const vertex of data.vertices) {
  const shortestPath = depthFirstSearch(vertex);
  vertexHeuristicMap[vertex] = shortestPath.cost;
  result += `"${vertex}: ${shortestPath.cost}"\n`;
}

for (const connection of data.connections) {
  const [from, to, cost] = connection;
  result += `"${from}: ${vertexHeuristicMap[from]}" "${to}: ${vertexHeuristicMap[to]}" ${cost}\n`
}

console.log(result);
writeFileSync('./generated-graph.txt', result)
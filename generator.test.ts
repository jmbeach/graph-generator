import { breadthFirstSearch, getData } from "./generator"

describe('breadth first search', () => {
  it('finds the lowest cost path', () => {
    const data = getData();
    // I manually checked what the shortest path of this generated graph should be
    const costs = [
      7,
      10,
      9,
      4,
      2,
      1,
      5,
      4,
      10,
      9,
      3,
      6,
      9,
      2,
      8,
      4,
      8,
      5,
      8
    ]
    expect(costs.length).toEqual(data.connections.length);
    for (let i = 0; i < costs.length; i++) {
      data.connections[i].push(costs[i])
    }
    const shortestPathAtoM = breadthFirstSearch('A', data.connections);
    expect(shortestPathAtoM.cost).toEqual(26)
  })
})
// Similar to BFS, but needs to keep track of distances from start node to current neighbors/nodes.
// Add startNodeObject to nodeObjectsPriorityQueue to be the first nodeObject to be visited. Set the
// distanceFromStart of startNodeObject to be 0 and every other nodeObject to be Infinity.
// Remove the first nodeObject from the queue, mark it as visited, and push it to the
// visitedNodeObjects. If it is the goal, return visitedNodeObjects. Otherwise, for each of its
// unvisitedNeighborNodeObjects, calculate the potentialPathDistance. If potentialPathDistance is
// less than the neighbor's current distanceFromStart, then update distanceFromStart,
// minDistanceNodeObject, and add the neighbor to the queue. Otherwise, it means that traveling
// from the minDistanceNode to its neighbor takes longer than some other path to it from a
// different node, thus not the shortest path to get to it, so do not want to take that route.
// Lastly, sort by each node's distanceFromStart, then loop.
function dspf(gameState, totalRows, totalCols) {
  let visitedNodeObjects = [];
  let nodeObjectsPriorityQueue = [];
  nodeObjectsPriorityQueue.push(gameState.startNodeObject);

  for (coordinates in gameState.nodeObjects) {
    if (!gameState.nodeObjects[coordinates].start) {
      gameState.nodeObjects[coordinates].distanceFromStart = Infinity;
    }
  }
  gameState.startNodeObject.distanceFromStart = 0;

  while (nodeObjectsPriorityQueue.length > 0) {
    let minDistanceNodeObject = nodeObjectsPriorityQueue.shift();
    minDistanceNodeObject.isVisited = true;
    visitedNodeObjects.push(minDistanceNodeObject);

    if (minDistanceNodeObject.goal) {
      return visitedNodeObjects;
    }

    let unvisitedNeighborNodeObjects = getUnvisitedNeighborNodeObjects(
      minDistanceNodeObject,
      gameState.nodeObjects,
      totalRows,
      totalCols
    );

    for (let i = 0; i < unvisitedNeighborNodeObjects.length; i++) {
      let neighborNodeObject = unvisitedNeighborNodeObjects[i];

      let potentialPathDistance =
        minDistanceNodeObject.distanceFromStart +
        (neighborNodeObject.weight ? gameState.weightOfWeight : 1);

      if (potentialPathDistance < neighborNodeObject.distanceFromStart) {
        neighborNodeObject.distanceFromStart = potentialPathDistance;
        neighborNodeObject.previousNodeObject = minDistanceNodeObject;
        nodeObjectsPriorityQueue.push(neighborNodeObject);
      }
    }
    nodeObjectsPriorityQueue.sort((a, b) => a.distanceFromStart - b.distanceFromStart);
  }
  return null;
}

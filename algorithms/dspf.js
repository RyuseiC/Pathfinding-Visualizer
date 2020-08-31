// Similar to BFS, but needs to keep track of distances from start node to current neighbors/nodes.
// Add startNodeObject to nodeObjectsPriorityQueue to be the first nodeObject to be visited. Set the distanceFromStart
// of every startNodeObject to be 0 and every other nodeObject to be Infinity.
// If the first entry of nodeObjectsPriorityQueue a.k.a. minDistanceNodeObject is Infinity steps away from the
// startNodeObject, then the path is impossible. Otherwise, mark it as visited and push it to the visitedNodeObjects.
// Then, for each of its unvisitedNeighborNodeObjects, calculate the distanceFromStart to the neighbor is
// less than the neighbor's current distanceFromStart AND whether it hasn't been visited yet. If so, then the new
// distanceFromStart of the neighbor will be the one previously calculated, the minDistanceNodeObject
// becomes its previousNodeObject, and the neighbor is added to the queue. Otherwise means that traveling from the
// minDistanceNode to its neighbor takes longer than some other path to it from a different node, thus not the shortest
// path to get to it, so don't want to take that route.
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
    
    if (minDistanceNodeObject.distanceFromStart === Infinity) {
      return null;
    }

    let unvisitedNeighborNodeObjects = getUnvisitedNeighborNodeObjects(
      minDistanceNodeObject,
      gameState.nodeObjects,
      totalRows,
      totalCols
    );
    
    for (let i = 0; i < unvisitedNeighborNodeObjects.length; i++) {
      let neighborNodeObject = unvisitedNeighborNodeObjects[i];
      
      if (neighborNodeObject.goal) {
        neighborNodeObject.previousNodeObject = minDistanceNodeObject;
        return visitedNodeObjects;
      }

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

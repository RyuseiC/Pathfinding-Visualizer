// Add startNodeObject to nodeObjectsPriorityQueue to be the first nodeObject to be visited. Remove
// the first nodeObject from the queue, mark it as visited, and push it to the visitedNodeObjects.
// If it is the goal, return visitedNodeObjects. Otherwise, for each of its
// unvisitedNeighborNodeObjects, if it is not in the queue, then update previousNodeObject, add the
// neighbor to the queue, then loop.
function bfs(gameState, totalRows, totalCols) {
  let unvisitedNodeObjects = [];
  let visitedNodeObjects = [];
  unvisitedNodeObjects.push(gameState.startNodeObject);

  while (unvisitedNodeObjects.length > 0) {
    let tempNodeObject = unvisitedNodeObjects.shift();
    tempNodeObject.isVisited = true;
    visitedNodeObjects.push(tempNodeObject);

    if (tempNodeObject.goal) {
      return visitedNodeObjects;
    }

    let unvisitedNeighborNodeObjects = getUnvisitedNeighborNodeObjects(
      tempNodeObject,
      gameState.nodeObjects,
      totalRows,
      totalCols
    );

    for (let i = 0; i < unvisitedNeighborNodeObjects.length; i++) {
      let neighborNodeObject = unvisitedNeighborNodeObjects[i];

      if (!unvisitedNodeObjects.includes(neighborNodeObject)) {
        neighborNodeObject.previousNodeObject = tempNodeObject;
        unvisitedNodeObjects.push(neighborNodeObject);
      }
    }
  }
  return null;
}

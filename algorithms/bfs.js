// startNodeObject is first unvisited node, shift (remove and return first index of) unvisitedNodeObjects, then retrieve
// neighbors, then push startNodeObject to visitedNodeObjects. For each neighbor, mark startNodeObject as their
// previous node. Then, check if any of the neighbors are the goal. If not the goal, then check if they are on queue to be
// visited. If not, then push them to the queue (unvisitedNodeObjects) for later and repeat process. If one of them is
// the goal, then return visitedNodeObjects. Return null if goal cannot be reached i.e. if start or goal is boxed in by
// walls.
function bfs(gameState, totalRows, totalCols) {
  console.log('Running BFS');
  let tempNodeObject;
  let unvisitedNodeObjects = [];
  let visitedNodeObjects = [];
  unvisitedNodeObjects.push(gameState.startNodeObject);
  while (unvisitedNodeObjects.length > 0) {
    tempNodeObject = unvisitedNodeObjects.shift();
    let neighborNodeObjects = getUnvisitedNeighborNodeObjects(
      tempNodeObject,
      gameState.nodeObjects,
      totalRows,
      totalCols
    );
    tempNodeObject.isVisited = true;
    visitedNodeObjects.push(tempNodeObject);
    for (let i = 0; i < neighborNodeObjects.length; i++) {
      neighborNodeObjects[i].previousNodeObject = tempNodeObject;
      if (neighborNodeObjects[i].goal) {
        return visitedNodeObjects;
      } else if (!unvisitedNodeObjects.includes(neighborNodeObjects[i])) {
        unvisitedNodeObjects.push(neighborNodeObjects[i]);
      }
    }
  }
  return null;
}

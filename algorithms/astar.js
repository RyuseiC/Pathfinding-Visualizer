// Similar to DSPF, but needs to also keeps track of totalDistance of each node by calculating the
// neighbor's distanceFromStart summed with the neighbor's distanceFromGoal. Add startNodeObject to
// openList to be the first nodeObject to be visited. Set the distanceFromStart, distanceFromGoal,
// and totalDistance of startNodeObject to be 0, 0, and the distance from the goal, respectively.
// And set them all to Infinity for every other nodeObject. Dequeue the first nodeObject from the
// queue, mark it as visited, and push it to the closeList. If it is the goal, return
// visitedNodeObjects. Otherwise, for each of its unvisitedNeighborNodeObjects, calculate the
// potentialPathDistance, distanceToNeighbor, and distanceFromGoal. If potentialPathDistance is
// less than the neighbor's current distanceFromStart, then update its distanceFromStart,
// previousNodeObject, totalDistance, and add the neighbor to the queue. Otherwise, it means that
// travelingfrom the minDistanceNode to its neighbor takes longer than some other path to it from a
// different node, thus not the shortest path to get to it, so do not want to take that route.
// Lastly, sort openList by each node's totalDistance, then loop.
function astar(gameState, totalRows, totalCols) {
  let openList = [];
  let closeList = [];
  openList.push(gameState.startNodeObject);

  for (coordinates in gameState.nodeObjects) {
    if (!gameState.nodeObjects[coordinates].start) {
      gameState.nodeObjects[coordinates].distanceFromStart = Infinity;
      gameState.nodeObjects[coordinates].distanceFromGoal = Infinity;
      gameState.nodeObjects[coordinates].totalDistance = Infinity;
    }
  }
  gameState.startNodeObject.distanceFromStart = 0;
  gameState.startNodeObject.totalDistance = heuristic(gameState, gameState.startNodeObject);

  while (openList.length > 0) {
    let minDistanceNodeObject = openList.shift();
    minDistanceNodeObject.isVisited = true;
    closeList.push(minDistanceNodeObject);

    if (minDistanceNodeObject.goal) {
      return closeList;
    }

    let unvisitedNeighborNodeObjects = getUnvisitedNeighborNodeObjects(
      minDistanceNodeObject,
      gameState.nodeObjects,
      totalRows,
      totalCols
    );

    for (let i = 0; i < unvisitedNeighborNodeObjects.length; i++) {
      let neighborNodeObject = unvisitedNeighborNodeObjects[i];

      let distanceToNeighbor = neighborNodeObject.weight ? gameState.weightOfWeight : 1;

      // g
      let potentialPathDistance = minDistanceNodeObject.distanceFromStart + distanceToNeighbor;

      // h
      let distanceFromGoal = heuristic(gameState, neighborNodeObject);

      if (potentialPathDistance < neighborNodeObject.distanceFromStart) {
        neighborNodeObject.distanceFromStart = potentialPathDistance;
        neighborNodeObject.previousNodeObject = minDistanceNodeObject;
        // f = g + h
        neighborNodeObject.totalDistance = potentialPathDistance + distanceFromGoal;
        openList.push(neighborNodeObject);
      }
    }
    openList.sort((a, b) => a.totalDistance - b.totalDistance);
  }

  return null;
}

function heuristic(gameState, nodeObject) {
  return (
    Math.abs(nodeObject.row - gameState.goalNodeObject.row) +
    Math.abs(nodeObject.col - gameState.goalNodeObject.col)
  );
}

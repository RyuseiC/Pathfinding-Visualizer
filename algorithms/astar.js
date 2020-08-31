// Similar to DSPF
function astar(gameState, totalRows, totalCols) {
  let openList = [];
  let closeList = [];
  openList.push(gameState.startNodeObject);

  for (coordinates in gameState.nodeObjects) {
    if (!gameState.nodeObjects[coordinates].start) {
      gameState.nodeObjects[coordinates].distanceFromStart = Infinity;
      gameState.nodeObjects[coordinates].totalDistance = Infinity;
    }
  }
  gameState.startNodeObject.distanceFromStart = 0;
  gameState.startNodeObject.totalDistance =
    Math.abs(gameState.startNodeObject.row - gameState.goalNodeObject.row) +
    Math.abs(gameState.startNodeObject.col - gameState.goalNodeObject.col);

  while (openList.length > 0) {
    let minDistanceNodeObject = openList.shift();
    minDistanceNodeObject.isVisited = true;
    closeList.push(minDistanceNodeObject);

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
        return closeList;
      }

      let distanceBetweenNeighbors =
        (neighborNodeObject.weight ? gameState.weightOfWeight : 1);

      // g
      let distanceFromStart = minDistanceNodeObject.distanceFromStart + distanceBetweenNeighbors;

      // h
      let distanceFromGoal =
        Math.abs(neighborNodeObject.row - gameState.goalNodeObject.row) +
        Math.abs(neighborNodeObject.col - gameState.goalNodeObject.col);

      if (distanceFromStart < neighborNodeObject.distanceFromStart) {
        neighborNodeObject.distanceFromStart = distanceFromStart;
        neighborNodeObject.previousNodeObject = minDistanceNodeObject;
        // f = g + h
        neighborNodeObject.totalDistance = neighborNodeObject.distanceFromStart + distanceFromGoal;
        openList.push(neighborNodeObject);
      }
    }
    openList.sort((a, b) => a.totalDistance - b.totalDistance);
  }

  return null;
}

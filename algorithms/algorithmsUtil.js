// convertJSToDOM(nodeObjects): remove weight classNames if nodeObjects.weight is false,
// and only do this next stuff if hasComputed
// Visualization: Set all object keys + values (visited, shortestPath) at once
// setTimeout and loop through full list of nodes for and add className 'visited' while also making a list of shortestPath
// nodes then a second setTimeout for shortestPath nodes, remove visited className and add shortestPath. For instantVisited
// and instantShortestPath remove visited, shortestPath, instantVisited, instantShortestPath classNames, tell
// if needed to be done using hasVisualized

function convertToWall(node, i) {
  setTimeout(() => {
    node.className = 'wall';
  }, 10 * i);
}

function visualizeAlgorithm(gameState) {
  gameState.isRunning = true;
  if (gameState.algorithm === 'BFS') {
    for (coordinates in gameState.nodeObjects) {
      Object.assign(gameState.nodeObjects[coordinates], { weight: false });
    }
    convertJSToDOM(gameState.nodeObjects);
  }
  // else if (gameState.algorithm === 'DFSMaze') {
  //   let i = 0;
  //   for (coordinates in gameState.nodeObjects) {
  //     i++;
  //     if (!gameState.nodeObjects[coordinates].start && !gameState.nodeObjects[coordinates].goal) {
  //       convertToWall(getNode(gameState.nodeObjects[coordinates]), i);
  //     }
  //     convertDOMToJS(grid, gameState);
  //   }
  //   convertJSToDOM(gameState.nodeObjects);
  // }
  let nodeObjectsInVisitedOrder;
  let algorithm = gameState.algorithm
  if (algorithm === 'BFS') {
    nodeObjectsInVisitedOrder = bfs(gameState, totalRows, totalCols);
  } else if (algorithm === 'DSPF') {
    nodeObjectsInVisitedOrder = dspf(gameState, totalRows, totalCols);
  } else if (algorithm === 'ASTAR') {
    nodeObjectsInVisitedOrder = astar(gameState, totalRows, totalCols);
  } else if (algorithm === 'DFSMaze') {
    nodeObjectsInVisitedOrder = dfsMazeStart(gameState, totalRows, totalCols);
    gameState.visualizingMaze = true;
  }
  gameState.hasComputed = true;
  if (nodeObjectsInVisitedOrder !== null) {
    toggleButtons(gameState);
    convertJSToDOM(gameState, nodeObjectsInVisitedOrder);
    gameState.hasVisualized = true;
  } else {
    gameState.isRunning = false;
    alert('Please do not surround the start or goal nodes with wall nodes.');
    return;
  }
}

function instantVisualizeAlgorithm(gameState) {
  let nodeObjectsInVisitedOrder;
  if (gameState.algorithm === 'BFS') {
    nodeObjectsInVisitedOrder = bfs(gameState, totalRows, totalCols);
  } else if (gameState.algorithm === 'DSPF') {
    nodeObjectsInVisitedOrder = dspf(gameState, totalRows, totalCols);
  } else if (gameState.algorithm === 'ASTAR') {
    nodeObjectsInVisitedOrder = astar(gameState, totalRows, totalCols);
  }
  convertJSToDOM(gameState, nodeObjectsInVisitedOrder);
}

function getUnvisitedNeighborNodeObjects(nodeObject, nodeObjects, totalRows, totalCols) {
  let neighborNodeObjects = [];

  let topNeighborNodeObject =
    nodeObject.row === 0 ? null : nodeObjects[[nodeObject.row - 1, nodeObject.col]];
  let bottomNeighborNodeObject =
    nodeObject.row + 1 === totalRows ? null : nodeObjects[[nodeObject.row + 1, nodeObject.col]];
  let leftNeighborNodeObject =
    nodeObject.col === 0 ? null : nodeObjects[[nodeObject.row, nodeObject.col - 1]];
  let rightNeighborNodeObject =
    nodeObject.col + 1 === totalCols ? null : nodeObjects[[nodeObject.row, nodeObject.col + 1]];
  neighborNodeObjects.push(
    topNeighborNodeObject,
    bottomNeighborNodeObject,
    leftNeighborNodeObject,
    rightNeighborNodeObject
  );

  return neighborNodeObjects.filter(
    (neighborNodeObject) =>
      neighborNodeObject !== null && !neighborNodeObject.isVisited && !neighborNodeObject.wall
  );
}

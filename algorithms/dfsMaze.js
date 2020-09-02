let unvisitedNodeObjects = [];
let visitedNodeObjects = [];

function dfsMazeStart(gameState) {
  visitedNodeObjects = [];
  dfsMaze(gameState, gameState.startNodeObject.row, gameState.startNodeObject.col);
  return visitedNodeObjects;
}

function dfsMaze(gameState, row, col) {
  let nodeObject = gameState.nodeObjects[`${row},${col}`];
  visitedNodeObjects.push(nodeObject);
  let randNumArray = generateRandNumArray();

  for (let i = 0; i < randNumArray.length; i++) {
    switch (randNumArray[i]) {
      // Top neighbor
      case 0:
        if (row - 2 < 0) {
          continue;
        }  if (!visitedNodeObjects.includes(gameState.nodeObjects[`${row - 2},${col}`])) {
          visitedNodeObjects.push(gameState.nodeObjects[`${row - 1},${col}`]);
          dfsMaze(gameState, row - 2, col);
        }
        break;
      // Bottom neighbor
      case 1:
        if (row + 2 >= totalRows) {
          continue;
        }  if (!visitedNodeObjects.includes(gameState.nodeObjects[`${row + 2},${col}`])) {
          visitedNodeObjects.push(gameState.nodeObjects[`${row + 1},${col}`]);
          dfsMaze(gameState, row + 2, col);
        }
        break;
      // Left neighbor
      case 2:
        if (col - 2 < 0) {
          continue;
        }  if (!visitedNodeObjects.includes(gameState.nodeObjects[`${row},${col - 2}`])) {
          visitedNodeObjects.push(gameState.nodeObjects[`${row},${col - 1}`]);
          dfsMaze(gameState, row, col - 2);
        }
        break;
      // Right neighbor
      case 3:
        if (col + 2 >= totalCols) {
          continue;
        }  if (!visitedNodeObjects.includes(gameState.nodeObjects[`${row},${col + 2}`])) {
          visitedNodeObjects.push(gameState.nodeObjects[`${row},${col + 1}`]);
          dfsMaze(gameState, row, col + 2);
        }
        break;
    }
  }


function generateRandNumArray() {
  let arr = [];
  while (arr.length < 4) {
    var r = Math.floor(Math.random() * 4);
    if (arr.indexOf(r) === -1) {
      arr.push(r);
    }
  }
  return arr;
}
}

var grid = document.getElementById('grid');
var totalRows = 20;
var totalCols = 55;
var gameState = {
  algorithm: '',
  nodeObjects: {},
  startNodeObject: -1,
  goalNodeObject: -1,
  hasComputed: false,
  hasVisualized: false,
  visualizingMaze: false,
  isRunning: false,
  isDrawing: false,
  selectedWalls: true,
  selectedWeights: false,
  weightOfWeight: 5,
  movingStartOrGoalNodes: { isMoving: false, isMovingStartNode: false, isMovingGoalNode: false },
};

/**
 * TODO: Fix weight CSS
 * TODO: Fix visualize function
 * TODO: Fix timing of total distance alert and button toggle
 * TODO: Probably rename visualize, visualizeAlgorithm, convertJSToDOM
 * TODO: Separate out animations from convertJSToDOM
 * TODO: Redo comments for conevrtDOMTJS and convertJSToDOM
 * TODO: Write more comments
 * TODO: Kruskal(?) maze generator
 */

drawGrid(totalRows, totalCols, gameState);

function convertDOMToJS(grid, gameState) {
  let rows = grid.children;
  for (let i = 0; i < rows.length; i++) {
    let nodes = rows[i].children;
    for (let j = 0; j < nodes.length; j++) {
      let nodeClassList = nodes[j].classList;
      let nodeObject = getNodeObject(nodes[j], totalCols);
      Object.assign(nodeObject, {
        start: nodeClassList.contains('start') ? true : false,
        goal: nodeClassList.contains('goal') ? true : false,
        wall: nodeClassList.contains('wall') ? true : false,
        weight: nodeClassList.contains('weight') ? true : false,
        isVisited: false,
      });
      if (nodeClassList.contains('start')) {
        gameState.startNodeObject = nodeObject;
      } else if (nodeClassList.contains('goal')) {
        gameState.goalNodeObject = nodeObject;
      } else if (nodeClassList.contains('weight') && gameState.algorithm === 'BFS') {
        nodeObject.weight = false;
      }
    }
  }

  return gameState;
}

function convertJSToDOM(gameState, nodeObjectsInVistedOrder) {
  let totalDistance = 0;
  console.log('nodeObjectsInVistedOrder :>> ', nodeObjectsInVistedOrder);

  if (gameState.visualizingMaze) {
    console.log('converting');
    let i = 0;
    for (coordinates in gameState.nodeObjects) {
      let node = getNode(gameState.nodeObjects[coordinates]);
      if (!node.className.includes('start') && !node.className.includes('goal')) {
        node.className = '';
      }
      let nodeObject = gameState.nodeObjects[coordinates]
      console.log(nodeObjectsInVistedOrder.includes(nodeObject))
      setTimeout(() => {
        if (
          !nodeObjectsInVistedOrder.includes(nodeObject) &&
          !node.className.includes('start') &&
          !node.className.includes('goal')
        ) {
          node.className = 'wall';
        }
      }, 5 * i);
      i++;
    };

    setTimeout(() => {
      gameState.hasVisualized = true;
      gameState.hasComputed = false;
      gameState.isRunning = false;
      gameState.visualizingMaze = false;
      toggleButtons(gameState);
    }, 10 * nodeObjectsInVistedOrder.length);
  }
  // If an algorithm has been visualized and the board has not been cleared, then do instant visualization.
  // Clear previous visualization first. Then, iterate through the nodeObjectsInVistedOrder array to mark as
  // instantVisited. Then, take the goalNodeObject and iterate through its previousNodeObjects to get the reverse
  // shortest path. Reverse, then add instantShortestPath class to all of them.
  else if (gameState.hasVisualized) {
    for (coordinates in gameState.nodeObjects) {
      getNode(gameState.nodeObjects[coordinates]).classList.remove(
        'shortestPath',
        'instantShortestPath',
        'visited',
        'instantVisited'
      );
    }

    nodeObjectsInVistedOrder.forEach((visitedNodeObject) => {
      getNode(visitedNodeObject).classList.add('instantVisited');
    });

    let tempNodeObject = gameState.goalNodeObject;
    let nodeObjectsInShortestPathOrder = [];

    while (!tempNodeObject.start) {
      nodeObjectsInShortestPathOrder.push(tempNodeObject);
      tempNodeObject = tempNodeObject.previousNodeObject;
    }
    nodeObjectsInShortestPathOrder.push(gameState.startNodeObject);
    nodeObjectsInShortestPathOrder.reverse();

    nodeObjectsInShortestPathOrder.forEach((shortestPathNodeObject) => {
      getNode(shortestPathNodeObject).classList.remove('instantVisited');
      getNode(shortestPathNodeObject).classList.add('instantShortestPath');
    });
  }
  // If the main algorithm has returned a non-null array, visualize the algorithm.
  else if (gameState.hasComputed) {
    nodeObjectsInVistedOrder.forEach((visitedNodeObject, i) => {
      setTimeout(() => {
        getNode(visitedNodeObject).classList.add('visited');
      }, 4 * i);
    });

    setTimeout(() => {
      let tempNodeObject = gameState.goalNodeObject;
      let nodeObjectsInShortestPathOrder = [];

      while (!tempNodeObject.start) {
        nodeObjectsInShortestPathOrder.push(tempNodeObject);
        tempNodeObject = tempNodeObject.previousNodeObject;
      }
      nodeObjectsInShortestPathOrder.push(gameState.startNodeObject);
      nodeObjectsInShortestPathOrder.reverse();

      nodeObjectsInShortestPathOrder.forEach((shortestPathNodeObject, i) => {
        setTimeout(() => {
          totalDistance += shortestPathNodeObject.weight ? gameState.weightOfWeight : 1;
          getNode(shortestPathNodeObject).classList.remove('visited');
          getNode(shortestPathNodeObject).classList.add('shortestPath');
        }, 30 * i);
      });
      setTimeout(() => {
        gameState.hasVisualized = true;
        gameState.hasComputed = false;
        gameState.isRunning = false;
        toggleButtons(gameState);
        setTimeout(() => {
          alert(`It took ${totalDistance - 1} steps to get to your destination.`);
        }, 20 * nodeObjectsInShortestPathOrder.length);
      }, 55 * nodeObjectsInShortestPathOrder.length);
    }, 5 * nodeObjectsInVistedOrder.length);
  }
  return gameState;
}

function visualize(gameState) {
  let algorithm = gameState.algorithm;
  if (algorithm !== '') {
    // Remove weights if algorithm is BFS because it is an unweighted algorithm.
    if (algorithm === 'BFS') {
      for (coordinates in gameState.nodeObjects) {
        getNode(gameState.nodeObjects[coordinates]).classList.contains('weight')
          ? getNode(gameState.nodeObjects[coordinates]).classList.remove('weight')
          : null;
      }
    }
    gameState.isRunning = true;
    gameState.hasVisualized = false;
    gameState.hasComputed = false;
    for (coordinates in gameState.nodeObjects) {
      getNode(gameState.nodeObjects[coordinates]).classList.remove(
        'visited',
        'shortestPath',
        'instantVisited',
        'instantShortestPath'
      );
    }
    visualizeAlgorithm(convertDOMToJS(grid, gameState));
  } else {
    alert('Please select an algorithm');
  }
}

function getNode(nodeObject) {
  return document.getElementById(`node ${getIndex(nodeObject)}`);
}

function getNodeObject(node, totalCols) {
  let rowCol = getRowCol(node, totalCols);
  return gameState.nodeObjects[[rowCol.row, rowCol.col]];
}

function getIndex(nodeObject) {
  return nodeObject.col + nodeObject.row * totalCols;
}

function getRowCol(node, totalCols) {
  let nodeId = parseInt(node.id.split(' ')[1]);
  return {
    row: Math.floor(nodeId / totalCols),
    col: nodeId % totalCols,
  };
}

function drawGrid(totalRows, totalCols, gameState) {
  let grid = document.getElementById('grid');
  grid.innerHTML = '';
  for (let r = 0; r < totalRows; r++) {
    let row = document.createElement('tr');
    grid.appendChild(row);
    for (let c = 0; c < totalCols; c++) {
      let node = document.createElement('td');
      node.innerHTML = '&nbsp';
      node.id = `node ${c + r * totalCols}`;
      node.pointerEvents = 'none';
      node.addEventListener('mousedown', (event) => nodeMouseDown(event, gameState));
      node.addEventListener('mouseenter', (event) => nodeMouseEnter(event, gameState));
      node.addEventListener('mouseup', () => nodeMouseUp(gameState));
      row.appendChild(node);
      gameState.nodeObjects[[r, c]] = {
        row: r,
        col: c,
        start: false,
        goal: false,
        wall: false,
        weight: false,
        isVisited: false,
      };
      if (c === Math.floor(totalCols / 5) && r === Math.floor(totalRows / 2)) {
        node.className = 'start';
      }
      if (c === totalCols - Math.floor(totalCols / 5) && r === Math.floor(totalRows / 2)) {
        node.className = 'goal';
      }
    }
  }
  convertDOMToJS(grid, gameState);
}

// Event handlers for info button, dropdown menu, and slider
document.addEventListener('keydown', (keyboardEvent) => nodeKeydown(keyboardEvent, gameState));
document.getElementById('info').addEventListener('click', () => showInfo(gameState));
document.getElementById('selected').addEventListener('change', () => changeAlgorithm(gameState));
document.getElementById('weightSlider').addEventListener('change', () => changeWeight(gameState));
// Event handlers for visualize, reset grid, clear walls and weights, and clear path buttons.
document.getElementById('visualize').addEventListener('click', () => visualize(gameState));
document
  .getElementById('resetGrid')
  .addEventListener('click', () => resetGrid(gameState, totalRows, totalCols));
document
  .getElementById('clearWallsAndWeights')
  .addEventListener('click', () => clearWallsAndWeights(gameState));
document.getElementById('clearPath').addEventListener('click', () => clearPath(gameState));

function confirm(card) {
  card.style.visibility = 'hidden';
}

function showInfo(gameState) {
  let card;
  if (gameState.algorithm === '') {
    card = document.getElementById('welcome');
  } else if (gameState.algorithm === 'BFS') {
    card = document.getElementById('BFSCard');
  } else if (gameState.algorithm === 'DSPF') {
    card = document.getElementById('DSPFCard');
  } else if (gameState.algorithm === 'ASTAR') {
    card = document.getElementById('ASTARCard');
  } else if (gameState.algorithm === 'DFSMaze') {
    card = document.getElementById('DFSMazeCard');
  }

  let cards = document.getElementsByClassName('mdl-card');
  for (let i = 0; i < cards.length; i++) {
    if (cards[i] !== card) {
      cards[i].style.visibility = 'hidden';
    }
  }

  card.style.visibility = card.style.visibility === 'hidden' ? 'visible' : 'hidden';
}

function changeAlgorithm(gameState) {
  let algorithm = document.getElementById('selected').value;
  // For BFS, an unweighted algorithm, handle legend for weight and wall nodes as soon as BFS is
  // selected. Also, make toggle weight drawing off and wall drawing on.
  if (algorithm === 'Breadth-First Search Algorithm') {
    gameState.algorithm = 'BFS';
    gameState.selectedWalls = true;
    gameState.selectedWeights = false;

    let weightLabel = document.getElementById('weightLabel');
    weightLabel.classList.remove('emphasize');
    weightLabel.classList.add('unweighted');

    let wallLabel = document.getElementById('wallLabel');
    wallLabel.classList.add('emphasize');

    convertDOMToJS(grid, gameState);
  } else if (algorithm === "Dijkstra's Shortest Path First Algorithm") {
    gameState.algorithm = 'DSPF';
    document.getElementById('weightLabel').classList.remove('unweighted');
  } else if (algorithm === 'A* (A-Star) Search Algorithm') {
    gameState.algorithm = 'ASTAR';
    document.getElementById('weightLabel').classList.remove('unweighted');
  } else if (algorithm === 'Depth-First Search Maze Generator') {
    gameState.algorithm = 'DFSMaze';
  }
}

function changeWeight(gameState) {
  gameState.weightOfWeight = parseInt(document.getElementById('weightSlider').value, 10);
  if (gameState.hasVisualized && gameState.algorithm !== 'BFS') {
    instantVisualizeAlgorithm(convertDOMToJS(grid, gameState));
  }
}

function resetGrid(gameState, totalRows, totalCols) {
  document.getElementById('grid').innerHTML = '';
  gameState.nodeObjects = {};
  gameState.hasVisualized = false;
  gameState.hasComputed = false;
  drawGrid(totalRows, totalCols, gameState);
}

function clearWallsAndWeights(gameState) {
  for (coordinates in gameState.nodeObjects) {
    getNode(gameState.nodeObjects[coordinates]).classList.remove('wall', 'weight');
  }

  if (gameState.hasVisualized) {
    instantVisualizeAlgorithm(convertDOMToJS(grid, gameState));
  }
}

function clearPath(gameState) {
  for (coordinates in gameState.nodeObjects) {
    getNode(gameState.nodeObjects[coordinates]).classList.remove(
      'shortestPath',
      'instantShortestPath',
      'visited',
      'instantVisited'
    );
  }
  convertDOMToJS(grid, gameState);
  gameState.hasVisualized = false;
}

// Disable buttons if an algorithm is runnning / being visualized.
function toggleButtons(gameState) {
  let grid = document.getElementById('grid');
  let controls = document.getElementById('controls');
  if (gameState.isRunning) {
    grid.style.pointerEvents = 'none';
    Array.from(controls.children).forEach((control) => control.setAttribute('disabled', ''));
  } else {
    grid.style.pointerEvents = 'initial';
    Array.from(controls.children).forEach((control) => control.removeAttribute('disabled'));
  }
}

// Mouse and key event handler functions.
// Click and drag to draw.
// Press W to toggle between drawing walls and drawing weights.
function nodeMouseDown(event, gameState) {
  if (event.target.classList.contains('start') || event.target.classList.contains('goal')) {
    gameState.movingStartOrGoalNodes.isMoving = true;
    if (event.target.classList.contains('start')) {
      Object.assign(gameState.movingStartOrGoalNodes, {
        isMovingStartNode: true,
        isMovingGoalNode: false,
      });
    } else {
      Object.assign(gameState.movingStartOrGoalNodes, {
        isMovingStartNode: false,
        isMovingGoalNode: true,
      });
    }
  } else {
    gameState.isDrawing = true;
    handleWallsAndWeights(event.target, gameState);
  }
}

function nodeMouseEnter(event, gameState) {
  const { movingStartOrGoalNodes, isDrawing } = gameState;
  if (movingStartOrGoalNodes.isMoving) {
    handleMovingStartAndGoal(event.target, gameState);
  } else if (isDrawing) {
    handleWallsAndWeights(event.target, gameState);
  }
}

function nodeMouseUp(gameState) {
  gameState.isDrawing = false;
  Object.keys(gameState.movingStartOrGoalNodes).forEach(
    (key) => (gameState.movingStartOrGoalNodes[key] = false)
  );
}

function nodeKeydown(keyboardEvent, gameState) {
  const { selectedWeights, selectedWalls } = gameState;
  if (keyboardEvent.keyCode === 87 && gameState.algorithm !== 'BFS') {
    gameState.selectedWeights = selectedWeights ? false : true;
    let weightLabel = document.getElementById('weightLabel');
    gameState.selectedWeights
      ? weightLabel.classList.add('emphasize')
      : weightLabel.classList.remove('emphasize');

    let wallLabel = document.getElementById('wallLabel');
    gameState.selectedWalls = selectedWalls ? false : true;
    gameState.selectedWalls
      ? wallLabel.classList.add('emphasize')
      : wallLabel.classList.remove('emphasize');
  }
}

function handleWallsAndWeights(targetNode, gameState) {
  const { selectedWalls, selectedWeights, hasVisualized } = gameState;
  let targetNodeClassList = targetNode.classList;
  if (!targetNodeClassList.contains('start') && !targetNodeClassList.contains('goal')) {
    if (selectedWalls) {
      targetNode.className = targetNodeClassList.contains('wall') ? '' : 'wall';
    } else if (selectedWeights && gameState.algorithm !== 'BFS') {
      targetNode.className = targetNodeClassList.contains('weight') ? '' : 'weight';
    }

    convertDOMToJS(grid, gameState);
    if (hasVisualized) {
      instantVisualizeAlgorithm(gameState);
    }
  }
}

function handleMovingStartAndGoal(targetNode, gameState) {
  const { movingStartOrGoalNodes, startNodeObject, goalNodeObject, hasVisualized } = gameState;
  let targetNodeClassList = targetNode.classList;
  // let obstacleClassNames = ['wall', 'weight'];
  // if (
  //   obstacleClassNames.some((obstacleClassName) => !targetNodeClassList.contains(obstacleClassName))
  // ) {
  if (
    movingStartOrGoalNodes.isMovingStartNode &&
    !targetNodeClassList.contains('goal') &&
    !targetNodeClassList.contains('wall') &&
    !targetNodeClassList.contains('weight')
  ) {
    getNode(startNodeObject).className = '';
    targetNode.className = 'start';
  } else if (
    movingStartOrGoalNodes.isMovingGoalNode &&
    !targetNodeClassList.contains('start') &&
    !targetNodeClassList.contains('wall') &&
    !targetNodeClassList.contains('weight')
  ) {
    getNode(goalNodeObject).className = '';
    targetNode.className = 'goal';
  }
  // }

  convertDOMToJS(grid, gameState);
  if (hasVisualized) {
    instantVisualizeAlgorithm(gameState);
  }
}

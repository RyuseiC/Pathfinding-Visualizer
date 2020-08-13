var rows = 25;
var cols = 55;
var startNodeObject;
var goalNodeObject;
var nodeObjects = [];
var isDrawing = false;
var selectedWalls = true;
var selectedWeights = false;
var movingStartGoal = { moving: false, movingStartNode: false, movingGoalNode: false };
var hasVisualized = false;
var isRunning = false;
var algorithm;

drawGrid(rows, cols);

function run() {
  if (!isRunning) {
    algorithm = document.getElementById('algorithm').value;
    console.log(algorithm);
    for (let i = 0; i < nodeObjects.length; i++) {
      getNode(nodeObjects[i]).classList.remove(
        'visited',
        'shortestPath',
        'instantVisited',
        'instantShortestPath'
      );
      nodeObjects[i].isVisited = false;
    }
    if (algorithm == 'BFS') visualizeBFS();
    else if (algorithm == 'SPF') visualizeSPF();
    else if (algorithm == 'ASTAR') visualizeASTAR();
  }
}

// startNodeObject is first unvisited node, shift (remove and return first index of) unvisitedNodeObjects, then retrieve
// neighbors, then push startNodeObject to visitedNodeObjects. For each neighbor, mark startNodeObject as their
// previous node. Then, check if any of the neighbors are the goal. If not the goal, then check if they are on queue to be
// visited. If not, then push them to the queue (unvisitedNodeObjects) for later and repeat process. If one of them is
// the goal, then return visitedNodeObjects. Return null if goal cannot be reached i.e. if start or goal is boxed in by
// walls.
function bfs() {
  let tempNodeObject;
  let unvisitedNodeObjects = [];
  let visitedNodeObjects = [];
  unvisitedNodeObjects.push(startNodeObject);
  while (unvisitedNodeObjects.length > 0) {
    tempNodeObject = unvisitedNodeObjects.shift();
    let neighborNodeObjects = getUnvisitedNeighborNodeObjects(tempNodeObject);
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

// Similar to BFS, but needs to keep track of distances from start node to current neighbors/nodes.
// Add startNodeObject to nodeObjectsPriorityQueue to be the first nodeObject to be visited. Set the distanceFromStart
// of every startNodeObject to be 0 and every other nodeObject to be Infinity. If the first entry of
// nodeObjectsPriorityQueue a.k.a. minDistanceNodeObject is Infinity steps away from the startNodeObject,
// then the path is impossible. Otherwise, mark it as visited and push it to the visitedNodeObjects.
// Then, for each of its unvisitedNeighborNodeObjects, calculate the distanceFromStart to the neighbor is
// less than the neighbor's current distanceFromStart AND whether it hasn't been visited yet. If so, then the new
// distanceFromStart of the neighbor will be the one previously calculated, the minDistanceNodeObject 
// becomes its previousNodeObject, and the neighbor is added to the queue. Otherwise means that traveling from the 
// minDistanceNode to its neighbor takes longer than some other path to it from a different node, thus not the shortest
// path to get to it, so don't want to take that route.
function spf() {
  let visitedNodeObjects = [];
  let nodeObjectsPriorityQueue = [];
  nodeObjectsPriorityQueue.push(startNodeObject);

  nodeObjects.forEach((nodeObject) => {
    if (!nodeObject.start) {
      nodeObject.distanceFromStart = Infinity;
    }
  });
  startNodeObject.distanceFromStart = 0;

  while (nodeObjectsPriorityQueue.length > 0) {
    let minDistanceNodeObject = nodeObjectsPriorityQueue.shift();
    if (minDistanceNodeObject.distanceFromStart == Infinity) {
      return null;
    }

    minDistanceNodeObject.isVisited = true;
    visitedNodeObjects.push(minDistanceNodeObject);

    let unvisitedNeighborNodeObjects = getUnvisitedNeighborNodeObjects(minDistanceNodeObject);
    for (let i = 0; i < unvisitedNeighborNodeObjects.length; i++) {
      // Make weight changeable for user
      let potentialPathDistance =
        minDistanceNodeObject.distanceFromStart + (unvisitedNeighborNodeObjects[i].weight ? 20 : 1);
      if (unvisitedNeighborNodeObjects[i].goal) {
        unvisitedNeighborNodeObjects[i].previousNodeObject = minDistanceNodeObject;
        return visitedNodeObjects;
      }

      if (
        potentialPathDistance < unvisitedNeighborNodeObjects[i].distanceFromStart &&
        !unvisitedNeighborNodeObjects[i].isVisited
      ) {
        unvisitedNeighborNodeObjects[i].distanceFromStart = potentialPathDistance;
        unvisitedNeighborNodeObjects[i].previousNodeObject = minDistanceNodeObject;
        nodeObjectsPriorityQueue.push(unvisitedNeighborNodeObjects[i]);
      }
      nodeObjectsPriorityQueue.sort((a, b) => a.distanceFromStart - b.distanceFromStart);
    }
  }
  return null;
}

function visualizeSPF() {
  isRunning = true;
  let nodeObjectsInVisitedOrder = spf();
  if (nodeObjectsInVisitedOrder != null) {
    enableDisableButtons();
    animateBFSSPF(nodeObjectsInVisitedOrder);
  } else {
    isRunning = false;
    alert('Please do not surround the start or goal nodes with wall nodes.');
    return;
  }
}

function visualizeBFS() {
  isRunning = true;
  Object.keys(nodeObjects).forEach((weight, i) => {
    nodeObjects[i][weight] = false;
    getNode(nodeObjects[i]).classList.remove('weight');
  });
  let nodeObjectsInVisitedOrder = bfs();
  if (nodeObjectsInVisitedOrder != null) {
    enableDisableButtons();
    animateBFSSPF(nodeObjectsInVisitedOrder);
  } else {
    isRunning = false;
    alert('Please do not surround the start or goal nodes with wall nodes.');
    return;
  }
}

function instantVisualizeBFSSPF() {
  for (let i = 0; i < nodeObjects.length; i++) {
    getNode(nodeObjects[i]).classList.remove(
      'visited',
      'shortestPath',
      'instantVisited',
      'instantShortestPath'
    );
    nodeObjects[i].isVisited = false;
  }
  if (algorithm == 'BFS') {
    var nodeObjectsInVisitedOrder = bfs();
  } else if (algorithm == 'SPF') {
    var nodeObjectsInVisitedOrder = spf();
  }
  instantAnimateBFSSPF(nodeObjectsInVisitedOrder);
}

function animateBFSSPF(nodeObjectsInVisitedOrder) {
  for (let i = 0; i <= nodeObjectsInVisitedOrder.length; i++) {
    if (i == nodeObjectsInVisitedOrder.length) {
      setTimeout(() => {
        animateShortestPathBFSSPF();
      }, 5 * i);
      return;
    }
    setTimeout(() => {
      getNode(nodeObjectsInVisitedOrder[i]).classList.add('visited');
    }, 5 * i);
  }
}

function instantAnimateBFSSPF(nodeObjectsInVisitedOrder) {
  for (let i = 0; i <= nodeObjectsInVisitedOrder.length; i++) {
    if (i == nodeObjectsInVisitedOrder.length) {
      instantAnimateShortestPath();
      return;
    }
    getNode(nodeObjectsInVisitedOrder[i]).classList.add('instantVisited');
  }
}

function animateShortestPathBFSSPF() {
  var tempNodeObject = goalNodeObject.previousNodeObject;
  var nodeObjectsInShortestPathOrder = [];

  while (!tempNodeObject.start) {
    nodeObjectsInShortestPathOrder.push(tempNodeObject);
    tempNodeObject = tempNodeObject.previousNodeObject;
  }
  nodeObjectsInShortestPathOrder.reverse();

  getNode(startNodeObject).classList.add('shortestPath');
  for (let i = 0; i < nodeObjectsInShortestPathOrder.length; i++) {
    setTimeout(() => {
      getNode(nodeObjectsInShortestPathOrder[i]).classList.add('shortestPath');
      getNode(nodeObjectsInShortestPathOrder[i]).classList.remove('visited');
    }, 45 * i);
  }
  getNode(goalNodeObject).classList.add('shortestPath');

  setTimeout(() => {
    isRunning = false;
    hasVisualized = true;
    enableDisableButtons();
  }, 50 * nodeObjectsInShortestPathOrder.length);
}

function instantAnimateShortestPath() {
  var tempNodeObject = goalNodeObject.previousNodeObject;
  var nodeObjectsInShortestPathOrder = [];
  while (!tempNodeObject.start) {
    nodeObjectsInShortestPathOrder.push(tempNodeObject);
    tempNodeObject = tempNodeObject.previousNodeObject;
  }
  nodeObjectsInShortestPathOrder.reverse();
  getNode(startNodeObject).classList.add('instantShortestPath');
  for (let i = 0; i < nodeObjectsInShortestPathOrder.length; i++) {
    getNode(nodeObjectsInShortestPathOrder[i]).classList.remove('visited');
    getNode(nodeObjectsInShortestPathOrder[i]).classList.add('instantShortestPath');
  }
  getNode(goalNodeObject).classList.add('instantShortestPath');
  isRunning = false;
}

function instantVisualize(algorithm) {
  if (algorithm == 'BFS') {
    instantVisualizeBFS();
  } else if (algorithm == 'SPF') {
    instantVisualizeBFSSPF();
  } else if (algorithm == 'ASTAR') {
    instantVisualizeASTAR();
  }
}

function getUnvisitedNeighborNodeObjects(nodeObject) {
  var neighborNodeObjects = [];
  var topNeighborNode = document.getElementById(
    nodeObject.row == 0 ? null : `node ${nodeObject.id - cols}`
  );
  topNeighborNode != null ? neighborNodeObjects.push(getNodeObject(topNeighborNode)) : null;

  var bottomNeighborNode = document.getElementById(
    nodeObject.row + 1 == rows ? null : `node ${nodeObject.id + cols}`
  );
  bottomNeighborNode != null ? neighborNodeObjects.push(getNodeObject(bottomNeighborNode)) : null;

  var leftNeighborNode = document.getElementById(
    nodeObject.col == 0 ? null : `node ${nodeObject.id - 1}`
  );
  leftNeighborNode != null ? neighborNodeObjects.push(getNodeObject(leftNeighborNode)) : null;

  var rightNeighborNode = document.getElementById(
    nodeObject.col + 1 == cols ? null : `node ${nodeObject.id + 1}`
  );
  rightNeighborNode != null ? neighborNodeObjects.push(getNodeObject(rightNeighborNode)) : null;

  return neighborNodeObjects.filter(
    (neighborNodeObject) => !neighborNodeObject.isVisited && !neighborNodeObject.wall
  );
}

function getNodeObject(node) {
  var nodeId = parseInt(node.id.split(' ')[1]);
  return nodeObjects[nodeId];
}

function getNode(nodeObject) {
  return document.getElementById(`node ${nodeObject.id}`);
}

function drawGrid(rows, cols) {
  var grid = document.getElementById('grid');
  grid.innerHTML = '';
  grid.className = 'noHighlight';
  for (let r = 0; r < rows; r++) {
    var row = document.createElement('tr');
    grid.appendChild(row);
    for (let c = 0; c < cols; c++) {
      var node = document.createElement('td');
      node.innerHTML += '&nbsp';
      node.id = `node ${r == 0 ? c : c + r * cols}`;
      node.addEventListener('mousedown', (event) => nodeMouseDown(event));
      node.addEventListener('mouseenter', (event) => nodeMouseEnter(event));
      node.addEventListener('mouseup', () => nodeMouseUp());
      row.appendChild(node);
      nodeObjects.push({
        id: r == 0 ? c : c + r * cols,
        row: r,
        col: c,
        start: false,
        goal: false,
        isVisited: false,
        wall: false,
        weight: false,
      });
      if (c == 10 && r == Math.floor(rows / 2)) {
        node.className = 'start';
        startNodeObject = getNodeObject(node);
        getNodeObject(node).start = true;
      }
      if (c == cols - 10 && r == Math.floor(rows / 2)) {
        node.className = 'goal';
        goalNodeObject = getNodeObject(node);
        getNodeObject(node).goal = true;
      }
    }
  }
  document.addEventListener('keydown', (keyboardEvent) => nodeKeydown(keyboardEvent));
  // document.addEventListener('keyup', () => nodeKeyup());
}

function resetGrid() {
  if (!isRunning) {
    document.getElementById('grid').innerHTML = '';
    nodeObjects = [];
    hasVisualized = false;
    drawGrid(rows, cols);
  }
}

function clearWallsWeights() {
  if (!isRunning) {
    for (let i = 0; i < nodeObjects.length; i++) {
      getNode(nodeObjects[i]).classList.remove('wall', 'weight');
      nodeObjects[i].wall = false;
      nodeObjects[i].weight = false;
    }
    hasVisualized = false;
  }
}

function clearPath() {
  if (!isRunning) {
    for (let i = 0; i < nodeObjects.length; i++) {
      getNode(nodeObjects[i]).classList.remove(
        'shortestPath',
        'instantShortestPath',
        'visited',
        'instantVisited'
      );
      nodeObjects[i].isVisited = false;
    }
    hasVisualized = false;
  }
}

function enableDisableButtons() {
  if (isRunning) {
    document.getElementById('grid').style.pointerEvents = 'none';
    document.getElementById('run').disabled = true;
    document.getElementById('resetGrid').disabled = true;
    document.getElementById('clearWalls').disabled = true;
    document.getElementById('clearPath').disabled = true;
  } else {
    document.getElementById('grid').style.pointerEvents = 'initial';
    document.getElementById('run').disabled = false;
    document.getElementById('resetGrid').disabled = false;
    document.getElementById('clearWalls').disabled = false;
    document.getElementById('clearPath').disabled = false;
  }
}

// Mouse and key event handler functions.
// Press W to toggle between drawing walls and drawing weights. Click and drag to draw.
function nodeMouseDown(event) {
  if (event.target.classList.contains('start') || event.target.classList.contains('goal')) {
    movingStartGoal.moving = true;
    if (event.target.classList.contains('start')) {
      movingStartGoal.movingStartNode = true;
      movingStartGoal.movingGoalNode = false;
    } else {
      movingStartGoal.movingGoalNode = true;
      movingStartGoal.movingStartNode = false;
    }
  } else if (selectedWalls) {
    isDrawing = true;
    handleWalls(event.target, getNodeObject(event.target));
  } else if (selectedWeights) {
    isDrawing = true;
    handleWeights(event.target, getNodeObject(event.target));
  }
}

function nodeMouseEnter(event) {
  if (!isRunning) {
    if (movingStartGoal.moving) handleMoveStartGoal(event.target);
    else if (selectedWalls && isDrawing) handleWalls(event.target, getNodeObject(event.target));
    else if (selectedWeights && isDrawing) handleWeights(event.target, getNodeObject(event.target));
  }
}

function nodeMouseUp() {
  isDrawing = false;
  Object.keys(movingStartGoal).forEach((v) => (movingStartGoal[v] = false));
}

function nodeKeydown(keyboardEvent) {
  if (!isRunning) {
    if (keyboardEvent.keyCode == 87) {
      selectedWeights = selectedWeights ? false : true;
      selectedWalls = selectedWalls ? false : true;
    }
  }
}

function handleWalls(targetNode, targetNodeObject) {
  if (!targetNodeObject.start && !targetNodeObject.goal && isDrawing) {
    if (targetNodeObject.wall) {
      targetNodeObject.wall = false;
      targetNode.className = '';
    } else if (!targetNodeObject.wall) {
      targetNodeObject.wall = true;
      targetNode.className = 'wall';
    }

    if (hasVisualized) {
      instantVisualize(algorithm);
    }
  }
}

function handleWeights(targetNode, targetNodeObject) {
  if (!targetNodeObject.start && !targetNodeObject.goal && isDrawing) {
    if (targetNodeObject.weight) {
      targetNodeObject.weight = false;
      targetNode.className = '';
    } else if (!targetNodeObject.weight) {
      targetNodeObject.weight = true;
      targetNode.className = 'weight';
    }

    if (hasVisualized) {
      instantVisualize(algorithm);
    }
  }
}

function handleMoveStartGoal(targetNode) {
  let targetNodeObject = getNodeObject(targetNode);
  if (
    movingStartGoal.movingStartNode &&
    !targetNodeObject.wall &&
    !targetNodeObject.weight &&
    !targetNodeObject.goal
  ) {
    startNodeObject.start = false;
    getNode(startNodeObject).className = '';
    targetNode.className = 'start';
    startNodeObject = targetNodeObject;
    startNodeObject.start = true;
  } else if (
    movingStartGoal.movingGoalNode &&
    !targetNodeObject.wall &&
    !targetNodeObject.weight &&
    !targetNodeObject.start
  ) {
    goalNodeObject.goal = false;
    getNode(goalNodeObject).className = '';
    targetNode.className = 'goal';
    goalNodeObject = targetNodeObject;
    goalNodeObject.goal = true;
  }
  if (hasVisualized) {
    instantVisualize(algorithm);
  }
}

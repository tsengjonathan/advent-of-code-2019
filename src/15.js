import fs from 'fs';

import runIntcode from './utils/runIntcode';

const instructions = fs.readFileSync('data/15.txt', 'utf8').split(',').map(str => parseInt(str));

const SIZE = 50;
const opposites = {
  1: 2,
  2: 1,
  3: 4,
  4: 3
}

function getInitialCoordinates() {
  return SIZE / 2 + 1;
}

function initializeMap(size) {
  const result = [];
  for (let y = 0; y < size; y++) {
    result.push(Array(size).fill(' '));
  }
  const initialCoordinates = getInitialCoordinates();
  result[initialCoordinates][initialCoordinates] = '@'
  return result;
}

function prepareScan(movements) {
  const result = [];
  for (let direction = 1; direction <= 4; direction++) {
    const movementsCopy = movements.slice();
    movementsCopy.push(direction);
    result.push(movementsCopy);
  }
  return result;
}

function computePositionFromMovements(movements, x, y) {
  const initialCoordinates = getInitialCoordinates();
  let posX = x || initialCoordinates;
  let posY = y || initialCoordinates;

  movements.forEach(movement => {
    switch(parseInt(movement)) {
      case 1:
        posY--;
        break;
      case 2:
        posY++;
        break;
      case 3:
        posX--;
        break;
      case 4:
        posX++;
        break;
      default:
        throw Error(`Unrecognized direction ${movement}`);
    }
  });

  if (posX < 0 || posX > SIZE || posY < 0 || posY > SIZE) {
    throw Error(`Something went wrong. ${movements} yielded ${posX}, ${posY}`);
  }

  return [posX, posY];
}

function updateMapFromMovements(movements, map, status) {
  const [posX, posY] = computePositionFromMovements(movements);
  switch (status) {
    case 0:
      map[posY][posX] = '#';
      break;
    case 1:
      map[posY][posX] = '.';
      break;
    case 2:
      map[posY][posX] = '$';
      break;
    default:
      throw Error(`Unrecognized status ${status}`);
  }
}

function initializeMapStack(instructions, map) {
  const stack = [];
  const pathsToScan = prepareScan(stack);
  pathsToScan.forEach(path => {
    const program = runIntcode(instructions, path);
    const output = program.output[0];
    updateMapFromMovements(path, map, output);
    if (output === 1) {
      stack.push(path);
    }
  });
  return stack;
}

function printMap(map) {
  console.log(map.map(row => row.join('')).join('\n'));
}

function isNewPath(path) {
  if (path.length < 2) {
    return true;
  }
  const [prevDirection, currDirection] = path.slice(path.length - 2);
  return opposites[prevDirection] !== currDirection;
}

function exploreMap(instructions, map) {
  const stack = initializeMapStack(instructions, map); // push and pop, should store the complete movement
  let oxygenPath, oxygenX, oxygenY;
  while (stack.length > 0) {
    const movement = stack.pop();
    const pathsToScan = prepareScan(movement);
    pathsToScan.forEach(path => {
      const program = runIntcode(instructions, path, 0, undefined, true);
      const output = program.output.pop();
      updateMapFromMovements(path, map, output);
      if (output === 1 && isNewPath(path)) {
        stack.push(path);
      } else if (output === 2) {
        oxygenPath = path;
        [oxygenX, oxygenY] = computePositionFromMovements(path);
      }
    });
  }
  return {
    path: oxygenPath,
    x: oxygenX,
    y: oxygenY,
  };
}

const map = initializeMap(SIZE);
const oxygen = exploreMap(instructions, map);
printMap(map);
console.log(`Part 1: ${oxygen.path.length}`);

function initializeVisitedStack(instructions, visited) {
  const stack = [];
  const pathsToScan = prepareScan(stack);
  pathsToScan.forEach(path => {
    const [x, y] = computePositionFromMovements(path, oxygen.x, oxygen.y);
    const output = map[y][x];
    if (output === '.') {
      const currPath = path.join('');
      visited[currPath] = 1;
      stack.push(path);
    }
  });
  return stack;
}

function findMaximumDepthFromOxygen(instructions) {
  const visited = {};
  const stack = initializeVisitedStack(instructions, visited);
  while (stack.length > 0) {
    const movement = stack.pop();
    const pathsToScan = prepareScan(movement);
    pathsToScan.forEach(path => {
      const [x, y] = computePositionFromMovements(path, oxygen.x, oxygen.y);
      const output = map[y][x];
      if (output === '.' && isNewPath(path)) {
        const prevPath = path.slice(0, path.length - 1).join('');
        const currPath = path.join('');
        visited[currPath] = visited[prevPath] + 1;
        stack.push(path);
      }
    });
  }
  return Object.keys(visited).reduce((max, path) => Math.max(max, visited[path]), 0);
}

const maximumDepth = findMaximumDepthFromOxygen(instructions);
console.log(`Part 2: ${maximumDepth}`);

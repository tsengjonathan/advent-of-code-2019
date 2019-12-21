import fs from 'fs';
import _ from 'lodash';

import runIntcode from './utils/runIntcode';

const ascii = fs.readFileSync('data/17.txt', 'utf8').split(',').map(str => parseInt(str));
const cameraOutputs = runIntcode(ascii, [], 0, undefined, true).output;

function getViewWidth(outputs) {
  return outputs.indexOf('\n') + 1;
}

function printView(view) {
  console.log(view.map(row => row.join('')).join('\n'));
}

function constructView(outputs) {
  const mappedOutput = outputs.map(number => String.fromCharCode(number));
  const view = [[]];
  let rowIdx = 0;
  mappedOutput.forEach(character => {
    if (character === '\n') {
      view.push([]);
      rowIdx++;
    } else {
      view[rowIdx].push(character);
    }
  });
  return view;
}

function isIntersection(view, x, y) {
  if (x === 0 || x === view[0].length - 1 || y === 0 || y === view.length) {
    return false;
  }
  return view[y][x] === '#' 
      && view[y - 1][x] === '#' && view[y + 1][x] === '#'
      && view[y][x - 1] === '#' && view[y][x + 1] === '#';
}

function findIntersections(view) {
  const intersections = []
  view.forEach((row, y) => row.forEach((output, x) => {
    if (isIntersection(view, x, y)) {
      intersections.push([x, y])
    }
  }));
  return intersections.reduce((total, intersection) => total + intersection[0] * intersection[1], 0);
}

const view = constructView(cameraOutputs);
const intersectionCount = findIntersections(view);
console.log(`Part 1: ${intersectionCount}`);

function findCursor(view) {
  for (let y in view) {
    const x = view[y].indexOf('^');
    if (x > 0) {
      return { x: Number(x), y: Number(y) };
    }
  }
}

const directions = ['up', 'right', 'down', 'left'];

class VacuumRobot {
  constructor(view) {
    const cursor = findCursor(view);
    this.view = view;
    this.x = cursor.x;
    this.y = cursor.y;
    this.path = [];
    this.direction = 'up';
    this.finished = false;
  }

  rotateLeft() {
    this.path.push('L');
    this.direction = directions[(directions.indexOf(this.direction) + 3) % 4];
  }

  rotateRight() {
    this.path.push('R');
    this.direction = directions[(directions.indexOf(this.direction) + 1) % 4];
  }

  rotateRobot() {
    if (this.direction === 'up') {
      if (this.view[this.y][this.x - 1] === '#') {
        this.rotateLeft();
      } else if (this.view[this.y][this.x + 1] === '#') {
        this.rotateRight();
      } else {
        this.finished = true;
      }
    } else if (this.direction === 'down') {
      if (this.view[this.y][this.x + 1] === '#') {
        this.rotateLeft();
      } else if (this.view[this.y][this.x - 1] === '#') {
        this.rotateRight();
      } else {
        this.finished = true;
      }
    } else if (this.direction === 'left') {
      if (this.view[this.y + 1][this.x] === '#') {
        this.rotateLeft();
      } else if (this.view[this.y - 1][this.x] === '#') {
        this.rotateRight();
      } else {
        this.finished = true;
      }
    } else if (this.direction === 'right') {
      if (this.view[this.y - 1][this.x] === '#') {
        this.rotateLeft();
      } else if (this.view[this.y + 1][this.x] === '#') {
        this.rotateRight();
      } else {
        this.finished = true;
      }
    }
  }

  moveRobot() {
    let moveCount = 0;
    switch (this.direction) {
      case 'up':
        for (let i = this.y - 1; i >= 0; i--) {
          if (this.view[i][this.x] !== '#') {
            break;
          }
          moveCount++;
        }
        this.y -= moveCount;
        break;
      case 'down':
        for (let i = this.y + 1; i < this.view.length; i++) {
          if (this.view[i][this.x] !== '#') {
            break;
          }
          moveCount++;
        }
        this.y += moveCount;
        break;
      case 'left':
        for (let i = this.x - 1; i >= 0; i--) {
          if (this.view[this.y][i] !== '#') {
            break;
          }
          moveCount++;
        }
        this.x -= moveCount;
        break;
      case 'right':
        for (let i = this.x + 1; i < this.view[0].length; i++) {
          if (this.view[this.y][i] !== '#') {
            break;
          }
          moveCount++;
        }
        this.x += moveCount;
        break;
    }
    this.path.push(moveCount);
  }

  traceScaffold() {
    this.rotateRobot();
    while (!this.finished) {
      this.moveRobot();
      this.rotateRobot();
    }
    return this.path;
  }
}

const robot = new VacuumRobot(view);
// console.log(robot.traceScaffold().join(','));
// Manual grouping of instructions
const robotInstructions = 'A,B,A,C,A,B,C,B,C,B\nR,10,R,10,R,6,R,4\nR,10,R,10,L,4\nR,4,L,4,L,10,L,10\nn\n'
                          .split('').map(char => char.charCodeAt(0));;
ascii[0] = 2;
const robotResult = runIntcode(ascii, robotInstructions, 0, undefined, true).output;
const totalDust = robotResult.pop();
const robotView = constructView(robotResult);
console.log(`Part 2: ${totalDust}`);
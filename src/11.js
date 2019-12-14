import fs from 'fs';

import runIntcode from './utils/runIntcode';

const instructions = fs.readFileSync('data/11.txt', 'utf8').split(',').map(str => parseInt(str));

const directions = {
  up: ['left', 'right'],
  down: ['right', 'left'],
  left: ['down', 'up'],
  right: ['up', 'down'],
}

function paintRegistrationIdentifier(startIdx) {
  const grid = { 0: { 0: startIdx }};
  let curX = 0;
  let curY = 0;
  let currentDirection = 'up';
  let program = runIntcode(instructions, [grid[curX][curY]], 0, undefined, true);

  while (program.reason !== 99) {
    const [color, direction] = program.output;
    grid[curX][curY] = color;
    currentDirection = directions[currentDirection][direction];
    switch (currentDirection) {
      case 'up':
        curY++;
        break;
      case 'down':
        curY--;
        break;
      case 'left':
        curX--;
        break;
      case 'right':
        curX++;
        break;
      default:
        throw Error(`Invalid direction ${currentDirection}`);
    }
    grid[curX] = grid[curX] || {};
    grid[curX][curY] = grid[curX][curY] || 0;
    program = runIntcode(program.instructions, [grid[curX][curY]], program.index, undefined, true, program.base);
  }
  return grid;
}

const part1Grid = paintRegistrationIdentifier(0);
const paintCount = Object.keys(part1Grid).reduce((total, x) => total + Object.keys(part1Grid[x]).length, 0);
console.log(`Part 1: ${paintCount}`);

const part2Grid = paintRegistrationIdentifier(1);

const minX = Object.keys(part2Grid).reduce((min, x) => Math.min(min, x), Number.MAX_VALUE);
const maxX = Object.keys(part2Grid).reduce((max, x) => Math.max(max, x), 0);
const minY = Object.keys(part2Grid).reduce((min, x) => Math.min(min, Object.keys(part2Grid[x]).reduce((subMin, y) => Math.min(subMin, y), Number.MAX_VALUE)), Number.MAX_VALUE);
const maxY = Object.keys(part2Grid).reduce((max, x) => Math.max(max, Object.keys(part2Grid[x]).reduce((subMax, y) => Math.max(subMax, y), 0)), 0);

const identifierArray = [];
for (let i = 0; i < maxY - minY + 1; i++) {
  identifierArray.push(Array(maxX - minX + 1).fill('.'));
}

Object.keys(part2Grid).forEach(oldX => Object.keys(part2Grid[oldX]).forEach(oldY => {
    const val = part2Grid[oldX][oldY];
    const x = oldX - minX;
    const y = oldY - minY;
    identifierArray[y][x] = val === 0 ? '.' : '#';
  }));

const identifier = identifierArray.map(row => row.join('')).join('\n');
console.log(`Part 2: \n${identifier}`);
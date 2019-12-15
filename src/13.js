import fs from 'fs';
import _ from 'lodash';

import runIntcode from './utils/runIntcode';

const defaultInstructions = fs.readFileSync('data/13.txt', 'utf8').split(',').map(str => parseInt(str));

const tileMap = {
  0: '.',
  1: 'X',
  2: '#',
  3: '=',
  4: 'O',
}

const defaultOutputs = runIntcode(defaultInstructions, [], 0, undefined, true).output;
const blockTiles = defaultOutputs.reduce((total, output, idx) => idx % 3 === 2 && output === 2 ? total + 1 : total, 0);
console.log(`Part 1: ${blockTiles}`);

const width = defaultOutputs.reduce((max, output, idx) => idx % 3 === 0 ? Math.max(max, output) : max, 0) + 1;
const height = defaultOutputs.reduce((max, output, idx) => idx % 3 === 1 ? Math.max(max, output) : max, 0) + 1;

let score = -1;

function updateGame(game, output) {
  const outputBlocks = _.chunk(output, 3);
  outputBlocks.forEach((outputBlock) => {
    const [x, y, tileId] = outputBlock;
    if (x === -1 && y === 0) {
      score = tileId;
    } else {
      const block = tileMap[tileId];
      game[y][x] = block;
    }
  });
}

const instructions = defaultInstructions.slice();
instructions[0] = 2;
let program = runIntcode(instructions, [], 0, undefined, true);

const game = [];
for (let y = 0; y < height; y++) {
  game.push(Array(width).fill('.'));
}

while (program.reason !== 99) {
  updateGame(game, program.output);
  const ballX = game.reduce((position, row, y) => row.reduce((subPosition, cell, x) => cell === 'O' ? x : subPosition, undefined) || position, undefined);
  const paddleX = game.reduce((position, row, y) => row.reduce((subPosition, cell, x) => cell === '=' ? x : subPosition, undefined) || position, undefined);
  const joystick = ballX < paddleX ? -1 : ballX > paddleX ? 1 : 0;
  program = runIntcode(program.instructions, [joystick], program.index ,undefined, true, program.base);
  // console.log(game.map(row => row.join('')).join('\n'));
}

updateGame(game, program.output);
console.log(`Part 2: ${score}`);


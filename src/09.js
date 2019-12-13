import fs from 'fs';

import runIntcode from './utils/runIntcode';

const instructions = fs.readFileSync('data/09.txt', 'utf8').split(',').map(str => parseInt(str));

const part1 = runIntcode(instructions, [1], 0, undefined, true).output;
console.log(`Part 1: ${part1}`);

const part2 = runIntcode(instructions, [2], 0, undefined, true).output;
console.log(`Part 2: ${part2}`);
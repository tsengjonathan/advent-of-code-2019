import fs from 'fs';

import runIncodeComputer from './utils/runIncodeComputer';

const instructions = fs.readFileSync('data/05.txt', 'utf8').split(',').map(str => parseInt(str));

console.log(`Part 1: ${runIncodeComputer(instructions, [1], false)}`);
console.log(`Part 2: ${runIncodeComputer(instructions, [5], false)}`);

import fs from 'fs';

import runIntcode from './utils/runIntcode';

const instructions = fs.readFileSync('data/05.txt', 'utf8').split(',').map(str => parseInt(str));

console.log(`Part 1: ${runIntcode(instructions, [1]).output}`);
console.log(`Part 2: ${runIntcode(instructions, [5]).output}`);

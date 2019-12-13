import fs from 'fs';
import _ from 'lodash';

import runIntcode from './utils/runIntcode';

const instructions = fs.readFileSync('data/07.txt', 'utf8').split(',').map(str => parseInt(str));

function generatePermutations(input) {
  const result = [];
  function permute(arr, m = []) {
    if (arr.length === 0) {
      result.push(m);
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next));
      }
    }
  }
  permute(input);
  return result;
}

let maxThrusterSignal = 0;

const permutations = generatePermutations([0, 1, 2, 3, 4]);
permutations.forEach(permutation => {
  let signal = 0;
  permutation.forEach(phaseSetting => {
    signal = runIntcode(instructions, [phaseSetting, signal]).output;
  });
  maxThrusterSignal = Math.max(maxThrusterSignal, signal);
});

console.log(`Part 1: ${maxThrusterSignal}`);

const feedbackLoopPermutations = generatePermutations([5, 6, 7, 8, 9]);
let maxThrusterOutput = 0;

feedbackLoopPermutations.forEach(permutation => {
  let thrusterOutput = 0;
  const ampIndexes = [0, 0, 0, 0, 0];
  let ampIdx = 0;
  const settings = permutation.map((phaseSetting, idx) => idx === 0 ? [phaseSetting, 0] : [phaseSetting]);
  const ampInstructions = _.fill(Array(5), instructions);
  while (true) {
    const program = runIntcode(ampInstructions[ampIdx], settings[ampIdx], ampIndexes[ampIdx]);
    const nextIdx = (ampIdx + 1) % 5;
    
    ampIndexes[ampIdx] = program.index;
    settings[nextIdx].push(program.output);
    ampInstructions[ampIdx] = program.instructions;
    if (ampIdx === 4) {
      thrusterOutput = Math.max(thrusterOutput, program.output || 0);
      if (program.reason === 99) {
        break;
      }
    }
    ampIdx = nextIdx;
  };
  maxThrusterOutput = Math.max(maxThrusterOutput, thrusterOutput);
})

console.log(`Part 2: ${maxThrusterOutput}`);
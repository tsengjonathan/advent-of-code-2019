import fs from 'fs';

const instructions = fs.readFileSync('data/05.txt', 'utf8').split(',').map(str => parseInt(str));

const jumpIndexes = [0, 4, 4, 2, 2, 3, 3, 4, 4];

function runIncodeComputer(instArgs, inputs, shouldPrint) {
  const instructions = instArgs.slice();
  let idx = 0;
  let finalVal = undefined;

  while (idx < instructions.length) {
    const instruction = instructions[idx].toString().padStart(5, '0');
    const opcode = parseInt(instruction.substring(instruction.length - 2));
    const [modeB, modeA] = instruction.substring(1, 3).split('').map(str => parseInt(str));
    const [argA, argB, argC] = instructions.slice(idx + 1, idx + 4);
    const numA = modeA === 0 ? instructions[argA] : argA;
    const numB = modeB === 0 ? instructions[argB] : argB;

    if (opcode === 1) {
      instructions[argC] = numA + numB;
    } else if (opcode === 2) {
      instructions[argC] = numA * numB;
    } else if (opcode === 3) {
      instructions[argA] = inputs.shift();
    } else if (opcode === 4) {
      finalVal = numA;
      if (shouldPrint) {
        console.log(numA);
      }
    } else if (opcode === 5) {
      if (numA !== 0) {
        idx = numB;
        continue;
      }
    } else if (opcode === 6) {
      if (numA === 0) {
        idx = numB;
        continue
      }
    } else if (opcode === 7) {
      instructions[argC] = numA < numB ? 1 : 0;
    } else if (opcode === 8) {
      instructions[argC] = numA === numB ? 1 : 0;
    } else if (opcode === 99) {
      break;
    } else {
      throw new Error(`Unrecognized opcode ${opcode}`);
    }

    idx += jumpIndexes[opcode];
  }

  return finalVal;
}

console.log(`Part 1: ${runIncodeComputer(instructions, [1], false)}`);
console.log(`Part 2: ${runIncodeComputer(instructions, [5], false)}`);

export default runIncodeComputer;

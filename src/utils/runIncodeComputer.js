const jumpIndexes = [0, 4, 4, 2, 2, 3, 3, 4, 4];

function runIncodeComputer(instArgs, inputs, idx = 0, finalVal = undefined, shouldPrint = false) {
  const instructions = instArgs.slice();

  while (idx < instructions.length) {
    const instruction = instructions[idx].toString().padStart(5, '0');
    const opcode = parseInt(instruction.substring(instruction.length - 2));
    const [modeB, modeA] = instruction.substring(1, 3).split('').map(str => parseInt(str));
    const [argA, argB, argC] = instructions.slice(idx + 1, idx + 4);
    const numA = modeA === 0 ? instructions[argA] : argA;
    const numB = modeB === 0 ? instructions[argB] : argB;

    if (instructions.includes(NaN)) {
      throw new Error(`NaN at index ${instructions.indexOf(NaN)}`);
    } else if (instructions.includes(undefined)) {
      throw new Error(`undefined at index ${instructions.indexOf(undefined)}`);
    }

    if (opcode === 1) {
      instructions[argC] = numA + numB;
    } else if (opcode === 2) {
      instructions[argC] = numA * numB;
    } else if (opcode === 3) {
      if (inputs.length === 0) {
        return {
          output: finalVal,
          reason: opcode,
          index: idx, 
          instructions: instructions,
        }
      }
      instructions[argA] = inputs.shift();
    } else if (opcode === 4) {
      if (shouldPrint) {
        console.log(numA);
      }
      finalVal = numA;

      if (finalVal !== 0) {
        return {
          output: finalVal,
          reason: opcode,
          index: idx + jumpIndexes[opcode],
          instructions: instructions,
        };
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
      throw new Error(`Unrecognized opcode ${opcode} at index ${idx}`);
    }
    idx += jumpIndexes[opcode];
  }

  return {
    output: finalVal,
    reason: 99,
    index: idx,
    instructions: instructions,
  };
}

export default runIncodeComputer;
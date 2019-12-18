const jumpIndexes = [0, 4, 4, 2, 2, 3, 3, 4, 4, 2];

function runIntcode(instArgs, inputArgs, idx = 0, finalVal = undefined, overrideReturn = false, base = 0) {
  const instructions = instArgs.slice();
  const inputs = inputArgs.slice();
  const outputs = [];
  let relativeBase = base;

  function getNumberFromMode(mode, arg) {
    let pos = -1;
    if (mode === 0) {
      pos = arg;
    } else if (mode === 1) {
      return arg;
    } else if (mode === 2) {
      pos = relativeBase + arg;
    }

    if (pos > instructions.length || instructions[pos] === undefined) {
      instructions[pos] = 0;
    }

    return instructions[pos];
  }

  const instructionsCount = instructions.length;

  while (idx < instructionsCount) {
    const instruction = instructions[idx].toString().padStart(5, '0');
    const opcode = parseInt(instruction.substring(instruction.length - 2));
    const [modeC, modeB, modeA] = instruction.substring(0, 3).split('').map(str => parseInt(str));
    const [argA, argB, argC] = instructions.slice(idx + 1, idx + 4);
    const numA = getNumberFromMode(modeA, argA);
    const numB = getNumberFromMode(modeB, argB);
    const posA = modeA === 0 ? argA : relativeBase + argA;
    const posB = modeB === 0 ? argB : relativeBase + argB;
    const posC = modeC === 0 ? argC : relativeBase + argC;

    if (instructions.includes(NaN)) {
      throw new Error(`NaN at index ${instructions.indexOf(NaN)}`);
    } 

    if (opcode === 1) {
      instructions[posC] = numA + numB;
    } else if (opcode === 2) {
      instructions[posC] = numA * numB;
    } else if (opcode === 3) {
      if (inputs.length === 0) {
        return {
          output: outputs,
          reason: opcode,
          index: idx, 
          instructions: instructions,
          base: relativeBase,
        }
      }
      const val = inputs.shift();
      instructions[posA] = val;
    } else if (opcode === 4) {
      finalVal = numA;
      outputs.push(numA);
      if (finalVal !== 0 && !overrideReturn) {
        return {
          output: outputs,
          reason: opcode,
          index: idx + jumpIndexes[opcode],
          instructions: instructions,
          base: relativeBase,
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
        continue;
      }
    } else if (opcode === 7) {
      instructions[posC] = numA < numB ? 1 : 0;
    } else if (opcode === 8) {
      instructions[posC] = numA === numB ? 1 : 0;
    } else if (opcode === 9) {
      relativeBase += numA;
    } else if (opcode === 99) {
      break;
    } else {
      throw new Error(`Unrecognized opcode ${opcode} at index ${idx}`);
    }
    idx += jumpIndexes[opcode];
  }

  return {
    output: outputs,
    reason: 99,
    index: idx,
    instructions: instructions,
    base: relativeBase,
  };
}

export default runIntcode;
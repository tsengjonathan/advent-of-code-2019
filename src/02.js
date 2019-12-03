import fs from 'fs';

function runProgram(noun, verb) {
  const numbers = fs.readFileSync('data/02.txt', 'utf8').split(',').map((number) => parseInt(number));
  numbers[1] = noun;
  numbers[2] = verb;

  let index = 0;
  while (index < numbers.length) {
    const opcode = numbers[index];

    switch (opcode) {
      case 1:
        const add1 = numbers[numbers[index + 1]];
        const add2 = numbers[numbers[index + 2]];
        numbers[numbers[index + 3]] = add1 + add2;
        index += 4;
        break;
      case 2:
        const mult1 = numbers[numbers[index + 1]];
        const mult2 = numbers[numbers[index + 2]];
        numbers[numbers[index + 3]] = mult1 * mult2;
        index += 4;
        break;
      case 99:
        index = numbers.length;
        break;
      default:
        console.error('Unrecognized opcode');
        break;
    }
  }
  return numbers[0];
}

console.log(`Part 1: ${runProgram(12, 2)}`);

function findProgram(target) {
  let noun = 0;
  let verb = 0;

  while (noun < 100) {
    while (verb < 100) {
      if (runProgram(noun, verb) === target) {
        return 100 * noun + verb;
      }
      verb += 1;
    }
    noun += 1;
    verb = 0;
  }
  throw new Error('Cannot find noun/verb for given target');
}

console.log(`Part 2: ${findProgram(19690720)}`);

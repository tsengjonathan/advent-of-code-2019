import fs from 'fs';
import _ from 'lodash';

const puzzleInput = fs.readFileSync('data/14.txt', 'utf8').split('\n');

/*
 * {
 *  FUEL: {
 *    amount: 1,
 *    requires: {
 *      AB: 2,
 *      BC: 3,
 *      CA: 4,
 *    }
 *  }
 * }
 */

function parseItem(itemString) {
  const [amountStr, name] = itemString.split(' ');
  const amount = parseInt(amountStr);
  return [amount, name];
}

function parseInput(input) {
  const result = {};
  const inputStrings = input.split(', ');
  inputStrings.forEach(inputString => {
    const [amount, name] = parseItem(inputString);
    result[name] = amount;
  });
  return result;
}

function parseReactions(reactionStrings) {
  const reactions = {}
  reactionStrings.forEach(reaction => {
    const [rawInput, rawOutput] = reaction.split(' => ');
    const input = parseInput(rawInput);
    const [outputAmount, outputName] = parseItem(rawOutput);
    reactions[outputName] = {
      amount: outputAmount,
      requires: input,
    }
  });
  return reactions;
}

function getOres(name, requestedAmount, reactions, leftovers) {
  const amount = requestedAmount - (leftovers[name] || 0);
  const { amount: provides, requires } = reactions[name];
  const multiple = Math.ceil(amount / provides);
  const remaining = (provides * multiple) - amount;
  leftovers[name] = remaining;

  return Object.keys(requires).reduce((totalOres, requireName) => {
    const requireCount = requires[requireName] * multiple;
    if (requireName === 'ORE') {
      return totalOres + requireCount;
    } else {
      return totalOres + getOres(requireName, requireCount, reactions, leftovers);
    }
  }, 0);
}

const reactions = parseReactions(puzzleInput);
const leftovers = {};
let totalOres = 0;
let totalFuel = 0;
totalOres += getOres('FUEL', 1, reactions, leftovers);
totalFuel++;
console.log(`Part 1: ${totalOres}`);

while (totalOres < 1000000000000) {
  totalOres += getOres('FUEL', 1, reactions, leftovers);
  totalFuel++;
}

totalFuel--;
console.log(`Part 2: ${totalFuel}`);
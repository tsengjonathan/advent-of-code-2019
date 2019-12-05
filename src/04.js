import fs from 'fs';

const [low, high] = fs.readFileSync('data/04.txt', 'utf8').split('-').map(str => parseInt(str));

function hasTwoAdjDigits(digits) {
  for (let idx = 0; idx < digits.length - 1; idx++) {
    if (digits[idx] === digits[idx + 1]) {
      return true;
    }
  }
  return false;
}

function digitsNeverDecrease(digits) {
  for (let idx = 0; idx < digits.length - 1; idx++) {
    if (digits[idx] > digits[idx + 1]) {
      return false;
    }
  }
  return true;
}

function countDigits(digits, digit) {
  return digits.reduce((prev, curr) => curr === digit ? prev + 1 : prev, 0);
}

function hasTwoAdjDigitPairs(digits) {
  for (let idx = 0; idx < digits.length - 1; idx++) {
    const digit = digits[idx];
    if (countDigits(digits, digit) === 2) {
      return true;
    }
  }
  return false;
}

let part1 = 0;
for (let number = low; number <= high; number++) {
  const digits = number.toString().split('').map(digit => parseInt(digit));
  if (digitsNeverDecrease(digits) && hasTwoAdjDigits(digits)) {
    part1++;
  }
}

console.log(`Part 1: ${part1}`);

let part2 = 0;
for (let number = low; number <= high; number++) {
  const digits = number.toString().split('').map(digit => parseInt(digit));
  if (digitsNeverDecrease(digits) && hasTwoAdjDigitPairs(digits)) {
    part2++;
  }
}

console.log(`Part 2: ${part2}`);

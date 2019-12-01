import fs from 'fs';

const numbers = fs.readFileSync('data/01.txt', 'utf8').split('\n');

const calculateFuel = (mass) => Math.floor(mass / 3) - 2;

const total1 = numbers.reduce((total, number) => total += calculateFuel(number), 0);
console.log(`Part 1: ${total1}`);

let total2 = 0;
numbers.forEach((number) => {
  let remainingTotal = number;
  while (remainingTotal > 0) {
    const amount = calculateFuel(remainingTotal);
    if (amount > 0) {
      total2 += amount;
      remainingTotal = amount;
    } else {
      break;
    }
  }
});
console.log(`Part 2: ${total2}`);
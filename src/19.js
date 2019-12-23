import fs from 'fs';

import runIntcode from './utils/runIntcode';

const program = fs.readFileSync('data/19.txt', 'utf8').split(',').map(string => parseInt(string));

function printReadings(readings) {
  console.log(readings.map(row => row.join('')).join('\n'));
}

function countPoints(program) {
  let totalPoints = 0;
  for (let y = 0; y < 50; y++) {
    for (let x = 0; x < 50; x++) {
      totalPoints += runIntcode(program, [x, y], 0, undefined, true).output[0];
    }
  }
  return totalPoints;
}

function findStartingPoint(readings) {
  if (readings.length === 0) {
    return 0;
  }
  const prevRow = readings[readings.length - 1] || [];
  const startIdx = prevRow.indexOf('#');
  return startIdx < 0 ? 0 : startIdx;
}

function addRow(readings) {
  const y = readings.length;
  const row = [];
  const startIdx = findStartingPoint(readings);
  let x = startIdx;
  let count = 0;
  while (true) {
    const result = runIntcode(program, [x, y], 0, undefined, true).output[0];
    if ((row[x - 1] || '.') === '#' && result === 0) {
      break;
    }
    count += result;
    row[x] = result === 0 ? '.' : '#';
    x++;
  }
  readings.push(row);
  return { count: count, start: startIdx };
}

function plotReadings(program) {
  const readings = Array(5);
  let prevCount = 0;
  while (true) {
    const { count, start } = addRow(readings);
    if (count >= 100 && readings[readings.length - 100][start + 100] === '#') {
      return start * 10000 + (readings.length - 1);
    }
    prevCount = count;
  }
}

console.log(`Part 1: ${countPoints(program)}`);
console.log(`Part 2: ${plotReadings(program)}`);

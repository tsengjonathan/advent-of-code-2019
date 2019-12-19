import fs from 'fs';
import _ from 'lodash';

const signal = fs.readFileSync('data/16.txt', 'utf8').split('').map(str => parseInt(str));

const basePattern = [0, 1, 0, -1];

function getPattern(size, index) {
  const fullPattern = _.times(size + 1, (patternIndex) => {
    const repetitionCount = Math.floor(patternIndex / (index + 1));
    const basePatternIndex = repetitionCount % basePattern.length;
    return basePattern[basePatternIndex];
  });
  return fullPattern.slice(1);
}

function keepOneDigit(number) {
  return Math.abs(number % 10);
}

function calculateDigit(signal, pattern) {
  const sum = signal.reduce((total, digit, index) => total + digit * pattern[index], 0);
  return keepOneDigit(sum);
}

function runPhase(signal, allPatterns) {
  return signal.map((digit, index) => calculateDigit(signal, getPattern(signal.length, index), index));
}

function runFFT(signal, phases) {
  let output = signal;
  for (let phase = 0; phase < phases; phase++) {
    output = runPhase(output);
  }
  return output;
}

function runDynamicPhase(signal, phases) {
  for (let phase = 0; phase < phases; phase++) {
    for (let index = signal.length - 1; index >= 0; index--) {
      signal[index] = keepOneDigit((signal[index + 1] || 0) + signal[index]);
    }
  }
  return signal;
}

const finalOutput = runFFT(signal, 100);
const part1 = finalOutput.slice(0, 8).join('');
console.log(`Part 1: ${part1}`);

const offset = parseInt(signal.slice(0, 7).join(''));
const realSignal = _.flatten(_.times(10000, () => signal)).slice(offset);
const realOutput = runDynamicPhase(realSignal, 100);
const embeddedMessage = parseInt(realOutput.slice(0, 8).join(''));
console.log(`Part 2: ${embeddedMessage}`)


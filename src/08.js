import fs from 'fs';
import _ from 'lodash';

const digits = fs.readFileSync('data/08.txt', 'utf8').split('');
const WIDTH = 25;
const HEIGHT = 6;

function countReducer(total, digit, value) {
  const typesafeCheck = [value.toString(), parseInt(value)]
  return typesafeCheck.includes(digit) ? total + 1 : total;
}

const layers = _.chunk(digits, WIDTH * HEIGHT);
const zeroCounts = layers.map(layer => layer.reduce((total, digit) => countReducer(total, digit, 0), 0));
const minZeros = zeroCounts.reduce((min, current) => Math.min(min, current));
const minZeroLayer = layers[zeroCounts.indexOf(minZeros)]

const countOnes = minZeroLayer.reduce((total, digit) => countReducer(total, digit, 1), 0);
const countTwos = minZeroLayer.reduce((total, digit) => countReducer(total, digit, 2), 0);

const pixelLayers = layers[0].map((pixel, idx) => layers.map(layer => layer[idx]));

const flattenedImage = pixelLayers.map(pixels => pixels.reduce((prev, curr) => prev === '2' ? curr : prev));
const image = _.chunk(flattenedImage.map(pixel => pixel === '1' ? 'X' : ' '), WIDTH).map(row => row.join('')).join('\n');

console.log(`Part 2: \n${image}`);

import fs from 'fs';
import _ from 'lodash';

const map = fs.readFileSync('data/10.txt', 'utf8').split('\n').map(row => row.split(''));

const EMPTY = '.';
const ASTEROID = '#';

function countAsteroidsInSight(aX, aY) {
  const angles = [];
  let up, down, left, right;
  up, down, left, right = false;
  
  map.forEach((row, bY) => row.forEach((position, bX) => {
    if (position === ASTEROID && !(aX === bX && aY === bY)) {
      const angle = Math.atan2(bY - aY, bX - aX) * (180 / Math.PI);
      if (aX === bX || aY === bY) {
        up = up || aX === bX && aY < bY;
        down = down || aX === bX && aY > bY;
        left = left || aX > bX && aY === bY;
        right = right || aX < bX && aY === bY;
      } else if (!angles.includes(angle)) {
        angles.push(angle);
      }
    }
  }));
  const countRowColumns = [up, down, left, right].reduce((total, curr) => curr ? total + 1 : total, 0);
  return angles.length + countRowColumns;
}

const countMap = map.slice().map((row, y) => row.map((position, x) => {
  return position === ASTEROID ? countAsteroidsInSight(x, y) : 0;
}));

const maxAsteroidCount = countMap.reduce((max, row) => {
  return Math.max(max, row.reduce((subMax, asteroidCount) => {
    return Math.max(subMax, asteroidCount);
  }, 0));
}, 0);

let bestX, bestY;
countMap.forEach((row, y) => row.forEach((position, x) => {
  if (position === maxAsteroidCount) {
    bestX = x;
    bestY = y;
  }
}));

function distanceFromBase(asteroid, base) {
  return Math.sqrt(Math.pow(asteroid[0] - base[0], 2) + Math.pow(asteroid[1]- base[1], 2));
}

function mapAsteroidsToDegrees(x, y) {
  const degreeMap = {
    up: [],
    down: [],
    left: [],
    right: [],
  };

  map.forEach((row, targetY) => row.forEach((target, targetX) => {
    if (target === ASTEROID && !(x === targetX && y === targetY)) {
      const rawAngle = Math.atan2(targetY - y, targetX - x) * (180 / Math.PI);
      const angle = rawAngle;

      if (x === targetX || y === targetY) {
        if (x === targetX && y > targetY){
          degreeMap.up.push([targetX, targetY]);
        } else if (x === targetX && y < targetY) {
          degreeMap.down.push([targetX, targetY]);
        } else if (x > targetX && y === targetY) {
          degreeMap.left.push([targetX, targetY]);
        } else if (x < targetX && y === targetY) {
          degreeMap.right.push([targetX, targetY]);
        }
      } else {
        if (angle in degreeMap) {
          degreeMap[angle].push([targetX, targetY]);
        } else {
          degreeMap[angle] = [[targetX, targetY]];
        }
      }
    }
  }));
  for (let degree in degreeMap) {
    degreeMap[degree].sort((a, b) => distanceFromBase(a, [x, y]) - distanceFromBase(b, [x, y]));
  }
  return degreeMap;
}

function orderDegrees(degrees) {
  const quadrants = [];
  quadrants[0] = degrees.filter(degree => degree > -90 && degree < 0)
  quadrants[1] = degrees.filter(degree => degree > 0 && degree < 90)
  quadrants[2] = degrees.filter(degree => degree > 90 && degree < 180)
  quadrants[3] = degrees.filter(degree => degree > -180 && degree < -90);
  return ['up'].concat(quadrants[0])
    .concat(['right']).concat(quadrants[1])
    .concat(['down']).concat(quadrants[2])
    .concat(['left']).concat(quadrants[3]);
}

function vaporizeAsteroidsOrder(x, y) {
  const degreeMap = mapAsteroidsToDegrees(x, y);
  const degrees = Object.keys(degreeMap)
    .map(str => parseFloat(str))
    .filter(float => !_.isNaN(float))
    .sort((a, b) => a - b);
  const orderedDegrees = orderDegrees(degrees);
  const groupedCoordinates = orderedDegrees.map(degree => degreeMap[degree]);
  const asteroidCount = groupedCoordinates.reduce((total, group) => total + group.length, 0);
  const orderedCoordinates = [];
  let idx = 0;
  let groupIdx = 0;
  while (orderedCoordinates.length < asteroidCount) {
    if (idx === groupedCoordinates.length) {
      idx = 0;
      groupIdx++;
    } else if (groupedCoordinates[idx].length === groupIdx) {
      groupIdx++;
    } else {
      orderedCoordinates.push(groupedCoordinates[idx][groupIdx]);
      idx++;
    }
  }
  return orderedCoordinates;
}

const asteroid200 = vaporizeAsteroidsOrder(bestX, bestY)[199];

console.log(`Part 1: ${maxAsteroidCount}`);
console.log(`Part 2: ${asteroid200[0] * 100 + asteroid200[1]}`);
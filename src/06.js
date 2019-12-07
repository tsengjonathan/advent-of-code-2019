import fs from 'fs';

const orbitals = fs.readFileSync('data/06.txt', 'utf8').split('\n');
const inner = orbitals.map(orbital => orbital.split(')')[0]);
const outer = orbitals.map(orbital => orbital.split(')')[1]);
const orbits = {};

function getOuters(object) {
  const parents = [];
  inner.forEach((innerObject, idx) => {
    if (innerObject === object) {
      parents.push(outer[idx]);
    }
  });
  return parents;
}

function getInners(object) {
  const children = [];
  outer.forEach((outerObject, idx) => {
    if (outerObject === object) {
      children.push(inner[idx]);
    }
  });
  return children;
}

const orbitStack = [];

outer.filter(object => !inner.includes(object)).forEach(leaf => {
  orbits[leaf] = 0;
  getInners(leaf).forEach(innerObj => orbitStack.push(innerObj));
});

while (orbitStack.length > 0) {
  const object = orbitStack.pop();
  const inners = getInners(object);
  inners.forEach(innerObj => {
    orbitStack.push(innerObj);
  });

  const outers = getOuters(object);
  let orbitCount = 0;
  outers.forEach(outerObj => {
    orbitCount += orbits[outerObj];
  });
  orbits[object] = orbitCount + outers.length;
}

const totalOrbits = Object.values(orbits).reduce((total, count) => total + count);
console.log(`Part 1: ${totalOrbits}`);

const SANTA = 'SAN';
const YOU = 'YOU';

function initializeDistFromSanta() {
  const uniqObjects = inner.concat(outer).filter((value, index, self) => self.indexOf(value) === index);
  const distFromSanta = {};
  uniqObjects.forEach(obj => distFromSanta[obj] = Number.MAX_VALUE);
  return distFromSanta;
}

const distFromSanta = initializeDistFromSanta();
distFromSanta[SANTA] = 0;

const santaStack = [SANTA];
const visited = [];

while (santaStack.length > 0) {
  const object = santaStack.pop();
  visited.push(object);

  // add all unvisited peers to the stack
  const peers = getInners(object).concat(getOuters(object));
  const unvisitedPeers = peers.filter(peer => !visited.includes(peer));
  unvisitedPeers.forEach(innerObj => {
    santaStack.push(innerObj);
  });

  // find the peers' shortest distance to santa
  const shortestPeerDist = peers
    .map(peer => distFromSanta[peer])
    .reduce((prevVal, curVal) => Math.min(prevVal, curVal), Number.MAX_VALUE);

  // find whether peers' distance is better than what we have
  distFromSanta[object] = Math.min(distFromSanta[object], shortestPeerDist + 1);
}

// XXX)SAN and YYY)YOU doesn't count as 1
const shortestDistance = distFromSanta[YOU] - 2;

console.log(`Part 2: ${shortestDistance}`);
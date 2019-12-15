import fs from 'fs';

function compareValues(a, b) {
  return a < b ? 1 : a > b ? -1 : 0;
}

function stepMoons(moons) {
  moons[0].updateVelocityFromMoons([moons[1], moons[2], moons[3]]);
  moons[1].updateVelocityFromMoons([moons[0], moons[2], moons[3]]);
  moons[2].updateVelocityFromMoons([moons[0], moons[1], moons[3]]);
  moons[3].updateVelocityFromMoons([moons[0], moons[1], moons[2]]);
  moons.forEach(moon => moon.updatePositionFromVelocity()); 
}

class Moon {
  constructor(coordinates) {
    this.position = {
      x: coordinates[0],
      y: coordinates[1],
      z: coordinates[2],
    }
    this.velocity = {
      x: 0,
      y: 0,
      z: 0,
    }
  }

  updateVelocityFromMoon(moon) {
    const original = this.position;
    const other = moon.position;
    
    this.velocity.x += compareValues(original.x, other.x);
    this.velocity.y += compareValues(original.y, other.y);
    this.velocity.z += compareValues(original.z, other.z);
  }

  updateVelocityFromMoons(moons) {
    moons.forEach(moon => this.updateVelocityFromMoon(moon));
  }

  updatePositionFromVelocity() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.position.z += this.velocity.z;
  }

  totalEnergy() {
    const potential = Object.values(this.position).reduce((total, pos) => total + Math.abs(pos), 0);
    const kinetic = Object.values(this.velocity).reduce((total, pos) => total + Math.abs(pos), 0);
    return potential * kinetic;
  }

  clone() {
    const { x, y, z } = this.position;
    return new Moon([x, y, z]);
  }
}

const coordinates = fs.readFileSync('data/12.txt', 'utf8')
  .split('\n')
  .map(str => str.substring(1, str.length - 1))
  .map(str => str.split(', ').map(coord => parseInt(coord.substring(2))));

const originalMoons = coordinates.map(coordinate => new Moon(coordinate));

const moons = originalMoons.map(moon => moon.clone());
for (let step = 0; step < 1000; step++) {
  stepMoons(moons);
}

const totalEnergy = moons.reduce((total, moon) => total + moon.totalEnergy(), 0);
console.log(`Part 1: ${totalEnergy}`);

function gcd(a, b) {
  if (!b) {
    return a;
  }
  return gcd(b, a % b);
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

let loopX, loopY, loopZ;
loopX = loopY = loopZ = undefined;

const loopMoons = originalMoons.map(moon => moon.clone())
stepMoons(loopMoons);

let step = 2;
while (!loopX || !loopY || !loopZ) {
  stepMoons(loopMoons);
  step++;

  if (!loopX && loopMoons.every((moon, idx) => moon.position.x === originalMoons[idx].position.x)) {
    loopX = step;
  }

  if (!loopY && loopMoons.every((moon, idx) => moon.position.y === originalMoons[idx].position.y)) {
    loopY = step;
  }

  if (!loopZ && loopMoons.every((moon, idx) => moon.position.z === originalMoons[idx].position.z)) {
    loopZ = step;
  }
}

const commonMultiple = lcm(lcm(loopX, loopY), loopZ);
console.log(`Part 2: ${commonMultiple}`);

import fs from 'fs';
import _ from 'lodash';

const instructions = fs.readFileSync('data/03.txt', 'utf8').split('\n').map(instruction => instruction.split(','));

function coordComparator(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}

class Wire {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.visited = [];
    this.uniqueVisited = [];
  }

  parseInstructions(instructions) {
    instructions.forEach(instruction => {
      const direction = instruction.charAt(0);
      const value = parseInt(instruction.substring(1));

      for (let i = 0; i < value; i++) {
        switch (direction) {
          case 'U':
            this.y++;
            break;
          case 'D':
            this.y--;
            break;
          case 'L':
            this.x--;
            break;
          case 'R':
            this.x++;
            break;
          default:
            throw new Error('Unrecognized direction');
        }
        this.visited.push([this.x, this.y]);
      }
    });
    this.uniqueVisited = _.uniqWith(this.visited, coordComparator);
    return this;
  }
}

const wireA = new Wire().parseInstructions(instructions[0]);
const wireB = new Wire().parseInstructions(instructions[1]);

const intersections = _.intersectionWith(wireA.uniqueVisited, wireB.uniqueVisited, coordComparator);
const manhattanDistances = intersections.map(intersection => Math.abs(intersection[0]) + Math.abs(intersection[1]));

console.log(`Part 1: ${manhattanDistances.sort((a, b) => a - b)[0]}`);

const firstIntersection = intersections[0];

function totalStepsToIntersection(intersection, wireA, wireB) {
  let steps = 0;
  for (let coord of wireA.visited) {
    if (coordComparator(coord, intersection)) {
      steps++;
      break;
    }
    steps++;
  }

  for (let coord of wireB.visited) {
    if (coordComparator(coord, intersection)) {
      steps++;
      break;
    }
    steps++;
  }
  return steps;
}

const stepsToIntersections = intersections.map(intersection => totalStepsToIntersection(intersection, wireA, wireB));

console.log(`Part 2: ${stepsToIntersections.sort((a, b) => a - b)[0]}`);
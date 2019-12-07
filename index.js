import cp from 'child_process';
import fs from 'fs';

const args = process.argv.slice(2);

if (args.length > 0) {
  cp.fork(args[0]);
} else {
  const files = fs.readdirSync('src/').filter(file => file.endsWith('.js'));
  cp.fork(`src/${files.sort().pop()}`);
}
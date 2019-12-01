const cp = require('child_process');
const fs = require('fs');

const args = process.argv.slice(2);

if (args.length > 0) {
  cp.fork(args[0]);
} else {
  fs.readdir('src/', (err, files) => {
    cp.fork(`src/${files.sort().pop()}`);
  });
}
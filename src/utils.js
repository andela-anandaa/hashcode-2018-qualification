const fs = require('fs');
const readline = require('readline');

/**
 * Reading of input files
 * and transforming them
 */

// leaving it as readWrite for the time being
async function readWriteLine(inFile, cb) {
  const rl = readline.createInterface({
    input: fs.createReadStream(inFile),
    // output: fs.createWriteStream(inFile.replace('.in', '.out')),
    // crlfDelay: Infinity,
  });

  rl.on('line', (line) => {
    cb(line, rl);
  });
}

module.exports = {
  readWriteLine,
};

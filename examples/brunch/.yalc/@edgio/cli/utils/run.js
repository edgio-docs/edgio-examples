"use strict";

const {
  spawn
} = require('cross-spawn');
/**
 * Runs a command and streams the output to the console.  Takes the same arguments as child_process.spawn.
 * @param {...any} args
 * @return {Promise}
 */


module.exports = function run(...args) {
  return new Promise((resolve, reject) => {
    process.env.FORCE_COLOR = 'true'; // so that chalk output is preserved in child processes

    const cmd = spawn(...args);
    const stdioOption = args.find(item => item.stdio);
    const output = []; // If stdio is inherit, there is no stderr/stdout, it will stream the output as it is directly
    // to terminal, with all the colors and icons

    if (!stdioOption || stdioOption.stdio !== 'inherit') {
      cmd.stdout && cmd.stdout.on('data', data => output.push(data));
      cmd.stdout && cmd.stderr.on('data', data => output.push(data));
    }

    cmd.on('exit', code => {
      if (code === 0) {
        resolve(output.map(o => Buffer.from(o).toString('utf-8')));
      } else {
        reject(new Error('Process exited with code ' + code + '.\n' + output.join('\n')));
      }
    });
    cmd.on('error', e => reject(e));
  });
};
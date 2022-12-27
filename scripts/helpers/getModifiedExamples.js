const { execSync } = require('child_process');
const { join } = require('path');
const examplesPath = 'examples';
const examples = require('./getExamples')();

// Get the list of modified files
const modifiedFiles = execSync(
  'git diff --name-only main | xargs -I {} dirname {} | sort | uniq'
)
  .toString()
  .split('\n');

// Filter the array of paths to return only the modified paths
const modifiedPaths = examples.filter((path) =>
  modifiedFiles.includes(join(examplesPath, path))
);

module.exports = modifiedPaths;

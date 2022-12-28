const { execSync } = require('child_process');
const { join } = require('path');
const examplesPath = 'examples';
const examples = require('./getExamples')();

module.exports = () => {
  // Get the list of modified files
  const modifiedFiles = execSync(
    'git diff --name-only origin/main | xargs -I {} dirname {} | sort | uniq'
  )
    .toString()
    .split('\n');

  // Filter the array of paths to return only the modified paths
  return examples.filter((path) =>
    modifiedFiles.includes(join(examplesPath, path))
  );
};

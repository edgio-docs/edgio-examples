const { execSync } = require('child_process');
const { join } = require('path');
const examplesPath = 'examples';
const examples = require('./getExamples')();

module.exports = () => {
  // Check if the current branch is `main`
  const isMainBranch =
    execSync('git rev-parse --abbrev-ref HEAD').toString().trim() === 'main';

  // Determine if we should deploy all examples regardless of changes
  const deployAll = process.env.DEPLOY_ALL === 'true';

  // Get the list of modified files
  const modifiedFiles = (
    isMainBranch
      ? // If the current branch is `main`, get the list of modified files from the last commit
        execSync(
          'git diff --name-only HEAD~1 | xargs -I {} dirname {} | sort | uniq'
        )
      : execSync(
          'git diff --name-only origin/main | xargs -I {} dirname {} | sort | uniq'
        )
  )
    .toString()
    .split('\n')
    .filter(Boolean);

  // Filter the array of paths to return only the modified paths
  return examples.filter(
    (path) =>
      deployAll ||
      modifiedFiles.some((file) => file.includes(join(examplesPath, path)))
  );
};

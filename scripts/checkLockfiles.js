const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const examplesDir = 'examples';

// Get a list of subdirectories in the examples directory
const subdirs = fs.readdirSync(examplesDir).filter((file) => {
  return fs.statSync(path.join(examplesDir, file)).isDirectory();
});

// Iterate over the subdirectories
subdirs.forEach((subdir) => {
  const packageLockPath = path.join(examplesDir, subdir, 'package-lock.json');
  const yarnLockPath = path.join(examplesDir, subdir, 'yarn.lock');
  // Check if the package-lock.json file exists
  if (fs.existsSync(packageLockPath) && fs.existsSync(yarnLockPath)) {
    console.log(`Duplicate lockfile found in ${subdir}`);
  }
});

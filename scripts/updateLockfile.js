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
  // Construct the full path to the package-lock.json file
  const packageLockPath = path.join(examplesDir, subdir, 'package-lock.json');
  // Check if the package-lock.json file exists
  if (fs.existsSync(packageLockPath)) {
    console.log(`Updating ${subdir}`);
    // Remove the node_modules directory
    execSync(`rm -rf ${path.join(examplesDir, subdir, 'node_modules')}`);
    // Generate a new package-lock.json file
    try {
      execSync(`npm update --package-lock-only --legacy-peer-deps`, {
        cwd: path.join(examplesDir, subdir),
      });
    } catch (error) {
      console.error(`Error updating ${subdir}: ${error}`);
    }
  }
});

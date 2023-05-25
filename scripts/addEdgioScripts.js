const fs = require('fs');
const path = require('path');

const examplesDir = './examples';

const addEdgioScripts = (packageJsonPath) => {
  // Load the package.json file
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const hash = JSON.stringify(packageJson);

  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }

  // Add the "edgio:dev" script if it doesn't exist
  if (!packageJson.scripts['edgio:dev']) {
    packageJson.scripts['edgio:dev'] = 'edgio dev';
  }

  // Add the "edgio:build" script if it doesn't exist
  if (!packageJson.scripts['edgio:build']) {
    packageJson.scripts['edgio:build'] = 'edgio build';
  }

  // Add the "edgio:deploy" script if it doesn't exist
  if (!packageJson.scripts['edgio:deploy']) {
    packageJson.scripts['edgio:deploy'] = 'edgio deploy';
  }

  if (hash !== JSON.stringify(packageJson)) {
    // Write the updated package.json file back to disk
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }
};

const addEdgioScriptsToDirs = (dirs) => {
  for (const dir of dirs) {
    const packageJsonPath = path.join(dir, 'package.json');

    // If the package.json file exists, add the edgio scripts
    if (fs.existsSync(packageJsonPath)) {
      addEdgioScripts(packageJsonPath);
    }
  }
};

// Get the list of directories directly under the examples directory
const dirs = fs
  .readdirSync(examplesDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => path.join(examplesDir, dirent.name));

// Add the edgio scripts to the package.json files in the directories
addEdgioScriptsToDirs(dirs);

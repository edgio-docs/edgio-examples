const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;
const semver = require('semver');

const rootPath = process.argv[2];
const failures = [];

let version = process.argv[3] || 'latest';
try {
  // Get the version of the edgio module
  const command = 'edgio --version';
  version = execSync(command).toString().trim();
} catch (error) {
  console.error('Error: edgio module not found');
}

if (rootPath) {
  // Update the dependencies and dev dependencies in the specified directory
  updateEdgioDependencies(rootPath);
} else {
  // Update the dependencies and dev dependencies in all directories within the examples directory
  const examplesPath = path.join(process.cwd(), 'examples');
  const exampleDirs = fs.readdirSync(examplesPath);
  for (const dir of exampleDirs) {
    const examplePath = path.join(examplesPath, dir);
    updateEdgioDependencies(examplePath);
  }
}

if (failures.length > 0) {
  console.error(
    `\nFailed to update the following dependencies: \n ${failures
      .map((item) => `- ${item}`)
      .join('\n')}`
  );
  process.exit(1);
}

function updateEdgioDependencies(rootPath) {
  console.log(`Updating dependencies in ${rootPath}`);

  try {
    const packageJsonPath = path.join(rootPath, 'package.json');

    // Read the package.json file
    const packageJsonString = fs.readFileSync(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonString);

    // Find the dependencies and dev dependencies that start with @edgio
    const dependencies = packageJson.dependencies;
    const devDependencies = packageJson.devDependencies;
    const edgioDependencies = [];

    const allDependencies = { ...dependencies, ...devDependencies };

    for (const dependency in allDependencies) {
      if (dependency.startsWith('@edgio')) {
        // Compare the current version of the dependency with the specified version
        const currentVersion = allDependencies[dependency];
        if (!semver.satisfies(version, currentVersion)) {
          // Only update the dependency if the specified version is newer
          edgioDependencies.push(`${dependency}@${version}`);
        }
      }
    }

    // Determine whether to use npm or yarn based on the presence of a lock file
    const npmLockFileExists = fs.existsSync(
      path.join(rootPath, 'package-lock.json')
    );
    const yarnLockFileExists = fs.existsSync(path.join(rootPath, 'yarn.lock'));

    let packageManager;

    if (yarnLockFileExists) {
      packageManager = 'yarn';
    } else if (npmLockFileExists) {
      packageManager = 'npm';
    } else {
      console.error('Error: No lock file found');
      process.exit(1);
    }

    // Update the dependencies and dev dependencies to the latest version
    if (edgioDependencies.length > 0) {
      console.log(
        `Updating the following dependencies to the latest version using ${packageManager}: ${edgioDependencies.join(
          ', '
        )}`
      );
      let command;
      if (packageManager === 'yarn') {
        command = `yarn add ${edgioDependencies.join(' ')}`;
      } else {
        command = `npm install ${edgioDependencies.join(
          ' '
        )} --legacy-peer-deps`;
      }
      execSync(command, { stdio: 'inherit', cwd: rootPath });
    } else {
      console.log('No dependencies to update');
    }
  } catch (error) {
    console.error(
      `Unable to update dependencies for ${rootPath}`,
      error.message
    );
    failures.push(path.relative(process.cwd(), rootPath));
  }
}

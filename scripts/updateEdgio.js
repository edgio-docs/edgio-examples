const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;
const semver = require('semver');
const minimist = require('minimist');
const PACKAGE_NAMESAPCE = '@edgio';
const IGNORE_PACKAGES = ['@edgio/rum'];
const failures = [];

const args = minimist(process.argv.slice(2), {
  demandOption: ['dir'],
  default: {
    version: 'latest',
    allowMajor: false,
  },
  boolean: ['allowMajor'],
});

let { version, allowMajor, dir: rootPath } = args;

if (version === 'latest') {
  try {
    // Get the version of the edgio module
    const command = 'edgio --version';
    version = execSync(command).toString().trim();
  } catch (error) {
    console.error('Error: edgio module not found');
  }
}

if (rootPath) {
  // Update the dependencies and dev dependencies in the specified directory
  updateEdgioDependencies(path.join(process.cwd(), rootPath));
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
    const edgioDependencies = { dependencies: [], devDependencies: [] };

    function updateDependenciesByKey(key) {
      const dependencies = packageJson[key];
      for (const dependency in dependencies) {
        if (
          dependency.startsWith(PACKAGE_NAMESAPCE) &&
          !IGNORE_PACKAGES.includes(dependency)
        ) {
          // Compare the current version of the dependency with the specified version
          // Only update if:
          // - The specified version is newer
          // - The specified version is a major version newer and allowMajor is true
          const currentVersion = dependencies[dependency];
          if (
            semver.satisfies(version, currentVersion) ||
            (allowMajor && semver.lt(semver.coerce(currentVersion), version))
          ) {
            // Only update the dependency if the specified version is newer
            edgioDependencies[key].push(`${dependency}@${version}`);
          }
        }
      }
    }

    updateDependenciesByKey('dependencies');
    updateDependenciesByKey('devDependencies');

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
    for (const key in edgioDependencies) {
      const saveKey = key === 'dependencies' ? '' : ' -D ';

      if (edgioDependencies[key].length > 0) {
        console.log(
          `Updating the following ${key} to the latest version using ${packageManager}: ${edgioDependencies[
            key
          ].join(', ')}`
        );
        let command, installCommand;
        if (packageManager === 'yarn') {
          command = `yarn add ${saveKey} ${edgioDependencies[key].join(
            ' '
          )} --ignore-workspace-root-check`;
          installCommand = `yarn install --ignore-workspace-root-check`;
        } else {
          command = `npm install ${saveKey} ${edgioDependencies[key].join(
            ' '
          )} --legacy-peer-deps`;
          installCommand = `npm install --legacy-peer-deps`;
        }
        execSync(command, { stdio: 'inherit', cwd: rootPath });
        execSync(installCommand, { stdio: 'inherit', cwd: rootPath });
      } else {
        console.log(`No ${key} to update`);
      }
    }
  } catch (error) {
    console.error(
      `Unable to update dependencies for ${rootPath}`,
      error.message
    );
    failures.push(path.relative(process.cwd(), rootPath));
  }
}

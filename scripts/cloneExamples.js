const fs = require('fs');
const { spawn } = require('child_process');
const { join } = require('path');
const chalk = require('chalk');
const configPath = join(process.cwd(), 'examples.config.js');

let config;
const errors = [];

async function cloneAndCheckout(repo) {
  const cloneDir = `${config.outDir}/${repo.repo
    .split('/')[1]
    .replace('.git', '')}`;

  // Clone the repository into the outDir directory
  const clone = spawn('git', [
    'clone',
    '--single-branch',
    '--depth',
    '1',
    '--branch',
    repo.branch,
    repo.repo,
    cloneDir,
  ]);

  clone.stdout.on('data', (data) => {
    console.log(data);
  });
  // Log the output of the clone operation (stderr, not stdout)
  clone.stderr.on('data', (data) => {
    console.log(data.toString('utf8'));
  });

  return new Promise((resolve, reject) => {
    clone.on('close', (code) => {
      if (code === 0) {
        // Remove .git directory from the cloned repository
        fs.rmdirSync(join(cloneDir, '.git'), { recursive: true });
        console.log(chalk.green(`Cloned repository: ${repo.repo}`));
        resolve();
      } else {
        reject(`Failed to clone repository: ${repo.repo}`);
      }
    });
  });
}

async function cloneBatch(repos) {
  // Run the clone and checkout operations for each repository in the batch
  try {
    await Promise.all(repos.map(cloneAndCheckout));
  } catch (err) {
    errors.push(err);
  }
}

async function cloneRepos() {
  const batchSize = 5;

  // Check if the examples.config file exists
  if (!fs.existsSync(configPath)) {
    // Run the generate-config NPM script
    const generateConfig = spawn('npm', ['run', 'generate-config']);

    generateConfig.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    generateConfig.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    // Wait for the generateConfig process to close
    await new Promise((resolve, reject) => {
      generateConfig.on('close', (code) => {
        if (code !== 0) {
          console.error('Failed to generate config file');
          reject(new Error('Failed to generate config file'));
        } else {
          console.log('Config written successfully');
          resolve();
        }
      });
    });
  }

  // Load the config file after it has been generated
  console.log('Loading config file: ', configPath);
  config = require(configPath);

  // Split the list of repositories into batches of size `batchSize`
  const batches = [];
  while (config.repos.length > 0) {
    batches.push(config.repos.splice(0, batchSize));
  }

  // Clone each batch of repositories
  for (const batch of batches) {
    await cloneBatch(batch);
  }

  // Log any errors that occurred during the cloning process
  if (errors.length > 0) {
    console.log(chalk.red('Errors occurred during cloning:'));
    errors.forEach((err) => console.log(chalk.red(err)));
  }
}

cloneRepos();

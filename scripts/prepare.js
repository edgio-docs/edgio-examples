const { execSync } = require('child_process');
const chalk = require('chalk');
const prompts = require('prompts');
const fs = require('fs');
const path = require('path');

const examplesPath = path.join(process.cwd(), 'examples');
const templateName = '_template';

async function main() {
  console.clear();

  // Check if `edgio` CLI is installed globally
  try {
    execSync('edgio --version', { stdio: 'ignore' });
  } catch (err) {
    console.error(
      chalk.red(
        '❌ Edgio CLI is not installed. Please install it using `npm i -g @edgio/cli`.'
      )
    );
    return;
  }

  // Prompt the user to prepare a new or existing example
  console.log(
    `${chalk.cyan('Welcome to Edgio Examples')}\n`,
    'You may prepare a new example based on a starter template or work on an existing one.\n',
    'Preparing an example for use will automatically install the necessary dependencies.\n\n'
  );
  const { exampleType } = await prompts({
    type: 'select',
    name: 'exampleType',
    message: 'Would you like to prepare a new or existing example?',
    choices: [
      { title: 'New', value: 'new' },
      { title: 'Existing', value: 'existing' },
    ],
  });

  let exampleName;
  let examplePath;
  const formatFn = (input) => `edgio-${input.trim()}-example`;

  if (exampleType === 'new') {
    // Prompt the user to enter the name of the new example
    const { name } = await prompts({
      type: 'text',
      name: 'name',
      message: 'Enter the name of the new example:',
      initial: 'edgio-{name}-example',
      format: formatFn,
      validate: (input) => {
        const name = formatFn(input);
        const newExamplePath = path.join(examplesPath, name);
        if (fs.existsSync(newExamplePath)) {
          return `Example "${name}" already exists, please use different name`;
        }
        return true;
      },
    });

    exampleName = name;
    examplePath = path.join(examplesPath, exampleName);

    // Copy the contents of the `_template` directory into the new directory
    execSync(`cp -r _template ${examplesPath}`);

    // Rename the directory to the name of the new example
    fs.renameSync(path.join(examplesPath, '_template'), examplePath);
    console.log(chalk.green(`✔ Created new example "${exampleName}"`));

    // Install the packages and the latest Edgio version
    console.log('Installing packages and updating to latest Edgio version...');
    execSync(`cd ${examplePath} && npm install && edgio use latest`);
  } else {
    // Show a list of examples to choose from by listing the directory names within the `examples` directory
    const examples = fs
      .readdirSync(examplesPath)
      .sort()
      .filter((name) => name !== templateName);
    const { example } = await prompts({
      type: 'autocomplete',
      name: 'example',
      message: 'Select existing example (type to filter):',
      clearFirst: true,
      instructions: false,
      choices: examples.map((name) => ({ title: name, value: name })),
      suggest: (input, choices) =>
        choices.filter((choice) => choice.title.includes(input)),
    });

    exampleName = example;
    examplePath = path.join(examplesPath, exampleName);

    // Run `npm install` or `yarn install` within the chosen directory
    console.log('Installing packages...');
    const yarnLockFilePath = path.join(examplePath, 'yarn.lock');
    if (fs.existsSync(yarnLockFilePath)) {
      // Run `yarn install` within the chosen directory
      execSync(`cd ${examplePath} && yarn install`);
    } else {
      // Run `npm install` within the chosen directory
      execSync(`cd ${examplePath} && npm install`);
    }
  }

  // Inform the user that the example is ready to be worked on
  console.log(
    chalk.green(`✔ ${exampleName} is ready to be worked on.`),
    '\n\n',
    `To switch to the example, run: ${chalk.cyan(
      `cd ${path.relative(process.cwd(), examplePath)}`
    )}\n\n`
  );
}

main();

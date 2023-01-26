const fs = require('fs');
const path = require('path');

const examplesPath = 'examples';
const templatePath = path.join(
  '_template',
  '.github',
  'workflows',
  'edgio.yml'
);

const githubPath = path.join('.github');
const workflowsPath = path.join(githubPath, 'workflows');

fs.readdir(examplesPath, (err, examples) => {
  if (err) {
    console.error(err);
    return;
  }

  examples.forEach((example) => {
    const examplePath = path.join(examplesPath, example);
    const exampleGithubPath = path.join(examplePath, githubPath);
    const exampleWorkflowsPath = path.join(examplePath, workflowsPath);

    fs.mkdir(exampleWorkflowsPath, { recursive: true }, (err) => {
      if (err) {
        console.error(err);
        return;
      }

      if (!fs.existsSync(path.join(exampleWorkflowsPath, 'edgio.yml'))) {
        fs.copyFile(
          templatePath,
          path.join(exampleWorkflowsPath, 'edgio.yml'),
          (err) => {
            if (err) {
              console.error(err);
            }
          }
        );
      }
    });
  });
});

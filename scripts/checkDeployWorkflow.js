const fs = require('fs');
const path = require('path');

const examplesPath = 'examples';
const workflowsPath = path.join('.github', 'workflows');
const exampleWorkflowPath = path.join(workflowsPath, 'edgio.yml');

fs.readdir(examplesPath, (err, examples) => {
  if (err) {
    console.error(err);
    return;
  }

  examples.forEach((example) => {
    const examplePath = path.join(examplesPath, example);
    const exampleWorkflowFile = path.join(examplePath, exampleWorkflowPath);
    fs.access(exampleWorkflowFile, fs.constants.F_OK, (err) => {
      if (err) {
        console.log(
          `example ${example} does not have ${exampleWorkflowPath} file`
        );
      }
    });
  });
});

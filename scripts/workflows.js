const fs = require('fs');
const path = require('path');

const examplesPath = path.join(process.cwd(), 'examples');

fs.readdir(examplesPath, (err, directories) => {
  if (err) {
    console.error(err);
    return;
  }

  directories.forEach((directory) => {
    const workflowPath = path.join(
      examplesPath,
      directory,
      '.github/workflows'
    );

    fs.readdir(workflowPath, (err, files) => {
      if (err) {
        console.error(err);
        return;
      }

      files.forEach((file) => {
        if (file !== 'edgio.yml' && path.extname(file) === '.yml') {
          fs.unlink(path.join(workflowPath, file), (err) => {
            if (err) {
              console.error(err);
            }
          });
        }
      });
    });
  });
});

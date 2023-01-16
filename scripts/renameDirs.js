const fs = require('fs');
const { join } = require('path');

const examplesPath = 'examples';

// Get a list of all directories in the current directory
fs.readdir(examplesPath, (err, files) => {
  files.forEach((file) => {
    const examplePath = join(examplesPath, file);
    // Check if the file is a directory and the name starts with 'edgio-' and ends with '-example'
    if (
      fs.lstatSync(examplePath).isDirectory() &&
      file.startsWith('edgio-') &&
      file.endsWith('-example')
    ) {
      // Get the new directory name by removing 'edgio-' from the start and '-example' from the end
      const newName = join(examplesPath, file.slice(6, -8));
      // Rename the directory using the fs.renameSync function
      fs.renameSync(examplePath, newName);
    }
  });
});

const fs = require('fs');
const { join } = require('path');
const requiredScripts = ['edgio:dev', 'edgio:build', 'edgio:deploy'];
const repoFormat = (name) =>
  `git@github.com:edgio-docs/edgio-${name}-example.git`;

let error = false;

// Get package.json path from the first argument passed to the script
const exampleName = process.argv[2].split('/')[1];
const packageJsonPath = join(process.cwd(), process.argv[2], 'package.json');

// Read the contents of the package.json file
const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');

// Parse the JSON content of the file
const packageJson = JSON.parse(packageJsonContent);

// Check if the scripts property exists in the package.json object
if (packageJson.scripts) {
  // Check if the required scripts exist in the scripts property
  const missingScripts = requiredScripts.filter(
    (script) => !packageJson.scripts[script]
  );

  // If any of the required scripts are missing, log an error and exit the script
  if (missingScripts.length) {
    console.error(
      `'${missingScripts.join(
        "', '"
      )}' script(s) not found in '${packageJsonPath}'`
    );
    error = true;
  }
} else {
  console.error(
    `'${requiredScripts.join(
      "', '"
    )}' script(s) not found in '${packageJsonPath}'`
  );
  error = true;
}

// Check for `repository` property in package.json
if (!packageJson.repository) {
  console.error(
    `'repository' property missing in '${packageJsonPath}'.\n\n` +
      `Recommended value: "repository": "${repoFormat(exampleName)}"`
  );
  error = true;
} else if (packageJson.repository !== repoFormat(exampleName)) {
  console.warn(
    `Warning: 'repository' value in '${packageJsonPath}' does not match the recommended value.\n\n` +
      `Recommended value: "repository": "${repoFormat(exampleName)}"`
  );
}

if (error) {
  process.exit(1);
}

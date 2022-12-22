const fs = require('fs');
const { join } = require('path');
const requiredScripts = ['edgio:dev', 'edgio:build', 'edgio:deploy'];

// Get package.json path from the first argument passed to the script
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
    process.exit(1);
  }
} else {
  console.error(`'scripts' property not found in '${packageJsonPath}'`);
  process.exit(1);
}

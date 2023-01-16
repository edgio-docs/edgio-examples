const { exec } = require('child_process');
const args = `--team edgio-community --site examples`;
exec(`edgio env list ${args}`, (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }

  const envList = stdout.split('\n');

  envList.forEach((env) => {
    if (env.startsWith('edgio-')) {
      console.log(`edgio env del --environment ${env} ${args}`);
      exec(
        `edgio env del --environment ${env} ${args}`,
        (error, stdout, stderr) => {
          if (error) {
            console.log(`error: ${error.message}`);
            return;
          }
          if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
          }
          console.log(`${env} was successfully deleted.`);
        }
      );
    }
  });
});

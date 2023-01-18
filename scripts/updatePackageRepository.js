const fs = require('fs');
const path = require('path');
const { Octokit } = require('@octokit/rest');

const examplesPath = 'examples';
const octokit = new Octokit({
  auth: process.env.GITHUB_API_TOKEN,
});

fs.readdir(examplesPath, async (err, dirs) => {
  if (err) throw err;

  for (const dir of dirs) {
    const packagePath = path.join(examplesPath, dir, 'package.json');
    fs.access(packagePath, fs.constants.F_OK, async (err) => {
      if (err) {
        const packageJson = {
          name: `edgio-${dir}-example`,
          repository: `git@github.com:edgio-docs/edgio-${dir}-example.git`,
        };
        try {
          await checkAndCreateRepo(packageJson.repository);
          fs.writeFile(
            packagePath,
            JSON.stringify(packageJson, null, 2),
            (err) => {
              if (err) throw err;
              console.log(`Successfully created package.json for ${dir}`);
            }
          );
        } catch (err) {
          console.error(`Error: ${err}`);
        }
      } else {
        fs.readFile(packagePath, 'utf8', async (err, data) => {
          if (err) throw err;

          const packageJson = JSON.parse(data);
          packageJson.repository = `git@github.com:edgio-docs/edgio-${dir}-example.git`;
          try {
            await checkAndCreateRepo(packageJson.repository);
            fs.writeFile(
              packagePath,
              JSON.stringify(packageJson, null, 2),
              (err) => {
                if (err) throw err;
                console.log(`Successfully updated package.json for ${dir}`);
              }
            );
          } catch (err) {
            console.error(`Error: ${err}`);
          }
        });
      }
    });
  }
});

async function checkAndCreateRepo(repoUrl) {
  return;
  try {
    const [owner, repo] = repoUrl.split(':')[1].split('/');
    let { status } = await octokit.repos.get({
      owner,
      repo: repo.split('.')[0],
    });
    if (status === 404) {
      await octokit.repos.createForAuthenticatedUser({ name: repo });
      console.log(`Repository ${repoUrl} created`);
    }
    if (status !== 200 && status !== 201) {
      throw new Error(`Error checking repository ${repoUrl}`);
    }
  } catch (err) {
    throw new Error(`Error checking repository ${repoUrl}: ${err.message}`);
  }
}

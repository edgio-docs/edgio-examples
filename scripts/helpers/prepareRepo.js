const { Octokit } = require('@octokit/rest');
const { exec } = require('child_process');
require('dotenv').config();

const octokit = new Octokit({
  auth: process.env.GITHUB_API_TOKEN,
});

async function checkAndCreateRepo(repoUrl) {
  const [owner, repo] = repoUrl.split(':')[1].split('/');
  const repoName = repo.split('.')[0];

  async function createRepo() {
    const tmpRepoPath = `${repoName}-tmp`;
    // Create the repository
    await octokit.repos.createInOrg({
      org: owner,
      name: repoName,
    });
    console.log(`Repository ${repoUrl} created`);

    // Initialize the repository locally and push the main branch
    exec(
      `mkdir ${tmpRepoPath} && 
      cd ${tmpRepoPath} && 
      echo "# ${repoName}" >> README.md && 
      git init && 
      git add README.md && 
      git commit -m "first commit" && 
      git branch -M main && 
      git remote add origin git@github.com:${owner}/${repoName}.git && 
      git push -u origin main && 
      cd .. &&
      rm -rf ${tmpRepoPath}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      }
    );
  }

  try {
    let { status } = await octokit.repos.get({
      owner,
      repo: repoName,
    });

    if (status === 404) {
      await createRepo();
    }

    if (status !== 200 && status !== 201) {
      throw new Error(`Error checking repository ${repoUrl}`);
    }
  } catch (err) {
    if (err.message === 'Not Found') {
      await createRepo();
      return;
    }
    throw new Error(`Error checking repository ${repoUrl}: ${err.message}`);
  }
}

checkAndCreateRepo(process.argv[2]);

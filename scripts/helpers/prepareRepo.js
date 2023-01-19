const { Octokit } = require('@octokit/rest');
require('dotenv').config();

const octokit = new Octokit({
  auth: process.env.GITHUB_API_TOKEN,
});

async function checkAndCreateRepo(repoUrl) {
  const [owner, repo] = repoUrl.split(':')[1].split('/');
  const repoName = repo.split('.')[0];
  try {
    let { status } = await octokit.repos.get({
      owner,
      repo: repoName,
    });
    if (status === 404) {
      await octokit.repos.createForAuthenticatedUser({ name: repoName });
      console.log(`Repository ${repoUrl} created`);
    }
    if (status !== 200 && status !== 201) {
      throw new Error(`Error checking repository ${repoUrl}`);
    }
  } catch (err) {
    if (err.message === 'Not Found') {
      await octokit.repos.createForAuthenticatedUser({ name: repoName });
      console.log(`Repository ${repoUrl} created`);
      return;
    }
    throw new Error(`Error checking repository ${repoUrl}: ${err.message}`);
  }
}

checkAndCreateRepo(process.argv[2]);

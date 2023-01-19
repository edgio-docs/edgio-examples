const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({
  auth: process.env.GITHUB_API_TOKEN,
});

async function checkAndCreateRepo(repoUrl) {
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

checkAndCreateRepo(process.argv[2]);

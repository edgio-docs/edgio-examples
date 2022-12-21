const { join } = require('path');
const fs = require('fs/promises');
const prettier = require('prettier');
const _orderBy = require('lodash/orderBy');
const { Octokit } = require('@octokit/core');
require('dotenv').config();

const CONFIG_FILE = 'examples.config.js';
const OUT_DIR = 'examples';

const octokit = new Octokit({
  auth: process.env.GITHUB_API_TOKEN,
});

(async () => {
  const exampleRepos = await getExampleRepos();
  const repoUrls = exampleRepos.map(
    ({ ssh_url: repo, default_branch: branch }) => ({ repo, branch })
  );

  const content = `module.exports = ${JSON.stringify({
    outDir: OUT_DIR,
    repos: _orderBy(repoUrls, 'repo'),
  })}`;

  await fs.writeFile(
    join(process.cwd(), CONFIG_FILE),
    prettier.format(content)
  );
})();

async function getRepositories() {
  let page = 0;
  let allRepos = [];

  while (true) {
    const { data } = (resp = await octokit.request('GET /orgs/{org}/repos', {
      org: 'edgio-docs',
      page: ++page,
    }));

    allRepos.push(...data);

    if (data.length === 0) {
      break;
    }
  }

  console.log('Total repo count:', allRepos.length);

  return allRepos;
}

async function getExampleRepos() {
  const exampleRepoRE = /^(edgio)(.+example)$/i;
  const repos = await getRepositories();

  return repos.filter(
    ({ name, archived }) => !archived && name.match(exampleRepoRE)
  );
}

"use strict";

const {
  promisify
} = require('util');

const simpleGit = require('simple-git');

const GitUrlParse = require('git-url-parse');

const exec = promisify(require('child_process').exec);

const branch = path => {
  const git = simpleGit(path);
  return promisify(git.branch.bind(git))();
};

const getRemoteUrl = path => {
  const git = simpleGit(path);
  return promisify(git.listRemote.bind(git))(['--get-url']);
};

const isDirty = async () => {
  const {
    stdout
  } = await exec('git diff --quiet || echo true');
  return !!stdout;
};

const getCurrentHash = path => {
  const git = simpleGit(path);
  return promisify(git.revparse.bind(git))(['HEAD']);
};

const currentBranch = async path => {
  try {
    const {
      current
    } = await branch(path); // The lib returns empty string sometimes, when there is no branch

    return current || undefined;
  } catch (e) {
    return undefined;
  }
};

const commitUrl = async (path, customUrl) => {
  try {
    const hash = await getCurrentHash(path);

    if (customUrl) {
      return customUrl.endsWith('/') ? `${customUrl}${hash}` : `${customUrl}/${hash}`;
    }

    let commitString = 'commit';
    const remote = (await getRemoteUrl(path)).trim();
    const result = GitUrlParse(remote);
    const {
      source,
      full_name
    } = result;

    if (source.includes('bitbucket')) {
      commitString += 's';
    }

    return `https://${source}/${full_name}/${commitString}/${hash}`;
  } catch (e) {
    return undefined;
  }
};

module.exports = {
  currentBranch,
  commitUrl,
  isDirty
};
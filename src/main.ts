import * as github from '@actions/github';
import * as core from '@actions/core';
import {exec} from '@actions/exec';

import {createReviewCommentsFromPatch} from './createReviewCommentsFromPatch';

const {GITHUB_EVENT_PATH} = process.env;
const {owner, repo} = github.context.repo;
const token = core.getInput('github-token') || core.getInput('githubToken');
const octokit = token && github.getOctokit(token);
// @ts-ignore
const GITHUB_EVENT = require(GITHUB_EVENT_PATH);

async function run(): Promise<void> {
  if (!octokit) {
    core.debug('No octokit client');
    return;
  }

  if (!github.context.payload.pull_request) {
    core.debug('Requires a pull request');
    return;
  }
  const commentBody =
    core.getInput('message') ||
    'Something magical has suggested this change for you';

  let gitDiff = '';
  let gitDiffError = '';

  try {
    await exec('git', ['diff', '-U0', '--color=never'], {
      listeners: {
        stdout: (data: Buffer) => {
          gitDiff += data.toString();
        },
        stderr: (data: Buffer) => {
          gitDiffError += data.toString();
        },
      },
    });
  } catch (error) {
    core.setFailed(error.message);
  }

  if (gitDiffError) {
    core.setFailed(gitDiffError);
  }

  try {
    await createReviewCommentsFromPatch({
      octokit,
      owner,
      repo,
      commentBody,
      gitDiff,
      // @ts-ignore
      pullRequest: github.context.payload.pull_request?.number,
      commitId: GITHUB_EVENT.pull_request?.head.sha,
    });
  } catch (err) {
    core.setFailed(err);
  }

  // If we have a git diff, then it means that some linter/formatter has changed some files, so
  // we should fail the build
  if (!!gitDiff) {
    core.setFailed(
      new Error(
        'There were some changed files, please update your PR with the code review suggestions'
      )
    );
  }
}

run();

import * as github from '@actions/github';
import * as core from '@actions/core';
import {exec} from '@actions/exec';

import {parseGitPatch} from './parseGitPatch';

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

  let gitDiffOutput = '';
  let gitDiffError = '';

  try {
    await exec('git', ['diff', '-U0', '--color=never'], {
      listeners: {
        stdout: (data: Buffer) => {
          gitDiffOutput += data.toString();
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

  const patches = parseGitPatch(gitDiffOutput);

  if (patches.length) {
    const promises = patches.map(async patch =>
      octokit.pulls.createReviewComment({
        owner,
        repo,
        // @ts-ignore
        pull_number: github.context.payload.pull_request?.number,
        body: `
Something magical has suggested this change for you:

\`\`\`suggestion
${patch.added.lines.join('\n')}
\`\`\`
`,
        commit_id: GITHUB_EVENT.pull_request?.head.sha,
        path: patch.removed.file,
        side: 'RIGHT',
        start_side: 'RIGHT',
        start_line:
          patch.removed.start !== patch.removed.end
            ? patch.removed.start
            : undefined,
        line: patch.removed.end,
        mediaType: {
          previews: ['comfort-fade'],
        },
      })
    );

    try {
      const responses = await Promise.all(promises);
      responses.forEach(resp => {
        core.startGroup('patch debug');
        core.debug(JSON.stringify(resp, null, 2));
        core.endGroup();
      });
    } catch (err) {
      core.error(err);
    }
  }
}
run();

import * as core from '@actions/core';
import * as github from '@actions/github';

import {parseGitPatch} from './parseGitPatch';
import {deleteOldReviewComments} from './deleteOldReviewComments';

type Octokit = ReturnType<typeof github.getOctokit>;

type Params = {
  octokit: Octokit;
  owner: string;
  repo: string;
  commentBody: string;
  gitDiff: string;
  pullRequest: number;
  commitId: string;
};

export async function createReviewCommentsFromPatch({
  octokit,
  owner,
  repo,
  commentBody,
  gitDiff,
  pullRequest,
  commitId,
}: Params) {
  if (!gitDiff) {
    return;
  }

  const patches = parseGitPatch(gitDiff);

  if (!patches.length) {
    return;
  }

  // Delete existing review comments from this bot
  await deleteOldReviewComments({
    octokit,
    owner,
    repo,
    commentBody,
    pullRequest,
  });

  // Need to call these APIs serially, otherwise face API errors from
  // GitHub about having multiple pending review requests
  for (const patch of patches) {
    try {
      await octokit.pulls.createReviewComment({
        owner,
        repo,
        pull_number: pullRequest,
        body: `${commentBody}:

\`\`\`suggestion
${patch.added.lines.join('\n')}
\`\`\`
`,
        commit_id: commitId,
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
      });
    } catch (err) {
      core.error(err);
      throw err;
    }
  }
}

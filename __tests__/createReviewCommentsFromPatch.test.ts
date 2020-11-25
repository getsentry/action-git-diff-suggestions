import * as github from '@actions/github';

import {deleteOldReviewComments} from '@app/deleteOldReviewComments';
import {createReviewCommentsFromPatch} from '@app/createReviewCommentsFromPatch';

jest.mock('@app/deleteOldReviewComments', () => ({
  deleteOldReviewComments: jest.fn(),
}));

jest.mock('@actions/github', () => ({
  getOctokit: () => ({
    pulls: {
      listReviewComments: jest.fn(),
      deleteReviewComment: jest.fn(),
      createReviewComment: jest.fn(),
    },
  }),
}));

test('createReviewCommentsFromPatch does nothing with invalid git diff', async function () {
  const octokit = github.getOctokit('token');

  await createReviewCommentsFromPatch({
    octokit,
    owner: 'getsentry',
    repo: 'sentry',
    commentBody: 'Magic',
    gitDiff: 'git diff',
    pullRequest: 1337,
    commitId: '123',
  });

  expect(octokit.pulls.listReviewComments).not.toHaveBeenCalled();
});

test('createReviewCommentsFromPatch works', async function () {
  const octokit = github.getOctokit('token');

  await createReviewCommentsFromPatch({
    octokit,
    owner: 'getsentry',
    repo: 'sentry',
    commentBody: 'Magic',
    gitDiff: `diff --git a/src/sentry/static/sentry/app/views/alerts/utils/index.tsx b/src/sentry/static/sentry/app/views/alerts/utils/index.tsx
index 5d7caa2267..bc109f7943 100644
--- a/src/sentry/static/sentry/app/views/alerts/utils/index.tsx
+++ b/src/sentry/static/sentry/app/views/alerts/utils/index.tsx
@@ -195,5 +195,7 @@ export function convertDatasetEventTypesToSource(
-  if (eventTypes.includes(EventTypes.DEFAULT) && eventTypes.includes(EventTypes.ERROR)) {
-    return Datasource.ERROR_DEFAULT;
-  } else if (eventTypes.includes(EventTypes.DEFAULT)) {
-    return Datasource.DEFAULT;
-  } else {
+  if (
+    eventTypes.includes(EventTypes.DEFAULT
+                         ) && eventTypes.includes(
+    EventTypes.ERROR)) { return Datasource.ERROR_DEFAULT; } else if (eventTypes.includes(EventTypes.DEFAULT)) { return Datasource.DEFAULT;
+  }
+  else
+    {
`,
    pullRequest: 1337,
    commitId: '123',
  });

  expect(deleteOldReviewComments).toHaveBeenCalled();
  expect(octokit.pulls.createReviewComment).toHaveBeenCalledTimes(1);
  expect(octokit.pulls.createReviewComment).toHaveBeenCalledWith({
    body: `Magic:

\`\`\`suggestion
  if (
    eventTypes.includes(EventTypes.DEFAULT
                         ) && eventTypes.includes(
    EventTypes.ERROR)) { return Datasource.ERROR_DEFAULT; } else if (eventTypes.includes(EventTypes.DEFAULT)) { return Datasource.DEFAULT;
  }
  else
    {
\`\`\`
`,
    commit_id: '123',
    line: 200,
    mediaType: {
      previews: ['comfort-fade'],
    },
    owner: 'getsentry',
    path: 'src/sentry/static/sentry/app/views/alerts/utils/index.tsx',
    pull_number: 1337,
    repo: 'sentry',
    side: 'RIGHT',
    start_line: 195,
    start_side: 'RIGHT',
  });
});

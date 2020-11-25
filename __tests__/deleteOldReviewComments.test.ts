import * as github from '@actions/github';

import {deleteOldReviewComments} from '@app/deleteOldReviewComments';

jest.mock('@actions/github', () => ({
  getOctokit: () => ({
    pulls: {
      listReviewComments: jest.fn(),
      deleteReviewComment: jest.fn(),
    },
  }),
}));

test('deleteOldReviewComments works', async function () {
  const octokit = github.getOctokit('token');

  ((octokit.pulls
    .listReviewComments as unknown) as jest.Mock).mockImplementation(() => ({
    data: [
      {
        url:
          'https://api.github.com/repos/getsentry/sentry/pulls/comments/529164440',
        pull_request_review_id: 537035350,
        id: 529164440,
        node_id: 'MDI0OlB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudDUyOTE2NDQ0MA==',
        diff_hunk:
          '@@ -169,11 +164,7 @@ export const DATA_SOURCE_LABELS = {\n \n // Maps a datasource to the relevant dataset and event_types for the backend to use\n export const DATA_SOURCE_TO_SET_AND_EVENT_TYPES = {\n-  [Datasource.ERROR_DEFAULT]: {\n-    dataset: Dataset.ERRORS,\n-    eventTypes: [EventTypes.ERROR, EventTypes.DEFAULT],\n-  },\n-  [Datasource.ERROR]: {\n+  [Datasource.ERROR_DEFAULT]: { dataset: Dataset.ERRORS, eventTypes: [EventTypes.ERROR, EventTypes.DEFAULT], }, [Datasource.ERROR]: {',
        path: 'src/sentry/static/sentry/app/views/alerts/utils/index.tsx',
        position: 30,
        original_position: 30,
        commit_id: 'eb778a1c562885d7c4382d4b1d552d6f2825c5ff',
        original_commit_id: 'eb778a1c562885d7c4382d4b1d552d6f2825c5ff',
        user: {
          login: 'github-actions[bot]',
          id: 41898282,
          node_id: 'MDM6Qm90NDE4OTgyODI=',
          avatar_url: 'https://avatars2.githubusercontent.com/in/15368?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/github-actions%5Bbot%5D',
          html_url: 'https://github.com/apps/github-actions',
          followers_url:
            'https://api.github.com/users/github-actions%5Bbot%5D/followers',
          following_url:
            'https://api.github.com/users/github-actions%5Bbot%5D/following{/other_user}',
          gists_url:
            'https://api.github.com/users/github-actions%5Bbot%5D/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/github-actions%5Bbot%5D/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/github-actions%5Bbot%5D/subscriptions',
          organizations_url:
            'https://api.github.com/users/github-actions%5Bbot%5D/orgs',
          repos_url:
            'https://api.github.com/users/github-actions%5Bbot%5D/repos',
          events_url:
            'https://api.github.com/users/github-actions%5Bbot%5D/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/github-actions%5Bbot%5D/received_events',
          type: 'Bot',
          site_admin: false,
        },
        body:
          'Magic:\n\n```suggestion\n  [Datasource.ERROR_DEFAULT]: {\n    dataset: Dataset.ERRORS,\n    eventTypes: [EventTypes.ERROR, EventTypes.DEFAULT],\n  },\n  [Datasource.ERROR]: {\n```\n',
        created_at: '2020-11-24T02:44:01Z',
        updated_at: '2020-11-24T02:44:01Z',
        html_url:
          'https://github.com/getsentry/sentry/pull/22253#discussion_r529164440',
        pull_request_url:
          'https://api.github.com/repos/getsentry/sentry/pulls/22253',
        author_association: 'CONTRIBUTOR',
        _links: {
          self: {
            href:
              'https://api.github.com/repos/getsentry/sentry/pulls/comments/529164440',
          },
          html: {
            href:
              'https://github.com/getsentry/sentry/pull/22253#discussion_r529164440',
          },
          pull_request: {
            href: 'https://api.github.com/repos/getsentry/sentry/pulls/22253',
          },
        },
        start_line: null,
        original_start_line: null,
        start_side: null,
        line: 167,
        original_line: 167,
        side: 'RIGHT',
      },
      {
        url:
          'https://api.github.com/repos/getsentry/sentry/pulls/comments/529164440',
        pull_request_review_id: 537035351,
        id: 529164441,
        user: {
          login: 'sentry user',
          id: 41898283,
        },
        body:
          'Magic:\n\n```suggestion\n  [Datasource.ERROR_DEFAULT]: {\n    dataset: Dataset.ERRORS,\n    eventTypes: [EventTypes.ERROR, EventTypes.DEFAULT],\n  },\n  [Datasource.ERROR]: {\n```\n',
      },
      {
        url:
          'https://api.github.com/repos/getsentry/sentry/pulls/comments/529164440',
        pull_request_review_id: 537035351,
        id: 529164441,
        user: {
          login: 'github-actions[bot]',
          id: 41898283,
        },
        body:
          'Another message:\n\n```suggestion\n  [Datasource.ERROR_DEFAULT]: {\n    dataset: Dataset.ERRORS,\n    eventTypes: [EventTypes.ERROR, EventTypes.DEFAULT],\n  },\n  [Datasource.ERROR]: {\n```\n',
      },
    ],
  }));

  await deleteOldReviewComments({
    octokit,
    owner: 'getsentry',
    repo: 'sentry',
    commentBody: 'Magic',
    pullRequest: 1337,
  });

  expect(octokit.pulls.listReviewComments).toHaveBeenCalledTimes(1);
  expect(octokit.pulls.deleteReviewComment).toHaveBeenCalledTimes(1);
  expect(octokit.pulls.deleteReviewComment).toHaveBeenCalledWith({
    owner: 'getsentry',
    repo: 'sentry',
    comment_id: 529164440,
  });
});

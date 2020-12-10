# STOP

This doesn't work as intended as you can not leave a review comment on lines that are not modified in the PR. Due to this limitation, this action can potentionally have undesired results.


# action-git-diff-suggestions   <a href="https://github.com/getsentry/action-git-diff-suggestions/actions"><img alt="typescript-action status" src="https://github.com/getsentry/action-git-diff-suggestions/workflows/test/badge.svg"></a>


This GitHub Action will take the current git changes and apply them as GitHub code review suggestions.
This is useful to run after running a linter or formatter that automatically makes fixes for you.


Note: This only works on `pull_request` workflow events!

## Usage

See the [Sentry repo](https://github.com/getsentry/sentry/tree/master/.github/workflows) for real world examples.


### Inputs

| input | required | description |
| ----- | -------- | ----------- |
| `github-token` | no | The GitHub Actions token e.g. `secrets.GITHUB_TOKEN` |
| `message` | highly recommended | This is string used in the review comment before the suggestion. It is also used to find previous comments to be deleted when the action is re-run. This should be named according to the workflow job so that multiple jobs don't delete each other's reviews. |


### Example

```yaml
- uses: getsentry/action-git-diff-suggestions@main
  with:
    message: 'eslint made the following change'
```

### Full example

```yaml
name: test

on: pull_request

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - uses: actions/setup-node@v1
        with:
          node-version: 12

      - run: yarn install

      - run: yarn lint

      - uses: getsentry/action-git-diff-suggestions@main
        with:
          message: eslint

      - run: yarn test
```

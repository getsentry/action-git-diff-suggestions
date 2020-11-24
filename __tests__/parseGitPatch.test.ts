import {parseGitPatch} from '../src/parseGitPatch';

test('single line', async () => {
  const str = `diff --git a/src/sentry/static/sentry/app/views/alerts/utils/index.tsx b/src/sentry/static/sentry/app/views/alerts/utils/index.tsx
index 5d7caa2..5a0756a 100644
--- a/src/sentry/static/sentry/app/views/alerts/utils/index.tsx
+++ b/src/sentry/static/sentry/app/views/alerts/utils/index.tsx
@@ -123 +123 @@ export function getIncidentDiscoverUrl(opts: {
-const timeWindowString = 'incident.alertRule.timeWindow';
+  const timeWindowString = 'incident.alertRule.timeWindow';
`;
  const patches = parseGitPatch(str);
  expect(patches).toEqual([
    {
      added: {
        end: 123,
        file: 'src/sentry/static/sentry/app/views/alerts/utils/index.tsx',
        lines: ["  const timeWindowString = 'incident.alertRule.timeWindow';"],
        start: 123,
      },
      removed: {
        end: 123,
        file: 'src/sentry/static/sentry/app/views/alerts/utils/index.tsx',
        lines: ["const timeWindowString = 'incident.alertRule.timeWindow';"],
        start: 123,
      },
    },
  ]);
});

test('mixed single and multi line', async () => {
  const str = `diff --git a/src/sentry/static/sentry/app/views/alerts/utils/index.tsx b/src/sentry/static/sentry/app/views/alerts/utils/index.tsx
index 5d7caa2..5a0756a 100644
--- a/src/sentry/static/sentry/app/views/alerts/utils/index.tsx
+++ b/src/sentry/static/sentry/app/views/alerts/utils/index.tsx
@@ -129 +129,5 @@ const timeWindowString = \`\$\{incident.alertRule.timeWindow}m\`;
-    orderby: \`-$\{getAggregateAlias(incident.alertRule.aggregate)}\`, yAxis: incident.alertRule.aggregate, query: incident?.discoverQuery ?? '', projects: projects .filter(({slug}) => incident.projects.includes(slug))
+    orderby: \`-$\{getAggregateAlias(incident.alertRule.aggregate)}\`,
+    yAxis: incident.alertRule.aggregate,
+    query: incident?.discoverQuery ?? '',
+    projects: projects
+      .filter(({slug}) => incident.projects.includes(slug))
`;
  const patches = parseGitPatch(str);
  expect(patches).toEqual([
    {
      added: {
        end: 134,
        file: 'src/sentry/static/sentry/app/views/alerts/utils/index.tsx',
        lines: [
          '    orderby: `-${getAggregateAlias(incident.alertRule.aggregate)}`,',
          '    yAxis: incident.alertRule.aggregate,',
          "    query: incident?.discoverQuery ?? '',",
          '    projects: projects',
          '      .filter(({slug}) => incident.projects.includes(slug))',
        ],
        start: 129,
      },
      removed: {
        end: 129,
        file: 'src/sentry/static/sentry/app/views/alerts/utils/index.tsx',
        lines: [
          "    orderby: `-${getAggregateAlias(incident.alertRule.aggregate)}`, yAxis: incident.alertRule.aggregate, query: incident?.discoverQuery ?? '', projects: projects .filter(({slug}) => incident.projects.includes(slug))",
        ],
        start: 129,
      },
    },
  ]);
});

test('multi line', async () => {
  const str = `diff --git a/src/sentry/static/sentry/app/views/alerts/utils/index.tsx b/src/sentry/static/sentry/app/views/alerts/utils/index.tsx
index 5d7caa2..5a0756a 100644
--- a/src/sentry/static/sentry/app/views/alerts/utils/index.tsx
+++ b/src/sentry/static/sentry/app/views/alerts/utils/index.tsx
@@ -129,5 +129,5 @@ const timeWindowString = \`\$\{incident.alertRule.timeWindow}m\`;
-    orderby: \`-$\{getAggregateAlias(incident.alertRule.aggregate)}\`, yAxis: incident.alertRule.aggregate, query: incident?.discoverQuery ?? '', projects: projects .filter(({slug}) => incident.projects.includes(slug))
+    orderby: \`-$\{getAggregateAlias(incident.alertRule.aggregate)}\`,
+    yAxis: incident.alertRule.aggregate,
+    query: incident?.discoverQuery ?? '',
+    projects: projects
+      .filter(({slug}) => incident.projects.includes(slug))
`;
  const patches = parseGitPatch(str);
  expect(patches).toEqual([
    {
      added: {
        end: 134,
        file: 'src/sentry/static/sentry/app/views/alerts/utils/index.tsx',
        lines: [
          '    orderby: `-${getAggregateAlias(incident.alertRule.aggregate)}`,',
          '    yAxis: incident.alertRule.aggregate,',
          "    query: incident?.discoverQuery ?? '',",
          '    projects: projects',
          '      .filter(({slug}) => incident.projects.includes(slug))',
        ],
        start: 129,
      },
      removed: {
        end: 134,
        file: 'src/sentry/static/sentry/app/views/alerts/utils/index.tsx',
        lines: [
          "    orderby: `-${getAggregateAlias(incident.alertRule.aggregate)}`, yAxis: incident.alertRule.aggregate, query: incident?.discoverQuery ?? '', projects: projects .filter(({slug}) => incident.projects.includes(slug))",
        ],
        start: 129,
      },
    },
  ]);
});

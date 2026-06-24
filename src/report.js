/**
 * Build and print a human-readable summary of a sync/check run.
 * Actions are plain string labels (no emojis), per project communication style.
 */

const ORDER = [
  'created',
  'updated',
  'overwritten-drift',
  'removed',
  'removed-skipped',
  'unchanged',
  'protected-skipped',
  'skipped',
  'would-create',
  'would-update',
  'would-overwrite-drift',
  'would-remove',
  'drift',
  'orphaned',
  'outdated',
];

const LABELS = {
  created: 'Created',
  updated: 'Updated',
  'overwritten-drift': 'Overwritten (local drift)',
  removed: 'Removed (no longer shipped)',
  'removed-skipped': 'Kept (no longer shipped, local edits)',
  unchanged: 'Unchanged',
  'protected-skipped': 'Protected, skipped (already exists)',
  skipped: 'Skipped',
  'would-create': 'Would create',
  'would-update': 'Would update',
  'would-overwrite-drift': 'Would overwrite (local drift)',
  'would-remove': 'Would remove (no longer shipped)',
  drift: 'Drift detected',
  orphaned: 'Orphaned (stale, no longer shipped)',
  outdated: 'Outdated',
};

/**
 * @param {{action:string, path:string}[]} results
 * @param {{ dryRun?: boolean, version?: string, target?: string }} meta
 */
export function printReport(results, meta = {}) {
  /** @type {Record<string,string[]>} */
  const groups = {};
  for (const r of results) {
    (groups[r.action] ??= []).push(r.path);
  }

  const lines = [];
  lines.push('');
  lines.push(
    `copilot-framework-poc ${meta.version ?? ''}${
      meta.dryRun ? ' (dry run — nothing written)' : ''
    }`.trim(),
  );
  if (meta.target) {
    lines.push(`Target: ${meta.target}`);
  }
  lines.push('');

  const keys = ORDER.filter((k) => groups[k]?.length);
  if (keys.length === 0) {
    lines.push('No changes.');
  } else {
    for (const key of keys) {
      lines.push(`${LABELS[key] ?? key} (${groups[key].length}):`);
      for (const p of groups[key]) {
        lines.push(`  - ${p}`);
      }
      lines.push('');
    }
  }

  // Summary counts line.
  const summary = keys.map((k) => `${k}=${groups[k].length}`).join(', ');
  if (summary) {
    lines.push(`Summary: ${summary}`);
  }

  process.stdout.write(`${lines.join('\n')}\n`);
}

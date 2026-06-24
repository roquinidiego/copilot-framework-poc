#!/usr/bin/env node
import { resolve } from 'node:path';
import { sync, check } from '../src/sync.js';
import { printReport } from '../src/report.js';
import { packageVersion } from '../src/manifest.js';

const HELP = `coreboardingservices-copilot

Usage:
  coreboardingservices-copilot sync   [options]   Copy agents/prompts/skills/spec + AGENTS.md into this repo
  coreboardingservices-copilot check  [options]   Report drift of managed files (read-only, CI-friendly)
  coreboardingservices-copilot help               Show this help

Options:
  --dir <path>   Target directory (default: current working directory)
  --dry-run      Preview changes without writing (sync only)
  --force        Overwrite protected spec files too (sync only)
  --yes, -y      Skip confirmation prompts (reserved; sync is non-interactive)
  --version, -v  Print package version

Override policy:
  managed   .github/agents, .github/prompts, .github/skills, AGENTS.md  -> updated on sync
  protected spec/**                                                     -> created only if missing
`;

function parseArgs(argv) {
  const args = { _: [], dir: null, dryRun: false, force: false, yes: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    switch (a) {
      case '--dir':
        args.dir = argv[++i];
        break;
      case '--dry-run':
        args.dryRun = true;
        break;
      case '--force':
        args.force = true;
        break;
      case '--yes':
      case '-y':
        args.yes = true;
        break;
      case '--version':
      case '-v':
        args.version = true;
        break;
      case '--help':
      case '-h':
        args.help = true;
        break;
      default:
        args._.push(a);
    }
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const command = args._[0] ?? (args.version ? 'version' : 'help');
  const targetDir = resolve(args.dir ?? process.cwd());

  if (args.help || command === 'help') {
    process.stdout.write(HELP);
    return;
  }
  if (command === 'version') {
    process.stdout.write(`${packageVersion()}\n`);
    return;
  }

  if (command === 'sync') {
    const { results, version } = sync({
      targetDir,
      dryRun: args.dryRun,
      force: args.force,
    });
    printReport(results, { dryRun: args.dryRun, version, target: targetDir });
    return;
  }

  if (command === 'check') {
    const { results, version, hasDrift } = check({ targetDir });
    printReport(results, { version, target: targetDir });
    if (hasDrift) {
      process.stderr.write(
        '\nDrift detected. Run "coreboardingservices-copilot sync" to update.\n',
      );
      process.exitCode = 1;
    }
    return;
  }

  process.stderr.write(`Unknown command: ${command}\n\n${HELP}`);
  process.exitCode = 2;
}

main();

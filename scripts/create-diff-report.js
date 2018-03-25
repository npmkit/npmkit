const { promisify } = require('util');
const fs = require('fs');
const cp = require('child_process');
const path = require('path');
const { glob } = require('glob-gitignore');
const createMailSender = require('sendmail');

const DIFF_OUTPUT_DIR = '__diff_output__';
const sendMail = promisify(createMailSender({ silent: true }));
const cwd = process.cwd();
const outputZipPath = path.join(cwd, 'diff-snaps-report.zip');
const gitIgnorePath = path.join(cwd, '.gitignore');
const readFileAsync = promisify(fs.readFile);
const execFileAsync = promisify(cp.execFile);
const log = message => console.log(`[visual-diff-snapshots] ${message}`);

async function createAndSendReport() {
  // Read gitignore rules
  const gitIgnoreRules = (await readFileAsync(gitIgnorePath))
    .toString()
    .split('\n')
    .filter(rule => !rule.includes(DIFF_OUTPUT_DIR));
  // Collect list of files to archive
  const diffSnapshots = await glob([`**/${DIFF_OUTPUT_DIR}/**/*.png`], {
    cwd,
    ignore: gitIgnoreRules,
  });
  // Create an archive if diff exist
  if (diffSnapshots.length) {
    await execFileAsync('zip', ['-j', '-r', outputZipPath, ...diffSnapshots]);
    const lastCommitAuthor = (await execFileAsync('git', [
      'log',
      '-1',
      '--pretty=format:%ae',
    ])).stdout.toString();
    await sendMail({
      from: lastCommitAuthor,
      to: lastCommitAuthor,
      subject: 'npmkit visual diff report',
      html: `${diffSnapshots.length} snapshot(s) has failed.`,
      attachments: [{ filename: 'report.zip', path: outputZipPath }],
    });
    log(`Sent ${diffSnapshots.length} diff(s) to ${lastCommitAuthor}`);
  } else {
    log('No diff(s) found');
  }
  process.exit(0);
}

createAndSendReport();

const { execFileSync } = require('child_process');
const path = require('path');
const dir = path.join(__dirname, '.claude', 'worktrees', 'nice-williamson', 'client');
process.chdir(dir);
execFileSync(
  process.execPath,
  [path.join(dir, 'node_modules', 'vite', 'bin', 'vite.js'), '--port', '5174'],
  { stdio: 'inherit', cwd: dir }
);

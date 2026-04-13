const { execFileSync } = require('child_process');
const path = require('path');
const dir = path.join(__dirname, 'client');
process.chdir(dir);
execFileSync(
  process.execPath,
  [path.join(dir, 'node_modules', 'vite', 'bin', 'vite.js'), '--port', '5175'],
  { stdio: 'inherit', cwd: dir }
);

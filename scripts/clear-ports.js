const { execSync } = require('child_process');

const ports = [3000, 5173];

const stdout = execSync('netstat -ano -p tcp', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
const lines = stdout.split(/\r?\n/);
const pids = new Set();

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed) continue;

  const parts = trimmed.split(/\s+/);
  const port = parts[1]?.split(':')?.at(-1);
  const pid = parts[4];

  if (port && ports.includes(Number(port)) && pid && pid !== '0') {
    pids.add(pid);
  }
}

if (pids.size === 0) {
  console.log('No stale listeners found on ports 3000 or 5173.');
  process.exit(0);
}

console.log('Stopping stale listeners on ports 3000 and 5173...');

for (const pid of pids) {
  try {
    execSync(`taskkill /PID ${pid} /F`, { stdio: 'inherit' });
    console.log(`Stopped PID ${pid}`);
  } catch (err) {
    console.warn(`Failed to stop PID ${pid}: ${err.message}`);
  }
}

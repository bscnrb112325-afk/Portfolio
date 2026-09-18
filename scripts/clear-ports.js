const { execSync } = require('child_process');

const ports = [3000, 5173];

function getListeningPids() {
  try {
    const stdout = execSync('powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | Where-Object { $_.LocalPort -in (3000,5173) } | Select-Object -ExpandProperty OwningProcess"', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    });

    return [...new Set(
      stdout
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => /^\d+$/.test(line))
    )];
  } catch (err) {
    // Fallback for systems where PowerShell is unavailable or the command fails.
    const stdout = execSync('netstat -ano -p tcp', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    const pids = new Set();

    for (const line of stdout.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const parts = trimmed.split(/\s+/);
      const port = parts[1]?.split(':')?.at(-1);
      const pid = parts[4];

      if (port && ports.includes(Number(port)) && pid && pid !== '0') {
        pids.add(pid);
      }
    }

    return [...pids];
  }
}

const pids = getListeningPids();

if (pids.length === 0) {
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

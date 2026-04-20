#!/usr/bin/env node
'use strict';

const { execSync } = require('child_process');
const fs           = require('fs');
const path         = require('path');

// 1. Remove stale Turbopack dev lock
try {
  fs.rmSync(path.join(__dirname, '..', '.next', 'dev', 'lock'));
} catch {}

// 1b. Clear image optimization cache so replaced public images are picked up
try {
  fs.rmSync(path.join(__dirname, '..', '.next', 'dev', 'cache', 'images'), { recursive: true, force: true });
} catch {}

// 2. Free port 3000 — works on Windows (Git Bash / cmd) and Unix
try {
  if (process.platform === 'win32') {
    const raw = execSync('netstat -ano', { encoding: 'utf8', shell: true });
    const pids = [
      ...new Set(
        raw
          .split('\n')
          .filter(l => l.includes(':3000 ') && /LISTENING|ESTABLISHED/.test(l))
          .map(l => l.trim().split(/\s+/).at(-1))
          .filter(Boolean)
      ),
    ];
    if (pids.length) {
      pids.forEach(pid => {
        try { execSync(`taskkill /PID ${pid} /F`, { shell: true, stdio: 'ignore' }); } catch {}
      });
      console.log(`[predev] freed port 3000 (PID${pids.length > 1 ? 's' : ''}: ${pids.join(', ')})`);
    }
  } else {
    execSync('lsof -ti:3000 | xargs kill -9 2>/dev/null', { shell: true, stdio: 'ignore' });
  }
} catch {}

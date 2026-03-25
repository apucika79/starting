#!/usr/bin/env node
const { spawnSync } = require('node:child_process');

const bindingsByPlatformAndArch = {
  win32: {
    arm64: '@rollup/rollup-win32-arm64-msvc',
    ia32: '@rollup/rollup-win32-ia32-msvc',
    x64: '@rollup/rollup-win32-x64-msvc'
  },
  darwin: {
    arm64: '@rollup/rollup-darwin-arm64',
    x64: '@rollup/rollup-darwin-x64'
  },
  linux: {
    arm: '@rollup/rollup-linux-arm-gnueabihf',
    arm64: '@rollup/rollup-linux-arm64-gnu',
    x64: '@rollup/rollup-linux-x64-gnu'
  }
};

const packageName = bindingsByPlatformAndArch[process.platform]?.[process.arch];

if (!packageName) {
  process.exit(0);
}

try {
  require.resolve(packageName);
  process.exit(0);
} catch {
  console.warn(`[rollup-fix] Missing optional dependency: ${packageName}. Installing it now...`);
}

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const install = spawnSync(npmCmd, ['install', '--no-save', '--ignore-scripts', packageName], {
  stdio: 'inherit',
  env: process.env
});

if (install.status !== 0) {
  console.error(`[rollup-fix] Failed to install ${packageName}.`);
  process.exit(install.status ?? 1);
}

console.log(`[rollup-fix] Installed ${packageName}.`);

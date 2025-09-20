#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;
const distDir = path.join(projectRoot, 'dist');

const itemsToCopy = [
  'index.html',
  'css',
  'js',
  'fonts',
  'favicon.ico',
  'package.json',
  'server'
];

async function ensureCleanDist() {
  await fs.promises.rm(distDir, { recursive: true, force: true });
  await fs.promises.mkdir(distDir, { recursive: true });
}

async function copyItem(relativePath) {
  const sourcePath = path.join(projectRoot, relativePath);

  if (!fs.existsSync(sourcePath)) {
    console.warn(`Skipping missing path: ${relativePath}`);
    return;
  }

  const destinationPath = path.join(distDir, relativePath);
  await fs.promises.mkdir(path.dirname(destinationPath), { recursive: true });
  await fs.promises.cp(sourcePath, destinationPath, { recursive: true });
}

async function build() {
  await ensureCleanDist();

  for (const item of itemsToCopy) {
    await copyItem(item);
  }

  console.log(`Build completed. Output available in ${path.relative(projectRoot, distDir)}`);
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});

#!/usr/bin/env node
import { execSync } from 'child_process';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const OLD_COMPANY_NAME = /proper\s*rentals?/gi;
const IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  '.turbo',
  '.vercel',
  'coverage',
  '.env',
  '.env.*',
  'pnpm-lock.yaml',
  'package-lock.json',
  'yarn.lock',
  'guard-no-oldname.ts'
];

function searchInFile(filePath: string): { found: boolean; matches: string[] } {
  try {
    const content = readFileSync(filePath, 'utf8');
    const matches = content.match(OLD_COMPANY_NAME);
    return {
      found: matches !== null,
      matches: matches || []
    };
  } catch (error) {
    return { found: false, matches: [] };
  }
}

function shouldIgnore(path: string): boolean {
  const relativePath = relative(process.cwd(), path);
  return IGNORE_PATTERNS.some(pattern => {
    if (pattern.includes('*')) {
      return relativePath.includes(pattern.replace('*', ''));
    }
    return relativePath.includes(pattern);
  });
}

function searchDirectory(dir: string): { files: string[]; totalMatches: number } {
  const results: string[] = [];
  let totalMatches = 0;

  function walk(currentDir: string) {
    if (shouldIgnore(currentDir)) {
      return;
    }

    const items = readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = join(currentDir, item);
      
      if (shouldIgnore(fullPath)) {
        continue;
      }

      const stats = statSync(fullPath);
      
      if (stats.isDirectory()) {
        walk(fullPath);
      } else if (stats.isFile()) {
        const { found, matches } = searchInFile(fullPath);
        if (found) {
          results.push(fullPath);
          totalMatches += matches.length;
        }
      }
    }
  }

  walk(dir);
  return { files: results, totalMatches };
}

console.log('🔍 Searching for old company name "Proper Rentals"...\n');

const { files, totalMatches } = searchDirectory(process.cwd());

if (files.length > 0) {
  console.error(`❌ Found ${totalMatches} instance(s) of "Proper Rentals" in ${files.length} file(s):\n`);
  
  files.forEach(file => {
    const relativePath = relative(process.cwd(), file);
    console.error(`  - ${relativePath}`);
  });
  
  console.error('\n❌ Build failed: Old company name still exists in the codebase!');
  console.error('Please remove all references to "Proper Rentals" before proceeding.\n');
  process.exit(1);
} else {
  console.log('✅ No instances of "Proper Rentals" found in the codebase.\n');
  process.exit(0);
}

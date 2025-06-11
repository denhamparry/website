#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

console.log(chalk.blue('🔨 Running Hugo Build Tests...\n'));

const tests = [
  {
    name: 'Hugo Version Check',
    test: () => {
      const version = execSync('hugo version', { encoding: 'utf8' });
      console.log(chalk.gray(`Hugo version: ${version.trim()}`));
      return version.includes('hugo');
    }
  },
  {
    name: 'Hugo Build (Production)',
    test: () => {
      try {
        execSync('hugo --gc --minify', { stdio: 'inherit' });
        return true;
      } catch (error) {
        console.error(chalk.red('Build failed:', error.message));
        return false;
      }
    }
  },
  {
    name: 'Public Directory Created',
    test: () => {
      return fs.existsSync(path.join(process.cwd(), 'public'));
    }
  },
  {
    name: 'Index.html Generated',
    test: () => {
      return fs.existsSync(path.join(process.cwd(), 'public', 'index.html'));
    }
  },
  {
    name: 'Talks Page Generated',
    test: () => {
      return fs.existsSync(path.join(process.cwd(), 'public', 'talks', 'index.html'));
    }
  },
  {
    name: 'Static Assets Copied',
    test: () => {
      return fs.existsSync(path.join(process.cwd(), 'public', 'images', 'talks', 'hotdog.jpg'));
    }
  },
  {
    name: 'RSS Feed Generated',
    test: () => {
      return fs.existsSync(path.join(process.cwd(), 'public', 'index.xml'));
    }
  },
  {
    name: 'Sitemap Generated',
    test: () => {
      return fs.existsSync(path.join(process.cwd(), 'public', 'sitemap.xml'));
    }
  },
  {
    name: 'No HTML Validation Errors',
    test: () => {
      const indexContent = fs.readFileSync(path.join(process.cwd(), 'public', 'index.html'), 'utf8');
      // Check for common HTML issues
      const hasDoctype = indexContent.includes('<!DOCTYPE html>') || indexContent.includes('<!doctype html>');
      const hasHtmlTag = indexContent.includes('<html');
      const hasHeadTag = indexContent.includes('<head>') || indexContent.includes('<head ');
      const hasBodyTag = indexContent.includes('<body>') || indexContent.includes('<body ');
      
      if (!hasDoctype) console.error(chalk.yellow('  Missing DOCTYPE declaration'));
      if (!hasHtmlTag) console.error(chalk.yellow('  Missing <html> tag'));
      if (!hasHeadTag) console.error(chalk.yellow('  Missing <head> tag'));
      if (!hasBodyTag) console.error(chalk.yellow('  Missing <body> tag'));
      
      return hasDoctype && hasHtmlTag && hasHeadTag && hasBodyTag;
    }
  }
];

let passed = 0;
let failed = 0;

tests.forEach(({ name, test }) => {
  try {
    if (test()) {
      console.log(chalk.green(`✓ ${name}`));
      passed++;
    } else {
      console.log(chalk.red(`✗ ${name}`));
      failed++;
    }
  } catch (error) {
    console.log(chalk.red(`✗ ${name}`));
    console.error(chalk.red(`  Error: ${error.message}`));
    failed++;
  }
});

console.log('\n' + chalk.bold('Test Results:'));
console.log(chalk.green(`  Passed: ${passed}`));
console.log(chalk.red(`  Failed: ${failed}`));

if (failed > 0) {
  console.log('\n' + chalk.red('❌ Hugo build tests failed!'));
  process.exit(1);
} else {
  console.log('\n' + chalk.green('✅ All Hugo build tests passed!'));
}
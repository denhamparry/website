#!/usr/bin/env node

const { AxePuppeteer } = require('@axe-core/puppeteer');
const puppeteer = require('puppeteer');
const chalk = require('chalk');

console.log(chalk.blue('♿ Running Accessibility Tests...\n'));

const pages = [
  { name: 'Homepage', url: 'http://localhost:1313' },
  { name: 'Talks Page', url: 'http://localhost:1313/talks' },
  { name: '404 Page', url: 'http://localhost:1313/404.html' }
];

async function runAccessibilityTests() {
  const browser = await puppeteer.launch({ headless: 'new' });
  let totalViolations = 0;
  let totalPasses = 0;

  for (const pageInfo of pages) {
    console.log(chalk.bold(`\nTesting: ${pageInfo.name}`));
    console.log(chalk.gray(`URL: ${pageInfo.url}`));
    
    try {
      const page = await browser.newPage();
      await page.goto(pageInfo.url, { waitUntil: 'networkidle0' });
      
      // Run axe accessibility tests
      const results = await new AxePuppeteer(page)
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
        .analyze();
      
      // Report violations
      if (results.violations.length > 0) {
        console.log(chalk.red(`\n  ❌ Found ${results.violations.length} accessibility violations:`));
        
        results.violations.forEach((violation, index) => {
          console.log(chalk.red(`\n  ${index + 1}. ${violation.description}`));
          console.log(chalk.yellow(`     Impact: ${violation.impact}`));
          console.log(chalk.gray(`     Help: ${violation.help}`));
          console.log(chalk.gray(`     More info: ${violation.helpUrl}`));
          
          violation.nodes.forEach((node, nodeIndex) => {
            console.log(chalk.gray(`\n     Element ${nodeIndex + 1}:`));
            console.log(chalk.gray(`       ${node.html}`));
            if (node.failureSummary) {
              console.log(chalk.gray(`       Issue: ${node.failureSummary}`));
            }
          });
        });
        
        totalViolations += results.violations.length;
      } else {
        console.log(chalk.green('  ✅ No accessibility violations found!'));
      }
      
      // Report passes
      if (results.passes.length > 0) {
        console.log(chalk.green(`  ✓ Passed ${results.passes.length} accessibility checks`));
        totalPasses += results.passes.length;
      }
      
      // Report best practices
      const criticalViolations = results.violations.filter(v => v.impact === 'critical');
      const seriousViolations = results.violations.filter(v => v.impact === 'serious');
      
      if (criticalViolations.length > 0) {
        console.log(chalk.red(`\n  ⚠️  ${criticalViolations.length} CRITICAL violations found!`));
      }
      if (seriousViolations.length > 0) {
        console.log(chalk.yellow(`  ⚠️  ${seriousViolations.length} SERIOUS violations found!`));
      }
      
      await page.close();
    } catch (error) {
      console.log(chalk.red(`\n  Error testing ${pageInfo.name}: ${error.message}`));
      totalViolations++;
    }
  }

  await browser.close();

  // Summary
  console.log(chalk.bold('\n\n📊 Accessibility Test Summary:'));
  console.log(chalk.green(`  Total checks passed: ${totalPasses}`));
  console.log(chalk.red(`  Total violations: ${totalViolations}`));
  
  if (totalViolations === 0) {
    console.log(chalk.green('\n✅ All accessibility tests passed! Your site is accessible.'));
    process.exit(0);
  } else {
    console.log(chalk.red(`\n❌ Found ${totalViolations} accessibility issues that need to be fixed.`));
    console.log(chalk.yellow('\n💡 Tips for fixing accessibility issues:'));
    console.log(chalk.gray('  - Ensure all images have alt text'));
    console.log(chalk.gray('  - Use semantic HTML elements'));
    console.log(chalk.gray('  - Ensure sufficient color contrast'));
    console.log(chalk.gray('  - Make all interactive elements keyboard accessible'));
    console.log(chalk.gray('  - Use ARIA labels where appropriate'));
    process.exit(1);
  }
}

// Check if Hugo server is running
const http = require('http');
http.get('http://localhost:1313', (res) => {
  if (res.statusCode === 200) {
    runAccessibilityTests();
  }
}).on('error', () => {
  console.log(chalk.red('❌ Hugo server is not running!'));
  console.log(chalk.yellow('Please start the Hugo server with: hugo server'));
  process.exit(1);
});
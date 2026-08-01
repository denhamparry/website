#!/usr/bin/env node

const { AxePuppeteer } = require("@axe-core/puppeteer");
const puppeteer = require("puppeteer");
const { styleText } = require("node:util");

console.log(styleText("blue", "♿ Running Accessibility Tests...\n"));

const pages = [
  { name: "Homepage", url: "http://localhost:1313" },
  { name: "Talks Page", url: "http://localhost:1313/talks" },
  { name: "404 Page", url: "http://localhost:1313/404.html" },
];

async function runAccessibilityTests() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });
  let totalViolations = 0;
  let totalPasses = 0;

  for (const pageInfo of pages) {
    console.log(styleText("bold", `\nTesting: ${pageInfo.name}`));
    console.log(styleText("gray", `URL: ${pageInfo.url}`));

    try {
      const page = await browser.newPage();
      await page.goto(pageInfo.url, { waitUntil: "networkidle0" });

      // Run axe accessibility tests
      const results = await new AxePuppeteer(page)
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
        .analyze();

      // Report violations
      if (results.violations.length > 0) {
        console.log(
          styleText(
            "red",
            `\n  ❌ Found ${results.violations.length} accessibility violations:`,
          ),
        );

        results.violations.forEach((violation, index) => {
          console.log(
            styleText("red", `\n  ${index + 1}. ${violation.description}`),
          );
          console.log(styleText("yellow", `     Impact: ${violation.impact}`));
          console.log(styleText("gray", `     Help: ${violation.help}`));
          console.log(
            styleText("gray", `     More info: ${violation.helpUrl}`),
          );

          violation.nodes.forEach((node, nodeIndex) => {
            console.log(styleText("gray", `\n     Element ${nodeIndex + 1}:`));
            console.log(styleText("gray", `       ${node.html}`));
            if (node.failureSummary) {
              console.log(
                styleText("gray", `       Issue: ${node.failureSummary}`),
              );
            }
          });
        });

        totalViolations += results.violations.length;
      } else {
        console.log(
          styleText("green", "  ✅ No accessibility violations found!"),
        );
      }

      // Report passes
      if (results.passes.length > 0) {
        console.log(
          styleText(
            "green",
            `  ✓ Passed ${results.passes.length} accessibility checks`,
          ),
        );
        totalPasses += results.passes.length;
      }

      // Report best practices
      const criticalViolations = results.violations.filter(
        (v) => v.impact === "critical",
      );
      const seriousViolations = results.violations.filter(
        (v) => v.impact === "serious",
      );

      if (criticalViolations.length > 0) {
        console.log(
          styleText(
            "red",
            `\n  ⚠️  ${criticalViolations.length} CRITICAL violations found!`,
          ),
        );
      }
      if (seriousViolations.length > 0) {
        console.log(
          styleText(
            "yellow",
            `  ⚠️  ${seriousViolations.length} SERIOUS violations found!`,
          ),
        );
      }

      await page.close();
    } catch (error) {
      console.log(
        styleText(
          "red",
          `\n  Error testing ${pageInfo.name}: ${error.message}`,
        ),
      );
      totalViolations++;
    }
  }

  await browser.close();

  // Summary
  console.log(styleText("bold", "\n\n📊 Accessibility Test Summary:"));
  console.log(styleText("green", `  Total checks passed: ${totalPasses}`));
  console.log(styleText("red", `  Total violations: ${totalViolations}`));

  if (totalViolations === 0) {
    console.log(
      styleText(
        "green",
        "\n✅ All accessibility tests passed! Your site is accessible.",
      ),
    );
    process.exit(0);
  } else {
    console.log(
      styleText(
        "red",
        `\n❌ Found ${totalViolations} accessibility issues that need to be fixed.`,
      ),
    );
    console.log(
      styleText("yellow", "\n💡 Tips for fixing accessibility issues:"),
    );
    console.log(styleText("gray", "  - Ensure all images have alt text"));
    console.log(styleText("gray", "  - Use semantic HTML elements"));
    console.log(styleText("gray", "  - Ensure sufficient colour contrast"));
    console.log(
      styleText(
        "gray",
        "  - Make all interactive elements keyboard accessible",
      ),
    );
    console.log(styleText("gray", "  - Use ARIA labels where appropriate"));
    process.exit(1);
  }
}

// Check if Hugo server is running
const http = require("http");
http
  .get("http://localhost:1313", (res) => {
    if (res.statusCode === 200) {
      runAccessibilityTests();
    }
  })
  .on("error", () => {
    console.log(styleText("red", "❌ Hugo server is not running!"));
    console.log(
      styleText("yellow", "Please start the Hugo server with: hugo server"),
    );
    process.exit(1);
  });

#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/**
 * Extract human-readable content from markdown, excluding:
 * - YAML front matter
 * - URLs and links
 * - Code blocks
 * - HTML tags
 * - Markdown syntax
 * - Video IDs and technical identifiers
 */

function extractReadableContent(markdownContent) {
  let content = markdownContent;

  // Remove YAML front matter (between --- and ---)
  content = content.replace(/^---[\s\S]*?---\n?/m, "");

  // Remove code blocks (``` and ` blocks)
  content = content.replace(/```[\s\S]*?```/g, "");
  content = content.replace(/`[^`\n]+`/g, "");

  // Remove links but keep link text
  content = content.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // Remove standalone URLs
  content = content.replace(/https?:\/\/[^\s)]+/g, "");

  // Remove HTML tags
  content = content.replace(/<[^>]+>/g, "");

  // Remove markdown headers (keep the text)
  content = content.replace(/^#{1,6}\s+/gm, "");

  // Remove markdown list markers
  content = content.replace(/^[\s]*[-*+]\s+/gm, "");

  // Remove markdown emphasis markers
  content = content.replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, "$1");

  // Remove image syntax
  content = content.replace(/!\[[^\]]*\]\([^)]+\)/g, "");

  // Remove video IDs and technical identifiers (patterns like v=abc123, si=def456)
  content = content.replace(/[?&]v=[a-zA-Z0-9_-]+/g, "");
  content = content.replace(/[?&]si=[a-zA-Z0-9_-]+/g, "");
  content = content.replace(/[?&]t=[0-9]+s?/g, "");

  // Remove standalone technical identifiers (common patterns)
  content = content.replace(/\b[a-f0-9]{32,}\b/gi, ""); // Hash-like strings (32+ hex chars)
  content = content.replace(/\b[A-Z0-9]{8,}\b/g, ""); // All-caps technical IDs (8+ chars)

  // Remove dates in various formats
  content = content.replace(
    /\b\d{1,2}(st|nd|rd|th)?\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b/g,
    "",
  );
  content = content.replace(/\b\d{4}-\d{2}-\d{2}\b/g, "");

  // Clean up multiple spaces and newlines
  content = content.replace(/\s+/g, " ");
  content = content.replace(/\n\s*\n/g, "\n");

  return content.trim();
}

function main() {
  const talksFile = path.join(process.cwd(), "content/talks.md");

  if (!fs.existsSync(talksFile)) {
    console.error("Error: content/talks.md not found");
    process.exit(1);
  }

  const markdownContent = fs.readFileSync(talksFile, "utf8");
  const readableContent = extractReadableContent(markdownContent);

  // Write to temporary file for misspell to check
  const tempFile = path.join(process.cwd(), ".talks-content-only.txt");
  fs.writeFileSync(tempFile, readableContent);

  console.log(`Extracted readable content to ${tempFile}`);
  console.log(`Content length: ${readableContent.length} characters`);
}

if (require.main === module) {
  main();
}

module.exports = { extractReadableContent };

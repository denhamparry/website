# Website Testing Suite

This directory contains comprehensive tests for the denhamparry.co.uk website.

## Test Categories

### 1. Hugo Build Tests (`hugo/`)
- Verifies Hugo builds successfully
- Checks generated file structure
- Validates HTML output
- Ensures static assets are copied correctly

### 2. Functional Tests (`functional/`)
- **Navigation Tests**: Menu, links, and page routing
- **Content Tests**: Proper rendering of talks and metadata
- **Theme Tests**: Dark/light mode switching
- **SEO Tests**: Meta tags and structured data

### 3. Accessibility Tests (`accessibility/`)
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader compatibility
- Colour contrast validation
- ARIA labels and semantic HTML

## Running Tests Locally

### Prerequisites
```bash
# Install dependencies
npm install
```

### Run All Tests
```bash
# Run the complete test suite
./test.sh

# Or run individual test suites
npm test                    # Run all tests
npm run test:hugo          # Hugo build tests only
npm run test:functional    # Functional tests only
npm run test:accessibility # Accessibility tests only
npm run test:links        # Link validation only
```

### Running Tests Individually

#### Hugo Build Tests
```bash
node tests/hugo/test-hugo-build.js
```

#### Functional Tests (requires Hugo server)
```bash
# Start Hugo server in one terminal
hugo server

# Run tests in another terminal
npm run test:functional
```

#### Accessibility Tests (requires Hugo server)
```bash
# Start Hugo server in one terminal
hugo server

# Run tests in another terminal
node tests/accessibility/test-accessibility.js
```

## CI/CD Integration

Tests run automatically on:
- Every push to `main` branch
- Every pull request

GitHub Actions workflow includes:
- Hugo build verification
- Functional testing
- Accessibility testing
- Link checking
- HTML validation
- Security header checks
- Lighthouse performance audits

## Writing New Tests

### Adding Functional Tests
Create new test files in `tests/functional/` following the Jest pattern:

```javascript
describe('Feature Name', () => {
  test('specific behavior', async () => {
    // Test implementation
  });
});
```

### Accessibility Guidelines
When adding new features, ensure:
- All images have alt text
- Interactive elements are keyboard accessible
- Sufficient colour contrast (4.5:1 for normal text)
- Proper heading hierarchy
- Form labels are associated with inputs

## Test Results

Test results in CI are available in:
- GitHub Actions tab for each PR/commit
- Netlify preview deployments for PRs
- Lighthouse reports for performance metrics

## Troubleshooting

### Tests fail locally but pass in CI
- Ensure Hugo version matches CI (check `.github/workflows/test.yml`)
- Clear Hugo cache: `hugo mod clean`
- Rebuild: `hugo --gc`

### Accessibility test failures
- Use browser DevTools accessibility inspector
- Check axe DevTools extension for detailed reports
- Refer to specific WCAG guidelines linked in test output

### Link checker false positives
- External links may fail due to rate limiting
- Add exceptions in `linkinator` config if needed
- Focus on internal broken links first
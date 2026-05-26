# Investigate `Website Tests` GitHub Action Failure

## Summary
The `Website Tests` GitHub Action is failing during the functional test stage. The error logs indicate that Jest encountered syntax it could not parse. This resulted in failures for the following test suites:
- `content.test.js`
- `navigation.test.js`

### Error Snippet
```plaintext
FAIL tests/functional/content.test.js
● Test suite failed to run

Jest encountered an error:
- Unexpected token detected.
- May require additional Babel/Jest configuration for compatibility.

FAIL tests/functional/navigation.test.js
● Test suite failed to run

Same syntax-related error as above.
```

### Investigation Plan
#### To-do:
1. **Check Syntax Versions** — Ensure JavaScript syntax used in test files is fully supported.
2. **Update Jest/Babel Configurations**:
   - Adjust transforms for ES6/TypeScript syntax if required.
3. **Run Locally**:
   - Identify reproducibility locally with detailed Jest CLI outputs (`jest --no-cache --watchAll=false`).

#### Associated Artifacts
**Logs**: [(Access Full Logs Here)](https://github.com/denhamparry/website/actions/runs/26321776948/job/77845546659)
**Workflow** File Path: `.github/workflows/test.yml`
# Plan: Pin GitHub Actions to SHA Digests

- **Issue:** #226
- **Status:** In Progress
- **Branch:** denhamparry.co.uk/fix/gh-issue-226
- **Type:** Security hardening

## Problem

All GitHub Actions in this repository use mutable version tags (`@v4`, `@beta`,
`@v2`) instead of immutable SHA digests. A compromised upstream action
maintainer could push malicious code to an existing tag, affecting all workflows
that reference it.

## Solution

Pin every `uses:` reference to its full 40-character commit SHA, with a human-
readable version comment. Also upgrade stale references:

- `actions/checkout@v3` -> v4 (create-issues-for-outdated-pages.yml)
- `actions/github-script@v6` -> v7 (create-issues-for-outdated-pages.yml,
  link-check.yml)
- `lycheeverse/lychee-action@v2.0.2` -> v2.8.0

## SHA Reference Table

| Action                           | Pin SHA                                  | Version         |
| -------------------------------- | ---------------------------------------- | --------------- |
| actions/checkout                 | 34e114876b0b11c390a56381ad16ebd13914f8d5 | v4.3.1          |
| actions/setup-node               | 49933ea5288caeca8642d1e84afbd3f7d6820020 | v4.4.0          |
| actions/cache                    | 0057852bfaa89a56745cba8c7296529d2fc39830 | v4.3.0          |
| actions/upload-artifact          | ea165f8d65b6e75b540449e92b4886f43607fa02 | v4.6.2          |
| actions/download-artifact        | d3f86a106a0bac45b974a628896c90dbdf5c8093 | v4.3.0          |
| actions/github-script            | f28e40c7f34bde8b3046d885e986cb6290c5673b | v7.1.0          |
| anthropics/claude-code-action    | 28f83620103c48a57093dcc2837eec89e036bb9f | beta            |
| siderolabs/conform               | cfdb3cce90daece912e6a5cb3f20b2316a78a5bf | v0.1.0-alpha.31 |
| peaceiris/actions-hugo           | 16361eb4acea8698b220b76c0d4e84e1fd22c61d | v2.6.0          |
| Cyb3r-Jak3/html5validator-action | 41633d488eb36e18fd1a95ffc83daf1bf22a75bd | v7.2.0          |
| lycheeverse/lychee-action        | 8646ba30535128ac92d33dfc9133794bfdd9b411 | v2.8.0          |
| nwtgck/actions-netlify           | 7a92f00dde8c92a5a9e8385ec2919775f7647352 | v2.1.0          |

## Files Modified

- `.github/workflows/claude.yml`
- `.github/workflows/conform.yml`
- `.github/workflows/create-issues-for-outdated-pages.yml`
- `.github/workflows/link-check.yml`
- `.github/workflows/misspell.yml`
- `.github/workflows/test.yml`

## Implementation Steps

1. Pin actions in `claude.yml` (checkout, claude-code-action)
2. Pin actions in `conform.yml` (checkout, conform)
3. Pin actions in `create-issues-for-outdated-pages.yml` (checkout v3->v4,
   github-script v6->v7)
4. Pin actions in `link-check.yml` (checkout, lychee-action, github-script
   v6->v7)
5. Pin actions in `misspell.yml` (checkout, setup-node)
6. Pin actions in `test.yml` (checkout, hugo, setup-node, cache,
   upload-artifact, download-artifact, html5validator, netlify)
7. Run pre-commit hooks
8. Commit changes

## Acceptance Criteria

- [ ] All `uses:` references pinned to full SHA digests
- [ ] Each pinned reference has a version comment (e.g. `# v4.3.1`)
- [ ] `actions/checkout@v3` upgraded to v4
- [ ] `actions/github-script@v6` upgraded to v7
- [ ] Pre-commit hooks pass

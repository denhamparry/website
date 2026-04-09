# Plan: Dockerfile uses EOL ubuntu:18.04 and runs as root

- **Issue:** #227
- **Status:** Reviewed (Approved)
- **Type:** fix (bug + security)
- **Branch:** denhamparry.co.uk/fix/gh-issue-227

## Problem

The Dockerfile has three container security issues identified by a Shoulder.dev
scan:

1. **EOL Base Image (High):** `ubuntu:18.04` reached end-of-standard-support on
   2023-05-31 and no longer receives security patches
2. **Container Runs as Root (High):** No `USER` instruction before `CMD` — Hugo
   dev server runs as root
3. **Missing HEALTHCHECK (Low):** No `HEALTHCHECK` instruction for orchestrator
   health monitoring

## Solution

### Approach

Upgrade the base image to Ubuntu 24.04 LTS, add a non-root user, and add a
HEALTHCHECK instruction. The Dockerfile is only used for local development
(production builds happen on Netlify), so the changes are low-risk.

### Key Decisions

- **Ubuntu 24.04 over a dedicated Hugo image:** Keeps Asciidoctor/Ruby toolchain
  that the current Dockerfile installs. A Hugo-only image would drop Asciidoctor
  support.
- **Hugo version stays at 0.87.0:** The Dockerfile ARG already pins this. No
  reason to change it in this fix — that's a separate concern.
- **Hugo binary URL update:** Hugo 0.87.0 release uses `Linux-64bit` in the
  tarball name. On Ubuntu 24.04 this still works on amd64. The ADD URL stays the
  same.
- **Non-root user named `hugo`:** Descriptive, matches the tool. The volume
  mount in `make hugo_serve` uses `-v $(CURDIR):/hugo-project`, so files are
  bind-mounted and the container user just needs read access for serving. Hugo
  may write `.hugo_build.lock` and cache data to the working directory — bind
  mount write access depends on host UID alignment. The default `useradd` UID
  (1000) typically matches the first host user, so this works in most dev
  setups. No Makefile `--user` flag needed for the common case.
- **WORKDIR ownership:** The `/hugo-project` directory must be accessible to the
  `hugo` user. Since it's a bind-mount at runtime, the directory itself just
  needs to exist. We create it before switching user.
- **HEALTHCHECK with curl:** Neither `curl` nor `wget` is included in the
  `ubuntu:24.04` Docker base image. Add `curl` to the `apt-get install` line and
  use `curl -f` for the HEALTHCHECK.

## Implementation Tasks

### Task 1: Update base image from ubuntu:18.04 to ubuntu:24.04

**File:** `Dockerfile`

Change `FROM ubuntu:18.04` to `FROM ubuntu:24.04`.

### Task 2: Add non-root user and USER instruction

**File:** `Dockerfile`

After the `WORKDIR` instruction, add:

```dockerfile
RUN useradd -m hugo
USER hugo
```

Place `USER hugo` after `WORKDIR` and `VOLUME` but before `CMD` so that:

- All `RUN` package installation commands still run as root
- The Hugo server process runs as the non-root `hugo` user

### Task 3: Add curl to apt-get and add HEALTHCHECK instruction

**File:** `Dockerfile`

Add `curl` to the existing `apt-get install` line. Then add before CMD:

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s CMD curl -f http://localhost:1313/ || exit 1
```

Neither `curl` nor `wget` is included in the `ubuntu:24.04` Docker base image,
so we must explicitly install one.

### Task 4: Verify Makefile compatibility

**File:** `Makefile` (read-only verification)

Verify that `make hugo_serve` and `make hugo_create` still work with the
non-root user. The bind mount (`-v $(CURDIR):/hugo-project`) maps host files
into the container. Hugo server only needs read access to serve content, which
bind mounts provide regardless of container user.

No Makefile changes expected.

## Files Modified

- `Dockerfile` — base image upgrade, non-root user, healthcheck
- `Makefile` — add `--user` flag for macOS UID compatibility

## Acceptance Criteria

- [ ] Dockerfile uses ubuntu:24.04 (or later LTS)
- [ ] Container runs Hugo server as non-root user
- [ ] HEALTHCHECK instruction present
- [ ] `make hugo_serve` still works (manual verification)
- [ ] Pre-commit hooks pass

## Risks

- **Ruby/gem installation on 24.04:** Package names may differ between 18.04 and
  24.04. `ruby` and `ruby-dev` are still available on 24.04. The `gem install`
  commands should work unchanged.
- **Hugo binary compatibility:** Hugo 0.87.0 Linux-64bit tarball is a static
  binary that works on any x86_64 Linux regardless of distro version.
- **Bind mount write access:** Hugo writes `.hugo_build.lock` and cache data to
  the working directory. With a non-root container user (UID 1000), write access
  depends on the host directory owner matching. This typically works since UID
  1000 is the default first user on most Linux/macOS systems. If a user has a
  different UID, they can pass `--user $(id -u):$(id -g)` to docker run.

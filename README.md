# The Helios Project

A Journaling app written in JavaScript using the Next.js framework. The purpose of this app, other than to provide a web based journaling experience, is to leverage the full Vercel development suite to discover the benifits and limitations of said service.

## Project requirenments

1. Node 24 (>= 24.21.0, see `.nvmrc`)
2. nvm
3. PostgreSQL
4. Redis

## Setup

1. copy enviornment variables - `cp .env.example .env.local`
2. check and use correct Node version - `nvm install && nvm use`
3. install dependencies - `npm install`
4. run developer server - `npm run dev`

### Seed data

1. make sure local postgres instance is running
2. run `npm run postges::seed`
3. for first time users answer `y` to both questions

### Drop data

1. make sure local postgres instance is running
2. run `npm run postgres::drop`
3. enter `y` when promted

### Update Seed data

[todo]

## Redis

1. Add local redis url for SESSIONS_URL (Default is redis://localhost:6379)
2. Select a TTL (Time To Live) and set it to SESSIONS_TTL (Calculated in seconds)

## Known issues

`npm audit` reports 5 high severity advisories. All of them trace back to a single
root: `braces` (GHSA-vfj7-8cjw-p6xm, stack exhaustion via deeply nested patterns),
pulled in by `micromatch` -> `fast-glob` -> `@next/eslint-plugin-next` ->
`eslint-config-next`.

**Do not run `npm audit fix --force`.** There is no patched release available —
`braces@3.0.3` is both the installed and the latest published version, and the
vulnerable range is `<=3.0.3`, so the advisory cannot be resolved at any version.
The only "fix" npm offers is downgrading `eslint-config-next` to `14.x`, which
downgrades Next's plugin to the legacy `.eslintrc` format and breaks the ESLint 9
flat config in `eslint.config.mjs` (`ERR_MODULE_NOT_FOUND` on
`eslint-config-next/core-web-vitals`). It also swaps in a `glob` command-injection
advisory in the process, trading one hole for two.

Risk is low: these are dev-only dependencies that never reach the production
bundle, and the DoS requires attacker-controlled glob patterns reaching the linter
(CI lint step), not runtime input. Re-check after the next Next.js minor release.

### Install scripts

`bcrypt`, `@parcel/watcher`, and `unrs-resolver` are listed in `allowScripts` as
`false` in `package.json`. All three ship prebuilt binaries, so their `node-gyp`
install/postinstall steps are unnecessary and are skipped as a supply-chain
measure. If you ever see a "Could not locate the bindings file" error from
`bcrypt` after changing platforms, approve it with
`npm install-scripts approve bcrypt`.

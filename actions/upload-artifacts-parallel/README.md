# Upload Artifacts Parallel

Uploads each subdirectory of a given path as a separate GitHub artifact, in parallel.

## Why

The official [`actions/upload-artifact`](https://github.com/actions/upload-artifact) action uploads a single artifact per step. There is an [open feature request](https://github.com/actions/upload-artifact/issues/331) to support multiple artifacts in a single invocation, but it has been open since 2022 with no movement from the maintainers. No existing open-source action provided this capability either.

This action wraps the same `@actions/artifact` library that the official action uses, but fires all uploads concurrently via `Promise.all`. In practice this cuts upload time to roughly a third compared to sequential uploads.

## Usage

```yaml
- uses: spacelift-io/shared-actions/actions/upload-artifacts-parallel@main
  with:
    name: binaries
    path: bin
```

Given a directory structure like:

```
bin/
  amd64/
    myapp
  arm64/
    myapp
```

This produces two artifacts: `binaries-amd64` and `binaries-arm64`.

## Inputs

| Name             | Required | Description                                              |
|------------------|----------|----------------------------------------------------------|
| `name`           | Yes      | Artifact name prefix. Each subdirectory becomes `{name}-{subdir}` |
| `path`           | Yes      | Path containing subdirectories to upload                 |
| `retention-days` | No       | Number of days to retain artifacts (1-90)                |

## Outputs

| Name        | Description                              |
|-------------|------------------------------------------|
| `artifacts` | JSON array of uploaded artifact names    |

The output can be consumed in a follow-up job with `fromJSON()`, e.g. to fan out downloads via a matrix strategy.

## Development

```sh
npm install
npm run release   # bundles src/index.ts into dist/index.js via esbuild
```

The `dist/` directory is committed so the action can be used directly without a build step in CI.

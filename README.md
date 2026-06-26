# shared-actions

Shared GitHub Actions for Spacelift. This repository provides reusable composite actions that can be consumed across repositories.

## Usage

Reference actions from your workflows:

```yaml
- uses: spacelift-io/shared-actions/actions/<action-name>@main
```

## Available Actions

| Action | Description |
|--------|-------------|
| [notify-workflow-failure](actions/notify-workflow-failure) | Sends Slack notifications when a workflow fails, tracking the first failure and commit authors |
| [purge-cloudflare-cache](actions/purge-cloudflare-cache) | Purges the Cloudflare edge cache for one or more URL prefixes in a single zone |
| [upload-artifacts-parallel](actions/upload-artifacts-parallel) | Uploads each subdirectory of a path as a separate artifact in parallel |

## Adding a New Action

1. Create a new directory under `actions/` using kebab-case naming
2. Add an `action.yml` defining a composite action
3. Add a `README.md` documenting usage, inputs, and behavior

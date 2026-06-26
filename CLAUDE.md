# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

Shared GitHub Actions repository for Spacelift (`spacelift-io/shared-actions`). Contains reusable composite actions used across multiple repositories.

## Repository Structure

```
actions/
  <action-name>/
    action.yml      # Composite action definition
    README.md       # Action documentation (features, usage, inputs, payload)
```

Each action lives in its own directory under `actions/` and is a composite GitHub Action using bash shell steps.

## Action Patterns

- Actions use composite runner (`using: 'composite'`) with bash steps
- GitHub CLI (`gh`) is used for GitHub API interactions
- Outputs are passed between steps via `$GITHUB_OUTPUT`
- Each action has its own README.md documenting usage, inputs, and behavior

## Consuming Actions

Actions are referenced from other repositories as:
```yaml
uses: spacelift-io/shared-actions/actions/<action-name>@main
```

## PR Process

A PR template exists at `.github/pull_request_template.md`. Key review requirement: assess the impact of changes on workflows currently consuming these actions.

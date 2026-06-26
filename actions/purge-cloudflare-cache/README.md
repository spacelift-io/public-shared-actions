# Purge Cloudflare Cache

Purge the Cloudflare edge cache for one or more URL prefixes in a single zone.


## Usage

Single prefix:

```yaml
- uses: spacelift-io/shared-actions/actions/purge-cloudflare-cache@main
  with:
    zone_id: ${{ vars.EU_DOWNLOADS_CLOUDFLARE_ZONE_ID }}
    api_token: ${{ secrets.EU_CLOUDFLARE_CACHE_PURGE_TOKEN }}
    purge_prefixes: downloads.spacelift.io/spacelift-vcs-agent
```

Multiple prefixes (one per line):

```yaml
- uses: spacelift-io/shared-actions/actions/purge-cloudflare-cache@main
  with:
    zone_id: ${{ vars.EU_DOWNLOADS_CLOUDFLARE_ZONE_ID }}
    api_token: ${{ secrets.EU_CLOUDFLARE_CACHE_PURGE_TOKEN }}
    purge_prefixes: |
      downloads.spacelift.io/spacelift-launcher
      downloads.spacelift.io/spacelift-worker
```

## Prefix format

Each entry is sent to Cloudflare's `purge_cache` API as a literal **string prefix**, not a URL pattern:

- Omit the scheme — pass `host/path`, not `https://host/path`.
- A trailing slash matters. `host/foo` also purges `host/foobar`; `host/foo/` only purges paths under `/foo/`.
- Anything that begins with the entry is considered a match (no globbing).

## Inputs

| Input | Required | Description |
|---|---|---|
| `zone_id` | Yes | Cloudflare zone ID for the domain whose edge cache to purge. |
| `api_token` | Yes | Cloudflare API token with `Zone:Cache Purge:Purge` permission on the zone. |
| `purge_prefixes` | Yes | Newline-separated URL prefixes to purge.|


## Token setup

Create a Cloudflare API token (My Profile → API Tokens → Create Token) with permission `Zone — Cache Purge — Purge`, scoped to the relevant zone(s). Store the value in a GitHub repo secret.

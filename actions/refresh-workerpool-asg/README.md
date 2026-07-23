# refresh-workerpool-asg

Starts an EC2 Auto Scaling Group **instance refresh** and waits for it to
complete, streaming progress. Use it to cycle worker pool instances onto a new
launch template version (e.g. a new AMI) after the launch template has changed —
a plain apply updates the template but does **not** replace running instances.

## Prerequisites

- **AWS credentials must already be configured** in the job (this action does
  not authenticate). Configure them first, e.g. with
  `aws-actions/configure-aws-credentials`.
- The assumed role needs: `autoscaling:StartInstanceRefresh`,
  `autoscaling:DescribeInstanceRefreshes`, `autoscaling:DescribeAutoScalingGroups`.

## Usage

```yaml
jobs:
  cycle:
    runs-on: ubuntu-latest
    permissions:
      id-token: write   # for OIDC to AWS
      contents: read
    steps:
      - uses: aws-actions/configure-aws-credentials@v6
        with:
          aws-region: eu-west-1
          role-to-assume: ${{ secrets.AWS_ROLE_TO_ASSUME }}

      - uses: spacelift-io/public-shared-actions/actions/refresh-workerpool-asg@main
        with:
          asg_name: my-worker-pool-asg
          aws_region: eu-west-1
```

## Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `asg_name` | yes | — | Auto Scaling group name to refresh. |
| `aws_region` | no | ambient | Region of the ASG. Defaults to the caller's configured region. |
| `wait_timeout_minutes` | no | `10` | Fail if the refresh hasn't completed in this many minutes. |
| `min_healthy_percentage` | no | `0` | Min percent of capacity kept healthy during the refresh. `0` replaces everything at once (needed for single-instance pools). |
| `instance_warmup_seconds` | no | `0` | Warm-up before a new instance counts as ready. |

## Outputs

| Output | Description |
|--------|-------------|
| `instance_refresh_id` | ID of the started instance refresh. |

## Behavior

Polls every 10s and exits non-zero if the refresh ends in `Failed`, `Cancelled`,
or any `Rollback*` state, or if `wait_timeout_minutes` elapses. Note that an ASG
health check passing does **not** guarantee the launcher registered with
Spacelift — validate registration separately if you depend on it.

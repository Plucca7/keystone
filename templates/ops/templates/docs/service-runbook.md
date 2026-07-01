# Runbook: [Service Name]

## General Information

| Field | Value |
|-------|-------|
| **Service** | Name |
| **Repo** | github.com/your-org/... |
| **Stack** | TypeScript / Node / Next.js |
| **Environment** | Production: URL / Staging: URL |
| **Owner** | @responsible-team |
| **Dashboard** | Link to observability dashboard |
| **Alerts** | Link to alert configuration |

## Running locally

```bash
# 1. Clone the repo
git clone https://github.com/your-org/NAME.git

# 2. Copy the env vars
cp .env.example .env.local

# 3. Install dependencies
npm install

# 4. Start the local database (if applicable)
npx supabase start

# 5. Run the dev server
npm run dev
```

## How to deploy

```bash
# Automatic deploy on merge to main
# Manual (if needed):
npm run build
npm run deploy
```

## How to roll back

```bash
# Option 1: Revert the commit
git revert HEAD
git push origin main

# Option 2: Deploy the previous version
# (describe the specific process)
```

## How to rotate secrets

1. Generate the new secret in the provider
2. Update it in the environment's vault/env vars
3. Deploy to apply it
4. Revoke the old secret
5. Validate that the service is working

## How to restore a backup

1. Open the Supabase dashboard
2. Go to Database > Backups
3. Select the desired backup
4. Confirm the restore

**RTO:** [maximum time to restore]
**RPO:** [maximum acceptable data loss]

## Incident Response

### SEV-1 — Complete Outage
1. Notify the team immediately
2. Check the status of external services
3. Check the logs: `[link to logs]`
4. Roll back if needed
5. Communicate with stakeholders
6. Postmortem within 48h

### SEV-2 — Critical Degradation
1. Check dashboards and metrics
2. Identify the affected component
3. Apply a fix or roll back
4. Respond within <30 minutes

### SEV-3 — Non-Critical Issue
1. Create a GitHub issue
2. Prioritize in the next sprint
3. Respond within <4 hours

### SEV-4 — Minor Inconvenience
1. Create a GitHub issue
2. Resolve on the next business day

## Contacts

| Role | Contact |
|-------|---------|
| **On-call** | @person |
| **Tech Lead** | @person |
| **Product** | @person |

---

> Ref: [Engineering Handbook — SRE & Reliability](https://example.com/handbook)

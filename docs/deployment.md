# OpsDashboard Deployment

## Vercel env push (run when Phase 2 ships)

```bash
cd /Users/shaunlennert/VSCode/projects/OpsDashboard
vercel env add SUPABASE_MANAGEMENT_PAT production
vercel env add OPENAI_ADMIN_KEY production
vercel env add ANTHROPIC_ADMIN_KEY production
vercel env add ANTHROPIC_ORG_ID production
vercel env add VERCEL_API_TOKEN production
vercel env add CLOUDFLARE_API_TOKEN production
vercel env add CLOUDFLARE_ACCOUNT_ID production
vercel env pull .env.production.local
```

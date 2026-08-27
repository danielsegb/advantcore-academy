# GitHub, Vercel and Domain Deployment

## Target

```text
Repository: https://github.com/danielsegb/advantcore-academy
Application: https://app.advantcore.co/academy
```

## 1. Verify locally

From the project folder:

```bash
npm install
npm run typecheck
npm run lint
npm run build
```

The local application is available at:

```text
http://localhost:3000/academy
```

Do not remove the base path simply to make `http://localhost:3000` display the page. The required production path is `/academy`.

## 2. Create the GitHub repository

Sign in to the `danielsegb` GitHub account and create:

```text
advantcore-academy
```

Recommended settings:

- Visibility: Private during development
- Do not initialise with another README
- Protect the `main` branch after the first push
- Require pull requests before merging when more developers are added
- Enable secret scanning and dependency alerts

## 3. Push with Git or Antigravity

Manual commands:

```bash
git init
git add .
git commit -m "Initial Advantcore Academy application"
git branch -M main
git remote add origin https://github.com/danielsegb/advantcore-academy.git
git push -u origin main
```

Suggested Antigravity instruction:

```text
Read AGENTS.md and all documentation first. Treat this folder as an existing Next.js application. Initialise Git, commit the supplied source without adding secrets, connect it to https://github.com/danielsegb/advantcore-academy.git and push main. Preserve NEXT_PUBLIC_BASE_PATH=/academy. Run typecheck, lint and build before pushing.
```

## 4. Import into Vercel

1. Sign in to Vercel with the GitHub account that can access `danielsegb/advantcore-academy`.
2. Select **Add New**, then **Project**.
3. Import `advantcore-academy`.
4. Confirm the framework preset is **Next.js**.
5. Leave the root directory as the repository root.
6. Add the environment variables below.
7. Deploy.

## 5. Configure environment variables

Add these in Vercel under Project Settings, Environment Variables:

| Variable | Scope | Sensitive | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_BASE_PATH` | All environments | No | Set to `/academy` |
| `GROQ_API_KEY` | Production and Preview | Yes | Primary AI provider |
| `GEMINI_API_KEY` | Production and Preview | Yes | Secondary AI provider |

Use the existing Job AI Pro Groq and Gemini keys if they are authorised for use by this application. Do not copy keys into source files or GitHub Actions.

The local Academy fallback remains available when both cloud keys are absent, but its replies are intentionally restricted.

## 6. Test the Vercel address

Vercel will initially provide an address similar to:

```text
https://advantcore-academy.vercel.app/academy
```

Verify:

- Dashboard loads
- Navigation changes views
- Quiz modal works
- AI meeting message returns a response
- Browser speech can be enabled
- Google Calendar link opens
- Mobile layout works

## 7. Add the custom domain

In Vercel:

1. Open the Advantcore Academy project.
2. Go to **Settings**, then **Domains**.
3. Add `app.advantcore.co`.
4. Vercel will display the required DNS record.

In the DNS manager for `advantcore.co`, add the record Vercel specifies. For a typical subdomain it will be a CNAME similar to:

| Type | Name | Value |
| --- | --- | --- |
| CNAME | `app` | `cname.vercel-dns.com` |

Use the exact value shown by Vercel if it differs. Remove conflicting `app` records before validation.

The route will then be:

```text
https://app.advantcore.co/academy
```

## 8. Production verification

After DNS and TLS show as valid:

- Open `https://app.advantcore.co/academy` in a private browser session.
- Confirm assets load from `/academy/_next/`.
- Confirm the AI endpoint is called at `/academy/api/academy-ai`.
- Confirm no key appears in browser source, network responses or JavaScript bundles.
- Confirm the site is not framed by another website.
- Confirm browser permissions are requested only after an explicit action.

## 9. Automatic deployments

After GitHub connection:

- A push to `main` deploys production.
- Pull requests create Vercel preview deployments.
- Environment variables remain in Vercel and are not copied to Git.

Use branch protection so unreviewed source does not publish directly.

## 10. Rollback

If a deployment fails:

1. Open **Deployments** in Vercel.
2. Inspect the build log.
3. Fix the source in a branch and run the local quality checks.
4. Merge and deploy a corrected version.

For an urgent production issue, promote the last known good deployment while a fix is prepared.

## Common problems

### Root works but `/academy` does not

Confirm:

```env
NEXT_PUBLIC_BASE_PATH=/academy
```

Redeploy after changing the variable.

### Page loads but styling is missing

Inspect asset requests. They should include `/academy/_next/`. Confirm `next.config.ts` is present and Vercel detected Next.js.

### Meeting AI always uses fallback

Confirm `GROQ_API_KEY` or `GEMINI_API_KEY` exists in the environment used by the current deployment, then redeploy.

### Custom domain validates but root shows another project

Ensure `app.advantcore.co` is assigned to the Academy Vercel project. The Academy still requires `/academy` after the hostname.

### Browser screen sharing fails

Screen capture requires HTTPS, explicit user permission and browser support. Test on the final secure domain.


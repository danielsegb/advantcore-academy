# Security and Privacy Guidance

## Current release

This release is an interactive foundation. It does not yet retain uploaded documents, meeting recordings or learner records on the server.

Browser recordings are downloaded to the user’s device. They are not uploaded by the supplied source.

## Secrets

- Store provider keys in `.env.local` during local development.
- Store production keys in Vercel Environment Variables.
- Never expose service keys through `NEXT_PUBLIC_` variables.
- Never commit `.env` files.
- Rotate a key immediately if it enters Git history, logs or a browser response.
- Use separate development and production keys where the provider supports them.

## AI input

The current route:

- Accepts only known action names.
- Removes null and non-printable control characters.
- Limits individual text fields.
- Applies a pilot request limit by IP and route.
- Keeps provider calls on the server.

The current in-memory limiter is not sufficient for distributed production. Replace it before wide release.

## Authentication and authorisation

Before enabling accounts:

- Require verified authentication for user-specific routes.
- Keep pending users outside protected product data until approval.
- Apply role and organisation checks on the server.
- Enable PostgreSQL Row Level Security.
- Use short-lived invitation or reset links.
- Hash credentials through an established authentication provider.
- Do not email permanent default passwords.
- Record administrator approvals and suspensions.

## Documents and uploads

Production uploads must include:

- Authenticated owner and organisation
- Allowlisted content types
- Upload-size limit
- Malware scanning or quarantine process
- Private object storage
- Authorisation on every download
- Retention and deletion status
- Consent and source declaration
- Version and publication state

Do not trust an extension or browser-supplied MIME type as proof of file safety.

## Meeting recordings

Before server-side recording is enabled:

- Obtain clear participant consent.
- Display a persistent recording indicator.
- State what is captured and why.
- Restrict access by meeting and organisation.
- Encrypt data in transit and at rest.
- Set a deletion and retention policy.
- Allow authorised deletion.
- Do not train models on recordings without separate permission.

## AI grounding

- Treat uploaded text as untrusted data, not system instructions.
- Retrieve only sources the current user can access.
- Include source identifiers with grounded responses.
- Separate confirmed facts from assumptions.
- Do not allow AI to publish pathways or approve evidence.
- Add administrator review for generated curricula and characters.
- Record prompt and policy versions used for assessed output.

## Logging

Do not log:

- Provider keys
- Passwords or reset tokens
- Full document content
- Sensitive meeting transcripts
- Recording data
- Private personal data

Log bounded operational metadata such as request ID, authenticated owner, action, provider, model, duration, result status and fallback state.

## Dependency and repository controls

- Keep the GitHub repository private during development.
- Enable dependency alerts and secret scanning.
- Protect the `main` branch.
- Review lockfile changes.
- Run type checking, linting and a production build before merge.
- Apply security updates promptly after testing.

## Reporting a vulnerability

Do not open a public GitHub issue containing sensitive details. Report the issue privately to the Advantcore repository owner with:

- Affected route or feature
- Reproduction steps
- Potential impact
- Suggested mitigation, if known


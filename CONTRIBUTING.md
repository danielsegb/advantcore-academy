# Contributing

## Branches

- `main` must remain deployable.
- Use short-lived branches such as `feature/authentication` or `fix/meeting-transcript`.
- Open a pull request before merging significant features.

## Commit messages

Use concise imperative messages:

```text
Add Supabase user approval workflow
Persist quiz attempts and mastery scores
Fix Academy API base path
```

## Development workflow

1. Create a branch.
2. Update or add tests for behaviour being changed.
3. Run type checking, linting and the production build.
4. Update documentation when behaviour, environment variables or deployment steps change.
5. Submit a pull request explaining scope, evidence and any migration required.

## Pull-request checklist

- No secret is committed.
- The `/academy` base path still works.
- Desktop and mobile layouts remain usable.
- AI output is grounded in approved context.
- Human approval remains explicit where required.
- Accessibility labels and keyboard interactions are preserved.
- Database changes include a reviewed migration.
- Security and privacy implications are documented.


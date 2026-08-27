name: CI

on:
  push:
    branches: [main, "antigravity/**"]
  pull_request:
    branches: [main]

jobs:
  validate:
    name: Typecheck, Lint, Test & Build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run TypeScript typecheck
        run: npm run typecheck

      - name: Run ESLint
        run: npm run lint

      - name: Run Vitest unit & component tests
        run: npm run test

      - name: Run Next.js production build
        run: npm run build
        env:
          NEXT_PUBLIC_BASE_PATH: /academy

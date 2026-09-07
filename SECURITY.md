# Security Policy

## Reporting a vulnerability

If you find a security issue in this repository or on <https://haug-it.eu>,
please report it privately to **maximilian@haug-it.eu**.

Please include:

- what you found and where (URL, file, or commit),
- how to reproduce it,
- what impact you think it has.

Please do **not** open a public issue for an unfixed vulnerability.

## What to expect

| Step | Target |
|---|---|
| Acknowledgement of your report | within 72 hours |
| First assessment | within 7 days |
| Fix or documented decision not to fix | as fast as the issue warrants |

Coordinated disclosure is welcome. If you would like credit, say so in your
report and it will be added to the fix commit.

## Scope

In scope: the content of this repository and the site served from it at
`haug-it.eu`.

Out of scope: the GitHub Pages platform itself and GitHub's infrastructure —
report those to GitHub. Findings that require physical access, social
engineering, or a modified client are also out of scope.

## Notes on this site

The site is fully static: no server-side code, no forms, no cookies, no
third-party resources, no dependencies. The realistic attack surface is
therefore the repository and the publishing pipeline, not the running site.
Known gaps in the HTTP response headers are documented in
[`docs/security-hinweise.md`](docs/security-hinweise.md).

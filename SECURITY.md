# Security Policy

## Reporting a vulnerability

Please do not publish exploit details, credentials, tokens, personal data or other sensitive information in a public issue or pull request.

Use GitHub's private vulnerability reporting / Security Advisories feature for this repository when it is available. If that option is not enabled, contact the repository owner privately through their GitHub profile and include the affected area, impact, reproduction steps and any relevant sanitized logs.

Please allow maintainers time to investigate and prepare a fix before publicly disclosing an exploitable issue.

## Scope and expectations

- Never test against or attempt to access real customer data without explicit authorization.
- Do not include live credentials, Supabase service-role keys, database passwords or production tokens in reports.
- Security fixes should include a regression test where practical.
- Any database or authorization change must be reviewed for Row Level Security (RLS), privilege boundaries and unintended data exposure.

# Authentication Deployment Security

The API validates registration and login requests server-side, rejects cross-origin state-changing requests, and uses generic credential failures. The project does not include a distributed rate-limit store, so process-local counters would not protect a multi-instance deployment.

Before exposing these endpoints publicly, configure rate limiting at the hosting edge or reverse proxy:

- `POST /api/auth/login`: limit repeated attempts per source IP and normalized account identifier; return HTTP 429 with a short `Retry-After` value. Avoid permanent account lockouts that enable denial of service.
- `POST /api/auth/register`: apply a lower per-IP creation limit and bot/challenge protection.
- `GET /api/auth/approvals` and `POST /api/auth/approvals/*`: rate-limit by source IP after the application has enforced the authenticated System Manager role.

Use provider-supported distributed rules (for example, Cloudflare WAF or the deployment platform's edge firewall), monitor 429 rates, and tune thresholds for shared campus networks. Do not rely on client-side controls for these limits.

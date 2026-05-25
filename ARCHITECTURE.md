# myklen.com.au — Architecture

Platform for people who want to **start and run a cleaning business** (B2B2C), not a generic consumer booking site.

## User roles

| Role | Who | Access |
|------|-----|--------|
| **Admin** | Platform operator | `/admin/*` — packages, content, managers, orders |
| **Manager** | Package buyer / cleaning business owner | `/manager/*` — schedule, CRM, branding, supplies |
| **Customer** | End client of a manager | `/m/{slug}/*` (later: `{slug}.myklen.com.au`, custom domain) |

All data is scoped by `managerId` except platform-wide admin data.

## Phased delivery

### Phase 1 (now) — Marketing & package sales

- Public site: story, training overview, shop teaser, **packages** with Stripe checkout
- Admin: manage packages (JSON → DB later)
- Auth cookies and route layout **reserved** for all three roles

### Phase 2 — Manager portal

- Manager signup after package purchase (or invite)
- Dashboard, profile, **booking link** (`slug`), basic CRM
- Subdomain: `{slug}.myklen.com.au`

### Phase 3 — Customer portal & operations

- Customer login on manager tenant URL
- Bookings, feedback, notifications
- Optional custom domain: `book.{manager-domain}.com.au` → CNAME to platform

## Manager “own domain” strategy

1. **Path (MVP):** `https://myklen.com.au/m/{slug}`
2. **Subdomain:** `https://{slug}.myklen.com.au` — wildcard DNS + middleware maps host → tenant
3. **Custom domain (premium):** manager verifies DNS; `Host` header → `manager_domains` lookup

Middleware (`src/middleware.ts`) centralises host/path → `x-myklen-tenant-slug` header for Server Components and APIs.

## Cookie namespaces (separate sessions)

| Cookie | Role |
|--------|------|
| `myklen_admin` | Platform admin |
| `myklen_manager` | Manager user id |
| `myklen_customer` | `{slug}:{customerId}` — tenant-scoped |

Never share login pages across roles (`/admin/login`, `/manager/login`, `/m/[slug]/login`).

## Suggested data model (when moving off JSON)

- `managers` — slug, businessName, packageId, customDomain?, stripeCustomerId
- `manager_domains` — hostname, managerId, verifiedAt
- `customers` — managerId, email, name
- `bookings` — managerId, customerId, scheduledAt, status
- `packages` — name, priceAud, features[], stripePriceId
- `orders` — supplies, print (cards, flyers), apparel

## Repo boundary

**Independent from kshop-au.** Reuse patterns only; no shared deployment or database.

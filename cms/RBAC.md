# Payload RBAC

Payload users have one of three roles:

- `admin`: full backend access, including user management.
- `marketing`: full Support Hub content access. Marketing can read users but cannot create, update or delete users.
- `support`: Support Hub access only.

Support users can manage:

- `knowledge-articles`
- `knowledge-categories`
- `media` for article images and screenshots

Support users cannot access users or admin-only settings. This standalone app does not include website pages, News & Insights articles, forms, CRM collections, proposal content or global marketing settings.

Access rules are centralised in `cms/access.ts`. Update that file first when changing role behaviour, then apply the reusable helpers to collection or global configs.

Legacy local Payload users created before roles existed are treated as `admin` by the helper until their `role` field is explicitly saved. This prevents accidental lockout during the role migration.

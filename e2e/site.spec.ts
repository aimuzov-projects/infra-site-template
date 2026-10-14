import { siteChecks } from '@aimuzov-projects/infra-site-kit/playwright/checks'

import { site } from '#frontend/data/site.ts'

// The checks every site shares: the sitemap pages, axe, and the Metrika once the site has a counter.
siteChecks({ metrika: Number.isInteger(site.metrikaId) })

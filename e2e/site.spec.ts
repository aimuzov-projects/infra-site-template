import { siteChecks } from '@aimuzov/infra-site-kit/playwright/checks'

import { site } from '#frontend/data/site.ts'

// Проверки, общие для всех сайтов: страницы из sitemap, 404, axe и Метрика, когда у сайта есть счётчик.
// В sitemap шаблона одна главная, подсказать по опечатке нечего: со второй страницей
// `suggest: false` убирается.
siteChecks({ metrika: Number.isInteger(site.metrikaId), notFound: { suggest: false } })

import sitemap from '@astrojs/sitemap'
import svelte from '@astrojs/svelte'
import { defineConfig } from 'astro/config'

export default defineConfig({
	// Абсолютные ссылки в canonical, og:url и sitemap.
	site: 'https://__DOMAIN__',
	// CSS немного: внутри HTML он не блокирует первую отрисовку отдельным запросом.
	build: { inlineStylesheets: 'always' },
	// Svelte для интерактивных островков, остальное -- статичный HTML с ванильными скриптами.
	integrations: [svelte(), sitemap()],
	// Подсветка Shiki несовместима с CSP.
	markdown: { syntaxHighlight: false },
	// Astro кладёт CSP с хешами своих скриптов и стилей в <meta> страницы. Снаружи только
	// Яндекс Метрика (mc.yandex.ru, yastatic.net). frame-ancestors в <meta> не действует,
	// встраивание запрещает X-Frame-Options в Caddy.
	security: {
		csp: {
			scriptDirective: { resources: ["'self'", 'https://mc.yandex.ru', 'https://yastatic.net'] },
			directives: [
				"default-src 'self'",
				"img-src 'self' data: https://mc.yandex.ru",
				"connect-src 'self' https://mc.yandex.ru",
				'frame-src blob: https://mc.yandex.ru',
				'child-src blob: https://mc.yandex.ru',
				"object-src 'none'",
				"base-uri 'self'",
				"form-action 'self'",
			],
		},
	},
})

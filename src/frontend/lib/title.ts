import { site } from '#frontend/data/site.ts'

/** Page title: its own name and the site name after a dash, the home page gets only the site name. */
export function pageTitle(title?: string) {
	return title ? `${title} — ${site.name}` : site.name
}

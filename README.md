<p align="center">
	<a href="https://github.com/aimuzov-projects/__PROJECT__/actions/workflows/deploy.yml"><img src="https://img.shields.io/github/actions/workflow/status/aimuzov-projects/__PROJECT__/deploy.yml?branch=main&label=deploy" alt="Deploy"></a>
	<a href="https://__DOMAIN__"><img src="https://img.shields.io/website?url=https%3A%2F%2F__DOMAIN__&label=site" alt="Site status"></a>
	<a href="package.json"><img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Faimuzov-projects%2F__PROJECT__%2Fmain%2Fpackage.json&query=%24.engines.node&label=node&logo=nodedotjs&logoColor=white&color=5fa04e" alt="Node"></a>
	<a href="https://astro.build"><img src="https://img.shields.io/github/package-json/dependency-version/aimuzov-projects/__PROJECT__/astro?logo=astro&logoColor=white&color=bc52ee" alt="Astro"></a>
	<a href="https://svelte.dev"><img src="https://img.shields.io/github/package-json/dependency-version/aimuzov-projects/__PROJECT__/svelte?logo=svelte&logoColor=white&color=ff3e00" alt="Svelte"></a>
	<a href="LICENSE"><img src="https://img.shields.io/github/license/aimuzov-projects/__PROJECT__" alt="License"></a>
</p>

<p align="center"><b>English</b> · <a href="README.ru.md">Русский</a></p>

<p>__DESCRIPTION_EN__: <a href="https://__DOMAIN__">__DOMAIN__</a>. The site itself is in Russian.</p>

A static site built with [Astro](https://astro.build), interactive islands are written in [Svelte](https://svelte.dev).

## Getting started

Requires Node 26.11.1, the same version is pinned in `package.json` and the Dockerfile.

```sh
cp .env.example .env
npm ci
npm run dev
```

Before committing:

```sh
npm run format:check && npm run lint:js && npm run lint:css && npm run check && npm test
```

## Content Security Policy

The build puts a CSP with hashes of Astro's scripts and styles into every page (the `security.csp` option in `astro.config.mjs`). `npm run dev` has no policy, so violations only show up after `npm run build && npm run preview` and in production.

- No `style=""` attributes or handlers like `onclick`: styles go through classes and rules in `<style>`, handlers live in `<script>`.
- An external script, image or request (a widget, a map, a font from a CDN) has to be allowed in `security.csp` first. Right now only Yandex Metrica is there.
- After such changes, check the browser console in `npm run preview`: the browser reports everything it blocks there.

## Deployment

A push to `main` triggers GitHub Actions: checks first, then an SSH login to the server. There the key is bound to [`deploy/remote.sh`](deploy/remote.sh), which pulls `main` and rebuilds the container from [`deploy/docker-compose.yml`](deploy/docker-compose.yml). The domain is served by the server's shared Caddy ([aimuzov-projects/infra-server](https://github.com/aimuzov-projects/infra-server)), and `.env` lives on the server next to the repository. The deploy job runs only when the repository variable `DEPLOY_ENABLED` is `true`.

## License

The code is licensed under [MIT](LICENSE). Site content (texts, images, names and contacts) is not covered by it: all rights reserved.

<p align="center">
	<a href="https://github.com/aimuzov-projects/__PROJECT__/actions/workflows/deploy.yml"><img src="https://img.shields.io/github/actions/workflow/status/aimuzov-projects/__PROJECT__/deploy.yml?branch=main&label=deploy" alt="Deploy"></a>
	<a href="https://__DOMAIN__"><img src="https://img.shields.io/website?url=https%3A%2F%2F__DOMAIN__&label=site" alt="Site status"></a>
	<a href="package.json"><img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Faimuzov-projects%2F__PROJECT__%2Fmain%2Fpackage.json&query=%24.engines.node&label=node&logo=nodedotjs&logoColor=white&color=5fa04e" alt="Node"></a>
	<a href="https://astro.build"><img src="https://img.shields.io/github/package-json/dependency-version/aimuzov-projects/__PROJECT__/astro?logo=astro&logoColor=white&color=bc52ee" alt="Astro"></a>
	<a href="https://svelte.dev"><img src="https://img.shields.io/github/package-json/dependency-version/aimuzov-projects/__PROJECT__/svelte?logo=svelte&logoColor=white&color=ff3e00" alt="Svelte"></a>
	<a href="LICENSE"><img src="https://img.shields.io/github/license/aimuzov-projects/__PROJECT__" alt="License"></a>
</p>

<p align="center"><a href="README.md">English</a> · <b>Русский</b></p>

<p>__DESCRIPTION__: <a href="https://__DOMAIN__">__DOMAIN__</a>.</p>

Статичный сайт на [Astro](https://astro.build), интерактивные островки на [Svelte](https://svelte.dev).

## Запуск

Нужен Node 26.11.1, эта же версия закреплена в `package.json` и в Dockerfile.

```sh
cp .env.example .env
npm ci
npm run dev
```

Перед коммитом:

```sh
npm run format:check && npm run lint:js && npm run lint:css && npm run check && npm test
```

## Content Security Policy

Сборка кладёт в каждую страницу CSP с хешами скриптов и стилей Astro (настройка `security.csp` в `astro.config.mjs`). В `npm run dev` политики нет, поэтому нарушения видны только после `npm run build && npm run preview` и на проде.

- Никаких атрибутов `style=""` и обработчиков вроде `onclick`: стили задаются классами и правилами в `<style>`, обработчики живут в `<script>`.
- Внешний скрипт, картинку или запрос (виджет, карту, шрифт с CDN) сначала нужно разрешить в `security.csp`. Сейчас там только Яндекс Метрика.
- После таких правок стоит открыть консоль браузера в `npm run preview`: всё заблокированное браузер пишет туда.

## Выкладка

Пуш в `main` запускает GitHub Actions: сначала проверки, затем вход по SSH на сервер. Там ключ привязан к [`deploy/remote.sh`](deploy/remote.sh), который подтягивает `main` и пересобирает контейнер из [`deploy/docker-compose.yml`](deploy/docker-compose.yml). Домен обслуживает общий Caddy сервера ([aimuzov-projects/infra-server](https://github.com/aimuzov-projects/infra-server)), `.env` лежит на сервере рядом с репозиторием. Job выкладки запускается, только когда переменная репозитория `DEPLOY_ENABLED` равна `true`.

## Лицензия

Код распространяется по лицензии [MIT](LICENSE). Содержимое сайта (тексты, изображения, имена и контакты) под неё не подпадает: все права защищены.

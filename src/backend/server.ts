/**
 * API сайта: отвечает на `/api/*`, остальное отдаёт nginx со статикой.
 *
 * Node запускает файл сам, без сборки и зависимостей. На проде `/api/*` сюда шлёт Caddy,
 * локально -- прокси dev-сервера Astro.
 */

import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'

const PORT = Number(process.env.PORT || 8787)

// Запросам сайта хватает с запасом, большее тело -- уже ошибка или чужой запрос.
export const BODY_LIMIT = 1024 * 1024

type Reply = [status: number, body: unknown]

/**
 * Ошибка с HTTP-статусом для клиента.
 *
 * Статус и сообщение уходят в ответ как есть. Любая другая ошибка
 * пишется в лог и отдаётся с кодом 500.
 */
export class HttpError extends Error {
	// Без parameter properties: Node только стирает типы и такой синтаксис не запустит.
	readonly status: number

	constructor(status: number, message: string) {
		super(message)
		this.status = status
	}
}

/**
 * Собирает тело запроса целиком и разбирает его как JSON.
 *
 * Бросает {@link HttpError} 413, если тело больше `limit`, и 400, если это не JSON.
 *
 * @param request Тело запроса, на вход годится и `IncomingMessage`.
 * @param limit Предел размера тела в байтах.
 */
export async function readJson(request: AsyncIterable<Buffer>, limit = BODY_LIMIT): Promise<unknown> {
	const chunks: Buffer[] = []
	let size = 0

	for await (const chunk of request) {
		size += chunk.length

		if (size > limit) throw new HttpError(413, 'Слишком большой запрос')

		chunks.push(chunk)
	}

	try {
		return JSON.parse(Buffer.concat(chunks).toString('utf8'))
	} catch {
		throw new HttpError(400, 'Тело запроса не JSON')
	}
}

const routes: Record<string, (request: IncomingMessage) => Promise<Reply>> = {
	// Деплой опрашивает его после релиза, compose -- в контейнере.
	'GET /api/health': async () => [200, { ok: true }],
}

export async function handle(request: IncomingMessage, response: ServerResponse) {
	const { pathname } = new URL(request.url ?? '/', 'http://localhost')
	const route = routes[`${request.method} ${pathname}`]

	let status: number
	let body: unknown

	try {
		;[status, body] = route ? await route(request) : [404, { error: 'Нет такой ручки' }]
	} catch (error) {
		if (!(error instanceof HttpError)) console.error(error)

		status = error instanceof HttpError ? error.status : 500
		body = { error: (error as Error).message }
	}

	response.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
	response.end(JSON.stringify(body))
}

// Тесты импортируют модуль, сервер поднимается только при запуске файла.
if (import.meta.main) {
	createServer(handle).listen(PORT, () => console.log(`api: http://localhost:${PORT}`))
}

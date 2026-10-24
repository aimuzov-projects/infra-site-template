import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import type { AddressInfo } from 'node:net'
import { after, before, test } from 'node:test'

import { handle, HttpError, readJson } from './server.ts'

async function* body(...parts: string[]) {
	for (const part of parts) yield Buffer.from(part)
}

const server = createServer(handle)
let origin = ''

before(async () => {
	await new Promise<void>((resolve) => server.listen(0, resolve))
	origin = `http://localhost:${(server.address() as AddressInfo).port}`
})

after(() => server.close())

test('health отвечает ok', async () => {
	const response = await fetch(`${origin}/api/health`)

	assert.equal(response.status, 200)
	assert.deepEqual(await response.json(), { ok: true })
})

test('неизвестная ручка -- 404', async () => {
	const response = await fetch(`${origin}/api/nope`)

	assert.equal(response.status, 404)
})

test('собирает JSON из нескольких кусков', async () => {
	assert.deepEqual(await readJson(body('{"a":', '1}')), { a: 1 })
})

test('не JSON -- 400', async () => {
	await assert.rejects(readJson(body('nope')), (error) => error instanceof HttpError && error.status === 400)
})

test('больше лимита -- 413', async () => {
	await assert.rejects(readJson(body('[1,', '2]'), 3), (error) => error instanceof HttpError && error.status === 413)
})

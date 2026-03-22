const test = require('node:test')
const assert = require('node:assert/strict')
const childProcess = require('child_process')

const withPingService = async ({ execImpl, fetchImpl } = {}, callback) => {
  const modulePath = require.resolve('../pingService')
  const originalExec = childProcess.exec
  const originalFetch = global.fetch

  if (execImpl) {
    childProcess.exec = execImpl
  }

  if (fetchImpl) {
    global.fetch = fetchImpl
  }

  delete require.cache[modulePath]

  try {
    const pingService = require('../pingService')
    return await callback(pingService)
  } finally {
    childProcess.exec = originalExec
    global.fetch = originalFetch
    delete require.cache[modulePath]
  }
}

test('clampSamples defaults and bounds the requested sample count', async () => {
  await withPingService({}, async (pingService) => {
    assert.equal(pingService.clampSamples(undefined), 4)
    assert.equal(pingService.clampSamples('0'), 1)
    assert.equal(pingService.clampSamples('3'), 3)
    assert.equal(pingService.clampSamples('99'), 5)
  })
})

test('measureTarget returns ICMP latency details when ping succeeds', async () => {
  await withPingService({
    execImpl: (command, options, callback) => {
      assert.match(command, /ping -c 2 8\.8\.8\.8/)
      callback(
        null,
        `PING 8.8.8.8
64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=12.5 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=117 time=15.5 ms
`
      )
    },
  }, async (pingService) => {
    const result = await pingService.measureTarget('google', 2)

    assert.equal(result.target, 'google')
    assert.equal(result.mode, 'external-icmp')
    assert.equal(result.latencyMs, 14)
    assert.deepEqual(result.times, [12.5, 15.5])
  })
})

test('measureTarget falls back to HTTP timing when ICMP fails', async () => {
  let fetchCalls = 0
  await withPingService({
    execImpl: (command, options, callback) => {
      callback(new Error('icmp failed'))
    },
    fetchImpl: async (url, options) => {
      fetchCalls += 1
      assert.match(url, /^https:\/\/discord\.com\/api\/v9\/experiments\?t=/)
      assert.equal(options.headers.accept, 'application/dns-json')
      return { ok: true, status: 200 }
    },
  }, async (pingService) => {
    const result = await pingService.measureTarget('discord', 2)

    assert.equal(result.target, 'discord')
    assert.equal(result.mode, 'external-http')
    assert.equal(fetchCalls, 2)
    assert.equal(typeof result.latencyMs, 'number')
    assert.equal(result.times.length, 2)
  })
})

test('measurePing combines default targets and reports mixed mode when fallback is used', async () => {
  await withPingService({
    execImpl: (command, options, callback) => {
      if (command.includes('8.8.8.8')) {
        callback(
          null,
          `PING 8.8.8.8
64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=10.0 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=117 time=14.0 ms
`
        )
        return
      }

      callback(new Error('icmp failed'))
    },
    fetchImpl: async () => ({ ok: true, status: 200 }),
  }, async (pingService) => {
    const result = await pingService.measurePing({ targetId: null, samples: 2 })

    assert.equal(result.message, 'pong')
    assert.equal(result.samples, 2)
    assert.equal(result.mode, 'mixed')
    assert.ok(result.targets.google >= 0)
    assert.ok(result.targets.cloudflare >= 0)
    assert.equal(result.average, result.latencyMs)
    assert.equal(result.details.google.mode, 'external-icmp')
    assert.equal(result.details.cloudflare.mode, 'external-http')
  })
})

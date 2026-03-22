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

describe('pingService', () => {
  describe('clampSamples', () => {
    it('defaults to 4 when the input is missing or invalid', async () => {
      await withPingService({}, async ({ clampSamples }) => {
        expect(clampSamples()).toBe(4)
        expect(clampSamples('nope')).toBe(4)
      })
    })

    it('clamps values to the supported 1-5 range', async () => {
      await withPingService({}, async ({ clampSamples }) => {
        expect(clampSamples('0')).toBe(1)
        expect(clampSamples('2')).toBe(2)
        expect(clampSamples('10')).toBe(5)
      })
    })
  })

  it('returns ICMP latency details when ping succeeds', async () => {
    await withPingService(
      {
        execImpl: (command, options, callback) => {
          expect(command).toMatch(/ping -c 2 8\.8\.8\.8/)
          callback(
            null,
            `PING 8.8.8.8
64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=12.5 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=117 time=15.5 ms
`
          )
        },
      },
      async (pingService) => {
        const result = await pingService.measureTarget('google', 2)

        expect(result).toMatchObject({
          target: 'google',
          mode: 'external-icmp',
          latencyMs: 14,
          times: [12.5, 15.5],
        })
      }
    )
  })

  it('falls back to HTTP timing when ICMP fails', async () => {
    let fetchCalls = 0

    await withPingService(
      {
        execImpl: (command, options, callback) => {
          callback(new Error('icmp failed'))
        },
        fetchImpl: async (url, options) => {
          fetchCalls += 1
          expect(url).toMatch(/^https:\/\/discord\.com\/api\/v9\/experiments\?t=/)
          expect(options.headers.accept).toBe('application/dns-json')
          return { ok: true, status: 200 }
        },
      },
      async (pingService) => {
        const result = await pingService.measureTarget('discord', 2)

        expect(result.target).toBe('discord')
        expect(result.mode).toBe('external-http')
        expect(fetchCalls).toBe(2)
        expect(result.latencyMs).toEqual(expect.any(Number))
        expect(result.times).toHaveLength(2)
      }
    )
  })

  it('combines default targets and reports mixed mode when fallback is used', async () => {
    await withPingService(
      {
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
      },
      async (pingService) => {
        const result = await pingService.measurePing({ targetId: null, samples: 2 })

        expect(result.message).toBe('pong')
        expect(result.samples).toBe(2)
        expect(result.mode).toBe('mixed')
        expect(result.targets.google).toEqual(expect.any(Number))
        expect(result.targets.cloudflare).toEqual(expect.any(Number))
        expect(result.average).toBe(result.latencyMs)
        expect(result.details.google.mode).toBe('external-icmp')
        expect(result.details.cloudflare.mode).toBe('external-http')
      }
    )
  })
})

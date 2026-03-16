const { exec } = require('child_process')
const { TARGETS, DEFAULT_TARGET_IDS } = require('./targets')

const clampSamples = (value) => {
  const parsedSamples = Number.parseInt(value, 10)
  const samples = Number.isFinite(parsedSamples) ? parsedSamples : 4
  return Math.min(Math.max(samples, 1), 5)
}

const pingHost = (host, count) =>
  new Promise((resolve, reject) => {
    exec(`ping -c ${count} ${host}`, { timeout: 8000 }, (error, stdout) => {
      if (error) {
        return reject(error)
      }

      const matches = [...stdout.matchAll(/time[=<]([0-9.]+)\s*ms/g)]
      if (!matches.length) {
        return reject(new Error('No latency data found'))
      }

      const times = matches.map((match) => parseFloat(match[1]))
      const average = times.reduce((sum, value) => sum + value, 0) / times.length

      resolve({
        times,
        average,
      })
    })
  })

const httpPing = async (url, count) => {
  const times = []

  for (let i = 0; i < count; i += 1) {
    const controller = new AbortController()
    const start = process.hrtime.bigint()
    const timeoutId = setTimeout(() => controller.abort(), 3000)

    try {
      const cacheBuster = `t=${Date.now()}-${i}`
      const separator = url.includes('?') ? '&' : '?'
      const response = await fetch(`${url}${separator}${cacheBuster}`, {
        headers: { accept: 'application/dns-json' },
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP ping failed with ${response.status}`)
      }
    } finally {
      clearTimeout(timeoutId)
    }

    const end = process.hrtime.bigint()
    const durationMs = Number(end - start) / 1e6
    times.push(durationMs)
  }

  const average = times.reduce((sum, value) => sum + value, 0) / times.length
  return { times, average }
}

const measureTarget = async (targetId, samples) => {
  const target = TARGETS[targetId]
  if (!target) {
    const error = new Error(`Unknown target: ${targetId}`)
    error.code = 'UNKNOWN_TARGET'
    throw error
  }

  try {
    const result = await pingHost(target.host, samples)
    return {
      target: target.id,
      label: target.label,
      host: target.host,
      latencyMs: Math.round(result.average),
      average: result.average,
      times: result.times,
      mode: 'external-icmp',
    }
  } catch (icmpError) {
    if (!target.httpUrl) {
      throw icmpError
    }

    const result = await httpPing(target.httpUrl, samples)
    return {
      target: target.id,
      label: target.label,
      host: target.host,
      url: target.httpUrl,
      latencyMs: Math.round(result.average),
      average: result.average,
      times: result.times,
      mode: 'external-http',
    }
  }
}

const averageLatencies = (results) =>
  Math.round(results.reduce((sum, result) => sum + result.average, 0) / results.length)

const buildSingleTargetResponse = (result, samples) => ({
  message: 'pong',
  serverTime: Date.now(),
  target: result.target,
  label: result.label,
  host: result.host,
  url: result.url,
  mode: result.mode,
  samples,
  latencyMs: result.latencyMs,
  times: result.times,
})

const buildMultiTargetResponse = (results, samples) => {
  const targets = Object.fromEntries(results.map((result) => [result.target, result.latencyMs]))
  const details = Object.fromEntries(
    results.map((result) => [
      result.target,
      {
        label: result.label,
        host: result.host,
        url: result.url,
        latencyMs: result.latencyMs,
        times: result.times,
        mode: result.mode,
      },
    ])
  )
  const average = averageLatencies(results)

  return {
    message: 'pong',
    serverTime: Date.now(),
    samples,
    targets,
    details,
    average,
    latencyMs: average,
    mode: results.every((result) => result.mode === results[0].mode) ? results[0].mode : 'mixed',
  }
}

const measurePing = async ({ targetId, samples }) => {
  if (targetId) {
    const result = await measureTarget(targetId, samples)
    return buildSingleTargetResponse(result, samples)
  }

  const results = await Promise.all(DEFAULT_TARGET_IDS.map((defaultTargetId) => measureTarget(defaultTargetId, samples)))
  return buildMultiTargetResponse(results, samples)
}

module.exports = {
  TARGETS,
  DEFAULT_TARGET_IDS,
  clampSamples,
  measurePing,
  measureTarget,
}

const TARGETS = {
  google: {
    id: 'google',
    label: 'Google DNS',
    host: '8.8.8.8',
    httpUrl: 'https://dns.google/resolve?name=example.com&type=A',
  },
  cloudflare: {
    id: 'cloudflare',
    label: 'Cloudflare DNS',
    host: '1.1.1.1',
    httpUrl: 'https://cloudflare-dns.com/dns-query?name=example.com&type=A',
  },
  discord: {
    id: 'discord',
    label: 'Discord',
    host: 'discord.com',
    httpUrl: 'https://discord.com/api/v9/experiments',
  },
  youtube: {
    id: 'youtube',
    label: 'YouTube',
    host: 'youtube.com',
    httpUrl: 'https://www.youtube.com/generate_204',
  },
  aws: {
    id: 'aws',
    label: 'Amazon Web Services',
    host: 'amazon.com',
    httpUrl: 'https://aws.amazon.com/',
  },
}

const DEFAULT_TARGET_IDS = ['google', 'cloudflare']

module.exports = {
  TARGETS,
  DEFAULT_TARGET_IDS,
}

export const pingPages = [
  {
    path: '/',
    target: null,
    navLabel: 'Home',
    shortLabel: 'Ping Test',
    title: "What's My Ping? Check Internet Latency Instantly",
    description:
      'Run a fast ping test, compare latency to major services, and understand whether your connection is stable enough for gaming, streaming, and voice chat.',
    eyebrow: 'Realtime latency tools',
    h1: "What's My Ping?",
    subtitle:
      'Measure latency in seconds, watch it over time, and jump into focused tests for Google, Cloudflare, Discord, YouTube, and AWS.',
    heroNote: 'Start with the default blended ping test or open a service-specific tool below.',
    introHeading: 'Popular Ping Tests',
    introBody:
      'This home page gives you a quick way to understand your internet latency without hunting through multiple tools. Use the main ping test to average major DNS endpoints, then open service-specific pages when you want a more targeted signal for voice chat, video delivery, or cloud-hosted workloads.',
    sections: [
      {
        title: 'What a ping test tells you',
        body:
          'Ping is the time it takes for a packet to travel from your network to a remote destination and back again. Lower numbers usually mean a more responsive connection. If you play online games, join voice calls, or stream live content, ping can shape how immediate everything feels. A stable 25 ms connection often feels much better than a line that swings between 20 ms and 150 ms.',
      },
      {
        title: 'Why different targets matter',
        body:
          'There is no single universal ping because every service uses its own servers, routing, and edge network. Testing Google or Cloudflare is helpful for a broad baseline, while pinging Discord, YouTube, or AWS can reveal whether a specific kind of traffic is more affected by distance or congestion. That is why this project now exposes multiple landing pages powered by the same backend logic.',
      },
      {
        title: 'How to interpret results',
        body:
          'Treat low and consistent latency as the ideal outcome. Excellent results are usually under 30 ms, while 30 to 60 ms is still comfortable for most real-time apps. Once latency moves above 100 ms, delay becomes easier to notice. If your numbers spike, try a wired connection, pause large downloads, or test again at a different time of day to spot congestion patterns.',
      },
    ],
  },
  {
    path: '/ping-test',
    target: null,
    navLabel: 'Ping Test',
    shortLabel: 'Default Ping Test',
    title: 'Ping Test Tool - Check Internet Latency to Google and Cloudflare',
    description:
      'Run a free ping test that checks latency to both Google and Cloudflare, then see an average result with live history and connection quality.',
    eyebrow: 'Baseline internet check',
    h1: 'Run a Fast Ping Test',
    subtitle:
      'Measure your latency against Google and Cloudflare together for a broad view of your internet responsiveness.',
    heroNote: 'Default test combines two reliable public endpoints.',
    introHeading: 'Why use the default ping test?',
    introBody:
      'The default page is a strong starting point when you want a broad, quick signal instead of a single-service reading. It pings both Google and Cloudflare and averages the result, which makes it useful for checking general internet responsiveness before gaming, streaming, or hopping on a call.',
    sections: [
      {
        title: 'A balanced latency snapshot',
        body:
          'Testing only one host can be misleading when routing is having an odd moment. By checking Google and Cloudflare together, this page creates a more balanced snapshot of your connection. If one route is temporarily noisy but the other is healthy, the blended result is still a better baseline than a single reading taken in isolation.',
      },
      {
        title: 'When to use this page',
        body:
          'Use this page before online matches, while troubleshooting slow internet, or whenever you want to compare latency across different times of day. It is especially helpful if you suspect local Wi-Fi issues, congestion from downloads, or inconsistent ISP routing because the history chart makes those spikes much easier to spot.',
      },
      {
        title: 'Reading the quality label',
        body:
          'The quality label translates raw milliseconds into something easier to scan. Excellent usually feels instant, good is still smooth for most apps, playable means some delay may be noticeable, and poor suggests the connection may feel sluggish or unstable. The exact experience still depends on the app you use, but these categories are a practical starting guide.',
      },
    ],
  },
  {
    path: '/ping-google',
    target: 'google',
    navLabel: 'Ping Google',
    shortLabel: 'Google Ping Test',
    title: 'Ping Google Server - Test Latency to Google',
    description:
      'Check your ping to Google DNS and see how responsive your internet feels to one of the world’s most widely distributed networks.',
    eyebrow: 'Service-specific latency',
    h1: 'Check Ping to Google Servers',
    subtitle:
      'Measure latency to Google DNS for a focused look at your connection to a major global edge network.',
    heroNote: 'Single-target test against Google DNS (8.8.8.8).',
    introHeading: 'Why test ping to Google?',
    introBody:
      'Google’s network is one of the most globally distributed and reliable places to measure baseline internet latency. If you want to know how quickly your connection reaches a major edge network, this page gives you a focused Google ping test with history, quality labels, and repeat measurements.',
    sections: [
      {
        title: 'What Google ping reveals',
        body:
          'A Google ping test is often used as a quick benchmark because Google DNS is highly reachable and usually close to internet exchange points. If your latency to Google is low and stable, your base connection is probably healthy. If it is high or erratic, the issue could be local Wi-Fi congestion, ISP routing, or broader network instability.',
      },
      {
        title: 'Why Google is a useful benchmark',
        body:
          'Google operates a very large global network, which means many users can reach it with relatively predictable latency. That makes it a practical reference point when you want to compare one test today with another tomorrow. It does not represent every game or app, but it does give you a reliable baseline for how quickly your traffic reaches a major internet platform.',
      },
      {
        title: 'How to use the result',
        body:
          'If your Google ping is low but another service feels slow, the problem may be specific to that service rather than your whole connection. If your Google ping is already elevated, start by checking your local network first. Try Ethernet, restart a crowded router, and rerun the test over a few minutes to see whether the history graph settles or keeps spiking.',
      },
    ],
  },
  {
    path: '/ping-cloudflare',
    target: 'cloudflare',
    navLabel: 'Ping Cloudflare',
    shortLabel: 'Cloudflare Ping Test',
    title: 'Ping Cloudflare - Test Latency to Cloudflare DNS',
    description:
      'Measure your ping to Cloudflare DNS and track real-time latency to one of the fastest edge networks on the web.',
    eyebrow: 'Service-specific latency',
    h1: 'Test Your Ping to Cloudflare',
    subtitle:
      'Run a focused Cloudflare ping test and monitor how quickly your connection reaches a major global edge platform.',
    heroNote: 'Single-target test against Cloudflare DNS (1.1.1.1).',
    introHeading: 'Why test ping to Cloudflare?',
    introBody:
      'Cloudflare sits close to users in many regions, which makes it a strong target for measuring edge latency. If your goal is to see how fast your internet reaches a globally distributed network, this page gives you a dedicated Cloudflare ping test with current results, history, and quality scoring.',
    sections: [
      {
        title: 'A practical edge-network benchmark',
        body:
          'Cloudflare is widely used for DNS, caching, security, and content delivery. Because of that footprint, latency to Cloudflare often reflects how quickly you can reach nearby internet infrastructure. This can make it a helpful benchmark when you want to separate local connection issues from problems that are isolated to a single app or game.',
      },
      {
        title: 'What high Cloudflare ping can mean',
        body:
          'If your Cloudflare ping is consistently higher than expected, it may point to local wireless interference, last-mile ISP problems, or poor routing to your nearest edge location. Comparing this page with the Google ping page can also help. If both are high, your issue is likely broad. If only one is high, the route to that network may be the main factor.',
      },
      {
        title: 'How to act on the data',
        body:
          'Use the continuous test to watch for latency spikes while streaming, gaming, or joining calls. Short bursts may signal background downloads or temporary congestion. If the graph stays noisy across multiple tests, try reducing Wi-Fi interference or checking whether the problem improves on another device. Trends matter more than a single isolated reading.',
      },
    ],
  },
  {
    path: '/ping-discord',
    target: 'discord',
    navLabel: 'Ping Discord',
    shortLabel: 'Discord Ping Test',
    title: 'Discord Ping Test - Check Latency to Discord',
    description:
      'Test your latency to Discord and see whether your connection is responsive enough for smoother voice chat and real-time communication.',
    eyebrow: 'Voice chat latency',
    h1: 'Test Your Ping to Discord Servers',
    subtitle:
      'Measure how quickly your connection reaches Discord so you can spot delay before calls, streams, and communities go live.',
    heroNote: 'Single-target test using Discord as the service endpoint.',
    introHeading: 'Why test ping to Discord?',
    introBody:
      'Discord is sensitive to delay, jitter, and packet loss when you are in voice channels or screen-sharing. This page gives you a focused Discord ping test so you can check responsiveness before a session starts and keep an eye on stability if people begin sounding robotic or delayed.',
    sections: [
      {
        title: 'What Discord latency affects',
        body:
          'Latency to Discord can influence how natural conversation feels, especially in fast group calls during games or live events. Lower ping helps your voice arrive with less delay, which makes back-and-forth conversation smoother. While Discord performance depends on more than ping alone, a quick latency check is still one of the easiest ways to sanity-check your connection.',
      },
      {
        title: 'Why service-specific testing helps',
        body:
          'A general internet test may look healthy while one app still feels off. Testing Discord directly helps narrow that down. If your baseline ping is good but Discord is slow, the issue may be related to routing, a regional edge location, or temporary service-side conditions. That makes this page useful alongside the default blended test rather than instead of it.',
      },
      {
        title: 'How to improve poor Discord results',
        body:
          'If Discord latency is high, start with the basics: move to Ethernet if possible, close bandwidth-heavy apps, and reduce crowded Wi-Fi conditions. Run the continuous test while you join a call and watch the graph for spikes. If results stay elevated across devices, your connection to Discord’s edge path may simply be less direct at that moment.',
      },
    ],
  },
  {
    path: '/ping-youtube',
    target: 'youtube',
    navLabel: 'Ping YouTube',
    shortLabel: 'YouTube Ping Test',
    title: 'YouTube Ping Test - Check Latency to YouTube',
    description:
      'Measure your ping to YouTube and understand how responsive your connection is to a major video delivery platform.',
    eyebrow: 'Video platform latency',
    h1: 'Check Ping to YouTube',
    subtitle:
      'Run a focused YouTube ping test to see how quickly your internet reaches one of the largest video networks online.',
    heroNote: 'Single-target test using YouTube as the service endpoint.',
    introHeading: 'Why test ping to YouTube?',
    introBody:
      'YouTube is built for video delivery at global scale, and a quick latency check can tell you how responsive your route is to that platform. While streaming quality depends on throughput as well as ping, this page still gives useful insight into how quickly your network reaches YouTube’s edge infrastructure.',
    sections: [
      {
        title: 'How YouTube latency differs from speed',
        body:
          'Ping and bandwidth are related but different. Bandwidth controls how much data you can move, while ping reflects how fast each request-response cycle feels. On YouTube, high bandwidth matters for higher resolutions, but lower latency still helps the service feel more responsive when loading pages, switching videos, or starting streams.',
      },
      {
        title: 'Why a YouTube ping test is useful',
        body:
          'A YouTube-specific test can help you compare your route to a video-heavy platform against your broader internet baseline. If YouTube latency looks much worse than your default ping test, there may be a route or edge-specific issue. If both are healthy, buffering is more likely caused by throughput, device constraints, or temporary service-side demand.',
      },
      {
        title: 'Best way to read the result',
        body:
          'Use the result as a responsiveness signal rather than a full streaming-quality score. Lower and more stable latency suggests your path to YouTube is healthy. If the chart shows frequent spikes, test again while pausing background uploads, cloud sync, or large downloads. Those activities can raise delay even when your raw internet speed still looks fine.',
      },
    ],
  },
  {
    path: '/ping-aws',
    target: 'aws',
    navLabel: 'Ping AWS',
    shortLabel: 'AWS Ping Test',
    title: 'AWS Ping Test - Check Latency to Amazon Web Services',
    description:
      'Test your latency to AWS and get a quick view of how responsive your connection is to major cloud infrastructure.',
    eyebrow: 'Cloud infrastructure latency',
    h1: 'Test Your Ping to AWS',
    subtitle:
      'Measure how quickly your connection reaches Amazon Web Services and compare cloud latency with your broader baseline.',
    heroNote: 'Single-target test using AWS as the service endpoint.',
    introHeading: 'Why test ping to AWS?',
    introBody:
      'Many apps, APIs, and multiplayer backends run on Amazon Web Services. A focused AWS ping test helps you estimate how responsive your connection feels to large-scale cloud infrastructure, which can be useful when debugging app lag, cloud-hosted workloads, or region-sensitive services.',
    sections: [
      {
        title: 'Cloud latency and real applications',
        body:
          'Modern apps often rely on AWS for compute, storage, APIs, and real-time backends. That means latency to AWS can influence how quickly dashboards load, requests return, or game-related services respond. This page does not tell you the exact latency to every AWS region, but it does provide a useful high-level indicator of how your network reaches major cloud infrastructure.',
      },
      {
        title: 'When this page is helpful',
        body:
          'Use the AWS ping test when a cloud-hosted app feels sluggish, when comparing home and office connections, or when checking whether a VPN changes your route in a noticeable way. It also pairs well with the default ping page. If AWS is slower than your general baseline, the path to that cloud platform may be the source of the delay.',
      },
      {
        title: 'How to use the trend view',
        body:
          'Watch the session stats and recent-history graph during repeated tests. A consistently high result points to distance or routing, while sharp spikes may suggest local congestion or short-term instability. If you need more confidence, compare several short sessions across different times of day and look for a pattern rather than relying on one single run.',
      },
    ],
  },
]

export const pingPageMap = Object.fromEntries(pingPages.map((page) => [page.path, page]))

export const toolPages = pingPages.filter((page) => page.path !== '/')

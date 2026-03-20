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
    h1: 'Check Your Ping Instantly',
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

export const ipPages = [
  {
    path: '/what-is-my-ip',
    toolType: 'ip',
    navLabel: 'What Is My IP',
    shortLabel: 'IP Lookup',
    showInNav: true,
    title: 'What Is My IP Address? Check It Instantly',
    description:
      'Find your public IP address instantly, see whether you are using IPv4 or IPv6, and understand what your IP says about your connection.',
    eyebrow: 'Public IP lookup',
    h1: 'What Is My IP Address?',
    subtitle:
      'Check your current public IP address in seconds and confirm how your browser appears to the wider internet.',
    heroNote: 'Fast lookup for your current public IP and address version.',
    introHeading: 'Why check your IP address?',
    introBody:
      'A quick IP lookup helps you confirm how your network appears to websites and services. It can be useful when setting up remote access, checking VPN behavior, troubleshooting connection issues, or simply confirming whether your public address has changed.',
    quickFactsHeading: 'Use this page when you need to:',
    quickFacts: [
      'Confirm your current public IP before sharing it with support or an admin.',
      'Check whether your home or office connection has changed addresses recently.',
      'Verify what websites and remote services can see from your browser session.',
    ],
    sections: [
      {
        title: 'What an IP address does',
        body:
          'An IP address is the identifier your network uses to send and receive traffic across the internet. When you open a website or connect to an app, that service sees your public IP and uses it to return data to your device. It is one of the most basic pieces of network identity online.',
      },
      {
        title: 'Why your public IP can change',
        body:
          'Many home internet connections use dynamic public IP addresses, which means your ISP can rotate them over time. Restarting a router, reconnecting after maintenance, or switching networks can lead to a new address. That is why a simple IP check is useful whenever you need to confirm what is active right now.',
      },
      {
        title: 'When this tool is useful',
        body:
          'Use this page when testing a VPN, configuring allowlists, checking remote access rules, or comparing how different networks present themselves online. It is also handy when a support article asks for your IP or when you want to verify whether a proxy or privacy tool is actually changing what websites see.',
      },
    ],
  },
  {
    path: '/ip-check',
    toolType: 'ip',
    navLabel: 'IP Check',
    shortLabel: 'IP Check',
    showInNav: false,
    title: 'IP Check Tool - Find Your Public IP Fast',
    description:
      'Run a quick IP check to see your current public IP address, confirm your IP version, and verify how your connection appears online.',
    eyebrow: 'Quick network check',
    h1: 'Run a Fast IP Check',
    subtitle:
      'Verify your public IP address instantly and confirm whether your network is reaching the internet over IPv4 or IPv6.',
    heroNote: 'A quick way to confirm your current internet-facing IP.',
    introHeading: 'Why use an IP check tool?',
    introBody:
      'An IP check is one of the fastest network sanity checks you can run. It tells you what address websites see, which can help when a VPN seems stuck, a proxy looks misconfigured, or a service asks you to confirm the IP you are connecting from.',
    quickFactsHeading: 'This IP check is especially useful for:',
    quickFacts: [
      'Troubleshooting allowlist or firewall rules that depend on your current public IP.',
      'Checking whether a VPN or proxy is actually changing your outward-facing address.',
      'Confirming whether your connection is using IPv4 or IPv6 before deeper debugging.',
    ],
    sections: [
      {
        title: 'A fast troubleshooting signal',
        body:
          'Sometimes the simplest test is the most useful. If a service is rejecting your connection or a firewall rule is not behaving as expected, checking your current IP can quickly confirm whether you are coming from the address you expect. That alone can save time before deeper debugging.',
      },
      {
        title: 'Checking VPN and proxy behavior',
        body:
          'If you use a VPN or proxy, this page helps you confirm whether traffic is actually leaving through the route you intended. If your IP does not change when the tool is enabled, your traffic may still be using your original path. If it does change, the service is likely working as expected.',
      },
      {
        title: 'Why IP version matters',
        body:
          'Some networks connect over IPv4, some over IPv6, and some support both. Knowing the version in use can help during compatibility checks, firewall work, and DNS troubleshooting. It is a small detail, but it can explain why behavior differs between devices or networks.',
      },
    ],
  },
  {
    path: '/check-my-ip',
    toolType: 'ip',
    navLabel: 'Check My IP',
    shortLabel: 'Check My IP',
    showInNav: false,
    title: 'Check My IP - See My Public IP Address Now',
    description:
      'Check my IP instantly to see the public address your browser is using right now and confirm what websites can detect from your connection.',
    eyebrow: 'Instant address lookup',
    h1: 'Check My IP Address',
    subtitle:
      'See the public IP your browser is using right now and confirm how your current network appears to external services.',
    heroNote: 'Useful when your connection changes or you switch networks.',
    introHeading: 'Why would you check your IP?',
    introBody:
      'There are plenty of moments when you need to know your public IP quickly. Maybe you just switched Wi-Fi networks, turned on a VPN, restarted a router, or need to give your address to a coworker or admin. A fast lookup removes the guesswork.',
    quickFactsHeading: 'Common moments to check your IP:',
    quickFacts: [
      'Right after switching from one Wi-Fi network or hotspot to another.',
      'Before testing access to a private dashboard, server, or staging environment.',
      'After enabling or disabling a VPN to confirm which route is actually active.',
    ],
    sections: [
      {
        title: 'Your IP can vary by network',
        body:
          'Moving between home Wi-Fi, office internet, mobile tethering, and VPN connections can completely change the address websites see. That is why checking your IP after a network switch is useful. It confirms your current path instead of relying on assumptions about which route is active.',
      },
      {
        title: 'Helpful for access control',
        body:
          'Some dashboards, staging sites, and private tools restrict access to approved IP addresses. If you are troubleshooting an allowlist problem, your first question should often be simple: what IP am I actually using right now? This page helps answer that immediately.',
      },
      {
        title: 'A good first step before deeper tests',
        body:
          'IP checks do not replace full diagnostics, but they are a strong first step. Once you confirm the public address in use, you can move on to ping tests, DNS checks, or application-specific debugging with more confidence about the network path you are starting from.',
      },
    ],
  },
  {
    path: '/my-ip-address',
    toolType: 'ip',
    navLabel: 'My IP Address',
    shortLabel: 'My IP Address',
    showInNav: false,
    title: 'My IP Address - Find My Current Public IP',
    description:
      'Find my current public IP address, understand the difference between public and local IPs, and verify the address websites see from this connection.',
    eyebrow: 'Network basics',
    h1: 'Find My Current IP Address',
    subtitle:
      'Look up the public IP tied to your current connection and understand how it differs from the local address inside your home or office network.',
    heroNote: 'Shows the public address that external services can see.',
    introHeading: 'Public IP vs local IP',
    introBody:
      'People often hear “my IP address” and assume there is only one. In practice, you usually have a local IP inside your own network and a public IP that the wider internet sees. This page is focused on that public address, because that is the one most websites and remote services care about.',
    quickFactsHeading: 'This page helps clarify:',
    quickFacts: [
      'The difference between your router-assigned local IP and your internet-facing public IP.',
      'Why multiple devices in one home can still appear under a single public address.',
      'Which address matters when websites, APIs, and firewall rules identify your connection.',
    ],
    sections: [
      {
        title: 'Why local and public IPs differ',
        body:
          'Your laptop or phone usually has a local address assigned by your router, but that address is not what most external services see. Your router or gateway typically uses network address translation to send many devices through a single public IP. That is why your “internet IP” often looks different from the address shown in device settings.',
      },
      {
        title: 'Why this matters in real life',
        body:
          'Understanding the public address matters when setting up remote tools, firewall allowlists, hosting small services, or checking whether a VPN is active. If you only look at a device’s internal network settings, you may miss the address that actually matters for outside connections.',
      },
      {
        title: 'What this page can confirm',
        body:
          'This tool confirms the address and IP version visible to websites from your current session. It is not a full networking report, but it gives you the exact external identifier most services use as their starting point when making routing or security decisions.',
      },
    ],
  },
  {
    path: '/ip-lookup',
    toolType: 'ip',
    navLabel: 'IP Lookup',
    shortLabel: 'IP Lookup',
    showInNav: false,
    title: 'IP Lookup Tool - Check Your Current Public IP',
    description:
      'Use this IP lookup tool to check your current public IP address, confirm address version, and understand how your connection appears to external websites.',
    eyebrow: 'Lookup and verification',
    h1: 'Use This IP Lookup Tool',
    subtitle:
      'Look up the public IP for your current session and verify the address external services can detect from your browser.',
    heroNote: 'Focused on fast public IP lookup without extra noise.',
    introHeading: 'What an IP lookup tells you',
    introBody:
      'An IP lookup at its simplest tells you what public address is attached to your current request. That can help you confirm routing, identify the visible address behind a VPN or proxy, and double-check whether your current network setup matches what you expect before moving on to other tests.',
    quickFactsHeading: 'A quick lookup is useful before you:',
    quickFacts: [
      'Request access to a tool that only allows known IP addresses.',
      'Compare how your connection looks with and without a VPN or proxy enabled.',
      'Move on to latency or DNS tests that depend on knowing your current route first.',
    ],
    sections: [
      {
        title: 'Useful before remote setup',
        body:
          'If you need to connect to a remote admin panel, development environment, or private service, an IP lookup helps you confirm the address that may need to be allowlisted first. It is a quick step, but it often prevents access errors caused by stale or incorrect IP assumptions.',
      },
      {
        title: 'Why lookup tools stay relevant',
        body:
          'Even though IP addresses are a basic networking concept, they are still central to access control, routing, diagnostics, and privacy tools. A simple lookup remains useful because it answers a direct, practical question: what address am I using right now from the perspective of the outside world?',
      },
      {
        title: 'How this pairs with ping testing',
        body:
          'An IP lookup tells you identity, while a ping test tells you responsiveness. Together they make a useful starting toolkit. First confirm the route and address you are using, then test latency to understand how responsive that same connection feels under real network conditions.',
      },
    ],
  },
]

export const dnsPages = [
  {
    path: '/dns-lookup',
    toolType: 'dns',
    navLabel: 'DNS Lookup',
    shortLabel: 'DNS Lookup',
    showInNav: true,
    title: 'DNS Lookup Tool - Check DNS Records Fast',
    description:
      'Run a DNS lookup for a domain or subdomain, inspect common record types, and verify whether your DNS configuration looks healthy.',
    eyebrow: 'DNS troubleshooting',
    h1: 'Run A DNS Lookup',
    subtitle:
      'Check common DNS records for a domain in one place and use the result as a fast starting point for debugging routing, mail, and verification issues.',
    heroNote: 'Checks A, AAAA, CNAME, MX, TXT, and NS records from the same backend utility stack.',
    lookupFocus: 'All common records',
    introHeading: 'Why run a DNS lookup?',
    introBody:
      'A DNS lookup helps you confirm how a domain is configured before you dig into deeper network issues. It is useful when a website is not resolving, email delivery looks wrong, or you need to verify that a recent DNS change is actually visible.',
    formHint: 'Enter a domain or subdomain such as example.com or api.example.com.',
    exampleDomain: 'example.com',
    quickFactsHeading: 'Use this page when you need to:',
    quickFacts: [
      'Verify whether a domain points to the expected IP addresses or aliases.',
      'Check whether email or verification records appear to be present.',
      'Confirm that a subdomain is returning the DNS data you expect before deeper debugging.',
    ],
    sections: [
      {
        title: 'What this tool checks',
        body:
          'This page returns a practical set of common DNS records in a single lookup. That makes it a good first stop when you want to verify web routing, mail configuration, domain ownership records, or which name servers appear to be responsible for the zone.',
      },
      {
        title: 'Why DNS matters before anything else',
        body:
          'A surprising number of outages and setup issues start with DNS rather than the application itself. If the wrong record is published, a record is missing, or a subdomain points somewhere unexpected, the app can look broken even when the server is healthy. A quick lookup helps narrow that down fast.',
      },
      {
        title: 'How to read the results',
        body:
          'Treat the lookup as a configuration snapshot. Look for obvious mismatches first: missing A records, unexpected CNAME targets, missing MX records for a mail domain, or TXT records that do not match the value your provider expects. Once the DNS shape looks right, move on to ping or application-level checks.',
      },
    ],
  },
  {
    path: '/dns-check',
    toolType: 'dns',
    navLabel: 'DNS Check',
    shortLabel: 'DNS Check',
    showInNav: false,
    title: 'DNS Check Tool - Verify Domain DNS Records',
    description:
      'Use this DNS check tool to verify common DNS records and quickly spot whether a domain looks correctly configured.',
    eyebrow: 'Configuration verification',
    h1: 'Run A Fast DNS Check',
    subtitle:
      'Check whether a domain appears to have the core DNS records it needs before you spend time debugging the wrong layer.',
    heroNote: 'Best for quick verification when a site, mail setup, or subdomain change is not behaving as expected.',
    lookupFocus: 'DNS sanity check',
    introHeading: 'Why use a DNS check tool?',
    introBody:
      'A DNS check is often the fastest way to answer a simple question: does this domain look configured at all? When a launch, migration, or verification step is failing, that quick answer can save time before you move into server logs, app settings, or CDN dashboards.',
    formHint: 'Use this to sanity-check a live domain after a DNS change or deployment.',
    exampleDomain: 'www.example.com',
    quickFactsHeading: 'A DNS check is useful for:',
    quickFacts: [
      'Verifying that a recent DNS change did not leave a record group empty.',
      'Checking whether a web or app subdomain has a visible target.',
      'Confirming that a domain appears configured before testing the app itself.',
    ],
    sections: [
      {
        title: 'A practical first troubleshooting step',
        body:
          'When a site does not load or a new subdomain seems dead, there is no need to guess immediately about application bugs. A DNS check lets you confirm whether the domain is actually publishing the records you expect. That often narrows the problem much faster than diving into the app stack first.',
      },
      {
        title: 'Useful after migrations and cutovers',
        body:
          'DNS mistakes are common during domain moves, CDN cutovers, provider changes, and email onboarding. Even a small typo in a record or missing alias can break traffic. This page gives you a quick post-change verification point to see whether the visible record set matches the plan.',
      },
      {
        title: 'What a clean result does and does not mean',
        body:
          'A clean DNS response does not guarantee the whole service is healthy, but it does confirm the naming layer is at least returning data. That helps you decide whether to continue with ping, HTTP, TLS, or app-specific checks rather than staying stuck on domain configuration questions.',
      },
    ],
  },
  {
    path: '/check-dns-records',
    toolType: 'dns',
    navLabel: 'Check DNS Records',
    shortLabel: 'Check DNS Records',
    showInNav: false,
    title: 'Check DNS Records - Inspect Domain Record Types',
    description:
      'Check DNS records for a domain and review A, AAAA, CNAME, MX, TXT, and NS data from one place.',
    eyebrow: 'Record inspection',
    h1: 'Check DNS Records',
    subtitle:
      'Inspect the most common DNS record types for a domain and compare what is published with what you expect to see.',
    heroNote: 'Focused on record-by-record inspection when you need a more explicit DNS view.',
    lookupFocus: 'Record-by-record view',
    introHeading: 'When should you check DNS records?',
    introBody:
      'You should check DNS records whenever a domain, website, mail setup, or verification flow seems off and you want to inspect the published data directly. It is especially useful when documentation gives you a record to add and you want to confirm whether that exact value is visible.',
    formHint: 'Good for reviewing the full record set after adding or changing DNS entries.',
    exampleDomain: 'mail.example.com',
    quickFactsHeading: 'This page helps you:',
    quickFacts: [
      'Inspect the exact record groups a domain is returning right now.',
      'Compare published values against provider setup instructions.',
      'Spot obviously missing mail, verification, or routing records.',
    ],
    sections: [
      {
        title: 'Why record-level visibility matters',
        body:
          'A domain can look mostly healthy while still missing one critical record type. Maybe the A record exists but the MX records do not, or the TXT record for verification never got published correctly. Looking at each record group side by side makes those gaps easier to spot.',
      },
      {
        title: 'Helpful for email and verification work',
        body:
          'Record inspection is especially useful when setting up email, SPF, DKIM, or domain ownership verification. Those workflows often depend on exact values rather than broad connectivity alone. This page gives you a simpler way to verify whether the right record type is visible.',
      },
      {
        title: 'How to move from DNS to the next check',
        body:
          'If the record list looks right, the problem may be further downstream. That is the right moment to switch to ping tests, application checks, or provider-specific debugging. If the record list looks wrong, you have a much clearer reason to stay focused on DNS until the configuration is corrected.',
      },
    ],
  },
  {
    path: '/mx-lookup',
    toolType: 'dns',
    navLabel: 'MX Lookup',
    shortLabel: 'MX Lookup',
    showInNav: false,
    title: 'MX Lookup Tool - Check Mail Server Records',
    description:
      'Run an MX lookup to inspect mail server records and verify whether a domain appears ready for inbound email routing.',
    eyebrow: 'Email routing DNS',
    h1: 'Run An MX Lookup',
    subtitle:
      'Check MX records for a domain and confirm which mail servers appear responsible for receiving email.',
    heroNote: 'Especially useful when onboarding email providers or troubleshooting mail routing.',
    lookupFocus: 'Mail exchange records',
    introHeading: 'Why run an MX lookup?',
    introBody:
      'MX records tell other mail systems where email for a domain should go. If those records are missing or incorrect, mail delivery can fail even when the rest of the domain appears healthy. That makes MX lookup a valuable step during email setup and troubleshooting.',
    formHint: 'Use a mail domain or subdomain when you want to check where inbound email is directed.',
    exampleDomain: 'example.com',
    quickFactsHeading: 'MX lookups are useful for:',
    quickFacts: [
      'Checking whether a domain has visible inbound mail routing configured.',
      'Comparing MX priorities during a provider migration or rollout.',
      'Confirming mail records after switching to a hosted email platform.',
    ],
    sections: [
      {
        title: 'What MX records control',
        body:
          'MX records identify the mail servers that should receive email for a domain and define their priority order. When a provider asks you to add mail routing records, these are often the core entries that decide where delivery attempts are sent first.',
      },
      {
        title: 'Why email problems often start in DNS',
        body:
          'A mail client can look misconfigured when the actual issue is simpler: the sending system cannot find the correct MX records in the first place. Checking the published MX set is one of the fastest ways to confirm whether the domain is even advertising a destination for inbound mail.',
      },
      {
        title: 'How to use this with TXT checks',
        body:
          'MX alone is not the whole email story. After confirming the receiving servers, it is common to check TXT records for SPF, DKIM, or verification tokens as well. That is why this page pairs naturally with a broader DNS lookup or a TXT-focused check.',
      },
    ],
  },
  {
    path: '/txt-lookup',
    toolType: 'dns',
    navLabel: 'TXT Lookup',
    shortLabel: 'TXT Lookup',
    showInNav: false,
    title: 'TXT Lookup Tool - Check SPF, DKIM, and Verification Records',
    description:
      'Use a TXT lookup to inspect DNS text records such as SPF, DKIM-related values, and domain verification tokens.',
    eyebrow: 'Verification and policy DNS',
    h1: 'Run A TXT Lookup',
    subtitle:
      'Inspect TXT records for a domain when you need to verify ownership, review email policy values, or confirm setup tokens.',
    heroNote: 'TXT records often contain SPF, verification tokens, and other DNS-based configuration data.',
    lookupFocus: 'TXT and verification records',
    introHeading: 'Why check TXT records?',
    introBody:
      'TXT records are commonly used for domain verification, email policy, and other service integrations. They can be easy to mistype and hard to confirm by eye in a provider dashboard, so a lookup page gives you a faster way to see what is actually published.',
    formHint: 'Useful after adding SPF values, domain verification tokens, or provider-issued TXT entries.',
    exampleDomain: 'example.com',
    quickFactsHeading: 'TXT lookups help with:',
    quickFacts: [
      'Checking whether SPF or other policy text is visible in DNS.',
      'Confirming domain verification tokens after setup changes.',
      'Reviewing long TXT values outside a DNS provider dashboard.',
    ],
    sections: [
      {
        title: 'Why TXT records matter so often',
        body:
          'Many services use TXT records because they are flexible and easy to query. You will see them in email authentication, domain verification, security tooling, and third-party service setup. That makes TXT lookups one of the most practical DNS checks for real-world troubleshooting.',
      },
      {
        title: 'Common problems with TXT records',
        body:
          'TXT values are easy to copy incorrectly, split strangely, or publish under the wrong name. Even when a provider dashboard looks right, it helps to check what the DNS system is actually returning. This page gives you that external view of the published result.',
      },
      {
        title: 'How this page fits into a DNS workflow',
        body:
          'Start here when a service says your verification token or SPF record is missing. If the TXT value appears correctly, move on to propagation timing or provider-specific checks. If it is absent or wrong, you can stay focused on DNS with much more confidence about where the issue lives.',
      },
    ],
  },
]

export const pageMap = Object.fromEntries(
  [...pingPages, ...ipPages, ...dnsPages].map((page) => [page.path, page])
)

export const pingPageMap = Object.fromEntries(pingPages.map((page) => [page.path, page]))

export const toolPages = [...pingPages, ...ipPages, ...dnsPages].filter(
  (page) => page.path !== '/' && page.showInNav !== false
)

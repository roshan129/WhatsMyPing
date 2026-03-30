export const pingPages = [
  {
    path: '/',
    target: null,
    navLabel: 'Home',
    shortLabel: 'Ping Test',
    title: 'Roswag - Fast, Free Online Tools for Developers',
    description:
      'Use Roswag for fast online developer and network tools including ping tests, IP lookup, DNS lookup, and JSON formatting in one place.',
    eyebrow: 'Roswag utility hub',
    h1: 'Fast, Free Online Tools for Developers',
    subtitle:
      'Start with ping, IP, DNS, and JSON utilities, then move into focused tool pages built for quick checks and lightweight troubleshooting.',
    heroNote: 'Roswag is a growing multi-utility toolkit, with ping tests as one featured experience.',
    introHeading: 'Why use Roswag?',
    introBody:
      'Roswag is designed to keep useful web utilities in one clean place instead of spreading them across separate sites and tabs. You can start with a quick ping test, check your current IP, inspect DNS records, or format JSON without leaving the same shared tool hub.',
    sections: [
      {
        title: 'A simple multi-tool starting point',
        body:
          'Instead of treating each utility as a separate product, Roswag brings related checks together in one place. That makes it easier to move from one debugging step to the next. You can confirm your IP, inspect DNS, test latency, and clean up JSON responses as part of one quick workflow.',
      },
      {
        title: 'Built for practical everyday checks',
        body:
          'Most people do not need heavy observability dashboards for small issues. They need fast answers. Roswag focuses on practical checks that are easy to open, easy to read, and useful for both casual troubleshooting and developer workflows.',
      },
      {
        title: 'Tool-specific pages still matter for SEO and clarity',
        body:
          'Even though Roswag is the parent brand, each tool still has its own dedicated page, use case, and search intent. That means you can keep a strong homepage brand while still letting pages like ping tests, DNS lookups, IP checks, and JSON formatters stand on their own when people search for them directly.',
      },
    ],
  },
  {
    path: '/ping-test',
    target: null,
    navLabel: 'Ping Test',
    showInNav: true,
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
    showInNav: false,
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
    showInNav: false,
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
    showInNav: false,
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
    showInNav: false,
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
    showInNav: false,
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

export const jsonPages = [
  {
    path: '/json-formatter',
    toolType: 'json',
    navLabel: 'JSON Formatter',
    shortLabel: 'JSON Formatter',
    showInNav: true,
    title: 'JSON Formatter - Format and Validate JSON Online',
    description:
      'Format JSON online, clean up raw API responses, and validate whether your JSON is readable and structurally correct.',
    eyebrow: 'Developer utility',
    h1: 'Format JSON Instantly',
    subtitle:
      'Paste raw JSON, clean up the structure, and turn dense API payloads into readable output in seconds.',
    heroNote: 'A fast JSON formatter for debugging API responses, config files, and structured payloads.',
    toolFocus: 'Format and validate JSON',
    introHeading: 'Why use a JSON formatter?',
    introBody:
      'A JSON formatter turns compressed or messy JSON into something much easier to read. That is useful when you are debugging APIs, checking config output, or comparing nested objects that are hard to scan in their raw form.',
    formHint: 'Paste a valid JSON object or array to format it with clean indentation.',
    exampleInput: '{\n  "ok": true,\n  "items": [1, 2, 3]\n}',
    quickFactsHeading: 'This formatter is useful when you want to:',
    quickFacts: [
      'Make raw API responses readable before debugging them.',
      'Check whether JSON is valid before using it elsewhere.',
      'Clean up nested payloads copied from logs or tools.',
    ],
    sections: [
      {
        title: 'What formatting changes',
        body:
          'Formatting does not change the underlying JSON data. It only adds whitespace and indentation so the structure becomes easier to read. That can make nested objects, arrays, and repeated keys much easier to inspect when you are debugging data from an API or script.',
      },
      {
        title: 'Why readability matters',
        body:
          'Unreadable JSON slows down debugging. Even valid payloads can be hard to scan when everything is packed into one long line. A formatter helps you move faster by making the hierarchy obvious, which reduces the chance of missing a key, array item, or structural problem.',
      },
      {
        title: 'When this page is the right tool',
        body:
          'Use this page when you already have JSON and want a quick cleanup step. If the output formats cleanly, you can move on to inspecting values. If it fails, the error message becomes your next clue about where the JSON structure went wrong.',
      },
    ],
  },
  {
    path: '/json-pretty-print',
    toolType: 'json',
    navLabel: 'JSON Pretty Print',
    shortLabel: 'JSON Pretty Print',
    showInNav: false,
    title: 'JSON Pretty Print Tool - Beautify JSON Output',
    description:
      'Pretty print JSON online so nested objects and arrays become easier to read, debug, and compare.',
    eyebrow: 'Beautify raw output',
    h1: 'Pretty Print JSON',
    subtitle:
      'Turn compact JSON into neatly indented output that is easier to inspect during development and troubleshooting.',
    heroNote: 'Focused on readability when raw JSON is too dense to scan comfortably.',
    toolFocus: 'Beautify nested JSON',
    introHeading: 'Why pretty print JSON?',
    introBody:
      'Pretty printing is helpful when JSON is technically valid but frustrating to read. If a payload is deeply nested or packed into one line, beautifying it makes the structure easier to understand without changing the actual values.',
    formHint: 'Paste compact JSON from an API response, log, or config file to pretty print it.',
    exampleInput: '{"user":{"id":1,"name":"Rohan"},"roles":["admin","editor"]}',
    quickFactsHeading: 'Pretty printing is useful for:',
    quickFacts: [
      'Scanning deeply nested JSON without losing the structure.',
      'Comparing response shapes while debugging API changes.',
      'Making copied JSON easier to share with teammates.',
    ],
    sections: [
      {
        title: 'How pretty printing helps',
        body:
          'Pretty printing adds spacing, line breaks, and indentation so each level of the JSON structure is easier to follow. That becomes especially valuable when arrays contain objects or when you need to compare similar branches of a response without missing subtle differences.',
      },
      {
        title: 'Useful for API and config work',
        body:
          'Many developers paste raw JSON from browser tools, logs, or backend responses into a formatter before doing anything else. It is a quick habit that saves time because it turns an unreadable blob into something you can actually inspect with confidence.',
      },
      {
        title: 'What pretty printing does not do',
        body:
          'Pretty printing improves presentation, but it does not fix invalid JSON or incorrect data. If the input is broken, the parser will still fail. That is why this page is useful alongside validation: readability when the data is valid, and clear parser feedback when it is not.',
      },
    ],
  },
  {
    path: '/json-validator',
    toolType: 'json',
    navLabel: 'JSON Validator',
    shortLabel: 'JSON Validator',
    showInNav: false,
    title: 'JSON Validator - Check JSON for Errors Online',
    description:
      'Validate JSON online, catch parser errors, and understand why a JSON payload is failing before it reaches your app or API.',
    eyebrow: 'Validation and debugging',
    h1: 'Validate JSON Quickly',
    subtitle:
      'Check whether your JSON is valid, catch parser errors early, and use readable output when the structure passes.',
    heroNote: 'Useful when a parser, API, or script keeps rejecting your JSON input.',
    toolFocus: 'Validation-first workflow',
    introHeading: 'Why validate JSON?',
    introBody:
      'JSON validation helps you catch structural mistakes before they create confusing failures elsewhere. Missing commas, extra braces, invalid quotes, or malformed arrays are easy to overlook by eye, especially in larger payloads.',
    formHint: 'Paste JSON here to validate and format it.',
    exampleInput: '{\n  "config": {\n    "enabled": true,\n    "retryCount": 3\n  }\n}',
    quickFactsHeading: 'Validation helps when you need to:',
    quickFacts: [
      'Catch parser errors before sending JSON to an API.',
      'Debug malformed payloads copied from logs or code.',
      'Confirm that configuration JSON is structurally valid.',
    ],
    sections: [
      {
        title: 'Common JSON mistakes',
        body:
          'A lot of invalid JSON comes from small syntax mistakes: trailing commas, missing quotes, extra braces, or values copied from JavaScript objects that are not valid JSON. A validator gives you a faster answer than guessing where the structure broke.',
      },
      {
        title: 'Why validation saves time',
        body:
          'When an API or script rejects a payload, the root cause is often much simpler than it first appears. Validating JSON early narrows the problem quickly. If the JSON is valid, you can focus on the data itself. If it fails, the parser message gives you the next place to look.',
      },
      {
        title: 'How to use this page well',
        body:
          'Start by pasting the exact JSON that is failing. If the formatter succeeds, use the clean output to inspect the shape. If it fails, read the error message carefully and compare it against the surrounding braces, brackets, commas, and quotes near the reported position.',
      },
    ],
  },
  {
    path: '/json-viewer',
    toolType: 'json',
    navLabel: 'JSON Viewer',
    shortLabel: 'JSON Viewer',
    showInNav: false,
    title: 'JSON Viewer - Read and Inspect JSON Online',
    description:
      'Use this JSON viewer to inspect JSON data in a readable layout so objects, arrays, and nested values are easier to understand.',
    eyebrow: 'Readable data inspection',
    h1: 'View JSON More Clearly',
    subtitle:
      'Inspect JSON in a cleaner, more readable layout when raw payloads are too dense to scan comfortably.',
    heroNote: 'Best for reviewing structured data after copying it from an API, config file, or log.',
    toolFocus: 'Readable inspection',
    introHeading: 'Why use a JSON viewer?',
    introBody:
      'A JSON viewer is useful when the data is already valid and you mainly want a clearer way to read it. That is common when you are exploring API responses, inspecting configuration payloads, or checking the shape of nested objects and arrays.',
    formHint: 'Paste valid JSON to view it in a cleaner, readable format.',
    exampleInput: '{\n  "project": "WhatsMyPing",\n  "tools": ["ping", "ip", "dns"]\n}',
    quickFactsHeading: 'A JSON viewer helps you:',
    quickFacts: [
      'Inspect nested objects without losing context.',
      'Read copied API responses more comfortably.',
      'Understand the shape of arrays and repeated objects faster.',
    ],
    sections: [
      {
        title: 'Viewing versus validating',
        body:
          'A viewer is most useful once the JSON is already structurally correct. At that point the goal shifts from “is this valid?” to “what does this data actually contain?” Clean formatting helps answer that question faster, especially with multi-level payloads.',
      },
      {
        title: 'Useful during exploration',
        body:
          'If you are working with a new API or unfamiliar payload, viewing the JSON in a readable format makes it easier to spot keys, nested objects, and repeated patterns. That can speed up integration work because you spend less time deciphering raw output.',
      },
      {
        title: 'How this complements debugging',
        body:
          'When debugging structured data, readability matters almost as much as correctness. First make sure the payload is valid, then use a viewer-style layout to understand what it actually says. That combination makes the tool useful for both validation and inspection.',
      },
    ],
  },
]

export const base64Pages = [
  {
    path: '/base64-encode',
    toolType: 'base64',
    mode: 'encode',
    navLabel: 'Base64 Encoder',
    shortLabel: 'Base64 Encode',
    showInNav: true,
    title: 'Base64 Encode - Encode Text to Base64 Online',
    description:
      'Encode text to Base64 online instantly for debugging, APIs, config values, and developer workflows.',
    eyebrow: 'Encoding utility',
    h1: 'Encode Text To Base64',
    subtitle:
      'Paste plain text, convert it to Base64 in seconds, and copy the encoded output for your next step.',
    heroNote: 'Best for quick Base64 encoding during API work, config setup, and debugging.',
    toolFocus: 'Text to Base64 encoding',
    introHeading: 'Why use a Base64 encoder?',
    introBody:
      'Base64 encoding is a simple way to turn plain text into an ASCII-safe representation that is easier to move through systems that expect text-friendly payloads. It is common in APIs, tokens, config values, and debugging workflows.',
    formHint: 'Paste plain text to encode it into Base64.',
    exampleInput: 'Hello from Roswag',
    quickFactsHeading: 'Base64 encoding is useful when you need to:',
    quickFacts: [
      'Convert plain text into a text-safe encoded string.',
      'Prepare small values for APIs, headers, or configuration fields.',
      'Quickly test how application data changes when encoded.',
    ],
    sections: [
      {
        title: 'What Base64 encoding does',
        body:
          'Base64 encoding does not encrypt or secure your data. It simply converts binary or plain text content into a limited text character set that is easier to transmit in systems that expect text-safe values. That makes it practical for transport, formatting, and compatibility, not secrecy.',
      },
      {
        title: 'Common reasons developers encode text',
        body:
          'Developers often use Base64 when moving data through APIs, embedding values in configuration, testing authorization headers, or converting content into a format that works cleanly inside JSON, HTML, or command-line workflows. It is a utility step that shows up in many small debugging tasks.',
      },
      {
        title: 'When this page is the right tool',
        body:
          'Use this page when you already have plain text and want a quick encoded result without opening another app or script. If you need to go in the opposite direction, switch to the decoder page and inspect the original text output there.',
      },
    ],
  },
  {
    path: '/base64-decode',
    toolType: 'base64',
    mode: 'decode',
    navLabel: 'Base64 Decoder',
    shortLabel: 'Base64 Decode',
    showInNav: false,
    title: 'Base64 Decode - Decode Base64 to Text Online',
    description:
      'Decode Base64 to text online quickly so you can inspect encoded values, debug payloads, and verify content.',
    eyebrow: 'Decoding utility',
    h1: 'Decode Base64 To Text',
    subtitle:
      'Paste Base64 input, convert it back to readable text, and inspect the decoded value in seconds.',
    heroNote: 'Useful when an API, token, or config field contains encoded content you need to read.',
    toolFocus: 'Base64 to text decoding',
    introHeading: 'Why use a Base64 decoder?',
    introBody:
      'A Base64 decoder helps you turn encoded strings back into readable text so you can verify what is really being sent or stored. That is useful when you are debugging APIs, checking headers, or inspecting application values that have been encoded upstream.',
    formHint: 'Paste a valid Base64 string to decode it back to text.',
    exampleInput: 'SGVsbG8gZnJvbSBSb3N3YWc=',
    quickFactsHeading: 'Decoding helps when you want to:',
    quickFacts: [
      'Inspect what an encoded string actually contains.',
      'Debug API payloads or config values that arrive in Base64 form.',
      'Confirm whether copied Base64 data is valid before moving on.',
    ],
    sections: [
      {
        title: 'What decoding reveals',
        body:
          'Decoding Base64 lets you see the original text representation behind an encoded value. That can make debugging much faster because you stop guessing what a string might mean and instead inspect the exact value that another system produced.',
      },
      {
        title: 'Why invalid Base64 needs clear errors',
        body:
          'Not every copied value is clean. Missing padding, invalid characters, or malformed strings can all cause confusion. A good decoder should fail clearly so you know whether the problem is the encoded data itself or the downstream system using it.',
      },
      {
        title: 'When to use this page',
        body:
          'Use this page when you receive a Base64 string from logs, APIs, tokens, or application settings and want to understand what it contains. If you instead need to generate a fresh encoded value, switch to the encoder page and start from plain text.',
      },
    ],
  },
  {
    path: '/text-to-base64',
    toolType: 'base64',
    mode: 'encode',
    navLabel: 'Text to Base64',
    shortLabel: 'Text to Base64',
    showInNav: false,
    title: 'Text to Base64 Converter - Encode Text Online',
    description:
      'Convert text to Base64 online for fast developer workflows, API testing, and config preparation.',
    eyebrow: 'Text conversion',
    h1: 'Convert Text To Base64',
    subtitle:
      'Turn plain text into Base64 quickly when you need a text-safe encoded value for transport or testing.',
    heroNote: 'Focused on the plain-text-to-encoded workflow rather than general Base64 theory.',
    toolFocus: 'Plain text conversion',
    introHeading: 'Why convert text to Base64?',
    introBody:
      'Sometimes the job is simple: you have text, and another system expects Base64. This page is optimized for that straightforward workflow so you can paste content, convert it, and move on without extra friction.',
    formHint: 'Paste plain text such as a small payload, token fragment, or config value.',
    exampleInput: 'api-key:live-demo',
    quickFactsHeading: 'This converter is helpful when you need to:',
    quickFacts: [
      'Encode a short string without opening a terminal.',
      'Prepare values for quick API or config testing.',
      'Convert copied text into an encoded transport-safe form.',
    ],
    sections: [
      {
        title: 'A focused conversion workflow',
        body:
          'This route is useful for people searching specifically for text-to-Base64 conversion rather than a more general encoder. The tool behavior is the same, but the surrounding guidance is tuned to the plain text conversion use case that often comes up in day-to-day development.',
      },
      {
        title: 'Good for small repeat tasks',
        body:
          'If you encode strings frequently during testing, a browser-based converter can be faster than context-switching into scripts or shell commands. It is especially convenient for quick debugging, manual verification, and copy-paste heavy workflows.',
      },
      {
        title: 'What this page does not imply',
        body:
          'Converting text to Base64 is about representation, not protection. The output may look less readable at a glance, but it is still reversible. Treat it as a compatibility and transport step, not a security feature.',
      },
    ],
  },
  {
    path: '/base64-to-text',
    toolType: 'base64',
    mode: 'decode',
    navLabel: 'Base64 to Text',
    shortLabel: 'Base64 to Text',
    showInNav: false,
    title: 'Base64 to Text Converter - Decode Base64 Online',
    description:
      'Convert Base64 to text online and inspect encoded values quickly while debugging APIs, configs, or app output.',
    eyebrow: 'Readable decode',
    h1: 'Convert Base64 To Text',
    subtitle:
      'Decode an encoded string back into readable text so you can inspect what another system actually produced.',
    heroNote: 'Helpful when copied Base64 values need quick inspection instead of deeper tooling.',
    toolFocus: 'Readable decoded output',
    introHeading: 'Why convert Base64 to text?',
    introBody:
      'When you are debugging, encoded values are only useful once you can inspect them. This page is aimed at that direct conversion workflow: paste the Base64 string, decode it, and review the text output immediately.',
    formHint: 'Paste Base64 here to convert it into readable text output.',
    exampleInput: 'YXBpLWtleTpsaXZlLWRlbW8=',
    quickFactsHeading: 'This page helps you:',
    quickFacts: [
      'Inspect what a Base64 value actually contains.',
      'Check copied strings from logs, headers, or payloads.',
      'Catch malformed input early with a clear decode error.',
    ],
    sections: [
      {
        title: 'Useful during inspection and debugging',
        body:
          'Base64-to-text conversion is often part of a broader debugging workflow. You may be checking how an upstream system encoded a value, verifying what a header contains, or confirming whether a copied string is even valid Base64 in the first place.',
      },
      {
        title: 'Why a dedicated decoder page still helps',
        body:
          'Even though the encoder and decoder share the same underlying tool, separate SEO pages let each route target a clearer user intent. Someone searching for “Base64 to text” usually wants fast decoding help, not a broader explanation of the whole encoding workflow.',
      },
      {
        title: 'What to do after decoding',
        body:
          'Once the value is decoded, your next step often depends on the content itself. If it looks like JSON, move into the JSON formatter. If it is part of a larger config or network workflow, you can continue into the related Roswag tools from there.',
      },
    ],
  },
]

export const urlPages = [
  {
    path: '/url-encode',
    toolType: 'url',
    mode: 'encode',
    navLabel: 'URL Encoder',
    shortLabel: 'URL Encode',
    showInNav: true,
    title: 'URL Encoder - Encode URLs Online',
    description:
      'Encode URLs online with percent encoding so spaces, symbols, and unsafe characters are converted safely.',
    eyebrow: 'Percent encoding',
    h1: 'Encode URL Text Safely',
    subtitle:
      'Paste plain text or a URL, encode it for safe transport, and copy the result for your next request or config step.',
    heroNote: 'Useful for query strings, links, API parameters, and text that needs URL-safe encoding.',
    toolFocus: 'URL-safe percent encoding',
    introHeading: 'Why use a URL encoder?',
    introBody:
      'URL encoding converts characters like spaces, ampersands, and punctuation into a format that works safely inside URLs and query strings. It is one of those small utilities that becomes very useful whenever you work with APIs, redirects, search links, or dynamic parameters.',
    formHint: 'Paste text or a URL to convert it into encoded URL-safe output.',
    quickFactsHeading: 'Encoding is useful when you need to:',
    quickFacts: [
      'Make spaces and special characters safe inside a URL.',
      'Prepare query parameters for API calls or links.',
      'Quickly inspect how raw text changes when percent-encoded.',
    ],
    sections: [
      {
        title: 'What URL encoding changes',
        body:
          'URL encoding replaces characters that are unsafe or ambiguous inside a URL with percent-encoded equivalents. That helps browsers, servers, and applications interpret the value consistently instead of misreading spaces, delimiters, or reserved characters.',
      },
      {
        title: 'Common developer use cases',
        body:
          'Developers use URL encoding when building query strings, passing callback URLs, generating search links, or preparing user input for transport in web requests. It is especially helpful when a small formatting mistake can break a redirect, request, or link parameter.',
      },
      {
        title: 'When this page is the right tool',
        body:
          'Use this page when you already have raw text or a partial URL and need a safe encoded representation without jumping into another tool or script. If you need to inspect an already encoded value instead, switch to the decoder page and reverse it there.',
      },
    ],
  },
  {
    path: '/url-decode',
    toolType: 'url',
    mode: 'decode',
    navLabel: 'URL Decoder',
    shortLabel: 'URL Decode',
    showInNav: false,
    title: 'URL Decoder - Decode Encoded URLs Online',
    description:
      'Decode encoded URLs online quickly so you can inspect readable text, query parameters, and percent-encoded values.',
    eyebrow: 'Readable decode',
    h1: 'Decode URL Text',
    subtitle:
      'Paste encoded URL text, convert it back into readable form, and inspect what the original value actually says.',
    heroNote: 'Best for debugging query strings, encoded links, callback URLs, and app output.',
    toolFocus: 'Readable URL decoding',
    introHeading: 'Why use a URL decoder?',
    introBody:
      'A URL decoder is useful when a value is full of `%20`, `%2F`, and other encoded characters that make it hard to read. Decoding it back to plain text makes debugging faster and helps you understand exactly what a request or link contains.',
    formHint: 'Paste encoded URL text to decode it back into readable output.',
    quickFactsHeading: 'Decoding helps you:',
    quickFacts: [
      'Inspect encoded query strings more easily.',
      'Debug links or parameters copied from logs and requests.',
      'Catch malformed encoded input with a clear error message.',
    ],
    sections: [
      {
        title: 'What decoding reveals',
        body:
          'URL decoding converts percent-encoded sequences back into the original readable characters. That is useful when you want to inspect what a request parameter, redirect target, or copied link actually contains without mentally translating the encoded symbols yourself.',
      },
      {
        title: 'Why invalid decode errors matter',
        body:
          'Malformed percent-encoded strings can break parsing and create confusing downstream errors. A clear decoder should tell you when the encoded text itself is invalid so you know whether the problem is the source value or the application consuming it.',
      },
      {
        title: 'When to use this page',
        body:
          'Use this page when you receive an encoded URL fragment or query string and want to inspect the readable version quickly. If you instead need to generate a safe encoded value from raw text, switch to the encoder page and work in the other direction.',
      },
    ],
  },
  {
    path: '/encode-url',
    toolType: 'url',
    mode: 'encode',
    navLabel: 'Encode URL',
    shortLabel: 'Encode URL',
    showInNav: false,
    title: 'Encode URL Online - Percent Encode Text Fast',
    description:
      'Encode URL text online fast so parameters, links, and user input stay safe inside web requests.',
    eyebrow: 'Link-safe formatting',
    h1: 'Encode URL Values Quickly',
    subtitle:
      'Convert raw text into a URL-safe encoded value when links, requests, or redirects need percent encoding.',
    heroNote: 'Focused on fast encoding for links, query params, and URL-driven workflows.',
    toolFocus: 'Quick URL-safe formatting',
    introHeading: 'Why encode a URL value?',
    introBody:
      'Sometimes you do not need a full URL parser. You just need to take a value and make sure it is safe inside a URL. This page focuses on that practical workflow so you can encode quickly and move on.',
    formHint: 'Paste a path fragment, query value, redirect target, or plain text to encode it.',
    quickFactsHeading: 'This page is useful when you want to:',
    quickFacts: [
      'Encode one small value without opening a terminal.',
      'Prepare redirect or callback parameters quickly.',
      'Check how text changes before inserting it into a URL.',
    ],
    sections: [
      {
        title: 'A focused encoding workflow',
        body:
          'This route is aimed at people searching specifically for “encode URL” rather than a broader explanation of percent encoding. The underlying tool is the same, but the surrounding content is focused on the common workflow of taking a raw value and making it safe for URL usage.',
      },
      {
        title: 'Helpful for links and parameters',
        body:
          'Many small bugs in web apps come from unencoded spaces, ampersands, question marks, or fragments being inserted into a URL. A quick encoder helps prevent that by showing the exact value that should be passed through links, query strings, or API requests.',
      },
      {
        title: 'What encoding does not do',
        body:
          'Encoding makes a value URL-safe, but it does not validate the destination or confirm whether the broader URL is correct. It is a formatting step, not a full link-checking or routing tool.',
      },
    ],
  },
  {
    path: '/decode-url',
    toolType: 'url',
    mode: 'decode',
    navLabel: 'Decode URL',
    shortLabel: 'Decode URL',
    showInNav: false,
    title: 'Decode URL Online - Read Encoded URL Text',
    description:
      'Decode URL-encoded text online so links, query strings, and parameters become easier to read and debug.',
    eyebrow: 'Inspect encoded values',
    h1: 'Decode URL Values',
    subtitle:
      'Turn encoded URL text back into readable form so you can inspect links, parameters, and redirect targets more clearly.',
    heroNote: 'Helpful when query strings or copied links are too encoded to understand at a glance.',
    toolFocus: 'Readable decoded parameters',
    introHeading: 'Why decode a URL value?',
    introBody:
      'URL decoding is often part of everyday debugging. You may want to inspect what a query parameter contains, confirm whether a redirect target is correct, or understand the readable version of a value copied from a request log.',
    formHint: 'Paste encoded URL text here to inspect the decoded result.',
    quickFactsHeading: 'This decoder helps you:',
    quickFacts: [
      'Read copied query parameters more easily.',
      'Inspect redirect targets and encoded links quickly.',
      'Catch malformed percent-encoded strings before deeper debugging.',
    ],
    sections: [
      {
        title: 'Useful during link and request debugging',
        body:
          'Encoded URL text can hide the actual structure of a value, especially when spaces, punctuation, and path fragments are all represented through percent sequences. Decoding helps you inspect what the application is really sending or receiving.',
      },
      {
        title: 'Why a dedicated decoder page still helps',
        body:
          'Even though the encoder and decoder share the same underlying tool, separate SEO pages help each route target a clearer intent. Someone searching for “decode URL” usually wants a fast readable result, not a broader percent-encoding overview.',
      },
      {
        title: 'What to do after decoding',
        body:
          'Once the readable value appears, your next step depends on the content itself. You may move into the JSON formatter, Base64 tool, or DNS and network utilities if the decoded value is part of a larger debugging chain.',
      },
    ],
  },
]

export const uuidPages = [
  {
    path: '/uuid-generator',
    toolType: 'uuid',
    navLabel: 'UUID Generator',
    shortLabel: 'UUID Generator',
    showInNav: true,
    title: 'UUID Generator - Generate UUID v4 Online',
    description:
      'Generate UUID v4 values online instantly, copy single IDs or full batches, and create random UUIDs for apps, APIs, and databases.',
    eyebrow: 'Random identifiers',
    h1: 'Generate UUID v4 Values Instantly',
    subtitle:
      'Create one or many UUID v4 identifiers in seconds, copy them individually or together, and keep your workflow moving.',
    heroNote: 'Built for quick ID generation during app development, testing, data seeding, and request tracing.',
    toolFocus: 'UUID v4 generation',
    introHeading: 'Why use a UUID generator?',
    introBody:
      'UUIDs are one of the most common ways to create unique identifiers without coordinating with a central ID service first. A fast browser-based generator is useful when you need IDs right away for payloads, database rows, test fixtures, queue messages, or tracing values.',
    quickFactsHeading: 'This generator helps when you need to:',
    quickFacts: [
      'Create unique identifiers quickly without writing a script.',
      'Generate batches of UUIDs for test data or import prep.',
      'Copy one UUID or a full list depending on the workflow.',
    ],
    sections: [
      {
        title: 'What a UUID is',
        body:
          'A UUID is a long identifier format designed to be globally unique enough for practical software use. It is commonly used for rows, objects, sessions, events, and request IDs because it works well across distributed systems where IDs may be created in many places at once.',
      },
      {
        title: 'Why UUID v4 is popular',
        body:
          'UUID v4 relies on randomness rather than timestamps or machine-specific sequences. That makes it a simple and widely supported choice when you want unique IDs without exposing ordering or infrastructure details.',
      },
      {
        title: 'When this page is useful',
        body:
          'Use this page when you need a fresh UUID right now and do not want to stop to open a REPL, script, or local utility. It is especially handy during API testing, data modeling, and quick debugging sessions.',
      },
    ],
  },
  {
    path: '/generate-uuid',
    toolType: 'uuid',
    navLabel: 'Generate UUID',
    shortLabel: 'Generate UUID',
    showInNav: false,
    title: 'Generate UUID Online - Fast Random UUID Tool',
    description:
      'Generate UUIDs online fast for test payloads, records, and app workflows with a quick random UUID generation tool.',
    eyebrow: 'Fast ID creation',
    h1: 'Generate UUIDs Fast',
    subtitle:
      'Pick a count, generate a fresh set of random UUIDs, and copy the IDs you need for your next request or fixture.',
    heroNote: 'Focused on the practical workflow of generating UUIDs quickly during development and troubleshooting.',
    toolFocus: 'Fast random UUID batches',
    introHeading: 'Why generate a UUID online?',
    introBody:
      'Sometimes the need is simple: you just need a valid UUID now. This page is built around that search intent, giving you a quick route to fresh identifiers without extra setup or context switching.',
    quickFactsHeading: 'Use this route when you want to:',
    quickFacts: [
      'Generate IDs quickly during API testing.',
      'Create placeholder record IDs in seconds.',
      'Avoid opening a terminal for small one-off tasks.',
    ],
    sections: [
      {
        title: 'A practical tool for one-off IDs',
        body:
          'Many workflows only need a handful of valid IDs for a request body, seed file, or manual test. This page is optimized for that fast generate-and-copy flow rather than broader UUID theory.',
      },
      {
        title: 'Useful for product and engineering teams',
        body:
          'Developers, QA engineers, product managers, and support teams all run into moments where a unique-looking ID is useful. A browser-based generator keeps that lightweight and accessible.',
      },
      {
        title: 'Why batch generation matters',
        body:
          'Generating several UUIDs at once is helpful when you are preparing fixture data, mock entities, or repeated API calls. It saves time compared with creating one ID at a time in a script or terminal.',
      },
    ],
  },
  {
    path: '/uuid-v4-generator',
    toolType: 'uuid',
    navLabel: 'UUID v4 Generator',
    shortLabel: 'UUID v4',
    showInNav: false,
    title: 'UUID v4 Generator - Create Random Version 4 UUIDs',
    description:
      'Create random UUID v4 values online and copy one or many identifiers for modern apps, APIs, and data workflows.',
    eyebrow: 'Version 4 UUIDs',
    h1: 'Create UUID v4 Values',
    subtitle:
      'Generate version 4 UUIDs for distributed systems, test environments, and database records without leaving the browser.',
    heroNote: 'Focused specifically on UUID version 4, the most common random UUID format used in application development.',
    toolFocus: 'Version 4 UUIDs',
    introHeading: 'What makes UUID v4 different?',
    introBody:
      'UUID v4 is the random-based UUID format that many modern platforms support directly. It is a popular default because it is simple to generate, easy to validate, and well understood across APIs, databases, and libraries.',
    quickFactsHeading: 'UUID v4 is useful because it is:',
    quickFacts: [
      'Widely supported across platforms and languages.',
      'Random-based instead of timestamp-based.',
      'Easy to use for records, events, and request identifiers.',
    ],
    sections: [
      {
        title: 'Why version 4 is widely adopted',
        body:
          'Version 4 UUIDs are straightforward to generate because they do not depend on centralized sequencing or precise time coordination. That makes them a natural fit for services and applications that create IDs in many different places.',
      },
      {
        title: 'Where UUID v4 shows up',
        body:
          'You will often see UUID v4 in REST APIs, message queues, event payloads, auth-related flows, and database schemas. It is especially common where readability is less important than easy uniqueness and strong interoperability.',
      },
      {
        title: 'When to choose another ID strategy',
        body:
          'UUID v4 is a strong default, but it is not always the perfect fit. If strict ordering, shorter IDs, or human-friendliness matter more, another strategy may be better. For many general backend workflows though, v4 remains a practical choice.',
      },
    ],
  },
  {
    path: '/random-uuid-generator',
    toolType: 'uuid',
    navLabel: 'Random UUID Generator',
    shortLabel: 'Random UUID',
    showInNav: false,
    title: 'Random UUID Generator - Create Unique IDs Online',
    description:
      'Use a random UUID generator online to create unique IDs for development, QA, payloads, and distributed application workflows.',
    eyebrow: 'Random ID utility',
    h1: 'Create Random UUIDs',
    subtitle:
      'Generate random UUIDs online when you need quick unique identifiers for debugging, fixtures, and app data.',
    heroNote: 'Geared toward people searching specifically for random UUID generation instead of broader identifier theory.',
    toolFocus: 'Random unique identifiers',
    introHeading: 'Why random UUIDs are useful',
    introBody:
      'Random UUID generation is appealing because it removes the need to coordinate IDs manually. You can produce unique-looking values quickly and use them across systems, forms, payloads, and data imports with very little friction.',
    quickFactsHeading: 'Random UUIDs help you:',
    quickFacts: [
      'Create IDs without central coordination.',
      'Prepare quick sample data for testing.',
      'Avoid collisions in everyday development workflows.',
    ],
    sections: [
      {
        title: 'Good for distributed workflows',
        body:
          'When multiple services, scripts, or people may create identifiers independently, random UUIDs reduce the chance of overlap while keeping the generation step simple. That is one reason they are common in distributed systems and event-driven designs.',
      },
      {
        title: 'Helpful beyond backend engineering',
        body:
          'Random UUIDs are also useful for QA, demos, support reproduction steps, and internal docs where examples need realistic IDs. A web tool makes that accessible even for teammates who are not working from a local code environment.',
      },
      {
        title: 'What this page emphasizes',
        body:
          'This route leans into the random-ID search intent, while still using the same underlying generator as the rest of the UUID pages. It is the same tool with slightly different surrounding context for discoverability.',
      },
    ],
  },
  {
    path: '/uuid-generator-online',
    toolType: 'uuid',
    navLabel: 'UUID Generator Online',
    shortLabel: 'UUID Online',
    showInNav: false,
    title: 'UUID Generator Online - Bulk UUID v4 Tool',
    description:
      'Use an online UUID generator to create one or many UUID v4 values instantly and copy them for APIs, databases, and test data.',
    eyebrow: 'Online bulk UUIDs',
    h1: 'Use an Online UUID Generator',
    subtitle:
      'Generate bulk UUID v4 values directly in the browser and copy them into payloads, schemas, fixtures, or import lists.',
    heroNote: 'Designed for online batch generation when you need multiple UUIDs without a local helper script.',
    toolFocus: 'Bulk UUID generation online',
    introHeading: 'Why use an online UUID generator?',
    introBody:
      'An online UUID generator is useful when speed matters more than setup. You can open the page, create the IDs you need, and move on without writing code, opening a terminal, or switching tools.',
    quickFactsHeading: 'This page is especially useful when you need to:',
    quickFacts: [
      'Generate several UUIDs at once for imports or fixtures.',
      'Copy all generated IDs in one action.',
      'Stay in the browser during debugging or planning work.',
    ],
    sections: [
      {
        title: 'Batch generation speeds up setup work',
        body:
          'Bulk UUID generation is practical when you are preparing sample entities, import rows, mock requests, or repeated event payloads. Copying a whole batch at once keeps that work fast and reduces repetitive steps.',
      },
      {
        title: 'Useful for browser-first workflows',
        body:
          'Not every UUID need starts inside an IDE. Sometimes you are reviewing a payload, planning a schema, or coordinating with a teammate in a browser-first workflow. An online tool fits those moments nicely.',
      },
      {
        title: 'How this route differs',
        body:
          'The generator is the same underneath, but this page is tuned for people explicitly searching for an online UUID tool or a lightweight batch generator. That gives it a clearer SEO fit while keeping the user experience consistent.',
      },
    ],
  },
]

export const pageMap = Object.fromEntries(
  [...pingPages, ...ipPages, ...dnsPages, ...jsonPages, ...base64Pages, ...urlPages, ...uuidPages].map((page) => [
    page.path,
    page,
  ])
)

export const pingPageMap = Object.fromEntries(pingPages.map((page) => [page.path, page]))

export const navPages = [...pingPages, ...ipPages, ...dnsPages, ...jsonPages, ...base64Pages, ...urlPages, ...uuidPages]
  .filter((page) => page.path !== '/' && page.showInNav !== false)

export const toolPages = [...pingPages, ...ipPages, ...dnsPages, ...jsonPages, ...base64Pages, ...urlPages, ...uuidPages]
  .filter((page) => page.path !== '/')

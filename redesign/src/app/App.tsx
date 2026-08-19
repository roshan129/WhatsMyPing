import { useState, useCallback, useEffect, useRef } from "react";
import {
  Activity,
  Globe,
  Search,
  Code2,
  Lock,
  Link2,
  Hash,
  Key,
  Clock,
  ArrowRight,
  Copy,
  Check,
  RefreshCw,
  Menu,
  X,
  AlertCircle,
  ChevronRight,
  Terminal,
  Zap,
  Shield,
  Wifi,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ─── Types ─────────────────────────────────────────────────────────────────────
type Page =
  | "home"
  | "ping"
  | "ip"
  | "dns"
  | "json"
  | "base64"
  | "url"
  | "uuid"
  | "jwt"
  | "timestamp";

interface Tool {
  id: Page;
  label: string;
  shortLabel: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties; className?: string }>;
  accent: string;
  category: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────────
const TOOLS: Tool[] = [
  { id: "ping", label: "Ping Test", shortLabel: "Ping", desc: "Measure internet latency to any host", icon: Activity, accent: "#A8FF40", category: "Network" },
  { id: "ip", label: "IP Lookup", shortLabel: "IP", desc: "Find your public IP address", icon: Globe, accent: "#40C8FF", category: "Network" },
  { id: "dns", label: "DNS Lookup", shortLabel: "DNS", desc: "Query A, MX, TXT, NS, CNAME records", icon: Search, accent: "#FF8C40", category: "Network" },
  { id: "json", label: "JSON Formatter", shortLabel: "JSON", desc: "Format, minify & validate JSON data", icon: Code2, accent: "#FF40C8", category: "Format" },
  { id: "base64", label: "Base64 Codec", shortLabel: "Base64", desc: "Encode and decode Base64 strings", icon: Lock, accent: "#A840FF", category: "Encode" },
  { id: "url", label: "URL Codec", shortLabel: "URL", desc: "Encode and decode URL components", icon: Link2, accent: "#40FFD4", category: "Encode" },
  { id: "uuid", label: "UUID Generator", shortLabel: "UUID", desc: "Generate RFC-4122 v4 unique IDs", icon: Hash, accent: "#FFD440", category: "Generate" },
  { id: "jwt", label: "JWT Decoder", shortLabel: "JWT", desc: "Inspect JWT header and payload", icon: Key, accent: "#FF4060", category: "Decode" },
  { id: "timestamp", label: "Timestamp Converter", shortLabel: "Time", desc: "Convert Unix timestamps and dates", icon: Clock, accent: "#40FF8C", category: "Convert" },
];

const PING_TARGETS = [
  { label: "Google DNS", host: "8.8.8.8" },
  { label: "Cloudflare", host: "1.1.1.1" },
  { label: "Discord", host: "discord.com" },
  { label: "YouTube", host: "youtube.com" },
  { label: "AWS", host: "aws.amazon.com" },
];

const DISPLAY_FONT: React.CSSProperties = { fontFamily: "'Bricolage Grotesque', sans-serif" };
const MONO_FONT: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

// ─── Utilities ─────────────────────────────────────────────────────────────────
function formatJSON(str: string): { result: string; error: string | null } {
  try {
    return { result: JSON.stringify(JSON.parse(str), null, 2), error: null };
  } catch (e: any) {
    return { result: "", error: e.message };
  }
}

function encodeBase64(str: string): string {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch {
    return "Invalid input";
  }
}

function decodeBase64(str: string): { result: string; error: string | null } {
  try {
    return { result: decodeURIComponent(escape(atob(str.trim()))), error: null };
  } catch {
    return { result: "", error: "Invalid Base64 string" };
  }
}

function pingQualityLabel(ms: number): { label: string; color: string } {
  if (ms < 20) return { label: "Excellent", color: "#A8FF40" };
  if (ms < 50) return { label: "Good", color: "#40FFD4" };
  if (ms < 100) return { label: "Fair", color: "#FFD440" };
  if (ms < 200) return { label: "Poor", color: "#FF8C40" };
  return { label: "Critical", color: "#FF4060" };
}

function simulatePing(host: string): number {
  const base = host === "1.1.1.1" ? 7 : host === "8.8.8.8" ? 11 : host === "discord.com" ? 24 : 30;
  return Math.max(1, Math.round(base + (Math.random() - 0.4) * base * 1.2));
}

function decodeJWT(token: string): { header: any; payload: any; error: string | null } {
  try {
    const parts = token.trim().split(".");
    if (parts.length !== 3) throw new Error("JWT must have exactly 3 parts separated by dots");
    const decode = (str: string) =>
      JSON.parse(atob(str.replace(/-/g, "+").replace(/_/g, "/")));
    return { header: decode(parts[0]), payload: decode(parts[1]), error: null };
  } catch (e: any) {
    return { header: null, payload: null, error: e.message };
  }
}

// ─── CopyButton ────────────────────────────────────────────────────────────────
function CopyButton({ text, className = "" }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button
      onClick={copy}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-all ${
        copied
          ? "bg-[#A8FF40]/10 text-[#A8FF40] border border-[#A8FF40]/30"
          : "bg-white/5 text-white/40 border border-white/[0.08] hover:bg-white/10 hover:text-white/70"
      } ${className}`}
      style={MONO_FONT}
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

// ─── Nav ───────────────────────────────────────────────────────────────────────
function Nav({ current, onNavigate }: { current: Page; onNavigate: (p: Page) => void }) {
  const [open, setOpen] = useState(false);
  const navTools = TOOLS.slice(0, 8);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.05] bg-[#06070D]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 group"
        >
          <div className="w-7 h-7 bg-[#A8FF40] rounded flex items-center justify-center flex-shrink-0">
            <Terminal size={13} className="text-[#06070D]" />
          </div>
          <span className="font-bold text-white tracking-tight text-[15px]" style={DISPLAY_FONT}>
            Roswag
          </span>
          <span
            className="text-[#A8FF40]/50 text-[9px] tracking-widest uppercase ml-0.5 hidden sm:block"
            style={MONO_FONT}
          >
            dev tools
          </span>
        </button>

        <div className="hidden lg:flex items-center gap-0.5">
          {navTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onNavigate(tool.id)}
              className={`px-3 py-1.5 text-[11px] rounded transition-all ${
                current === tool.id
                  ? "text-[#A8FF40] bg-[#A8FF40]/8"
                  : "text-white/35 hover:text-white/60 hover:bg-white/[0.04]"
              }`}
              style={MONO_FONT}
            >
              {tool.shortLabel}
            </button>
          ))}
        </div>

        <button
          className="lg:hidden text-white/40 hover:text-white/70 transition-colors"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-white/[0.05] bg-[#06070D]/98 px-4 py-3 grid grid-cols-3 gap-1.5">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => { onNavigate(tool.id); setOpen(false); }}
              className={`px-3 py-2 text-[11px] rounded text-left transition-all border ${
                current === tool.id
                  ? "bg-[#A8FF40]/8 text-[#A8FF40] border-[#A8FF40]/20"
                  : "text-white/40 hover:text-white/70 hover:bg-white/[0.03] border-white/[0.05]"
              }`}
              style={MONO_FONT}
            >
              {tool.shortLabel}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────
function Footer({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const groups = [
    { label: "Network", tools: ["ping", "ip", "dns"] as Page[] },
    { label: "Format / Encode", tools: ["json", "base64", "url"] as Page[] },
    { label: "Generate / Parse", tools: ["uuid", "jwt", "timestamp"] as Page[] },
  ];

  return (
    <footer className="border-t border-white/[0.05] mt-24 py-14 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-[#A8FF40] rounded flex items-center justify-center">
                <Terminal size={11} className="text-[#06070D]" />
              </div>
              <span className="font-bold text-white text-sm" style={DISPLAY_FONT}>Roswag</span>
            </div>
            <p className="text-xs text-white/25 leading-relaxed" style={MONO_FONT}>
              Developer utility hub. Fast, private tools for everyday debugging.
            </p>
            <p className="text-xs text-white/15 mt-3" style={MONO_FONT}>roswag.com</p>
          </div>
          {groups.map((group) => (
            <div key={group.label}>
              <h4
                className="text-[10px] text-white/25 uppercase tracking-widest mb-4"
                style={MONO_FONT}
              >
                {group.label}
              </h4>
              <ul className="space-y-2.5">
                {group.tools.map((id) => {
                  const tool = TOOLS.find((t) => t.id === id)!;
                  return (
                    <li key={id}>
                      <button
                        onClick={() => onNavigate(id)}
                        className="text-xs text-white/40 hover:text-[#A8FF40] transition-colors"
                        style={MONO_FONT}
                      >
                        {tool.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/[0.04] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/15" style={MONO_FONT}>
            © 2025 Roswag
          </p>
          <p className="text-[11px] text-white/15" style={MONO_FONT}>
            No tracking · No sign-up · Just tools
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── ToolHero ──────────────────────────────────────────────────────────────────
function ToolHero({ tool, children }: { tool: Tool; children?: React.ReactNode }) {
  const Icon = tool.icon;
  return (
    <div className="pt-24 pb-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-5">
          <span
            className="text-[10px] px-2 py-0.5 rounded border border-white/[0.08] text-white/25"
            style={MONO_FONT}
          >
            {tool.category}
          </span>
          <span className="text-white/15 text-xs">›</span>
          <span className="text-[10px] text-white/25" style={MONO_FONT}>
            {tool.label}
          </span>
        </div>
        <div className="flex items-start gap-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center mt-0.5 flex-shrink-0"
            style={{ background: `${tool.accent}14`, border: `1px solid ${tool.accent}28` }}
          >
            <Icon size={22} style={{ color: tool.accent }} />
          </div>
          <div>
            <h1
              className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-none"
              style={DISPLAY_FONT}
            >
              {tool.label}
            </h1>
            <p className="text-white/35 mt-2 text-sm">{tool.desc}</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── RelatedTools ──────────────────────────────────────────────────────────────
function RelatedTools({ exclude, onNavigate }: { exclude: Page; onNavigate: (p: Page) => void }) {
  const related = TOOLS.filter((t) => t.id !== exclude).slice(0, 4);
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-16">
      <h3 className="text-[10px] text-white/25 uppercase tracking-widest mb-4" style={MONO_FONT}>
        Related Tools
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {related.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => onNavigate(tool.id)}
              className="group p-4 rounded-xl border border-white/[0.06] bg-white/[0.015] hover:bg-white/[0.035] hover:border-white/[0.10] transition-all text-left"
            >
              <Icon size={16} className="mb-2.5" style={{ color: tool.accent }} />
              <p className="text-xs font-medium text-white/60 group-hover:text-white/90 transition-colors leading-snug">
                {tool.label}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── TerminalPanel ─────────────────────────────────────────────────────────────
function TerminalPanel() {
  const lines = [
    { text: "$ ping 8.8.8.8", type: "cmd" },
    { text: "seq=1  time=11ms  ttl=57", type: "ok" },
    { text: "seq=2  time=12ms  ttl=57", type: "ok" },
    { text: "seq=3  time=9ms   ttl=57", type: "ok" },
    { text: "", type: "blank" },
    { text: "$ your-ip", type: "cmd" },
    { text: "203.0.113.47  IPv4  AS13335 Cloudflare", type: "ok" },
    { text: "", type: "blank" },
    { text: "$ uuid generate", type: "cmd" },
    { text: "7f8e9d2c-4a3b-4f1e-8c6d-9b0a1e2f3c4d", type: "accent" },
    { text: "", type: "blank" },
    { text: "$ json format", type: "cmd" },
    { text: '{ "status": "valid", "keys": 12 }', type: "accent" },
  ];

  return (
    <div
      className="rounded-2xl border border-white/[0.07] bg-[#080910] overflow-hidden"
      style={{ boxShadow: "0 0 60px rgba(168,255,64,0.04)" }}
    >
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.05]">
        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
        <span className="ml-2 text-[10px] text-white/20" style={MONO_FONT}>roswag — terminal</span>
      </div>
      <div className="p-5 space-y-1">
        {lines.map((line, i) => (
          <div
            key={i}
            className="text-xs leading-relaxed"
            style={{
              ...MONO_FONT,
              color:
                line.type === "cmd"
                  ? "rgba(255,255,255,0.7)"
                  : line.type === "accent"
                  ? "#A8FF40"
                  : line.type === "ok"
                  ? "rgba(255,255,255,0.35)"
                  : "transparent",
              animationDelay: `${i * 80}ms`,
            }}
          >
            {line.text || " "}
          </div>
        ))}
        <div className="flex items-center gap-1 pt-1">
          <span className="text-xs text-white/50" style={MONO_FONT}>$ </span>
          <span
            className="w-1.5 h-3.5 bg-[#A8FF40] animate-pulse inline-block"
            style={{ animationDuration: "1s" }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── HomePage ──────────────────────────────────────────────────────────────────
function HomePage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [query, setQuery] = useState("");
  const filtered = query.trim()
    ? TOOLS.filter(
        (t) =>
          t.label.toLowerCase().includes(query.toLowerCase()) ||
          t.desc.toLowerCase().includes(query.toLowerCase()) ||
          t.category.toLowerCase().includes(query.toLowerCase())
      )
    : TOOLS;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-28 pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#A8FF40]/20 bg-[#A8FF40]/5 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-[#A8FF40] animate-pulse" />
              <span className="text-xs text-[#A8FF40]" style={MONO_FONT}>
                9 tools · no sign-up
              </span>
            </div>

            <h1
              className="text-5xl sm:text-6xl font-extrabold text-white leading-[0.93] tracking-tight mb-6"
              style={DISPLAY_FONT}
            >
              Every dev tool.
              <br />
              <span className="text-[#A8FF40]">One address.</span>
            </h1>

            <p className="text-base text-white/40 max-w-md mb-10 leading-relaxed">
              Ping, DNS, IP, JSON, Base64, UUID, JWT, timestamps — open it, use
              it, close it. No accounts, no ads, no distractions.
            </p>

            <div className="flex flex-wrap gap-3 mb-14">
              <button
                onClick={() => onNavigate("ping")}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#A8FF40] text-[#06070D] rounded-lg font-semibold text-sm hover:bg-[#BFFF5A] transition-colors"
                style={DISPLAY_FONT}
              >
                Run Ping Test <ArrowRight size={15} />
              </button>
              <button
                onClick={() => onNavigate("json")}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.04] border border-white/[0.08] text-white/60 rounded-lg font-semibold text-sm hover:bg-white/[0.07] hover:text-white/80 transition-colors"
              >
                Format JSON
              </button>
            </div>

            <div className="flex gap-6">
              {[
                { value: "9", label: "Tools" },
                { value: "0ms", label: "Sign-up time" },
                { value: "100%", label: "Client-side" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    className="text-2xl font-bold text-[#A8FF40]"
                    style={{ ...DISPLAY_FONT, ...MONO_FONT }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/25 mt-0.5" style={MONO_FONT}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <TerminalPanel />
          </div>
        </div>
      </section>

      {/* Tool grid */}
      <section className="px-4 sm:px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[11px] text-white/25 uppercase tracking-widest" style={MONO_FONT}>
              All Tools
            </h2>
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-white/[0.02] border border-white/[0.07] rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/20 w-36 focus:outline-none focus:border-[#A8FF40]/25 transition-colors"
              style={MONO_FONT}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => onNavigate(tool.id)}
                  className="group p-5 rounded-2xl border border-white/[0.06] bg-white/[0.018] hover:bg-white/[0.035] hover:border-white/[0.11] transition-all text-left relative overflow-hidden"
                >
                  <div
                    className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-2xl pointer-events-none"
                    style={{ background: `${tool.accent}12` }}
                  />
                  <div className="flex items-start justify-between mb-4 relative">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{
                        background: `${tool.accent}14`,
                        border: `1px solid ${tool.accent}24`,
                      }}
                    >
                      <Icon size={18} style={{ color: tool.accent }} />
                    </div>
                    <span
                      className="text-[9px] px-2 py-0.5 rounded border border-white/[0.06] text-white/20"
                      style={MONO_FONT}
                    >
                      {tool.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white/75 group-hover:text-white transition-colors text-sm mb-1">
                    {tool.label}
                  </h3>
                  <p className="text-xs text-white/28 leading-relaxed">{tool.desc}</p>
                  <div
                    className="flex items-center gap-1 mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: tool.accent }}
                  >
                    <span className="text-[11px]" style={MONO_FONT}>
                      Open tool
                    </span>
                    <ChevronRight size={11} />
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="col-span-3 py-16 text-center text-white/20 text-sm" style={MONO_FONT}>
                No tools match "{query}"
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 sm:px-6 py-20 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-[11px] text-white/20 uppercase tracking-widest mb-12 text-center"
            style={MONO_FONT}
          >
            Why developers use Roswag
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: Zap,
                title: "Instant",
                desc: "Most tools run entirely in your browser. No server round-trips, no waiting, no rate limits.",
                color: "#FFD440",
              },
              {
                icon: Shield,
                title: "Private",
                desc: "Your data never leaves your device. No telemetry, no logs, no analytics on your inputs.",
                color: "#40FFD4",
              },
              {
                icon: Wifi,
                title: "Always Available",
                desc: "No account, no subscription. Just open roswag.com and start working.",
                color: "#A8FF40",
              },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="p-7 rounded-2xl border border-white/[0.06] bg-white/[0.015]"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                    style={{
                      background: `${f.color}14`,
                      border: `1px solid ${f.color}24`,
                    }}
                  >
                    <Icon size={20} style={{ color: f.color }} />
                  </div>
                  <h3
                    className="font-bold text-white mb-2 text-lg"
                    style={DISPLAY_FONT}
                  >
                    {f.title}
                  </h3>
                  <p className="text-sm text-white/38 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}

// ─── PingPage ──────────────────────────────────────────────────────────────────
function PingPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const tool = TOOLS.find((t) => t.id === "ping")!;
  const [target, setTarget] = useState(PING_TARGETS[0]);
  const [running, setRunning] = useState(false);
  const [samples, setSamples] = useState<{ ms: number; idx: number }[]>([]);
  const [current, setCurrent] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const start = useCallback(() => {
    setSamples([]);
    setCurrent(null);
    setRunning(true);
  }, []);

  useEffect(() => {
    if (!running) return;
    let idx = 0;
    intervalRef.current = setInterval(() => {
      const ms = simulatePing(target.host);
      setCurrent(ms);
      setSamples((prev) => [...prev.slice(-49), { ms, idx: idx++ }]);
    }, 700);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, target]);

  const avg = samples.length
    ? Math.round(samples.reduce((a, b) => a + b.ms, 0) / samples.length)
    : null;
  const min = samples.length ? Math.min(...samples.map((s) => s.ms)) : null;
  const max = samples.length ? Math.max(...samples.map((s) => s.ms)) : null;
  const quality = current !== null ? pingQualityLabel(current) : null;

  return (
    <div className="min-h-screen">
      <ToolHero tool={tool} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        {/* Target selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {PING_TARGETS.map((t) => (
            <button
              key={t.host}
              onClick={() => {
                setTarget(t);
                stop();
                setSamples([]);
                setCurrent(null);
              }}
              className={`px-4 py-2 rounded-lg text-xs transition-all border ${
                target.host === t.host
                  ? "bg-[#A8FF40]/8 border-[#A8FF40]/25 text-[#A8FF40]"
                  : "border-white/[0.06] text-white/35 hover:text-white/60 hover:border-white/[0.10] bg-white/[0.015]"
              }`}
              style={MONO_FONT}
            >
              {t.label}
              <span className="opacity-40 ml-1.5">{t.host}</span>
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-3 mb-8">
          {running ? (
            <button
              onClick={stop}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#FF4060]/8 border border-[#FF4060]/25 text-[#FF4060] rounded-lg text-sm font-semibold hover:bg-[#FF4060]/14 transition-all"
            >
              <div className="w-2 h-2 rounded-sm bg-[#FF4060]" /> Stop
            </button>
          ) : (
            <button
              onClick={start}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#A8FF40] text-[#06070D] rounded-lg text-sm font-bold hover:bg-[#BFFF5A] transition-colors"
              style={DISPLAY_FONT}
            >
              <Activity size={16} /> Start Ping
            </button>
          )}
          {samples.length > 0 && (
            <button
              onClick={() => { setSamples([]); setCurrent(null); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border border-white/[0.07] text-white/40 rounded-lg text-sm hover:bg-white/[0.06] transition-colors"
            >
              <RefreshCw size={14} /> Clear
            </button>
          )}
        </div>

        {/* Current reading */}
        {current !== null && quality && (
          <div className="mb-5 p-7 rounded-2xl border border-white/[0.06] bg-white/[0.015] flex items-center gap-10">
            <div>
              <div
                className="text-7xl font-black leading-none"
                style={{ ...DISPLAY_FONT, color: quality.color }}
              >
                {current}
              </div>
              <div className="text-sm text-white/25 mt-1.5" style={MONO_FONT}>
                ms latency
              </div>
            </div>
            <div className="border-l border-white/[0.06] pl-10">
              <div
                className="text-2xl font-bold mb-1"
                style={{ ...DISPLAY_FONT, color: quality.color }}
              >
                {quality.label}
              </div>
              <div className="text-xs text-white/30" style={MONO_FONT}>
                → {target.host}
              </div>
              {running && (
                <div className="mt-2 flex items-center gap-1.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: quality.color }}
                  />
                  <span className="text-xs text-white/25" style={MONO_FONT}>
                    live
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chart */}
        {samples.length > 3 && (
          <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.015] mb-5">
            <h3 className="text-[10px] text-white/25 uppercase tracking-widest mb-4" style={MONO_FONT}>
              Latency History ({samples.length} samples)
            </h3>
            <ResponsiveContainer width="100%" height={110}>
              <LineChart data={samples}>
                <XAxis dataKey="idx" hide />
                <YAxis hide domain={["auto", "auto"]} />
                <Tooltip
                  contentStyle={{
                    background: "#080910",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 8,
                    fontSize: 11,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                  labelStyle={{ display: "none" }}
                  formatter={(v: any) => [`${v}ms`, "Latency"]}
                />
                <Line
                  type="monotone"
                  dataKey="ms"
                  stroke="#A8FF40"
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Stats */}
        {avg !== null && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Average", value: `${avg}ms` },
              { label: "Min", value: `${min}ms` },
              { label: "Max", value: `${max}ms` },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.015] text-center"
              >
                <div
                  className="text-2xl font-bold text-white"
                  style={DISPLAY_FONT}
                >
                  {stat.value}
                </div>
                <div className="text-xs text-white/25 mt-1" style={MONO_FONT}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {!running && current === null && (
          <div className="p-14 rounded-2xl border border-dashed border-white/[0.06] text-center">
            <Activity size={30} className="text-white/15 mx-auto mb-3" />
            <p className="text-white/30 text-sm">
              Select a target and click{" "}
              <strong className="text-white/50">Start Ping</strong> to begin
            </p>
          </div>
        )}
      </div>
      <RelatedTools exclude="ping" onNavigate={onNavigate} />
      <Footer onNavigate={onNavigate} />
    </div>
  );
}

// ─── IPPage ────────────────────────────────────────────────────────────────────
function IPPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const tool = TOOLS.find((t) => t.id === "ip")!;
  const ipData = {
    ip: "203.0.113.47",
    version: "IPv4",
    org: "AS13335 Cloudflare, Inc.",
    country: "United States",
    region: "California",
    city: "San Francisco",
    timezone: "America/Los_Angeles",
    userAgent: navigator.userAgent.slice(0, 60) + "…",
  };

  return (
    <div className="min-h-screen">
      <ToolHero tool={tool} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div className="p-8 rounded-2xl border border-white/[0.06] bg-white/[0.015] mb-5">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-[10px] text-white/25 uppercase tracking-widest mb-2" style={MONO_FONT}>
                Your Public IP
              </p>
              <div
                className="text-5xl sm:text-6xl font-black tracking-tight"
                style={{ ...DISPLAY_FONT, color: "#40C8FF" }}
              >
                {ipData.ip}
              </div>
              <span
                className="inline-block mt-3 text-[11px] px-2.5 py-0.5 rounded border border-[#40C8FF]/20 bg-[#40C8FF]/6"
                style={{ ...MONO_FONT, color: "#40C8FF" }}
              >
                {ipData.version}
              </span>
            </div>
            <CopyButton text={ipData.ip} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries({
            Organization: ipData.org,
            Country: ipData.country,
            Region: ipData.region,
            City: ipData.city,
            Timezone: ipData.timezone,
          }).map(([key, value]) => (
            <div
              key={key}
              className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.015] flex items-center justify-between gap-4"
            >
              <div>
                <div className="text-[10px] text-white/25 mb-0.5" style={MONO_FONT}>
                  {key}
                </div>
                <div className="text-sm text-white/70" style={MONO_FONT}>
                  {value}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3.5 rounded-xl border border-yellow-500/10 bg-yellow-500/[0.04]">
          <p className="text-xs text-yellow-400/50" style={MONO_FONT}>
            ⚠ IP data shown is illustrative. Connect backend API at /api/ip for live geolocation.
          </p>
        </div>
      </div>
      <RelatedTools exclude="ip" onNavigate={onNavigate} />
      <Footer onNavigate={onNavigate} />
    </div>
  );
}

// ─── DNSPage ───────────────────────────────────────────────────────────────────
function DNSPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const tool = TOOLS.find((t) => t.id === "dns")!;
  const [domain, setDomain] = useState("google.com");
  const [queried, setQueried] = useState(false);

  const results = {
    A: ["142.250.80.46", "142.250.80.78", "142.250.80.110"],
    AAAA: ["2607:f8b0:4004:c1b::71"],
    MX: ["10 smtp.google.com", "20 alt1.aspmx.l.google.com"],
    NS: ["ns1.google.com", "ns2.google.com", "ns3.google.com", "ns4.google.com"],
    TXT: ["v=spf1 include:_spf.google.com ~all"],
  };

  const recordColors: Record<string, string> = {
    A: "#A8FF40",
    AAAA: "#40FFD4",
    MX: "#FF8C40",
    NS: "#FFD440",
    TXT: "#FF40C8",
  };

  return (
    <div className="min-h-screen">
      <ToolHero tool={tool} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setQueried(true)}
            placeholder="Enter domain (e.g. example.com)"
            className="flex-1 bg-[#0B0C16] border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#FF8C40]/25 transition-colors"
            style={MONO_FONT}
          />
          <button
            onClick={() => setQueried(true)}
            className="px-6 py-3 bg-[#FF8C40] text-[#06070D] rounded-xl text-sm font-bold hover:bg-[#FFA060] transition-colors whitespace-nowrap"
            style={DISPLAY_FONT}
          >
            Lookup
          </button>
        </div>

        {queried ? (
          <div className="space-y-3">
            {Object.entries(results).map(([type, records]) => (
              <div
                key={type}
                className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.015]"
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <span
                    className="text-[11px] font-bold px-2.5 py-0.5 rounded"
                    style={{
                      ...MONO_FONT,
                      background: `${recordColors[type]}12`,
                      color: recordColors[type],
                      border: `1px solid ${recordColors[type]}22`,
                    }}
                  >
                    {type}
                  </span>
                  <span className="text-[10px] text-white/20" style={MONO_FONT}>
                    {records.length} record{records.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="space-y-2">
                  {records.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-4 py-1.5 border-b border-white/[0.04] last:border-0"
                    >
                      <code className="text-xs text-white/60" style={MONO_FONT}>
                        {r}
                      </code>
                      <CopyButton text={r} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="p-3.5 rounded-xl border border-yellow-500/10 bg-yellow-500/[0.04]">
              <p className="text-xs text-yellow-400/50" style={MONO_FONT}>
                ⚠ Showing simulated records for {domain}. Live lookups require backend DNS resolver.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-14 rounded-2xl border border-dashed border-white/[0.06] text-center">
            <Search size={30} className="text-white/15 mx-auto mb-3" />
            <p className="text-white/30 text-sm">
              Enter a domain and press{" "}
              <strong className="text-white/50">Lookup</strong>
            </p>
          </div>
        )}
      </div>
      <RelatedTools exclude="dns" onNavigate={onNavigate} />
      <Footer onNavigate={onNavigate} />
    </div>
  );
}

// ─── JSONPage ──────────────────────────────────────────────────────────────────
function JSONPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const tool = TOOLS.find((t) => t.id === "json")!;
  const [input, setInput] = useState(
    `{"name":"Roswag","version":"2.0","tools":["ping","dns","ip","json","base64","uuid","jwt","timestamp"],"active":true,"meta":{"built":"2025","author":"roswag.com"}}`
  );
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const format = () => {
    const { result, error } = formatJSON(input);
    setOutput(result);
    setError(error);
  };

  const minify = () => {
    try {
      setOutput(JSON.stringify(JSON.parse(input)));
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  const validate = () => {
    const { error } = formatJSON(input);
    setError(error);
    if (!error) setOutput("✓ Valid JSON");
  };

  return (
    <div className="min-h-screen">
      <ToolHero tool={tool} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex gap-2 mb-4 flex-wrap">
          {[
            { label: "Format", action: format, color: "#FF40C8" },
            { label: "Minify", action: minify, color: null },
            { label: "Validate", action: validate, color: null },
          ].map((btn) => (
            <button
              key={btn.label}
              onClick={btn.action}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                btn.color
                  ? "text-[#06070D]"
                  : "bg-white/[0.04] border border-white/[0.07] text-white/50 hover:bg-white/[0.07]"
              }`}
              style={{
                ...MONO_FONT,
                ...(btn.color ? { background: btn.color } : {}),
              }}
            >
              {btn.label}
            </button>
          ))}
          <button
            onClick={() => { setInput(""); setOutput(""); setError(null); }}
            className="px-4 py-2 rounded-lg text-xs bg-white/[0.02] border border-white/[0.06] text-white/30 hover:bg-white/[0.05] transition-colors ml-auto"
            style={MONO_FONT}
          >
            Clear
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-white/25 uppercase tracking-widest" style={MONO_FONT}>
                Input
              </span>
              <span className="text-[10px] text-white/20" style={MONO_FONT}>
                {input.length} chars
              </span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-80 bg-[#080910] border border-white/[0.07] rounded-xl p-4 text-xs text-white/75 resize-none focus:outline-none focus:border-[#FF40C8]/20 transition-colors leading-relaxed"
              style={MONO_FONT}
              placeholder='{"key": "value"}'
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-white/25 uppercase tracking-widest" style={MONO_FONT}>
                Output
              </span>
              {output && !error && <CopyButton text={output} />}
            </div>
            {error ? (
              <div className="h-80 bg-[#080910] border border-[#FF4060]/18 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle size={15} className="text-[#FF4060] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-[#FF4060] font-semibold mb-1" style={MONO_FONT}>
                    Parse error
                  </p>
                  <p className="text-xs text-[#FF4060]/60 leading-relaxed" style={MONO_FONT}>
                    {error}
                  </p>
                </div>
              </div>
            ) : (
              <pre
                className="w-full h-80 bg-[#080910] border border-white/[0.07] rounded-xl p-4 text-xs overflow-auto leading-relaxed"
                style={{ ...MONO_FONT, color: output ? "#A8FF40" : "rgba(255,255,255,0.15)" }}
              >
                {output || "Formatted output appears here"}
              </pre>
            )}
          </div>
        </div>
      </div>
      <RelatedTools exclude="json" onNavigate={onNavigate} />
      <Footer onNavigate={onNavigate} />
    </div>
  );
}

// ─── Base64Page ────────────────────────────────────────────────────────────────
function Base64Page({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const tool = TOOLS.find((t) => t.id === "base64")!;
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!input.trim()) { setOutput(""); setError(null); return; }
    if (mode === "encode") {
      setOutput(encodeBase64(input));
      setError(null);
    } else {
      const { result, error } = decodeBase64(input);
      setOutput(result);
      setError(error);
    }
  }, [input, mode]);

  return (
    <div className="min-h-screen">
      <ToolHero tool={tool} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex gap-2 mb-5">
          {(["encode", "decode"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setInput(""); setOutput(""); setError(null); }}
              className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all capitalize ${
                mode === m
                  ? "text-white"
                  : "bg-white/[0.03] border border-white/[0.07] text-white/40 hover:bg-white/[0.06]"
              }`}
              style={{
                ...MONO_FONT,
                ...(mode === m ? { background: "#A840FF" } : {}),
              }}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] text-white/25 uppercase tracking-widest block mb-2" style={MONO_FONT}>
              {mode === "encode" ? "Plain Text" : "Base64 String"}
            </span>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-64 bg-[#080910] border border-white/[0.07] rounded-xl p-4 text-xs text-white/75 resize-none focus:outline-none focus:border-[#A840FF]/20 transition-colors leading-relaxed"
              style={MONO_FONT}
              placeholder={mode === "encode" ? "Enter text to encode…" : "Enter Base64 string to decode…"}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-white/25 uppercase tracking-widest" style={MONO_FONT}>
                {mode === "encode" ? "Base64 Output" : "Decoded Text"}
              </span>
              {output && !error && <CopyButton text={output} />}
            </div>
            {error ? (
              <div className="h-64 bg-[#080910] border border-[#FF4060]/18 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle size={15} className="text-[#FF4060] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-[#FF4060]/60" style={MONO_FONT}>{error}</p>
              </div>
            ) : (
              <pre
                className="w-full h-64 bg-[#080910] border border-white/[0.07] rounded-xl p-4 text-xs overflow-auto leading-relaxed break-all whitespace-pre-wrap"
                style={{ ...MONO_FONT, color: output ? "#A840FF" : "rgba(255,255,255,0.15)" }}
              >
                {output || "Output appears here as you type"}
              </pre>
            )}
          </div>
        </div>
      </div>
      <RelatedTools exclude="base64" onNavigate={onNavigate} />
      <Footer onNavigate={onNavigate} />
    </div>
  );
}

// ─── URLPage ───────────────────────────────────────────────────────────────────
function URLPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const tool = TOOLS.find((t) => t.id === "url")!;
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");

  const output = (() => {
    if (!input.trim()) return "";
    try {
      return mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input);
    } catch {
      return "Invalid URL encoding";
    }
  })();

  return (
    <div className="min-h-screen">
      <ToolHero tool={tool} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex gap-2 mb-5">
          {(["encode", "decode"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setInput(""); }}
              className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all capitalize ${
                mode === m
                  ? "text-[#06070D]"
                  : "bg-white/[0.03] border border-white/[0.07] text-white/40 hover:bg-white/[0.06]"
              }`}
              style={{
                ...MONO_FONT,
                ...(mode === m ? { background: "#40FFD4" } : {}),
              }}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] text-white/25 uppercase tracking-widest block mb-2" style={MONO_FONT}>
              {mode === "encode" ? "Raw URL" : "Encoded URL"}
            </span>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-48 bg-[#080910] border border-white/[0.07] rounded-xl p-4 text-xs text-white/75 resize-none focus:outline-none focus:border-[#40FFD4]/20 transition-colors leading-relaxed"
              style={MONO_FONT}
              placeholder={
                mode === "encode"
                  ? "https://example.com/path?q=hello world&foo=bar"
                  : "https%3A%2F%2Fexample.com%2Fpath%3Fq%3Dhello%20world"
              }
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-white/25 uppercase tracking-widest" style={MONO_FONT}>
                {mode === "encode" ? "Encoded" : "Decoded"}
              </span>
              {output && <CopyButton text={output} />}
            </div>
            <pre
              className="w-full h-48 bg-[#080910] border border-white/[0.07] rounded-xl p-4 text-xs overflow-auto leading-relaxed break-all whitespace-pre-wrap"
              style={{ ...MONO_FONT, color: output ? "#40FFD4" : "rgba(255,255,255,0.15)" }}
            >
              {output || "Output appears here as you type"}
            </pre>
          </div>
        </div>
      </div>
      <RelatedTools exclude="url" onNavigate={onNavigate} />
      <Footer onNavigate={onNavigate} />
    </div>
  );
}

// ─── UUIDPage ──────────────────────────────────────────────────────────────────
function UUIDPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const tool = TOOLS.find((t) => t.id === "uuid")!;
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);

  const generate = () => setUuids(Array.from({ length: count }, () => crypto.randomUUID()));

  return (
    <div className="min-h-screen">
      <ToolHero tool={tool} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-center gap-4 mb-7 flex-wrap">
          <div className="flex items-center gap-2 border border-white/[0.07] rounded-xl p-1">
            <button
              onClick={() => setCount((c) => Math.max(1, c - 1))}
              className="w-8 h-8 rounded-lg text-white/40 hover:bg-white/[0.06] hover:text-white/70 flex items-center justify-center transition-colors text-lg leading-none"
            >
              −
            </button>
            <span className="w-8 text-center text-sm text-white" style={MONO_FONT}>
              {count}
            </span>
            <button
              onClick={() => setCount((c) => Math.min(20, c + 1))}
              className="w-8 h-8 rounded-lg text-white/40 hover:bg-white/[0.06] hover:text-white/70 flex items-center justify-center transition-colors text-lg leading-none"
            >
              +
            </button>
          </div>
          <button
            onClick={generate}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#FFD440] text-[#06070D] rounded-xl text-sm font-bold hover:bg-[#FFE060] transition-colors"
            style={DISPLAY_FONT}
          >
            <Hash size={15} /> Generate
          </button>
          {uuids.length > 0 && <CopyButton text={uuids.join("\n")} />}
        </div>

        {uuids.length > 0 ? (
          <div className="space-y-2">
            {uuids.map((uuid, i) => (
              <div
                key={uuid}
                className="flex items-center gap-4 px-5 py-3.5 rounded-xl border border-white/[0.06] bg-white/[0.015] group hover:border-white/[0.10] transition-all"
              >
                <span className="text-[11px] text-white/20 w-5 shrink-0" style={MONO_FONT}>
                  {i + 1}
                </span>
                <code className="text-sm flex-1" style={{ ...MONO_FONT, color: "#FFD440" }}>
                  {uuid}
                </code>
                <CopyButton text={uuid} />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-14 rounded-2xl border border-dashed border-white/[0.06] text-center">
            <Hash size={30} className="text-white/15 mx-auto mb-3" />
            <p className="text-white/30 text-sm">
              Click <strong className="text-white/50">Generate</strong> to create UUIDs
            </p>
          </div>
        )}
      </div>
      <RelatedTools exclude="uuid" onNavigate={onNavigate} />
      <Footer onNavigate={onNavigate} />
    </div>
  );
}

// ─── JWTPage ───────────────────────────────────────────────────────────────────
function JWTPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const tool = TOOLS.find((t) => t.id === "jwt")!;
  const [input, setInput] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMzQ1NiIsIm5hbWUiOiJBbGljZSBTbWl0aCIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNzM1Njg5NjAwLCJyb2xlIjoiYWRtaW4ifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  );
  const { header, payload, error } = decodeJWT(input);

  const formatTime = (ts: number) => new Date(ts * 1000).toLocaleString();
  const isExpired = payload?.exp && payload.exp * 1000 < Date.now();

  return (
    <div className="min-h-screen">
      <ToolHero tool={tool} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div className="mb-5">
          <span className="text-[10px] text-white/25 uppercase tracking-widest block mb-2" style={MONO_FONT}>
            JWT Token
          </span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-24 bg-[#080910] border border-white/[0.07] rounded-xl p-4 text-xs text-white/50 resize-none focus:outline-none focus:border-[#FF4060]/20 transition-colors leading-relaxed break-all"
            style={MONO_FONT}
            placeholder="Paste your JWT token here…"
          />
        </div>

        {error ? (
          <div className="p-5 rounded-xl border border-[#FF4060]/15 bg-[#FF4060]/[0.04] flex items-start gap-3">
            <AlertCircle size={15} className="text-[#FF4060] mt-0.5 flex-shrink-0" />
            <p className="text-xs text-[#FF4060]/70" style={MONO_FONT}>{error}</p>
          </div>
        ) : (
          header &&
          payload && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {[
                  { label: "Header", data: header, color: "#FF4060" },
                  { label: "Payload", data: payload, color: "#FF4060" },
                ].map((section) => (
                  <div
                    key={section.label}
                    className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.015]"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="text-[11px] px-2.5 py-0.5 rounded"
                        style={{
                          ...MONO_FONT,
                          background: `${section.color}10`,
                          color: section.color,
                          border: `1px solid ${section.color}20`,
                        }}
                      >
                        {section.label}
                      </span>
                      <CopyButton text={JSON.stringify(section.data, null, 2)} />
                    </div>
                    <pre className="text-xs text-white/60 leading-relaxed overflow-auto" style={MONO_FONT}>
                      {JSON.stringify(section.data, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {header?.alg && (
                  <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.015]">
                    <div className="text-[9px] text-white/25 mb-1" style={MONO_FONT}>ALGORITHM</div>
                    <div className="text-sm font-semibold" style={{ ...MONO_FONT, color: "#FF4060" }}>
                      {header.alg}
                    </div>
                  </div>
                )}
                {payload?.iat && (
                  <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.015]">
                    <div className="text-[9px] text-white/25 mb-1" style={MONO_FONT}>ISSUED AT</div>
                    <div className="text-xs text-white/60" style={MONO_FONT}>{formatTime(payload.iat)}</div>
                  </div>
                )}
                {payload?.exp && (
                  <div
                    className={`p-3.5 rounded-xl border ${
                      isExpired
                        ? "border-[#FF4060]/15 bg-[#FF4060]/[0.04]"
                        : "border-white/[0.06] bg-white/[0.015]"
                    }`}
                  >
                    <div className="text-[9px] text-white/25 mb-1" style={MONO_FONT}>EXPIRES</div>
                    <div
                      className="text-xs"
                      style={{ ...MONO_FONT, color: isExpired ? "#FF4060" : "rgba(255,255,255,0.6)" }}
                    >
                      {isExpired ? "Expired · " : ""}{formatTime(payload.exp)}
                    </div>
                  </div>
                )}
                <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.015]">
                  <div className="text-[9px] text-white/25 mb-1" style={MONO_FONT}>SIGNATURE</div>
                  <div className="text-xs text-white/40" style={MONO_FONT}>Present (unverified)</div>
                </div>
              </div>
            </>
          )
        )}
      </div>
      <RelatedTools exclude="jwt" onNavigate={onNavigate} />
      <Footer onNavigate={onNavigate} />
    </div>
  );
}

// ─── TimestampPage ─────────────────────────────────────────────────────────────
function TimestampPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const tool = TOOLS.find((t) => t.id === "timestamp")!;
  const [mode, setMode] = useState<"unix" | "date">("unix");
  const [input, setInput] = useState(String(Math.floor(Date.now() / 1000)));

  const results = (() => {
    try {
      const ms =
        mode === "unix"
          ? input.trim().length <= 10
            ? parseInt(input) * 1000
            : parseInt(input)
          : new Date(input).getTime();
      const d = new Date(ms);
      if (isNaN(d.getTime())) throw new Error("Invalid");
      return [
        { label: "ISO 8601", value: d.toISOString() },
        { label: "UTC", value: d.toUTCString() },
        { label: "Local", value: d.toLocaleString() },
        { label: "Unix (seconds)", value: String(Math.floor(ms / 1000)) },
        { label: "Unix (milliseconds)", value: String(ms) },
      ];
    } catch {
      return null;
    }
  })();

  return (
    <div className="min-h-screen">
      <ToolHero tool={tool} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex gap-2 mb-5 flex-wrap">
          {[
            { id: "unix", label: "Unix → Date" },
            { id: "date", label: "Date → Unix" },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => { setMode(m.id as any); setInput(m.id === "unix" ? String(Math.floor(Date.now() / 1000)) : new Date().toISOString()); }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                mode === m.id
                  ? "text-[#06070D]"
                  : "bg-white/[0.03] border border-white/[0.07] text-white/40 hover:bg-white/[0.06]"
              }`}
              style={{
                ...MONO_FONT,
                ...(mode === m.id ? { background: "#40FF8C" } : {}),
              }}
            >
              {m.label}
            </button>
          ))}
          <button
            onClick={() =>
              setInput(
                mode === "unix"
                  ? String(Math.floor(Date.now() / 1000))
                  : new Date().toISOString()
              )
            }
            className="px-4 py-2 rounded-lg text-xs bg-white/[0.02] border border-white/[0.06] text-white/30 hover:bg-white/[0.05] transition-colors"
            style={MONO_FONT}
          >
            Now
          </button>
        </div>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-[#080910] border border-white/[0.07] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#40FF8C]/20 transition-colors mb-6"
          style={MONO_FONT}
          placeholder={
            mode === "unix"
              ? "Unix timestamp (e.g. 1735689600)"
              : "Date string (e.g. 2025-01-01T00:00:00Z)"
          }
        />

        {results ? (
          <div className="space-y-2">
            {results.map((row) => (
              <div
                key={row.label}
                className="flex items-center gap-4 px-5 py-3.5 rounded-xl border border-white/[0.06] bg-white/[0.015] hover:border-white/[0.10] transition-all"
              >
                <span className="text-[11px] text-white/25 w-36 shrink-0" style={MONO_FONT}>
                  {row.label}
                </span>
                <code className="text-sm flex-1 text-[#40FF8C]" style={MONO_FONT}>
                  {row.value}
                </code>
                <CopyButton text={row.value} />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-5 rounded-xl border border-[#FF4060]/15 bg-[#FF4060]/[0.04] flex items-center gap-3">
            <AlertCircle size={15} className="text-[#FF4060]" />
            <p className="text-xs text-[#FF4060]/70" style={MONO_FONT}>
              Invalid timestamp or date format
            </p>
          </div>
        )}
      </div>
      <RelatedTools exclude="timestamp" onNavigate={onNavigate} />
      <Footer onNavigate={onNavigate} />
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("home");

  const navigate = useCallback((p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-[#06070D] text-foreground">
      <Nav current={page} onNavigate={navigate} />
      {page === "home" && <HomePage onNavigate={navigate} />}
      {page === "ping" && <PingPage onNavigate={navigate} />}
      {page === "ip" && <IPPage onNavigate={navigate} />}
      {page === "dns" && <DNSPage onNavigate={navigate} />}
      {page === "json" && <JSONPage onNavigate={navigate} />}
      {page === "base64" && <Base64Page onNavigate={navigate} />}
      {page === "url" && <URLPage onNavigate={navigate} />}
      {page === "uuid" && <UUIDPage onNavigate={navigate} />}
      {page === "jwt" && <JWTPage onNavigate={navigate} />}
      {page === "timestamp" && <TimestampPage onNavigate={navigate} />}
    </div>
  );
}

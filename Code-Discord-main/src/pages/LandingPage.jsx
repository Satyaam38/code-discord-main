import { useEffect, useState } from "react";

/**
 * DevCord — public landing page
 *
 * Requires Tailwind (already set up in this project) and two Google Fonts.
 * Add this to index.html <head>, above your existing styles:
 *
 *   <link rel="preconnect" href="https://fonts.googleapis.com">
 *   <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
 */

import { Link } from "react-router-dom";

const CODE_LINES = [
  { text: "function mergeSort(arr) {", indent: 0 },
  { text: "if (arr.length <= 1) return arr;", indent: 1 },
  { text: "const mid = Math.floor(arr.length / 2);", indent: 1 },
  { text: "const left = mergeSort(arr.slice(0, mid));", indent: 1 },
  { text: "const right = mergeSort(arr.slice(mid));", indent: 1 },
  { text: "return merge(left, right);", indent: 1 },
  { text: "}", indent: 0 },
];

function TypingEditor() {
  const [visibleChars, setVisibleChars] = useState(0);
  const fullLength = CODE_LINES.reduce((n, l) => n + l.text.length, 0);

  useEffect(() => {
    const id = setInterval(() => {
      setVisibleChars((c) => (c >= fullLength ? 0 : c + 1));
    }, 45);
    return () => clearInterval(id);
  }, [fullLength]);

  let consumed = 0;

  return (
    <div className="rounded-lg border border-white/10 bg-[#14151A] shadow-2xl shadow-black/40 overflow-hidden">
      <div className="flex items-center gap-2 border-b border-white/10 bg-[#1C1E26] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="ml-3 text-xs text-white/40 font-['Inter']">
          merge-sort.js — room #4471
        </span>
      </div>

      <div className="px-5 py-5 font-['JetBrains_Mono'] text-[13px] leading-6">
        {CODE_LINES.map((line, i) => {
          const start = consumed;
          const end = consumed + line.text.length;
          consumed = end;
          const shown = Math.max(0, Math.min(line.text.length, visibleChars - start));
          const isCursorLine = visibleChars >= start && visibleChars < end;

          return (
            <div key={i} className="flex">
              <span className="w-6 shrink-0 select-none text-white/25">{i + 1}</span>
              <span style={{ paddingLeft: `${line.indent * 1.25}rem` }} className="text-[#D6D8E0] whitespace-pre">
                {line.text.slice(0, shown)}
                {isCursorLine && (
                  <span className="ml-[1px] inline-block h-[15px] w-[2px] -mb-[2px] bg-[#E8A33D] animate-pulse" />
                )}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t border-white/10 bg-[#1C1E26] px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#E8A33D]" />
          <span className="text-xs text-white/50 font-['Inter']">You</span>
          <span className="mx-2 h-1 w-1 rounded-full bg-white/20" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#4FD1C5]" />
          <span className="text-xs text-white/50 font-['Inter']">Rohan — line 4</span>
        </div>
        <span className="rounded bg-white/5 px-2 py-0.5 text-[11px] text-white/40 font-['Inter']">JavaScript</span>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-[#E8A33D] font-['JetBrains_Mono'] text-sm font-bold text-[#14151A]">
          &gt;_
        </div>
        <span className="font-['Space_Grotesk'] text-lg font-semibold text-white">DevCord</span>
      </div>
      <div className="hidden items-center gap-8 md:flex">
        <a href="#how-it-works" className="text-sm text-white/60 transition hover:text-white font-['Inter']">How it works</a>
        <a href="#features" className="text-sm text-white/60 transition hover:text-white font-['Inter']">Features</a>
      </div>
      <Link
        to="/login"
        className="rounded-md bg-white px-4 py-2 text-sm font-medium text-[#14151A] transition hover:bg-white/90 font-['Inter']"
      >
        Sign in
      </Link>
    </nav>
  );
}

function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 pt-12 pb-24 md:grid-cols-2 md:pt-20">
      <div>
        <h1 className="font-['Space_Grotesk'] text-4xl font-semibold leading-[1.1] text-white md:text-5xl">
          Open a room. Start typing.
          <br />
          Watch it fill in live.
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-white/60 font-['Inter']">
          DevCord is a shared code editor for pairing, teaching, and interviewing.
          Everyone in the room sees the same file update character by character —
          no refreshing, no merge conflicts, no "did you save?"
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            to="/login"
            className="rounded-md bg-[#E8A33D] px-5 py-3 text-sm font-medium text-[#14151A] transition hover:bg-[#f0b25c] font-['Inter']"
          >
            Create a room
          </Link>
          <a
            href="#how-it-works"
            className="text-sm font-medium text-white/70 transition hover:text-white font-['Inter']"
          >
            See how it works
          </a>
        </div>
        <p className="mt-6 text-xs text-white/35 font-['Inter']">
          No install. Runs Python, C++, and Java in the browser tab.
        </p>
      </div>

      <TypingEditor />
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "1",
      title: "Write",
      body: "Create a room and get a 6-digit PIN. Share it with your partner or your whole study group — anyone with the PIN can join, no account required to view.",
    },
    {
      n: "2",
      title: "Run",
      body: "Hit Run and your code executes in an isolated sandbox, not your browser. Output — or the error — comes back in seconds, same for everyone in the room.",
    },
    {
      n: "3",
      title: "Talk it through",
      body: "The chat panel sits right next to the editor, so you're never switching tabs to explain what you just changed.",
    },
  ];

  return (
    <section id="how-it-works" className="border-t border-white/10 bg-[#0F1014] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-['Space_Grotesk'] text-2xl font-semibold text-white md:text-3xl">
          What happens when you hit Run
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="border-l-2 border-[#E8A33D]/40 pl-5">
              <span className="font-['JetBrains_Mono'] text-sm text-[#E8A33D]">{s.n}</span>
              <h3 className="mt-2 font-['Space_Grotesk'] text-lg font-medium text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55 font-['Inter']">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2 rounded-xl border border-white/10 bg-gradient-to-br from-[#1C1E26] to-[#14151A] p-8">
            <h3 className="font-['Space_Grotesk'] text-xl font-medium text-white">
              Type together, in real time
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/55 font-['Inter']">
              Built on the same conflict-free syncing tech used by collaborative
              writing tools. Two people can edit the same line at the same
              moment and nothing gets overwritten.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#1C1E26] p-8">
            <h3 className="font-['Space_Grotesk'] text-xl font-medium text-white">
              Private rooms
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/55 font-['Inter']">
              Every room is PIN-protected. Nobody wanders in by accident.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#1C1E26] p-8">
            <h3 className="font-['Space_Grotesk'] text-xl font-medium text-white">
              Your own language
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/55 font-['Inter']">
              Switch languages without affecting anyone else's editor view.
            </p>
          </div>
          <div className="md:col-span-2 rounded-xl border border-white/10 bg-[#1C1E26] p-8">
            <h3 className="font-['Space_Grotesk'] text-xl font-medium text-white">
              Chat that doesn't leave the page
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/55 font-['Inter']">
              Talk through what you're building without alt-tabbing to another app.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-xs text-white/35 md:flex-row font-['Inter']">
        <span>DevCord</span>
        <span>Built for pairing, teaching, and late-night debugging sessions.</span>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#14151A] antialiased">
      <Nav />
      <Hero />
      <HowItWorks />
      <Features />
      <Footer />
    </div>
  );
}
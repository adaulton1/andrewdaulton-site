import React, { useMemo, useState, useEffect, useRef } from "react";

// ---
// Video data with Vimeo thumbnail fetching support
// ---
const VIDEOS = [
  { title: "Google Pixel 10", url: "https://vimeo.com/1133224130" },
  { title: "Samsung Galaxy Tab S10", url: "https://www.youtube.com/watch?v=I8YpJ8_ThgY&t=1s" },
  { title: "Grey Goose", url: "https://www.youtube.com/watch?v=IHj-MS9Pz_s" },
  { title: "Bud Light Next", url: "https://vimeo.com/670009552" },
  { title: "Grimace Meal", url: "https://vimeo.com/923860935" },
  { title: "BTS Meal", url: "https://vimeo.com/630237716" },
  { title: "Mariah Carey Meal", url: "https://vimeo.com/672187519" },
  { title: "WcDonald’s 1", url: "https://vimeo.com/954484682/7df978b82c" },
  { title: "WcDonald’s 2", url: "https://vimeo.com/954487241" },
  { title: "WcDonald’s 3", url: "https://vimeo.com/954488823/ad83bbb57d" },
  { title: "WcDonald’s 4", url: "https://vimeo.com/954491226/d6211e2f36" },
  { title: "J Balvin Meal", url: "https://vimeo.com/509071608" },
  { title: "Acura", url: "https://vimeo.com/163461338" },
  { title: "LinkedIn", url: "https://vimeo.com/andrewdaulton/360327049" },
  { title: "Taco Bell Time Split", url: "https://vimeo.com/310453542" }
];

const DIRECTOR_VIDEOS = [
  { title: "Magic Leap", url: "https://vimeo.com/307336046" },
  { title: "BuzzFeed", url: "https://vimeo.com/206471757" },
  { title: "29", url: "https://vimeo.com/1134770621" }
];

const PlayIcon: React.FC = () => (
  <svg aria-hidden className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 5v14l11-7-11-7z" />
  </svg>
);

function computeEmbedSrc(item: { title: string; url?: string }) {
  const url = item?.url || "";
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/i);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0`;
  const vm = url.match(/vimeo\.com\/(?:.*?\/)?(\d{6,})/i);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1`;
  return url;
}

async function fetchVimeoThumbnail(vimeoUrl: string): Promise<string | null> {
  try {
    const match = vimeoUrl.match(/vimeo\.com\/(?:.*?\/)?(\d{6,})/);
    if (!match) return null;
    const id = match[1];
    const res = await fetch(`https://vimeo.com/api/v2/video/${id}.json`);
    if (!res.ok) return null;
    const data = await res.json();
    return data?.[0]?.thumbnail_large || null;
  } catch (e) {
    return null;
  }
}

export default function VideoShowcase() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<null | { title: string; url?: string }>(null);
  const [thumbs, setThumbs] = useState<{ [key: string]: string }>({});
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Preload Vimeo thumbnails
  useEffect(() => {
    (async () => {
      const all = [...VIDEOS, ...DIRECTOR_VIDEOS];
      const results: { [key: string]: string } = {};
      await Promise.all(
        all.map(async (v) => {
          try {
            if (v.url?.includes("vimeo")) {
              const thumb = await fetchVimeoThumbnail(v.url);
              if (thumb) results[v.title] = thumb;
            }
          } catch {
            // ignore individual failures
          }
        })
      );
      setThumbs(results);
    })();
  }, []);

  // Close modal on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActive(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return VIDEOS;
    return VIDEOS.filter((v) => v.title.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-zinc-200">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold leading-tight tracking-tight">
              Andrew Daulton <span className="font-normal text-zinc-500">— Senior Producer</span>
            </h1>
            <a href="mailto:andrew.daulton@gmail.com" className="text-sm md:text-base text-zinc-600 hover:text-zinc-900 underline underline-offset-4">
              andrew.daulton@gmail.com
            </a>
          </div>
          <div className="w-full md:w-80">
            <label className="block text-xs uppercase tracking-wide text-zinc-500 mb-2">Search</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by title…"
              className="w-full rounded-2xl border border-zinc-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-16">
        {/* Featured Work */}
        <section>
          <h2 className="text-xl font-semibold mb-6">Featured Work</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((v) => (
              <article key={v.title} className="group relative rounded-2xl overflow-hidden shadow-sm ring-1 ring-zinc-200 hover:shadow-md transition-shadow">
                <button onClick={() => setActive(v)} className="block w-full text-left">
                  <div className="aspect-video bg-zinc-200">
                    {thumbs[v.title] ? <img src={thumbs[v.title]} alt={v.title} className="object-cover w-full h-full" /> : null}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium shadow">
                      <PlayIcon /> Play
                    </span>
                  </div>
                </button>
                <div className="p-4">
                  <h3 className="text-sm font-medium line-clamp-2">{v.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Director Section */}
        <section>
          <h2 className="text-xl font-semibold mb-6">I also direct!</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DIRECTOR_VIDEOS.map((v) => (
              <article key={v.title} className="group relative rounded-2xl overflow-hidden shadow-sm ring-1 ring-zinc-200 hover:shadow-md transition-shadow">
                <button onClick={() => setActive(v)} className="block w-full text-left">
                  <div className="aspect-video bg-zinc-200">
                    {thumbs[v.title] ? <img src={thumbs[v.title]} alt={v.title} className="object-cover w-full h-full" /> : null}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium shadow">
                      <PlayIcon /> Play
                    </span>
                  </div>
                </button>
                <div className="p-4">
                  <h3 className="text-sm font-medium line-clamp-2">{v.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            ref={modalRef}
            className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActive(null)}
              className="absolute top-3 right-3 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-medium hover:bg-white focus:outline-none focus:ring-2 focus:ring-white"
            >
              Close
            </button>
            <div className="aspect-video w-full">
              <iframe
                className="w-full h-full"
                src={computeEmbedSrc(active)}
                title={active.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      <footer className="max-w-6xl mx-auto px-4 pb-12 text-xs text-zinc-500">
        <div className="mt-12 border-t border-zinc-200 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span>© ${new Date().getFullYear()} Andrew Daulton</span>
          <a href="mailto:andrew.daulton@gmail.com" className="underline underline-offset-4">
            Email me
          </a>
        </div>
      </footer>
    </div>
  );
}
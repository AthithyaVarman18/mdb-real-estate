import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type RefObject, type MouseEvent } from "react";
import { Building3D } from "@/components/Building3D";
import heroImg from "@/assets/hero-villa.jpg";
import towerImg from "@/assets/project-tower.jpg";
import residenceImg from "@/assets/project-residence.jpg";
import hotelImg from "@/assets/project-hotel.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Modern Dream Builders — Building Visions. Creating Landmarks." },
      {
        name: "description",
        content:
          "Premium residential and commercial construction, structural engineering and architectural planning by Modern Dream Builders.",
      },
      { property: "og:title", content: "Modern Dream Builders" },
      { property: "og:description", content: "Building Visions. Creating Landmarks." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const NAV = ["Home", "About", "Services", "Projects", "Process", "Contact"];

const STAGES = [
  { n: "01", t: "Vision", d: "Every landmark begins as a conversation — site, ambition, light and the way you want to live or work." },
  { n: "02", t: "Design", d: "Architectural plans and spatial studies translate intent into precise, buildable drawings." },
  { n: "03", t: "Engineering", d: "Structural analysis, load paths and services coordination engineered for permanence." },
  { n: "04", t: "Construction", d: "Concrete, stone, glass and bronze assembled by our own site teams to exacting tolerances." },
  { n: "05", t: "Completion", d: "Landscaping, lighting and a meticulous handover — a building ready for generations." },
];

const PROJECTS = [
  { img: residenceImg, name: "The Olive Residence", type: "Residential", loc: "Lonavala, Maharashtra", year: "2025", d: "A terraced hillside home of white concrete, timber and dry-stone walls set among century-old olive trees.", w: 1504, h: 1008 },
  { img: towerImg, name: "Meridian Tower", type: "Commercial", loc: "Bengaluru, Karnataka", year: "2024", d: "Eighteen storeys of Grade-A offices wrapped in a bronze-fin curtain wall for solar control.", w: 1200, h: 1504 },
  { img: hotelImg, name: "Courtyard House Hotel", type: "Commercial", loc: "Jaipur, Rajasthan", year: "2023", d: "A boutique hotel of hand-dressed stone and brass louvres arranged around a planted courtyard.", w: 1504, h: 1008 },
];

const SERVICES = [
  { t: "Residential Construction", d: "Private villas and residences built turnkey, from foundation to finish." },
  { t: "Commercial Construction", d: "Offices, hospitality and retail delivered on programme and on budget." },
  { t: "Structural Engineering", d: "In-house analysis and design for RCC, steel and composite structures." },
  { t: "Architectural Planning", d: "Master planning, approvals and detailed design development." },
  { t: "Interior & Exterior Design", d: "Material palettes, façades and interiors resolved as one language." },
  { t: "Project Management", d: "A single accountable team for cost, quality, safety and schedule." },
];

function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  const p = useRef(0);
  useEffect(() => {
    const on = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      p.current = Math.max(0, Math.min(1, -r.top / total));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [ref]);
  return p;
}

function Index() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <main className="bg-background text-foreground">
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled ? "glass-light text-foreground" : "text-ink-foreground"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <a href="#home" className="font-serif text-xl tracking-wide">
            Modern Dream <span className="text-accent">Builders</span>
          </a>
          <ul className="hidden gap-9 md:flex">
            {NAV.map((n) => (
              <li key={n}>
                <a href={`#${n.toLowerCase()}`} className="eyebrow opacity-80 transition-opacity hover:opacity-100">
                  {n}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <Hero />
      <About />
      <Story />
      <Projects />
      <Services />
      <Contact />
    </main>
  );
}

function Hero() {
  return (
    <section id="home" className="relative h-screen min-h-[640px] overflow-hidden bg-ink text-ink-foreground">
      <img
        src={heroImg}
        alt="Modern travertine villa with infinity pool at sunset"
        width={1920}
        height={1088}
        className="hero-zoom absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/30 to-transparent" />

      {/* Blueprint overlay that draws, then fades as the photo resolves */}
      <svg className="blueprint-fade pointer-events-none absolute inset-0 h-full w-full text-accent" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor" strokeWidth="1">
        {[
          "M800 120 H1600", "M760 300 H1580", "M760 460 H1600", "M780 120 V460", "M1330 40 V900",
          "M760 460 L760 760 H1360", "M260 760 H1600", "M300 770 L620 900", "M1000 300 V760", "M1180 300 V760",
        ].map((d, i) => (
          <path key={d} d={d} pathLength={1} className="draw-line" style={{ animationDelay: `${i * 0.12}s` }} />
        ))}
      </svg>

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-24 md:px-10 md:pb-28">
        <p className="eyebrow rise text-accent" style={{ animationDelay: "2.6s" }}>Architecture · Engineering · Construction</p>
        <h1 className="rise mt-6 font-serif text-5xl font-normal leading-[1.02] tracking-[0.04em] md:text-6xl xl:text-7xl" style={{ animationDelay: "2.9s" }}>
          MODERN DREAM
          <br />
          BUILDERS
        </h1>
        <p className="rise mt-6 font-serif text-2xl italic opacity-90 md:text-3xl" style={{ animationDelay: "3.3s" }}>
          Building Visions. Creating Landmarks.
        </p>
        <div className="rise mt-10 flex flex-wrap gap-4" style={{ animationDelay: "3.7s" }}>
          <a href="#projects" className="eyebrow border border-ink-foreground bg-ink-foreground px-8 py-4 text-ink transition-colors hover:bg-transparent hover:text-ink-foreground">
            View Our Projects
          </a>
          <a href="#contact" className="eyebrow glass px-8 py-4 transition-colors hover:border-accent hover:text-accent">
            Start Your Project
          </a>
        </div>
      </div>

      <div className="rise glass absolute bottom-24 right-10 z-10 hidden h-72 w-96 xl:block" style={{ animationDelay: "1.2s" }}>
        <Building3D className="h-full w-full" autoDuration={8} />
        <p className="eyebrow absolute bottom-4 left-5 opacity-80">Blueprint → Built · Live model</p>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="mx-auto grid max-w-7xl gap-12 px-6 py-32 md:grid-cols-12 md:px-10">
      <p className="eyebrow text-accent md:col-span-3">About the practice</p>
      <div className="md:col-span-9">
        <h2 className="font-serif text-4xl leading-tight md:text-6xl">
          Two decades of engineering precision, expressed through quietly luxurious architecture.
        </h2>
        <dl className="mt-16 grid grid-cols-2 gap-8 border-t border-border pt-10 md:grid-cols-4">
          {[["20+", "Years of practice"], ["140", "Projects delivered"], ["2.1M", "Sq. ft. constructed"], ["0", "Lost-time incidents, 2025"]].map(([v, l]) => (
            <div key={l}>
              <dt className="font-serif text-5xl">{v}</dt>
              <dd className="eyebrow mt-3 text-muted-foreground">{l}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Story() {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);
  const [active, setActive] = useState(0);
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      setActive(Math.min(4, Math.floor(progress.current * 5)));
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [progress]);

  return (
    <section id="process" ref={ref} className="relative h-[500vh] border-y border-border bg-secondary">
      <div className="sticky top-0 grid h-screen grid-cols-1 overflow-hidden md:grid-cols-12">
        <div className="relative z-10 flex flex-col justify-center px-6 md:col-span-5 md:px-10 lg:pl-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]">
          <p className="eyebrow text-accent">The process</p>
          <ol className="mt-10 space-y-6">
            {STAGES.map((s, i) => (
              <li key={s.t} className={`border-l pl-6 transition-all duration-700 ${i === active ? "border-accent opacity-100" : "border-border opacity-35"}`}>
                <div className="flex items-baseline gap-4">
                  <span className="eyebrow text-muted-foreground">{s.n}</span>
                  <h3 className="font-serif text-3xl md:text-4xl">{s.t}</h3>
                </div>
                <p className={`max-w-sm overflow-hidden text-sm leading-relaxed text-muted-foreground transition-all duration-700 ${i === active ? "mt-3 max-h-32" : "max-h-0"}`}>
                  {s.d}
                </p>
              </li>
            ))}
          </ol>
        </div>
        <div className="absolute inset-0 md:relative md:col-span-7">
          <Building3D className="h-full w-full opacity-40 md:opacity-100" getProgress={() => 0.05 + progress.current * 0.95} />
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-7xl px-6 py-32 md:px-10">
      <div className="flex items-end justify-between border-b border-border pb-8">
        <h2 className="font-serif text-5xl md:text-6xl">Selected projects</h2>
        <p className="eyebrow hidden text-muted-foreground md:block">2023 — 2025</p>
      </div>
      <div className="mt-16 grid gap-x-10 gap-y-20 md:grid-cols-2">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.name} p={p} wide={i === 0} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ p, wide }: { p: (typeof PROJECTS)[number]; wide: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1200px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
  };
  const reset = () => ref.current && (ref.current.style.transform = "");
  return (
    <article className={`group ${wide ? "md:col-span-2" : ""}`}>
      <div ref={ref} onMouseMove={onMove} onMouseLeave={reset} className="overflow-hidden shadow-soft transition-transform duration-500 ease-out">
        <img
          src={p.img}
          alt={p.name}
          width={p.w}
          height={p.h}
          loading="lazy"
          className={`w-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-[1.04] ${wide ? "aspect-[21/9]" : "aspect-[4/5]"}`}
        />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-12">
        <div className="md:col-span-5">
          <h3 className="font-serif text-3xl">{p.name}</h3>
          <p className="eyebrow mt-3 text-accent">{p.type}</p>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground md:col-span-5">{p.d}</p>
        <div className="eyebrow text-muted-foreground md:col-span-2 md:text-right">
          <p>{p.loc}</p>
          <p className="mt-2">{p.year}</p>
        </div>
      </div>
    </article>
  );
}

function Services() {
  return (
    <section id="services" className="bg-ink py-32 text-ink-foreground">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <p className="eyebrow text-accent">Services</p>
        <h2 className="mt-6 max-w-3xl font-serif text-5xl leading-tight md:text-6xl">One team, from first sketch to final key.</h2>
        <div className="mt-20 grid border-l border-t border-ink-foreground/15 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <div key={s.t} className="group relative border-b border-r border-ink-foreground/15 p-10 transition-colors duration-500 hover:bg-ink-foreground/5">
              <span className="eyebrow text-accent">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-14 font-serif text-3xl">{s.t}</h3>
              <p className="mt-4 text-sm leading-relaxed opacity-60">{s.d}</p>
              <span className="absolute bottom-0 left-0 h-px w-0 bg-accent transition-all duration-700 group-hover:w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-7xl px-6 py-32 md:px-10">
      <div className="grid gap-16 md:grid-cols-2">
        <div>
          <p className="eyebrow text-accent">Start your project</p>
          <h2 className="mt-6 font-serif text-5xl leading-tight md:text-6xl">Let's build something that lasts.</h2>
          <div className="mt-12 space-y-2 text-muted-foreground">
            <p>studio@moderndreambuilders.com</p>
            <p>+91 98000 00000</p>
          </div>
        </div>
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          {["Full name", "Email", "Project location"].map((l) => (
            <label key={l} className="block">
              <span className="eyebrow text-muted-foreground">{l}</span>
              <input className="mt-2 w-full border-b border-border bg-transparent py-3 outline-none transition-colors focus:border-accent" />
            </label>
          ))}
          <label className="block">
            <span className="eyebrow text-muted-foreground">Tell us about your vision</span>
            <textarea rows={3} className="mt-2 w-full resize-none border-b border-border bg-transparent py-3 outline-none transition-colors focus:border-accent" />
          </label>
          <button className="eyebrow bg-primary px-10 py-4 text-primary-foreground transition-colors hover:bg-accent">Send enquiry</button>
        </form>
      </div>
      <footer className="mt-32 flex flex-col justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row">
        <p className="font-serif text-base text-foreground">Modern Dream Builders</p>
        <p>© 2026 Modern Dream Builders. All rights reserved.</p>
      </footer>
    </section>
  );
}

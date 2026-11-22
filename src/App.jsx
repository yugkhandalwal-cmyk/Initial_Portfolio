import { lazy, Suspense, useEffect, useState } from "react";
import {
  profile,
  links,
  stats,
  skills,
  projects,
  education,
  achievements,
  certificates,
  CV_FILE,
  PHOTO,
} from "./data.js";

const Scene = lazy(() => import("./Scene.jsx"));
const SkillsGlobe = lazy(() => import("./SkillsGlobe.jsx"));
const loadingImages = [...new Set([
  PHOTO,
  ...projects.map((project) => project.image).filter(Boolean),
  ...certificates.map((certificate) => certificate.image),
])];

const hasWebGL = () => {
  try {
    return !!document.createElement("canvas").getContext("webgl");
  } catch {
    return false;
  }
};

function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let disposed = false;
    let assetsLoaded = false;
    let completionTimer;
    const startedAt = performance.now();
    const images = loadingImages.map((source) => new Promise((resolve) => {
      const image = new Image();
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        resolve();
      };
      image.onload = finish;
      image.onerror = finish;
      image.src = source;
      if (image.complete) finish();
    }));

    Promise.all(images).then(() => {
      assetsLoaded = true;
    });

    const progressTimer = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      setProgress(Math.min(94, Math.round((elapsed / 1250) * 94)));
      if (assetsLoaded && elapsed >= 1250) {
        window.clearInterval(progressTimer);
        setProgress(100);
        completionTimer = window.setTimeout(() => {
          if (!disposed) onComplete();
        }, 350);
      }
    }, 32);

    return () => {
      disposed = true;
      window.clearInterval(progressTimer);
      window.clearTimeout(completionTimer);
    };
  }, [onComplete]);

  return (
    <div className="page-loader" role="status" aria-live="polite" aria-label={`Loading portfolio, ${progress}%`}>
      <div className="loader-content">
        <div className="loader-brand">YK<span>.</span></div>
        <p className="loader-title">Building your experience</p>
        <p className="loader-copy">Loading projects, credentials, and interactive details</p>
        <div className="loader-meter">
          <div className="loader-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
            <span className="loader-progress" style={{ width: `${progress}%` }} />
          </div>
          <div className="loader-meta"><span>PORTFOLIO LOADING</span><span className="loader-percentage">{progress}%</span></div>
        </div>
        <span className="loader-footnote"><span className="loader-pulse" /> JUST A MOMENT</span>
      </div>
    </div>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [sending, setSending] = useState(false);
  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  async function submit(event) {
    event.preventDefault();
    setSending(true);
    setStatus({ type: "info", text: "Sending your message..." });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Your message could not be sent.");
      setStatus({
        type: result.warning ? "warning" : "ok",
        text: result.warning || "Thanks for reaching out! Your message has been sent, and a confirmation email is on its way.",
      });
      setForm({ name: "", email: "", message: "", website: "" });
    } catch (error) {
      setStatus({
        type: "err",
        text: error.message || "Could not reach the contact service. Please email me directly.",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={submit} className="form">
      <label>
        Your name
        <input autoComplete="name" placeholder="Jane Smith" value={form.name} onChange={set("name")} required minLength="2" />
      </label>
      <label>
        Email address
        <input type="email" autoComplete="email" placeholder="jane@example.com" value={form.email} onChange={set("email")} required />
      </label>
      <label>
        Message
        <textarea rows="5" placeholder="Tell me a little about what you have in mind..." value={form.message} onChange={set("message")} required minLength="10" maxLength="3000" />
      </label>
      <input className="hp" tabIndex="-1" autoComplete="off" aria-hidden="true" name="website" value={form.website} onChange={set("website")} />
      <button className="button button-primary submit-button" type="submit" disabled={sending}>
        {sending ? "Sending..." : "Send message"}
        <span aria-hidden="true">↗</span>
      </button>
      {status.text && <p className={`status ${status.type}`} role="status" aria-live="polite">{status.text}</p>}
    </form>
  );
}

function Tags({ items }) {
  return <div className="tags">{items.map((item) => <span className="chip" key={item}>{item}</span>)}</div>;
}

export default function App() {
  const [webgl] = useState(hasWebGL);
  const [loading, setLoading] = useState(true);
  const light = typeof window !== "undefined" && window.innerWidth < 700;

  useEffect(() => {
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("reveal-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
    );
    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("reveal-ready");
    };
  }, []);

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <div className="bg" aria-hidden="true">
        {webgl && <Suspense fallback={null}><Scene light={light} /></Suspense>}
      </div>

      <nav className="nav" aria-label="Main navigation">
        <a className="wordmark" href="#home" aria-label="Yug Khandelwal, home">YK<span>.</span></a>
        <div className="nav-links">
          {["about", "skills", "projects", "certificates", "contact"].map((section) => (
            <a key={section} href={`#${section}`}>{section}</a>
          ))}
          <a className="button button-small" href={CV_FILE} download>Download CV <span aria-hidden="true">↓</span></a>
        </div>
      </nav>

      <header className="hero" id="home">
        <div className="hero-copy" data-reveal>
          <p className="eyebrow"><span className="availability-dot" /> Open to opportunities</p>
          <p className="hello">Hi, I&apos;m</p>
          <h1>{profile.name}<span>.</span></h1>
          <p className="tag">{profile.tagline}</p>
          <p className="hero-intro">I turn thoughtful ideas into useful, dependable software—from the first sketch to the final detail.</p>
          <p className="location"><span aria-hidden="true">⌖</span> {profile.location}</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#projects">Explore my work <span aria-hidden="true">↗</span></a>
            <a className="button button-outline" href={CV_FILE} download>Download CV <span aria-hidden="true">↓</span></a>
          </div>
          <div className="social-links">
            {links.slice(0, 3).map((link) => (
              <a key={link.label} href={link.url} target="_blank" rel="noreferrer">{link.label}<span aria-hidden="true"> ↗</span></a>
            ))}
          </div>
        </div>
        <div className="hero-visual" data-reveal style={{ "--reveal-delay": "100ms" }}>
          <div className="portrait-frame">
            <div className="portrait-orbit orbit-one" />
            <div className="portrait-orbit orbit-two" />
            <img src={PHOTO} alt={`${profile.name} portrait`} />
            <div className="portrait-caption"><span>Based in</span><strong>Punjab, India</strong></div>
          </div>
          <span className="visual-note">Curious by nature. Builder by choice.</span>
        </div>
      </header>

      <main>
        <div className="stats-strip" aria-label="Highlights">
          {stats.map((stat, index) => (
            <div className="stat" data-reveal key={stat.label} style={{ "--reveal-delay": `${index * 70}ms` }}><strong>{stat.value}</strong><span>{stat.label}</span></div>
          ))}
          <p>Learning, building, and getting better every day.</p>
        </div>

        <section id="about">
          <div className="section-heading">
            <p className="eyebrow">A little about me</p>
            <h2>Building with purpose.<br /><span>Growing with every project.</span></h2>
          </div>
          <div className="about-grid">
            <article className="card about-copy" data-reveal>
              <p>{profile.about}</p>
              <div className="education">
                <span className="education-mark" aria-hidden="true">✳</span>
                <div><span className="card-kicker">Currently studying</span><strong>{education.degree}</strong><span className="muted">{education.school} · {education.detail}</span></div>
              </div>
            </article>
            <article className="card id-card" data-reveal style={{ "--reveal-delay": "70ms" }}>
              <svg className="id-card-threads" viewBox="0 0 100 46" preserveAspectRatio="none" aria-hidden="true">
                <path d="M50 1 L13 45" />
                <path d="M50 1 L87 45" />
              </svg>
              <span className="id-card-pin" aria-hidden="true" />
              <div className="id-card-photo">
                <img src={PHOTO} alt={`${profile.name} portrait`} loading="lazy" />
              </div>
              <div className="id-card-details">
                <p className="card-kicker">Developer ID</p>
                <h3>{profile.name}</h3>
                <span>Computer Science &amp; Engineering</span>
                <span className="muted">{profile.location}</span>
              </div>
              <span className="id-card-footer">PORTFOLIO · 2026</span>
            </article>
            <article className="card achievements-card" data-reveal style={{ "--reveal-delay": "100ms" }}>
              <p className="card-kicker">A few things I&apos;m proud of</p>
              <ul>{achievements.map((achievement) => <li key={achievement}>{achievement}</li>)}</ul>
              <div className="all-links">
                {links.slice(3).map((link) => (
                  <a key={link.label} href={link.url} target="_blank" rel="noreferrer">{link.label}<span aria-hidden="true"> ↗</span></a>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section id="skills">
          <div className="section-heading">
            <p className="eyebrow">Tools of the trade</p>
            <h2>Skills &amp; technologies</h2>
          </div>
          <div className="grid skills-grid">
            {Object.entries(skills).map(([group, items], index) => (
              <article className="card skill-card" data-reveal key={group} style={{ "--reveal-delay": `${index * 70}ms` }}>
                <span className="skill-number">0{index + 1}</span>
                <h3>{group}</h3>
                <Tags items={items} />
              </article>
            ))}
          </div>
          <div className="skills-globe" data-reveal>
            <div className="skills-globe-heading">
              <p className="card-kicker">In constant motion</p>
              <h3>My toolkit, in orbit</h3>
            </div>
              <Suspense fallback={<div className="globe-loading">Preparing the skills globe...</div>}>
                <SkillsGlobe enabled={webgl} />
              </Suspense>
          </div>
        </section>

        <section id="projects">
          <div className="section-heading section-heading-row">
            <div><p className="eyebrow">Selected work</p><h2>Projects I&apos;ve built</h2></div>
            <span className="section-aside">Ideas made real, one commit at a time.</span>
          </div>
          <div className="grid project-grid">
            {projects.map((project, index) => (
              <article className="card media project-card" data-reveal key={project.title} style={{ "--reveal-delay": `${index * 90}ms` }}>
                <div className={`thumb${project.image ? "" : " thumb-placeholder"}`}>
                  {project.image
                    ? <img src={project.image} alt={`${project.title} project preview`} loading="lazy" />
                    : <><span className="placeholder-index">0{index + 1}</span><span className="placeholder-title">{project.title}</span><span className="placeholder-caption">Project preview</span></>}
                </div>
                <div className="project-content">
                  <p className="card-kicker">Project 0{index + 1}</p>
                  <h3>{project.title}</h3>
                  <p className="muted project-description">{project.description}</p>
                  <Tags items={project.stack} />
                  <div className="project-links">
                    {project.repo && <a href={project.repo} target="_blank" rel="noreferrer">View code <span aria-hidden="true">↗</span></a>}
                    {project.live && <a href={project.live} target="_blank" rel="noreferrer">View live <span aria-hidden="true">↗</span></a>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="certificates">
          <div className="section-heading section-heading-row">
            <div><p className="eyebrow">Always learning</p><h2>Certificates</h2></div>
            <span className="section-aside">A few milestones along the way.</span>
          </div>
          <div className="grid certificate-grid">
            {certificates.map((certificate, index) => (
              <a className="card media certificate-card" data-reveal key={certificate.title} href={certificate.url} target="_blank" rel="noreferrer" style={{ "--reveal-delay": `${index * 70}ms` }}>
                <div className="thumb certificate-thumb">
                  <img src={certificate.image} alt={`${certificate.title} certificate`} loading="lazy" />
                </div>
                <div className="certificate-info">
                  <span className="certificate-number">0{index + 1}</span>
                  <h3>{certificate.title}</h3>
                  <span className="certificate-open">View credential <span aria-hidden="true">↗</span></span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section id="contact" className="contact-section">
          <div className="contact-copy" data-reveal>
            <p className="eyebrow">Have something in mind?</p>
            <h2>Let&apos;s make<br /><span>it happen.</span></h2>
            <p className="muted">Have a project, opportunity, or just want to say hello? My inbox is open.</p>
            <a className="email-link" href={`mailto:${profile.email}`}>{profile.email}<span aria-hidden="true"> ↗</span></a>
          </div>
          <div className="card contact-card" data-reveal style={{ "--reveal-delay": "100ms" }}>
            <Contact />
          </div>
        </section>
      </main>
      <footer>
        <a className="wordmark" href="#home">YK<span>.</span></a>
        <p>Designed &amp; built by {profile.name} <span aria-hidden="true">✳</span> © {new Date().getFullYear()}</p>
        <a href="#home">Back to top ↑</a>
      </footer>
    </>
  );
}

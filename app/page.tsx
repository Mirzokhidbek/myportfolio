"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [projectFilter, setProjectFilter] = useState<"all" | "frontend" | "backend" | "fullstack">("all");
  const [lang, setLang] = useState<"en" | "uz">("en");
  const skills = [
    "Java",
    "Algorithms",
    "Django",
    "HTML5",
    "CSS3",
    "JavaScript",
    "Node.js",
    "ReactJS",
    "MongoDB",
    "REST API",
    "Backend/Server",
    "Tailwind CSS",
    "Express.js",
    "AWS",
    "Material-UI",
    "Figma",
  ];

  const interests = [
    "Building and Creating",
    "Learning new technologies",
    "Problem Solving",
    "Collaboration Mentorship",
    "Experimentation & Side Projects",
    "Project Optimization",
    "Watching films",
    "Travelling",
    "Gym",
    "Talking with people",
  ];

  const projects = [
    {
      title: "Construction Analytics Dashboard",
      description: "Role-based dashboard with responsive UI and realtime operational insights.",
      tech: ["React", "TypeScript", "Tailwind", "Node.js", "MongoDB"],
      category: "fullstack",
      github: "https://github.com/Mirzokhidbek",
      demo: "#",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80&auto=format&fit=crop",
    },
    {
      title: "Web3 Asset Insight UI",
      description: "High-performance frontend for digital asset analytics and chart-heavy workflows.",
      tech: ["React", "TypeScript", "Material-UI"],
      category: "frontend",
      github: "https://github.com/Mirzokhidbek",
      demo: "#",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80&auto=format&fit=crop",
    },
    {
      title: "Auth + API Service",
      description: "Backend service with JWT, OAuth, and scalable REST API architecture.",
      tech: ["Node.js", "Express", "MongoDB", "JWT"],
      category: "backend",
      github: "https://github.com/Mirzokhidbek",
      demo: "#",
      image: "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=1200&q=80&auto=format&fit=crop",
    },
  ];

  const filteredProjects =
    projectFilter === "all"
      ? projects
      : projects.filter((project) => project.category === projectFilter);

  const i18n = {
    en: {
      home: "Home",
      experience: "Experience",
      education: "Education",
      skills: "Skills",
      contact: "Contact",
      blog: "Blog",
      hireMe: "Hire me",
      openDailyBlog: "Open Daily Blog",
      downloadResume: "Download Resume",
      viewExperience: "View experience",
      projects: "Projects",
      interests: "Interests",
      letsWork: "Let's work together.",
    },
    uz: {
      home: "Bosh sahifa",
      experience: "Tajriba",
      education: "Ta'lim",
      skills: "Ko'nikmalar",
      contact: "Aloqa",
      blog: "Blog",
      hireMe: "Meni yollang",
      openDailyBlog: "Kunlik blog",
      downloadResume: "Rezyume yuklab olish",
      viewExperience: "Tajribani ko'rish",
      projects: "Loyihalar",
      interests: "Qiziqishlar",
      letsWork: "Keling birga ishlaymiz.",
    },
  }[lang];

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] px-6 py-8 overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 right-1/3 h-[360px] w-[360px] rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-[420px] w-[420px] rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <nav
          className="flex flex-col gap-4 rounded-[32px] border border-slate-200/70 bg-[var(--surface)] px-6 py-5 shadow-[0_20px_120px_-75px_rgba(56,189,248,0.65)] backdrop-blur-md dark:border-white/10 dark:bg-[var(--surface-strong)] md:flex-row md:items-center md:justify-between"
        >
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold tracking-[0.22em] text-emerald-500">MIRZOHIDBEK N.</span>
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs uppercase tracking-[0.24em] text-emerald-500/90">Portfolio</span>
          </div>

          <div className="hidden items-center gap-5 text-sm text-slate-800 dark:text-slate-200 md:flex">
            {[
              { label: i18n.home, href: "/" },
              { label: i18n.experience, href: "#experience" },
              { label: i18n.education, href: "#education" },
              { label: i18n.skills, href: "#skills" },
              { label: i18n.contact, href: "#contact" },
              { label: i18n.blog, href: "/blog" },
            ].map((item) => (
              <Link key={item.label} href={item.href} className="transition text-slate-800 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang((prev) => (prev === "en" ? "uz" : "en"))}
              className="hidden rounded-xl border border-slate-400/60 bg-[var(--surface-strong)] px-3 py-1.5 text-xs text-slate-950 transition hover:border-emerald-300 hover:text-slate-900 dark:border-white/20 dark:bg-[var(--surface)] dark:text-slate-100 md:inline"
            >
              {lang === "en" ? "UZ" : "EN"}
            </button>
            <a
              href="mailto:nurmuhammadovmirzohid678@gmail.com"
              className="rounded-2xl bg-emerald-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-emerald-400"
            >
              {i18n.hireMe}
            </a>
          </div>
        </nav>

        <section className="grid gap-8 lg:grid-cols-[1.35fr_.85fr]">
          <div
            className="rounded-[32px] border border-slate-200/70 bg-[var(--surface-strong)] p-8 shadow-[0_40px_120px_-80px_rgba(14,165,233,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-[var(--surface)]"
          >
            <div className="inline-flex items-center gap-3 rounded-full bg-emerald-500/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-emerald-500/90">
              Designed for enterprise-ready applications
            </div>
            <div className="mt-8 max-w-3xl space-y-6">
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-500/90">Hello, I’m Mirzohidbek</p>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                Building polished web applications that scale for global teams.
              </h1>
              <p className="text-base leading-8 text-slate-800 dark:text-slate-300">
                I’m a Full Stack Web Developer focused on clean architecture, responsive design, and modern JavaScript systems.
                I work across React, Node.js, and cloud-native workflows to deliver products with excellent performance and UX.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200/70 bg-[var(--surface)] p-5 dark:border-white/10 dark:bg-[var(--surface-strong)]">
                <p className="text-4xl font-semibold text-slate-950 dark:text-white">3+</p>
                <p className="mt-3 text-sm text-slate-800 dark:text-slate-400">Years experience delivering web products.</p>
              </div>
              <div className="rounded-3xl border border-slate-200/70 bg-[var(--surface)] p-5 dark:border-white/10 dark:bg-[var(--surface-strong)]">
                <p className="text-4xl font-semibold text-slate-950 dark:text-white">2</p>
                <p className="mt-3 text-sm text-slate-800 dark:text-slate-400">Global roles at modern product teams.</p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/blog"
                className="rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-emerald-400"
              >
                {i18n.openDailyBlog}
              </Link>
              <a
                href="/cv.pdf"
                download
                className="rounded-2xl border border-slate-700/80 bg-[var(--surface-strong)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:border-emerald-400 dark:border-slate-700/80 dark:bg-[var(--surface)] dark:text-slate-100"
              >
                {i18n.downloadResume}
              </a>
            </div>
          </div>

          <aside
            className="space-y-6"
          >
            <div className="rounded-[32px] border border-slate-200/70 bg-[var(--surface-strong)] p-6 shadow-xl shadow-cyan-500/5 backdrop-blur-xl dark:border-white/10 dark:bg-[var(--surface)]">
              <div className="relative overflow-hidden rounded-3xl border border-slate-700/90 bg-[var(--surface)] dark:border-slate-700/80 dark:bg-[var(--surface-strong)]">
                <Image src="/profile.JPG" alt="Mirzohid profile" width={800} height={1000} className="h-[420px] w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/20 via-transparent to-transparent p-4 dark:from-slate-950/90">
                  <p className="text-sm text-slate-900 dark:text-slate-100">Seoul, South Korea</p>
                </div>
              </div>
              <div className="mt-5 space-y-3 rounded-3xl border border-slate-200/70 bg-[var(--surface)] p-4 text-sm text-slate-950 dark:border-white/10 dark:bg-[var(--surface-strong)] dark:text-slate-100">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Contact</p>
                  <p className="mt-2 text-slate-800 dark:text-slate-300">nurmuhammadovmirzohid678@gmail.com</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">LinkedIn</p>
                  <p className="mt-2 text-slate-800 dark:text-slate-300">linkedin.com/in/mirzohidbek-nurmukhammadov-88a01a2a8</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Education</p>
                  <p className="mt-2 text-slate-800 dark:text-slate-300">Sejong University · Computer Software Engineering</p>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200/70 bg-[var(--surface)] p-6 backdrop-blur-xl dark:border-white/10 dark:bg-[var(--surface-strong)]">
              <h3 className="text-xl font-semibold text-slate-950 dark:text-white">Core technologies</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {skills.slice(0, 8).map((skill) => (
                  <span key={skill} className="rounded-2xl border border-slate-700/80 bg-[var(--surface-strong)] px-3 py-2 text-sm text-slate-800 dark:border-slate-700/80 dark:bg-[var(--surface)] dark:text-slate-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section id="projects" className="rounded-[32px] border border-slate-200/70 bg-[var(--surface)] p-6 shadow-xl shadow-cyan-500/5 backdrop-blur-xl dark:border-white/10 dark:bg-[var(--surface-strong)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-500/90">Featured Projects</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">Selected work built for scale.</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {["all", "frontend", "backend", "fullstack"].map((type) => (
                <button
                  key={type}
                  onClick={() => setProjectFilter(type as "all" | "frontend" | "backend" | "fullstack")}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    projectFilter === type
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <article key={project.title} className="group overflow-hidden rounded-[32px] border border-slate-200/70 bg-[var(--surface)] transition hover:-translate-y-1 hover:border-emerald-400/40 hover:shadow-2xl hover:shadow-emerald-500/10 dark:border-white/10 dark:bg-[var(--surface-strong)]">
                <div className="relative h-56 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={project.image} alt={project.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/20 via-transparent to-transparent p-4">
                    <span className="rounded-full bg-[var(--surface-strong)] px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-900 dark:bg-slate-900/80 dark:text-emerald-300">{project.category}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-slate-950 dark:text-white">{project.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-800 dark:text-slate-300">{project.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tech.map((item) => (
                      <span key={item} className="rounded-full border border-slate-700/80 bg-[var(--surface)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-800 dark:border-slate-700/80 dark:bg-[var(--surface-strong)] dark:text-slate-300">
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3 text-sm">
                    <a href={project.github} target="_blank" rel="noreferrer" className="text-emerald-500 hover:text-emerald-300">
                      GitHub
                    </a>
                    <span className="text-slate-600">·</span>
                    <a href={project.demo} target="_blank" rel="noreferrer" className="text-cyan-300 hover:text-cyan-100">
                      Live Demo
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="experience" className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-[32px] border border-slate-200/70 bg-[var(--surface)] p-6 shadow-xl shadow-cyan-500/5 backdrop-blur-xl dark:border-white/10 dark:bg-[var(--surface-strong)]">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-500/90">{i18n.experience}</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">Career highlights & recent roles.</h2>
            <p className="mt-4 text-slate-800 dark:text-slate-300">A record of hands-on impact in frontend, backend, and product-engineering environments.</p>
            <div className="mt-6 space-y-5">
              {[
                {
                  role: "Web Development Intern",
                  company: "Itransition Group",
                  timeline: "Nov 2025 — Present",
                  location: "Germany",
                },
                {
                  role: "Frontend Web Developer",
                  company: "Digital Assets Ai",
                  timeline: "May 2025 — Sep 2025",
                  location: "Seoul, South Korea",
                },
                {
                  role: "Full Stack Web Developer",
                  company: "MegaProject",
                  timeline: "Jan 2024 — Sep 2024",
                  location: "Seoul, South Korea",
                },
              ].map((item) => (
                <div key={item.role} className="rounded-[28px] border border-slate-200/70 bg-[var(--surface)] p-5 dark:border-white/10 dark:bg-[var(--surface-strong)]">
                  <p className="text-lg font-semibold text-slate-950 dark:text-white">{item.role}</p>
                  <p className="mt-1 text-sm text-slate-800 dark:text-slate-400">{item.company}</p>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
                    <span className="rounded-full border border-slate-300/70 bg-[var(--surface-strong)] px-3 py-1 text-slate-800 dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-200">{item.timeline}</span>
                    <span className="rounded-full border border-slate-300/70 bg-[var(--surface-strong)] px-3 py-1 text-slate-800 dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-200">{item.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[32px] border border-slate-200/70 bg-[var(--surface)] p-6 shadow-xl shadow-cyan-500/5 backdrop-blur-xl dark:border-white/10 dark:bg-[var(--surface-strong)]">
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-500/90">{i18n.education}</p>
              <div className="mt-5 space-y-5">
                <div className="rounded-[28px] border border-slate-200/70 bg-[var(--surface-strong)] p-5 dark:border-white/10 dark:bg-[var(--surface)]">
                  <p className="font-semibold text-slate-950 dark:text-white">Senior Student — Sejong University</p>
                  <p className="mt-1 text-sm text-slate-800 dark:text-slate-400">03/2023 — 03/2027 · Seoul, South Korea</p>
                  <p className="mt-3 text-sm text-slate-800 dark:text-slate-300">Computer Software Engineering</p>
                </div>
                <div className="rounded-[28px] border border-slate-200/70 bg-[var(--surface-strong)] p-5 dark:border-white/10 dark:bg-[var(--surface)]">
                  <p className="font-semibold text-slate-950 dark:text-white">Web Development Student — IT Park</p>
                  <p className="mt-1 text-sm text-slate-800 dark:text-slate-400">11/2021 — 03/2022 · Tashkent, Uzbekistan</p>
                  <p className="mt-3 text-sm text-slate-800 dark:text-slate-300">Python programming and libraries</p>
                </div>
              </div>
            </div>

            <div id="skills" className="rounded-[32px] border border-slate-200/70 bg-[var(--surface)] p-6 shadow-xl shadow-cyan-500/5 backdrop-blur-xl dark:border-white/10 dark:bg-[var(--surface-strong)]">
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-500/90">{i18n.skills}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {skills.map((skill) => (
                  <span key={skill} className="rounded-3xl border border-slate-700/90 bg-[var(--surface-strong)] px-4 py-3 text-sm text-slate-800 dark:border-slate-700/80 dark:bg-[var(--surface)] dark:text-slate-300">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="mt-6 rounded-[28px] border border-slate-700/90 bg-[var(--surface)] p-5 text-sm text-slate-800 dark:border-slate-700/80 dark:bg-[var(--surface-strong)] dark:text-slate-300">
                <h3 className="font-semibold text-slate-950 dark:text-white">Languages</h3>
                <ul className="mt-3 space-y-2">
                  <li>English — Full Professional Proficiency</li>
                  <li>Korean — Professional Working Proficiency</li>
                  <li>Uzbek — Native / Bilingual Proficiency</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="rounded-[32px] border border-slate-200/70 bg-[var(--surface)] p-8 shadow-xl shadow-cyan-500/10 backdrop-blur-xl dark:border-white/10 dark:bg-[var(--surface-strong)]">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_.8fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-500/90">{i18n.letsWork}</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">Let’s build the next high-performing product together.</h2>
              <p className="mt-4 text-slate-800 dark:text-slate-300">Available for full stack opportunities and collaborative projects that focus on UX, reliability, and maintainability.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="mailto:nurmuhammadovmirzohid678@gmail.com" className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-emerald-400">
                Email
              </a>
              <a href="https://github.com/Mirzokhidbek" target="_blank" rel="noreferrer" className="rounded-2xl border border-slate-700/90 bg-[var(--surface-strong)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:border-emerald-400 dark:border-slate-700/80 dark:bg-[var(--surface)] dark:text-slate-100">
                GitHub
              </a>
              <Link href="/blog" className="rounded-2xl border border-slate-700/90 bg-[var(--surface-strong)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:border-cyan-300 dark:border-slate-700/80 dark:bg-[var(--surface)] dark:text-slate-100">
                Blog
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
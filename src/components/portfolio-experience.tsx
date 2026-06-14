"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  ChevronUp,
  Code2,
  Database,
  Download,
  Github,
  LayoutDashboard,
  Mail,
  MapPin,
  Menu,
  Network,
  Phone,
  ShieldCheck,
  X,
} from "lucide-react";

import {
  GithubProfileShowcase,
  RecruiterDashboard,
} from "@/components/github-platform-sections";
import { ProjectsExplorer } from "@/components/projects-explorer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { GithubSyncData } from "@/lib/github-types";
import {
  modules,
  profile,
  skillGroups,
  socialLinks,
  timeline,
} from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

const sectionVariant: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.36, ease: "easeOut" },
  },
};

const stagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const navLinks = [
  { label: "Profile", href: "#home", id: "home" },
  { label: "Skills", href: "#skills", id: "skills" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Recruiter", href: "#recruiter", id: "recruiter" },
  { label: "GitHub", href: "#github", id: "github" },
  { label: "Contact", href: "#contact", id: "contact" },
];

const moduleIcons = {
  Programming: Code2,
  "Database Design": Database,
  Networking: Network,
  Security: ShieldCheck,
  "Software Development": BriefcaseBusiness,
  "Web Development": LayoutDashboard,
};

function SectionHeader({
  eyebrow,
  title,
  copy,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
}) {
  return (
    <motion.div
      className={cn("mb-10 max-w-3xl", align === "center" && "mx-auto text-center")}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      variants={sectionVariant}
    >
      <Badge>{eyebrow}</Badge>
      <h2 className="mt-5 text-3xl font-semibold tracking-normal text-white sm:text-4xl">
        {title}
      </h2>
      {copy ? <p className="mt-4 text-base leading-8 text-slate-400">{copy}</p> : null}
    </motion.div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const updateActiveSection = () => {
      const marker = window.innerHeight * 0.38;
      const current =
        navLinks
          .map((link) => ({
            id: link.id,
            top: document.getElementById(link.id)?.getBoundingClientRect().top ?? Infinity,
          }))
          .filter((section) => section.top <= marker)
          .at(-1)?.id ?? "home";

      setActive(current);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full border border-white/10 bg-[#0a0a0a]/72 px-3 shadow-[0_8px_32px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:px-4">
        <a href="#home" className="flex items-center gap-3" aria-label="Home">
          <span className="relative size-9 overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
            <Image
              src="/hero-lasindu-profile.webp"
              alt="Lasindu Tharumitha profile photo"
              fill
              sizes="36px"
              className="object-cover"
            />
          </span>
          <span className="hidden text-sm font-medium text-white sm:block">Lasindu</span>
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={cn(
                "rounded-full px-3 py-2 text-sm font-medium text-slate-400 transition duration-300 hover:text-white",
                active === item.id && "bg-white/[0.06] text-white",
              )}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <a href="#contact">
              <Mail className="size-4" />
              Contact
            </a>
          </Button>
          <Button
            aria-label={open ? "Close menu" : "Open menu"}
            size="icon"
            variant="secondary"
            className="lg:hidden"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </nav>

      {open ? (
        <motion.div
          className="mx-auto mt-2 grid max-w-6xl gap-1 rounded-[20px] border border-white/10 bg-[#0a0a0a]/92 p-2 shadow-[0_8px_32px_rgba(0,0,0,0.28)] backdrop-blur-2xl lg:hidden"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24 }}
        >
          {navLinks.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-full px-4 py-3 text-sm font-medium text-slate-300",
                active === item.id && "bg-white/[0.06] text-white",
              )}
            >
              {item.label}
            </a>
          ))}
        </motion.div>
      ) : null}
    </header>
  );
}

function HeroSection({ data }: { data: GithubSyncData }) {
  const liveProjects = data.repositories.filter((repo) => repo.liveDemoUrl).length;
  const metrics = [
    { label: "Repositories", value: data.profile.publicRepos || data.repositories.length },
    { label: "Stars", value: data.profile.totalStars },
    { label: "Live demos", value: liveProjects },
  ];

  return (
    <section id="home" className="relative min-h-screen overflow-hidden pt-28" aria-labelledby="hero-title">
      <div className="absolute inset-x-0 top-0 -z-10 mx-auto h-[34rem] max-w-5xl rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-6xl items-center gap-14 px-4 pb-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="max-w-3xl"
        >
          <motion.div variants={sectionVariant}>
            <Badge>Current Status: Open to Internship Opportunities</Badge>
          </motion.div>
          <motion.h1
            id="hero-title"
            variants={sectionVariant}
            className="mt-7 max-w-3xl text-5xl font-semibold leading-[1.04] tracking-normal text-white sm:text-6xl lg:text-7xl"
          >
            Software engineer building calm, scalable web products.
          </motion.h1>
          <motion.div variants={sectionVariant} className="mt-6 space-y-2">
            <p className="text-xl font-medium text-white">{profile.role}</p>
            <p className="text-xl text-slate-300">Full Stack Developer</p>
            <p className="max-w-2xl text-lg leading-8 text-slate-400">
              Building scalable web applications with clean interfaces, reliable data
              models, and production-minded engineering habits.
            </p>
          </motion.div>
          <motion.div variants={sectionVariant} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <a href="/Lasindu-Tharumitha-Resume.pdf" download>
                <Download className="size-4" />
                Download Resume
              </a>
            </Button>
            <Button asChild variant="secondary">
              <a href="#projects">
                View Projects
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </motion.div>
          <motion.div variants={sectionVariant} className="mt-9 grid max-w-xl grid-cols-3 gap-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-[20px] border border-white/8 bg-white/[0.03] p-4">
                <p className="text-2xl font-semibold text-white">{metric.value.toLocaleString()}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                  {metric.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="relative mx-auto w-full max-w-[430px]"
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="absolute inset-8 rounded-full bg-cyan-400/16 blur-3xl" />
          <div className="relative mx-auto aspect-square overflow-hidden rounded-full border border-white/10 bg-white/[0.04] p-2 shadow-[0_24px_120px_rgba(0,0,0,0.44)]">
            <div className="relative h-full overflow-hidden rounded-full">
              <Image
                src="/hero-lasindu-profile.webp"
                alt="Lasindu Tharumitha professional portrait"
                fill
                priority
                sizes="(max-width: 768px) 82vw, 430px"
                className="object-cover"
              />
            </div>
          </div>
          <div className="absolute -bottom-4 left-1/2 w-[88%] -translate-x-1/2 rounded-[20px] border border-white/10 bg-[#0a0a0a]/80 p-4 text-center shadow-[0_8px_32px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
            <p className="text-sm font-medium text-white">Lasindu Tharumitha</p>
            <p className="mt-1 text-sm text-slate-400">{profile.location}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="section-pad">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <SectionHeader
            eyebrow="Profile"
            title="A practical engineer with product taste."
            copy="I care about the part where software becomes useful: readable systems, clean workflows, and interfaces that make evaluation easy for users and teams."
          />
          <motion.div
            className="grid gap-4 sm:grid-cols-2"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            {[
              "Full stack web applications with Next.js, TypeScript, Firebase, ASP.NET MVC, and SQL.",
              "Database-backed tools with normalized schemas, reporting flows, and reliable CRUD design.",
              "Network and infrastructure simulations covering VLANs, VPN, routing, switching, and security.",
              "Recruiter-ready delivery: source code, project demos, resume, transcript, and GitHub signals.",
            ].map((item) => (
              <motion.div key={item} variants={sectionVariant}>
                <Card className="h-full p-6">
                  <p className="leading-7 text-slate-300">{item}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SkillsSection() {
  return (
    <section id="skills" className="section-pad">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Capabilities"
          title="A balanced stack, shown without vanity metrics."
          copy="Grouped by the way the stack appears in real work: interfaces, services, data, infrastructure, and delivery tools."
        />
        <motion.div
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
          variants={stagger}
        >
          {skillGroups.map((group) => {
            const Icon = group.icon;
            return (
              <motion.div key={group.title} variants={sectionVariant}>
                <Card className="h-full p-6">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-cyan-300">
                      <Icon className="size-4" />
                    </span>
                    <h3 className="text-lg font-semibold text-white">{group.title}</h3>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {group.skills.map(([name]) => (
                      <span
                        key={name}
                        className="rounded-full border border-white/8 bg-white/[0.035] px-3 py-1.5 text-sm text-slate-300"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function ProjectsSection({ data }: { data: GithubSyncData }) {
  return (
    <section id="projects" className="section-pad">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Projects"
          title="A searchable project library synced from GitHub."
          copy="Repository data remains automatic, so new public repositories appear here without manually editing project cards."
        />

        <ProjectsExplorer data={data} compact />
        <div className="mt-8 flex justify-center">
          <Button asChild variant="secondary">
            <a href="/projects">
              Open full project library
              <ArrowRight className="size-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

function RecruiterSection({ data }: { data: GithubSyncData }) {
  return (
    <section id="recruiter" className="section-pad">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <RecruiterDashboard data={data} />
      </div>
    </section>
  );
}

function ExperienceSection() {
  return (
    <section id="experience" className="section-pad">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Experience"
          title="Execution signals from academic and project work."
          copy="A concise timeline focused on the kinds of systems, constraints, and collaboration patterns that translate into internship work."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {timeline.map((item) => (
            <Card key={item.title} className="p-6">
              <BriefcaseBusiness className="size-5 text-cyan-300" />
              <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-3 leading-7 text-slate-400">{item.detail}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function EducationSection() {
  return (
    <section id="education" className="section-pad">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="p-7">
            <Badge>Education</Badge>
            <h2 className="mt-5 text-3xl font-semibold text-white">{profile.education}</h2>
            <p className="mt-4 text-slate-400">{profile.institution} - {profile.location}</p>
            <p className="mt-6 leading-8 text-slate-300">
              Coursework spans programming, databases, networking, security,
              software development, and web engineering. The emphasis is on
              turning fundamentals into working systems.
            </p>
          </Card>
          <div className="grid gap-4 sm:grid-cols-2">
            {modules.map((module) => {
              const Icon = moduleIcons[module as keyof typeof moduleIcons] || Code2;

              return (
                <Card
                  key={module}
                  className="flex min-h-28 flex-col justify-between p-5 transition duration-300 hover:border-white/14"
                >
                  <span className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-cyan-300">
                    <Icon className="size-4" />
                  </span>
                  <p className="mt-6 text-lg font-medium text-white">{module}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function GitHubSection({ data }: { data: GithubSyncData }) {
  return (
    <section id="github" className="section-pad">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="GitHub"
          title="A live engineering dashboard."
          copy="Repositories, pinned work, contribution signals, languages, stars, forks, and activity are synchronized from GitHub."
        />
        <GithubProfileShowcase data={data} />
      </div>
    </section>
  );
}

function ContactSection() {
  const contactItems = [
    { label: "Email", value: profile.email, href: `mailto:${profile.email}`, icon: Mail },
    { label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s+/g, "")}`, icon: Phone },
    { label: "Location", value: profile.location, href: null, icon: MapPin },
  ];

  return (
    <section id="contact" className="section-pad">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Card className="overflow-hidden p-7 sm:p-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-end">
            <div>
              <Badge>Contact</Badge>
              <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-normal text-white sm:text-5xl">
                Let&apos;s talk about internship roles, product engineering, and practical software work.
              </h2>
              <p className="mt-5 max-w-2xl leading-8 text-slate-400">
                The fastest path is email. Resume, academic transcript, GitHub, and project links are available for quick recruiter review.
              </p>
            </div>
            <div className="grid gap-3">
              <Button asChild>
                <a href={`mailto:${profile.email}`}>
                  <Mail className="size-4" />
                  Email Lasindu
                </a>
              </Button>
              <Button asChild variant="secondary">
                <a href="/Lasindu-Tharumitha-Resume.pdf" download>
                  <Download className="size-4" />
                  Download Resume
                </a>
              </Button>
              <Button asChild variant="secondary">
                <a href={`https://github.com/${profile.githubUsername}`} target="_blank" rel="noreferrer">
                  <Github className="size-4" />
                  GitHub Profile
                </a>
              </Button>
            </div>
          </div>
          <div className="mt-10 grid gap-3 md:grid-cols-3">
            {contactItems.map((item) => {
              const Icon = item.icon;
              const content = (
                <div className="rounded-[20px] border border-white/8 bg-white/[0.03] p-5 transition duration-300 hover:border-white/14">
                  <Icon className="size-4 text-cyan-300" />
                  <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm text-slate-300">{item.value}</p>
                </div>
              );

              return item.href ? (
                <a key={item.label} href={item.href}>
                  {content}
                </a>
              ) : (
                <div key={item.label}>{content}</div>
              );
            })}
          </div>
        </Card>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/8 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-base font-semibold text-white">Lasindu Tharumitha</p>
            <p className="mt-1 text-sm text-slate-500">
              {profile.role} | Full Stack Developer
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                  className="inline-flex items-center gap-2 rounded-full border border-white/8 px-3 py-2 text-sm text-slate-400 transition hover:border-white/14 hover:text-white"
                >
                  <Icon className="size-4" />
                  {link.label}
                </a>
              );
            })}
          </div>
          <Button asChild size="icon" variant="secondary">
            <a href="#home" aria-label="Back to top">
              <ChevronUp className="size-4" />
            </a>
          </Button>
        </div>
        <p className="text-sm text-slate-500">
          Copyright {new Date().getFullYear()} Lasindu Tharumitha. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export function PortfolioExperience({
  githubData,
}: {
  githubData: GithubSyncData;
}) {
  return (
    <div className="premium-shell min-h-screen text-white">
      <Header />
      <main>
        <HeroSection data={githubData} />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection data={githubData} />
        <RecruiterSection data={githubData} />
        <ExperienceSection />
        <EducationSection />
        <GitHubSection data={githubData} />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

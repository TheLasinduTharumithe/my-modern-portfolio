import Image from "next/image";
import { ExternalLink, GitFork, Github, Radio, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { SyncedRepository } from "@/lib/github-types";
import { formatDate, formatRelativeDate } from "@/lib/github-utils";

const caseStudyCopy = [
  {
    match: "ecoplate",
    challenge: "Donation workflows need trust, clarity, and fast status visibility.",
    solution: "Role-aware flows, Firebase data, and operational screens for donors and admins.",
    architecture: "Next.js, TypeScript, Firebase Auth, Firestore, and responsive UI modules.",
    outcome: "A clearer operating model for collecting, reviewing, and routing donation records.",
  },
  {
    match: "islandlink",
    challenge: "Distribution work becomes difficult when orders, inventory, and delivery context split apart.",
    solution: "A centralized dashboard for sales, inventory movement, and route-aware status tracking.",
    architecture: "Next.js application with Firebase collections and reusable management views.",
    outcome: "A more organized logistics workflow with visible operational state.",
  },
  {
    match: "greenlife",
    challenge: "Retail teams need accurate inventory and sales records without spreadsheet drift.",
    solution: "Desktop tools for product, customer, sales, and reporting workflows.",
    architecture: "C# WinForms connected to SQL Server with structured CRUD flows.",
    outcome: "A practical store management system for repeated daily use.",
  },
];

function getCaseStudy(repo: SyncedRepository) {
  const normalized = repo.name.toLowerCase();
  return (
    caseStudyCopy.find((item) => normalized.includes(item.match)) ?? {
      challenge: "A scoped repository needed to become understandable as a product.",
      solution: "Organized the project around clear workflows, source code, metadata, and demo readiness.",
      architecture: `${repo.language || "Software"} project with GitHub-synced topics, language data, and repository activity.`,
      outcome: "A project that can be reviewed from code quality, stack choices, and delivery signals.",
    }
  );
}

export function LiveProjectCard({
  repo,
  priority = false,
}: {
  repo: SyncedRepository;
  priority?: boolean;
}) {
  const techStack = Array.from(
    new Set([repo.language, ...repo.languages, ...repo.topics].filter(Boolean)),
  ).slice(0, 5);
  const caseStudy = getCaseStudy(repo);

  return (
    <Card className="group h-full overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-white/14">
      <div className="relative aspect-[16/9] overflow-hidden bg-white/[0.03]">
        <Image
          src={repo.thumbnailUrl}
          alt={`${repo.name} project thumbnail`}
          fill
          priority={priority}
          sizes="(max-width: 768px) 92vw, (max-width: 1280px) 46vw, 31vw"
          unoptimized
          className="object-cover opacity-78 transition duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,10,10,0.86),rgba(10,10,10,0.12))]" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {repo.isPinned ? <Badge>Featured</Badge> : null}
          {repo.liveDemoUrl ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-cyan-300/24 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100">
              <Radio className="size-3" />
              Live
            </span>
          ) : null}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
            Updated {formatRelativeDate(repo.updatedAt)}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-white">{repo.name}</h3>
        </div>
      </div>

      <div className="p-5">
        <p className="min-h-14 text-sm leading-7 text-slate-400">{repo.description}</p>

        <div className="mt-5 grid gap-3">
          {[
            ["Challenge", caseStudy.challenge],
            ["Solution", caseStudy.solution],
            ["Architecture", caseStudy.architecture],
            ["Outcome", caseStudy.outcome],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                {label}
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-300">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/8 bg-white/[0.035] px-3 py-1 text-xs font-medium text-slate-300"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Star className="size-3.5" />
            {repo.stars}
          </span>
          <span className="inline-flex items-center gap-1">
            <GitFork className="size-3.5" />
            {repo.forks}
          </span>
          <span>{formatDate(repo.updatedAt)}</span>
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="secondary" size="sm" className="w-full sm:w-auto">
            <a href={repo.githubUrl} target="_blank" rel="noreferrer">
              <Github className="size-4" />
              GitHub
            </a>
          </Button>
          {repo.liveDemoUrl ? (
            <Button asChild size="sm" className="w-full sm:w-auto">
              <a href={repo.liveDemoUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="size-4" />
                Live Demo
              </a>
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

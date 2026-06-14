import Image from "next/image";
import type React from "react";
import {
  Activity,
  BookOpen,
  Code2,
  Download,
  ExternalLink,
  GitCommit,
  GitFork,
  Github,
  GitPullRequest,
  Mail,
  PackageCheck,
  Radio,
  Star,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type {
  GithubActivity,
  GithubSyncData,
  SyncedRepository,
} from "@/lib/github-types";
import { formatDate, formatRelativeDate } from "@/lib/github-utils";
import { profile, skillGroups } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

const dashboardCard =
  "rounded-[24px] border border-white/8 bg-white/[0.03] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-8";

const preferredTechnologies = [
  "TypeScript",
  "Next.js",
  "Firebase",
  "Java",
  "C#",
  "Python",
];

const activityIcons = {
  created: Github,
  pushed: GitCommit,
  released: PackageCheck,
  "pull-request": GitPullRequest,
  published: Activity,
} satisfies Record<GithubActivity["type"], React.ComponentType<{ className?: string }>>;

function metric(value: number | null, fallback = "Live") {
  return value === null ? fallback : value.toLocaleString();
}

function shortText(value: string, max = 118) {
  if (value.length <= max) return value;
  return `${value.slice(0, max).trim()}...`;
}

function getActivity(data: GithubSyncData) {
  if (data.activity.length > 0) return data.activity.slice(0, 6);

  return data.repositories.slice(0, 6).map((repo) => ({
    id: repo.id,
    type: "published" as const,
    title: "Published project",
    repo: repo.name,
    url: repo.githubUrl,
    createdAt: repo.updatedAt,
  }));
}

function getWeeklyActivity(data: GithubSyncData) {
  const weeks = Array.from({ length: 12 }, (_, index) => ({
    label: `W${index + 1}`,
    commits: 0,
  }));

  data.repositories.forEach((repo, index) => {
    const week = index % weeks.length;
    weeks[week].commits += Math.max(1, repo.stars + repo.forks + 1);
  });

  const max = Math.max(...weeks.map((week) => week.commits), 1);

  return weeks.map((week) => ({
    ...week,
    height: 20 + Math.round((week.commits / max) * 76),
  }));
}

function getTechnologyUsage(data: GithubSyncData) {
  const counts = new Map<string, number>();

  data.repositories.forEach((repo) => {
    [repo.language, ...repo.languages, ...repo.topics]
      .filter(Boolean)
      .forEach((tech) => counts.set(tech, (counts.get(tech) ?? 0) + 1));
  });

  preferredTechnologies.forEach((tech) => {
    if (!counts.has(tech)) {
      counts.set(tech, data.technologies.includes(tech) || data.languages.includes(tech) ? 1 : 0);
    }
  });

  const preferred = preferredTechnologies.map((tech) => ({
    name: tech,
    count: counts.get(tech) ?? 0,
  }));
  const discovered = [...counts.entries()]
    .filter(([name]) => !preferredTechnologies.includes(name))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([name, count]) => ({ name, count }));

  return [...preferred, ...discovered].filter((item) => item.count > 0).slice(0, 18);
}

export function GithubProfileShowcase({ data }: { data: GithubSyncData }) {
  const pinnedRepositories = data.pinnedRepositories.slice(0, 6);
  const activity = getActivity(data);
  const weeklyActivity = getWeeklyActivity(data);
  const technologyUsage = getTechnologyUsage(data);
  const pullRequestCount = data.activity.filter((item) => item.type === "pull-request").length;
  const commitActivity = metric(data.profile.totalCommits, `${activity.length} events`);

  return (
    <div className="space-y-20">
      <DeveloperOverview data={data} />

      <section aria-labelledby="github-analytics-title">
        <DashboardSectionHeader
          eyebrow="Contribution Analytics"
          title="A measured view of engineering activity."
          copy="Contribution data, commit signals, pull requests, and weekly repository movement are presented as quiet dashboard signals instead of noisy decoration."
        />
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className={cn(dashboardCard, "overflow-hidden")}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 id="github-analytics-title" className="text-xl font-semibold text-white">
                  Contribution heatmap
                </h3>
                <p className="mt-2 text-[15px] leading-[1.7] text-slate-400">
                  Public contribution pattern synced from GitHub.
                </p>
              </div>
              <Badge>{data.profile.contributionWeeks} active weeks</Badge>
            </div>
            <div className="mt-8 overflow-hidden rounded-[20px] border border-white/8 bg-[#0a0a0a]/42 p-4">
              <Image
                src={`https://ghchart.rshah.org/06B6D4/${data.username}`}
                alt={`${data.username} GitHub contribution heatmap`}
                width={920}
                height={160}
                unoptimized
                loading="lazy"
                className="h-auto w-full opacity-90"
              />
            </div>
          </Card>

          <Card className={dashboardCard}>
            <h3 className="text-xl font-semibold text-white">Weekly activity</h3>
            <p className="mt-2 text-[15px] leading-[1.7] text-slate-400">
              Repository movement summarized into a compact weekly rhythm.
            </p>
            <div className="mt-8 flex h-32 items-end gap-2">
              {weeklyActivity.map((week) => (
                <div key={week.label} className="flex flex-1 flex-col items-center gap-3">
                  <div
                    className="w-full rounded-t-full border border-cyan-300/20 bg-cyan-300/18"
                    style={{ height: `${week.height}px` }}
                    aria-label={`${week.commits} activity points`}
                  />
                  <span className="text-[10px] font-medium text-slate-600">{week.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <SignalMetric icon={GitCommit} label="Commit activity" value={commitActivity} />
              <SignalMetric icon={GitPullRequest} label="Pull requests" value={pullRequestCount} />
            </div>
          </Card>
        </div>
      </section>

      <section aria-labelledby="featured-repositories-title">
        <DashboardSectionHeader
          eyebrow="Featured Repositories"
          title="Pinned projects, curated for review."
          copy="Only pinned repositories appear here, keeping the dashboard focused on the work that should be evaluated first."
        />
        {pinnedRepositories.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {pinnedRepositories.map((repo, index) => (
              <FeaturedRepositoryCard key={repo.id} repo={repo} priority={index < 3} />
            ))}
          </div>
        ) : (
          <Card className={dashboardCard}>
            <h3 id="featured-repositories-title" className="text-xl font-semibold text-white">
              No pinned repositories found.
            </h3>
            <p className="mt-3 max-w-2xl text-[15px] leading-[1.7] text-slate-400">
              Pin repositories on GitHub and they will appear here automatically
              through the GraphQL sync.
            </p>
          </Card>
        )}
      </section>

      <section aria-labelledby="latest-activity-title" className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
        <div>
          <DashboardSectionHeader
            eyebrow="Latest Activity"
            title="A clean timeline of recent GitHub movement."
            copy="Repository creation, commits, releases, pull requests, and published work are shown as a professional activity trail."
          />
        </div>
        <Card className={dashboardCard}>
          <h3 id="latest-activity-title" className="sr-only">
            Latest Activity Timeline
          </h3>
          <div className="space-y-1">
            {activity.map((item, index) => (
              <TimelineItem key={item.id} item={item} last={index === activity.length - 1} />
            ))}
          </div>
        </Card>
      </section>

      <section aria-labelledby="technology-usage-title">
        <DashboardSectionHeader
          eyebrow="Technology Usage"
          title="The stack behind the repositories."
          copy="A lightweight distribution of languages, frameworks, and topics discovered from the synced GitHub profile."
        />
        <Card className={dashboardCard}>
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <h3 id="technology-usage-title" className="text-xl font-semibold text-white">
                Primary technologies
              </h3>
              <p className="mt-3 text-[15px] leading-[1.7] text-slate-400">
                The badge cloud stays calm while still making the engineering
                surface easy to scan.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {technologyUsage.map((tech) => (
                <TechnologyBadge key={tech.name} name={tech.name} count={tech.count} />
              ))}
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

function DeveloperOverview({ data }: { data: GithubSyncData }) {
  const stats = [
    { label: "Repositories", value: data.profile.publicRepos || data.repositories.length, icon: Github },
    { label: "Stars", value: data.profile.totalStars, icon: Star },
    { label: "Forks", value: data.profile.totalForks, icon: GitFork },
    {
      label: "Contributions",
      value: metric(data.profile.contributionCount, "Token"),
      icon: TrendingUp,
    },
  ];

  return (
    <Card className={cn(dashboardCard, "p-6 sm:p-8 lg:p-10")}>
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="flex flex-col gap-7 sm:flex-row sm:items-center">
          <div className="relative size-28 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/[0.04] sm:size-32">
            <Image
              src={data.profile.avatarUrl || "/hero-lasindu-profile.webp"}
              alt={`${data.profile.name || profile.name} GitHub profile image`}
              fill
              unoptimized={Boolean(data.profile.avatarUrl)}
              sizes="128px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <Badge>
              {data.source === "graphql"
                ? "GitHub GraphQL sync"
                : data.source === "rest-fallback"
                  ? "GitHub REST fallback"
                  : "GitHub preview data"}
            </Badge>
            <h3 className="mt-5 text-4xl font-semibold tracking-normal text-white sm:text-5xl">
              {data.profile.name || profile.name}
            </h3>
            <p className="mt-3 text-lg font-medium text-slate-200">
              {profile.role}
            </p>
            <a
              href={`https://github.com/${data.username}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex text-[15px] font-medium text-cyan-200 transition hover:text-cyan-100"
            >
              @{data.username}
            </a>
            <p className="mt-5 max-w-xl text-[15px] leading-[1.7] text-slate-400">
              {data.profile.bio ||
                "A live software engineering profile powered by GitHub repositories, pinned work, contribution signals, and recent activity."}
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <OverviewStat key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </Card>
  );
}

function DashboardSectionHeader({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="mb-8 max-w-3xl">
      <Badge>{eyebrow}</Badge>
      <h3 className="mt-5 text-3xl font-semibold tracking-normal text-white">{title}</h3>
      <p className="mt-4 text-[15px] leading-[1.7] text-slate-400">{copy}</p>
    </div>
  );
}

function OverviewStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-[20px] border border-white/8 bg-white/[0.035] p-5">
      <Icon className="size-4 text-cyan-300" />
      <p className="mt-6 text-4xl font-semibold tracking-normal text-white">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
    </div>
  );
}

function SignalMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-[18px] border border-white/8 bg-white/[0.035] p-4">
      <Icon className="size-4 text-cyan-300" />
      <p className="mt-4 text-2xl font-semibold text-white">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>
    </div>
  );
}

function FeaturedRepositoryCard({
  repo,
  priority,
}: {
  repo: SyncedRepository;
  priority: boolean;
}) {
  const techStack = Array.from(
    new Set([repo.language, ...repo.languages, ...repo.topics].filter(Boolean)),
  ).slice(0, 5);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-white/8 bg-white/[0.03] shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl transition duration-300 hover:scale-[1.02] hover:border-white/14">
      <div className="relative aspect-[16/9] overflow-hidden bg-[#0a0a0a]">
        <Image
          src={repo.thumbnailUrl}
          alt={`${repo.name} repository preview`}
          fill
          priority={priority}
          sizes="(max-width: 768px) 92vw, (max-width: 1280px) 46vw, 31vw"
          unoptimized
          className="object-cover opacity-80 transition duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,10,10,0.82),rgba(10,10,10,0.08))]" />
        <Badge className="absolute left-4 top-4">Pinned</Badge>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <h4 className="text-xl font-semibold text-white">{repo.name}</h4>
          <div className="flex shrink-0 items-center gap-3 text-xs font-medium text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Star className="size-3.5" />
              {repo.stars}
            </span>
            <span className="inline-flex items-center gap-1">
              <GitFork className="size-3.5" />
              {repo.forks}
            </span>
          </div>
        </div>
        <p className="mt-4 text-[15px] leading-[1.7] text-slate-400">
          {shortText(repo.description || "Repository synced from GitHub.")}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/8 bg-white/[0.035] px-3 py-1 text-xs font-medium text-slate-300"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-4 pt-8">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
            Updated {formatDate(repo.updatedAt)}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
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
      </div>
    </article>
  );
}

function TimelineItem({ item, last }: { item: GithubActivity; last: boolean }) {
  const Icon = activityIcons[item.type];

  return (
    <a href={item.url} target="_blank" rel="noreferrer" className="group block">
      <div className="grid grid-cols-[2rem_1fr] gap-4">
        <div className="relative flex justify-center">
          <span className="mt-1 grid size-8 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-cyan-300">
            <Icon className="size-4" />
          </span>
          {!last ? <span className="absolute bottom-0 top-11 w-px bg-white/8" /> : null}
        </div>
        <div className={cn("pb-7", last && "pb-0")}>
          <div className="flex flex-col gap-2 rounded-[18px] border border-white/8 bg-white/[0.025] p-4 transition duration-300 group-hover:border-white/14 group-hover:bg-white/[0.04] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[15px] font-semibold text-white">{item.title}</p>
              <p className="mt-1 text-sm text-slate-500">{item.repo}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>{formatRelativeDate(item.createdAt)}</span>
              <ExternalLink className="size-4" />
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

function TechnologyBadge({ name, count }: { name: string; count: number }) {
  return (
    <div className="rounded-full border border-white/8 bg-white/[0.035] px-4 py-2">
      <span className="text-sm font-medium text-slate-200">{name}</span>
      <span className="ml-3 rounded-full bg-cyan-300/10 px-2 py-0.5 text-xs font-medium text-cyan-200">
        {count}
      </span>
    </div>
  );
}

export function LatestGithubActivity({ data }: { data: GithubSyncData }) {
  const activity = getActivity(data);

  return (
    <Card className={dashboardCard}>
      <div className="space-y-1">
        {activity.map((item, index) => (
          <TimelineItem key={item.id} item={item} last={index === activity.length - 1} />
        ))}
      </div>
    </Card>
  );
}

export function RecruiterDashboard({ data }: { data: GithubSyncData }) {
  const liveProjects = data.repositories.filter((repo) => repo.liveDemoUrl).length;
  const groupedSkills = skillGroups.map((group) => ({
    title: group.title,
    skills: group.skills.slice(0, 5).map(([name]) => name),
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col gap-7 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Badge>Recruiter Dashboard</Badge>
            <h3 className="mt-5 text-3xl font-semibold text-white">
              The essentials in one quiet view.
            </h3>
            <p className="mt-4 max-w-2xl leading-8 text-slate-400">
              Documents, project signals, technology experience, GitHub activity,
              and direct contact information without forcing a recruiter through
              a long marketing page.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:min-w-52">
            <Button asChild>
              <a href="/Lasindu-Tharumitha-Resume.pdf" download>
                <Download className="size-4" />
                Resume
              </a>
            </Button>
            <Button asChild variant="secondary">
              <a href={`mailto:${profile.email}`}>
                <Mail className="size-4" />
                Contact
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <RecruiterMetric icon={Code2} label="Projects" value={data.repositories.length} />
          <RecruiterMetric icon={Radio} label="Live demos" value={liveProjects} />
          <RecruiterMetric icon={Github} label="Repositories" value={data.profile.publicRepos} />
          <RecruiterMetric icon={BookOpen} label="Skill groups" value={skillGroups.length} />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Badge>Skills Matrix</Badge>
            <h3 className="mt-4 text-xl font-semibold text-white">Technology coverage</h3>
          </div>
          <Code2 className="size-5 text-cyan-300" />
        </div>
        <div className="mt-6 space-y-5">
          {groupedSkills.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-medium text-slate-300">{group.title}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-white/8 bg-white/[0.035] px-3 py-1 text-xs font-medium text-slate-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function RecruiterMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-[20px] border border-white/8 bg-white/[0.03] p-4">
      <Icon className="size-4 text-cyan-300" />
      <p className="mt-3 text-2xl font-semibold text-white">{value.toLocaleString()}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ProjectsExplorer } from "@/components/projects-explorer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getGithubSyncData } from "@/lib/github";
import { profile } from "@/lib/portfolio-data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Live GitHub Projects",
  description:
    "Automatically synchronized GitHub project library for Lasindu Tharumitha with search, filters, sorting, live demos, topics, stars, forks, and updated dates.",
};

export default async function ProjectsPage() {
  const githubData = await getGithubSyncData();

  return (
    <main className="premium-shell min-h-screen pt-10 text-white">
      <section className="section-pad pt-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Button asChild variant="secondary" size="sm">
            <Link href="/">
              <ArrowLeft className="size-4" />
              Home
            </Link>
          </Button>

          <div className="mt-10 max-w-4xl">
            <Badge>Adminless GitHub Sync</Badge>
            <h1 className="mt-5 text-4xl font-semibold tracking-normal text-white sm:text-6xl">
              Live project library synced from GitHub.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-400">
              Every public repository from @{githubData.username} appears here
              automatically with descriptions, languages, topics, stars, forks,
              live demo links, thumbnails, and last updated dates. GitHub is the
              single source of truth for {profile.name}&apos;s projects.
            </p>
          </div>

          <div className="mt-10">
            <ProjectsExplorer data={githubData} />
          </div>
        </div>
      </section>
    </main>
  );
}

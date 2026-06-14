"use client";

import type React from "react";
import { useMemo, useState } from "react";
import { ArrowDownUp, Filter, Search } from "lucide-react";

import { LiveProjectCard } from "@/components/live-project-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { GithubSyncData, SyncedRepository } from "@/lib/github-types";
import { cn } from "@/lib/utils";

type SortMode = "newest" | "stars" | "popularity";

const sortLabels: Record<SortMode, string> = {
  newest: "Newest",
  stars: "Stars",
  popularity: "Popularity",
};

function matches(value: string, selected: string) {
  return selected === "All" || value.toLowerCase() === selected.toLowerCase();
}

function sortRepositories(repositories: SyncedRepository[], sort: SortMode) {
  return [...repositories].sort((a, b) => {
    if (sort === "stars") {
      return b.stars - a.stars;
    }

    if (sort === "popularity") {
      return b.popularity - a.popularity;
    }

    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

export function ProjectsExplorer({
  data,
  compact = false,
}: {
  data: GithubSyncData;
  compact?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("All");
  const [technology, setTechnology] = useState("All");
  const [sort, setSort] = useState<SortMode>("newest");

  const languageOptions = useMemo(
    () => ["All", ...data.languages].slice(0, compact ? 8 : undefined),
    [compact, data.languages],
  );
  const technologyOptions = useMemo(
    () => ["All", ...data.technologies].slice(0, compact ? 10 : undefined),
    [compact, data.technologies],
  );

  const repositories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = data.repositories.filter((repo) => {
      const searchText = [
        repo.name,
        repo.description,
        repo.language,
        ...repo.languages,
        ...repo.topics,
      ]
        .join(" ")
        .toLowerCase();

      const languageMatch =
        language === "All" ||
        repo.language.toLowerCase() === language.toLowerCase() ||
        repo.languages.some((item) => matches(item, language));
      const technologyMatch =
        technology === "All" ||
        repo.topics.some((topic) => matches(topic, technology)) ||
        repo.languages.some((item) => matches(item, technology));

      return (
        (!normalizedQuery || searchText.includes(normalizedQuery)) &&
        languageMatch &&
        technologyMatch
      );
    });

    return sortRepositories(filtered, sort);
  }, [data.repositories, language, query, sort, technology]);

  const visibleRepositories = compact ? repositories.slice(0, 6) : repositories;

  return (
    <div className="space-y-8">
      <div className="premium-card rounded-[20px] p-4">
        <div className="grid gap-3 lg:grid-cols-[1.2fr_0.9fr_0.9fr_0.8fr]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search projects"
              aria-label="Search projects"
              className="pl-9"
            />
          </label>

          <SelectControl
            icon={<Filter className="size-4" />}
            label="Language"
            value={language}
            options={languageOptions}
            onChange={setLanguage}
          />
          <SelectControl
            icon={<Filter className="size-4" />}
            label="Technology"
            value={technology}
            options={technologyOptions}
            onChange={setTechnology}
          />
          <SelectControl
            icon={<ArrowDownUp className="size-4" />}
            label="Sort"
            value={sort}
            options={Object.keys(sortLabels)}
            onChange={(value) => setSort(value as SortMode)}
            renderLabel={(value) => sortLabels[value as SortMode]}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <span>
            Showing {visibleRepositories.length} of {data.repositories.length} synced
            repositories
          </span>
          <span>
            Source:{" "}
            {data.source === "graphql"
              ? "GitHub GraphQL"
              : data.source === "rest-fallback"
                ? "GitHub REST fallback"
                : "Local seed fallback"}
          </span>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visibleRepositories.map((repo, index) => (
          <LiveProjectCard key={repo.id} repo={repo} priority={index < 3} />
        ))}
      </div>

      {visibleRepositories.length === 0 ? (
        <div className="premium-card rounded-[20px] p-8 text-center">
          <p className="text-xl font-semibold text-white">
            No repositories match those filters.
          </p>
          <p className="mt-2 text-slate-500">
            Clear the filters to view the full GitHub-synced project library.
          </p>
          <Button
            variant="secondary"
            className="mt-5"
            onClick={() => {
              setQuery("");
              setLanguage("All");
              setTechnology("All");
              setSort("newest");
            }}
          >
            Reset filters
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function SelectControl({
  icon,
  label,
  value,
  options,
  onChange,
  renderLabel = (option) => option,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  renderLabel?: (value: string) => string;
}) {
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "h-11 w-full appearance-none rounded-full border border-white/10 bg-white/[0.04] px-9 text-sm font-medium text-slate-200 outline-none transition duration-300 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/10",
        )}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {renderLabel(option)}
          </option>
        ))}
      </select>
    </label>
  );
}

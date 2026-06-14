import "server-only";

import type {
  GithubActivity,
  GithubSyncData,
  SyncedRepository,
} from "@/lib/github-types";
import { profile, projects } from "@/lib/portfolio-data";

const GITHUB_API = "https://api.github.com";
const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";
const SYNC_REVALIDATE_SECONDS = 60;

const LIVE_DEMO_OVERRIDES: Record<string, string> = {
  "final-project": "https://final-project-flax-xi.vercel.app/",
};

type GraphqlLanguageNode = {
  name: string;
};

type GraphqlRepoNode = {
  id: string;
  name: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  stargazerCount: number;
  forkCount: number;
  updatedAt: string;
  createdAt: string;
  pushedAt: string | null;
  primaryLanguage: GraphqlLanguageNode | null;
  repositoryTopics: {
    nodes: { topic: { name: string } }[];
  };
  languages: {
    nodes: GraphqlLanguageNode[];
  };
};

type RestRepo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  created_at: string;
  pushed_at: string | null;
  language: string | null;
  topics?: string[];
  owner: { login: string };
};

type RestUser = {
  login: string;
  name: string | null;
  avatar_url: string | null;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
};

type RestEvent = {
  id: string;
  type: string;
  repo: { name: string; url: string };
  created_at: string;
  payload: {
    action?: string;
    ref_type?: string;
    commits?: { sha: string; message: string }[];
    release?: { html_url?: string; tag_name?: string };
    pull_request?: { html_url?: string; title?: string };
  };
};

function getUsername() {
  return (
    process.env.GITHUB_USERNAME ||
    process.env.NEXT_PUBLIC_GITHUB_USERNAME ||
    profile.githubUsername
  );
}

function getToken() {
  return process.env.GITHUB_TOKEN || process.env.GH_TOKEN || null;
}

function githubHeaders(token = getToken()) {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function hasDeployableHomepage(url: string | null) {
  if (!url) {
    return null;
  }

  const normalized = url.trim();

  if (!normalized || normalized === "https://" || normalized === "http://") {
    return null;
  }

  const withProtocol = /^https?:\/\//i.test(normalized)
    ? normalized
    : `https://${normalized}`;

  try {
    const hostname = new URL(withProtocol).hostname;
    const supportedHosts = [
      "vercel.app",
      "netlify.app",
      "web.app",
      "firebaseapp.com",
      "github.io",
      "onrender.com",
      "railway.app",
      "up.railway.app",
    ];

    return supportedHosts.some((host) => hostname.endsWith(host))
      ? withProtocol
      : withProtocol;
  } catch {
    return null;
  }
}

function liveDemoForRepository(repoName: string, homepageUrl: string | null) {
  return LIVE_DEMO_OVERRIDES[repoName] || hasDeployableHomepage(homepageUrl);
}

function thumbnailFor(owner: string, repoName: string) {
  return `https://opengraph.githubassets.com/lasindu-portfolio/${owner}/${repoName}`;
}

function normalizeGraphqlRepo(
  repo: GraphqlRepoNode,
  username: string,
  pinnedNames: Set<string>,
): SyncedRepository {
  const languages = repo.languages.nodes.map((language) => language.name);
  const topics = repo.repositoryTopics.nodes.map((node) => node.topic.name);
  const language = repo.primaryLanguage?.name || languages[0] || "Code";
  const stars = repo.stargazerCount;
  const forks = repo.forkCount;

  return {
    id: repo.id,
    name: repo.name,
    description: repo.description || "Repository synced from GitHub.",
    language,
    languages,
    stars,
    forks,
    updatedAt: repo.updatedAt,
    createdAt: repo.createdAt,
    pushedAt: repo.pushedAt,
    topics,
    homepageUrl: repo.homepageUrl || null,
    githubUrl: repo.url,
    thumbnailUrl: thumbnailFor(username, repo.name),
    isPinned: pinnedNames.has(repo.name),
    liveDemoUrl: liveDemoForRepository(repo.name, repo.homepageUrl),
    popularity: stars * 2 + forks,
  };
}

function normalizeRestRepo(repo: RestRepo): SyncedRepository {
  const language = repo.language || "Code";
  const languages = repo.language ? [repo.language] : [];

  return {
    id: String(repo.id),
    name: repo.name,
    description: repo.description || "Repository synced from GitHub.",
    language,
    languages,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    updatedAt: repo.updated_at,
    createdAt: repo.created_at,
    pushedAt: repo.pushed_at,
    topics: repo.topics || [],
    homepageUrl: repo.homepage || null,
    githubUrl: repo.html_url,
    thumbnailUrl: thumbnailFor(repo.owner.login, repo.name),
    isPinned: false,
    liveDemoUrl: liveDemoForRepository(repo.name, repo.homepage),
    popularity: repo.stargazers_count * 2 + repo.forks_count,
  };
}

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b),
  );
}

function estimateStreakDays(contributionCalendar: {
  weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
}) {
  const days = contributionCalendar.weeks.flatMap((week) =>
    week.contributionDays.map((day) => ({
      date: day.date,
      count: day.contributionCount,
    })),
  );

  let streak = 0;

  for (const day of days.reverse()) {
    const isFuture = new Date(day.date).getTime() > Date.now();

    if (isFuture) {
      continue;
    }

    if (day.count > 0) {
      streak += 1;
      continue;
    }

    if (streak > 0) {
      break;
    }
  }

  return streak;
}

async function fetchGraphqlData(username: string): Promise<GithubSyncData> {
  const token = getToken();

  if (!token) {
    throw new Error("GitHub GraphQL sync requires GITHUB_TOKEN.");
  }

  const query = `
    query PortfolioSync($login: String!) {
      user(login: $login) {
        login
        name
        avatarUrl
        bio
        followers { totalCount }
        following { totalCount }
        repositories(first: 100, privacy: PUBLIC, ownerAffiliations: OWNER, orderBy: { field: UPDATED_AT, direction: DESC }) {
          totalCount
          nodes {
            id
            name
            description
            url
            homepageUrl
            stargazerCount
            forkCount
            updatedAt
            createdAt
            pushedAt
            primaryLanguage { name }
            languages(first: 8, orderBy: { field: SIZE, direction: DESC }) {
              nodes { name }
            }
            repositoryTopics(first: 12) {
              nodes { topic { name } }
            }
          }
        }
        pinnedItems(first: 6, types: REPOSITORY) {
          totalCount
          nodes {
            ... on Repository {
              name
            }
          }
        }
        contributionsCollection {
          totalCommitContributions
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch(GITHUB_GRAPHQL_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables: { login: username } }),
    next: { revalidate: SYNC_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL failed with ${response.status}.`);
  }

  const payload = (await response.json()) as {
    data?: {
      user?: {
        login: string;
        name: string | null;
        avatarUrl: string | null;
        bio: string | null;
        followers: { totalCount: number };
        following: { totalCount: number };
        repositories: { totalCount: number; nodes: GraphqlRepoNode[] };
        pinnedItems: {
          totalCount: number;
          nodes: { name?: string }[];
        };
        contributionsCollection: {
          totalCommitContributions: number;
          contributionCalendar: {
            totalContributions: number;
            weeks: {
              contributionDays: {
                date: string;
                contributionCount: number;
              }[];
            }[];
          };
        };
      };
    };
    errors?: { message: string }[];
  };

  if (payload.errors?.length || !payload.data?.user) {
    throw new Error(payload.errors?.[0]?.message || "GitHub user not found.");
  }

  const user = payload.data.user;
  const pinnedNames = new Set(
    user.pinnedItems.nodes
      .map((node) => node.name)
      .filter((name): name is string => Boolean(name)),
  );
  const repositories = user.repositories.nodes.map((repo) =>
    normalizeGraphqlRepo(repo, username, pinnedNames),
  );

  const totalStars = repositories.reduce((sum, repo) => sum + repo.stars, 0);
  const totalForks = repositories.reduce((sum, repo) => sum + repo.forks, 0);
  const calendar = user.contributionsCollection.contributionCalendar;

  return {
    source: "graphql",
    syncedAt: new Date().toISOString(),
    username,
    profile: {
      username,
      name: user.name || profile.name,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      followers: user.followers.totalCount,
      following: user.following.totalCount,
      publicRepos: user.repositories.totalCount,
      totalStars,
      totalForks,
      totalCommits: user.contributionsCollection.totalCommitContributions,
      contributionCount: calendar.totalContributions,
      contributionWeeks: calendar.weeks.length,
      streakDays: estimateStreakDays(calendar),
      pinnedCount: user.pinnedItems.totalCount,
    },
    repositories,
    pinnedRepositories: repositories.filter((repo) => repo.isPinned),
    activity: await fetchRestActivity(username),
    languages: uniqueSorted(repositories.map((repo) => repo.language)),
    technologies: uniqueSorted(
      repositories.flatMap((repo) => [...repo.languages, ...repo.topics]),
    ),
  };
}

async function fetchRestJson<T>(path: string): Promise<T> {
  const response = await fetch(`${GITHUB_API}${path}`, {
    headers: githubHeaders(),
    next: { revalidate: SYNC_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`GitHub REST failed with ${response.status}.`);
  }

  return response.json() as Promise<T>;
}

async function fetchRestActivity(username: string): Promise<GithubActivity[]> {
  try {
    const events = await fetchRestJson<RestEvent[]>(
      `/users/${username}/events/public?per_page=12`,
    );

    return events
      .map((event) => normalizeActivity(event))
      .filter((event): event is GithubActivity => Boolean(event))
      .slice(0, 8);
  } catch {
    return [];
  }
}

function normalizeActivity(event: RestEvent): GithubActivity | null {
  const repoName = event.repo.name.split("/").pop() || event.repo.name;
  const repoUrl = event.repo.url.replace("api.github.com/repos", "github.com");

  if (event.type === "CreateEvent" && event.payload.ref_type === "repository") {
    return {
      id: event.id,
      type: "created",
      title: "Created repository",
      repo: repoName,
      url: repoUrl,
      createdAt: event.created_at,
    };
  }

  if (event.type === "PushEvent") {
    const count = event.payload.commits?.length || 1;

    return {
      id: event.id,
      type: "pushed",
      title: `Pushed ${count} commit${count === 1 ? "" : "s"}`,
      repo: repoName,
      url: repoUrl,
      createdAt: event.created_at,
    };
  }

  if (event.type === "ReleaseEvent") {
    return {
      id: event.id,
      type: "released",
      title: `Released ${event.payload.release?.tag_name || "new version"}`,
      repo: repoName,
      url: event.payload.release?.html_url || repoUrl,
      createdAt: event.created_at,
    };
  }

  if (event.type === "PullRequestEvent") {
    return {
      id: event.id,
      type: "pull-request",
      title: `${event.payload.action || "Updated"} pull request`,
      repo: repoName,
      url: event.payload.pull_request?.html_url || repoUrl,
      createdAt: event.created_at,
    };
  }

  if (event.type === "PublicEvent") {
    return {
      id: event.id,
      type: "published",
      title: "Published project",
      repo: repoName,
      url: repoUrl,
      createdAt: event.created_at,
    };
  }

  return null;
}

async function fetchRestFallback(username: string): Promise<GithubSyncData> {
  const [user, repos, activity] = await Promise.all([
    fetchRestJson<RestUser>(`/users/${username}`),
    fetchRestJson<RestRepo[]>(
      `/users/${username}/repos?type=owner&sort=updated&per_page=100`,
    ),
    fetchRestActivity(username),
  ]);

  const repositories = repos.map(normalizeRestRepo);
  const totalStars = repositories.reduce((sum, repo) => sum + repo.stars, 0);
  const totalForks = repositories.reduce((sum, repo) => sum + repo.forks, 0);

  return {
    source: "rest-fallback",
    syncedAt: new Date().toISOString(),
    username,
    profile: {
      username,
      name: user.name || profile.name,
      avatarUrl: user.avatar_url,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      publicRepos: user.public_repos,
      totalStars,
      totalForks,
      totalCommits: null,
      contributionCount: null,
      contributionWeeks: 0,
      streakDays: null,
      pinnedCount: 0,
    },
    repositories,
    pinnedRepositories: repositories.slice(0, 6),
    activity,
    languages: uniqueSorted(repositories.map((repo) => repo.language)),
    technologies: uniqueSorted(
      repositories.flatMap((repo) => [...repo.languages, ...repo.topics]),
    ),
  };
}

function createSeedFallback(username: string): GithubSyncData {
  const repositories: SyncedRepository[] = projects.map((project, index) => ({
    id: `seed-${project.title}`,
    name: project.title,
    description: project.subtitle,
    language: project.stack[0] || "Code",
    languages: project.stack,
    stars: 0,
    forks: 0,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    pushedAt: new Date().toISOString(),
    topics: project.stack.map((item) => item.toLowerCase().replace(/\s+/g, "-")),
    homepageUrl: null,
    githubUrl: `https://github.com/${username}`,
    thumbnailUrl: thumbnailFor(username, project.title.replace(/\s+/g, "-")),
    isPinned: index < 3,
    liveDemoUrl: null,
    popularity: 0,
  }));

  return {
    source: "seed-fallback",
    syncedAt: new Date().toISOString(),
    username,
    profile: {
      username,
      name: profile.name,
      avatarUrl: null,
      bio: profile.title,
      followers: 0,
      following: 0,
      publicRepos: repositories.length,
      totalStars: 0,
      totalForks: 0,
      totalCommits: null,
      contributionCount: null,
      contributionWeeks: 0,
      streakDays: null,
      pinnedCount: repositories.filter((repo) => repo.isPinned).length,
    },
    repositories,
    pinnedRepositories: repositories.filter((repo) => repo.isPinned),
    activity: repositories.slice(0, 5).map((repo) => ({
      id: `seed-activity-${repo.id}`,
      type: "published",
      title: "Published project",
      repo: repo.name,
      url: repo.githubUrl,
      createdAt: repo.updatedAt,
    })),
    languages: uniqueSorted(repositories.map((repo) => repo.language)),
    technologies: uniqueSorted(
      repositories.flatMap((repo) => [...repo.languages, ...repo.topics]),
    ),
  };
}

export async function getGithubSyncData(): Promise<GithubSyncData> {
  const username = getUsername();

  try {
    return await fetchGraphqlData(username);
  } catch {
    try {
      return await fetchRestFallback(username);
    } catch {
      return createSeedFallback(username);
    }
  }
}

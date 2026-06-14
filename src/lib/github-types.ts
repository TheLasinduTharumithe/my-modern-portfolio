export type SyncedRepository = {
  id: string;
  name: string;
  description: string;
  language: string;
  languages: string[];
  stars: number;
  forks: number;
  updatedAt: string;
  createdAt: string;
  topics: string[];
  homepageUrl: string | null;
  githubUrl: string;
  thumbnailUrl: string;
  isPinned: boolean;
  liveDemoUrl: string | null;
  pushedAt: string | null;
  popularity: number;
};

export type GithubActivity = {
  id: string;
  type: "created" | "pushed" | "released" | "pull-request" | "published";
  title: string;
  repo: string;
  url: string;
  createdAt: string;
};

export type GithubProfile = {
  username: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  followers: number;
  following: number;
  publicRepos: number;
  totalStars: number;
  totalForks: number;
  totalCommits: number | null;
  contributionCount: number | null;
  contributionWeeks: number;
  streakDays: number | null;
  pinnedCount: number;
};

export type GithubSyncData = {
  source: "graphql" | "rest-fallback" | "seed-fallback";
  syncedAt: string;
  username: string;
  profile: GithubProfile;
  repositories: SyncedRepository[];
  pinnedRepositories: SyncedRepository[];
  activity: GithubActivity[];
  languages: string[];
  technologies: string[];
};

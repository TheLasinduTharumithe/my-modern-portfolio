import { PortfolioExperience } from "@/components/portfolio-experience";
import { getGithubSyncData } from "@/lib/github";

export const revalidate = 60;

export default async function Home() {
  const githubData = await getGithubSyncData();

  return <PortfolioExperience githubData={githubData} />;
}

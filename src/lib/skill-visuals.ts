import {
  Cable,
  Code2,
  Network,
  Replace,
  ShieldCheck,
  Table2,
  Waypoints,
  type LucideIcon,
} from "lucide-react";
import type { IconType } from "react-icons";
import { DiMsqlServer, DiVisualstudio } from "react-icons/di";
import { FaJava } from "react-icons/fa6";
import {
  SiBootstrap,
  SiCisco,
  SiCss3,
  SiDotnet,
  SiExpress,
  SiFigma,
  SiFirebase,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPostman,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { TbBrandCSharp } from "react-icons/tb";
import { VscCode } from "react-icons/vsc";

export type SkillVisualIcon = IconType | LucideIcon;

export type SkillLogo = {
  icon: IconType;
  color: string;
};

export const skillFallbackIcons: Record<string, LucideIcon> = {
  SQL: Table2,
  VLANs: Network,
  VPN: ShieldCheck,
  "TCP/IP": Cable,
  Routing: Waypoints,
  Switching: Replace,
  "Network Security": ShieldCheck,
};

export const skillLogos: Record<string, SkillLogo> = {
  HTML5: { icon: SiHtml5, color: "#e34f26" },
  CSS3: { icon: SiCss3, color: "#1572b6" },
  JavaScript: { icon: SiJavascript, color: "#d2b500" },
  TypeScript: { icon: SiTypescript, color: "#3178c6" },
  React: { icon: SiReact, color: "#24a9c7" },
  "Next.js": { icon: SiNextdotjs, color: "#292920" },
  "Tailwind CSS": { icon: SiTailwindcss, color: "#06a6ba" },
  Bootstrap: { icon: SiBootstrap, color: "#7952b3" },
  "Node.js": { icon: SiNodedotjs, color: "#5a9347" },
  "Express.js": { icon: SiExpress, color: "#292920" },
  "ASP.NET MVC": { icon: SiDotnet, color: "#512bd4" },
  "C#": { icon: TbBrandCSharp, color: "#9b4f96" },
  MySQL: { icon: SiMysql, color: "#4479a1" },
  "SQL Server": { icon: DiMsqlServer, color: "#d63f3f" },
  Firebase: { icon: SiFirebase, color: "#e7a900" },
  Firestore: { icon: SiFirebase, color: "#e7a900" },
  Java: { icon: FaJava, color: "#d97918" },
  Python: { icon: SiPython, color: "#3776ab" },
  Git: { icon: SiGit, color: "#f05032" },
  GitHub: { icon: SiGithub, color: "#292920" },
  "VS Code": { icon: VscCode, color: "#1688c7" },
  "Visual Studio": { icon: DiVisualstudio, color: "#8b63c7" },
  "Cisco Packet Tracer": { icon: SiCisco, color: "#147fa9" },
  Figma: { icon: SiFigma, color: "#e75534" },
  Postman: { icon: SiPostman, color: "#f05f35" },
};

export const skillAccentColors = {
  cyan: "#b8613b",
  emerald: "#596b50",
  amber: "#9b7128",
  rose: "#a45d52",
  violet: "#71627c",
} as const;

export function getSkillVisual(name: string, accent: keyof typeof skillAccentColors) {
  const logo = skillLogos[name];

  return {
    icon: logo?.icon ?? skillFallbackIcons[name] ?? Code2,
    color: logo?.color ?? skillAccentColors[accent],
  } satisfies { icon: SkillVisualIcon; color: string };
}

import {
  Award,
  Blocks,
  BriefcaseBusiness,
  Code2,
  Database,
  Figma,
  Github,
  GraduationCap,
  LayoutDashboard,
  Network,
  Rocket,
  Server,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Users,
} from "lucide-react";

export const profile = {
  name: "Lasindu Tharumitha",
  role: "BEng (Hons) Software Engineering Graduate",
  headline:
    "I build modern web applications, enterprise systems, and innovative software solutions.",
  title:
    "BEng (Hons) Software Engineering | Full Stack Developer | IT Enthusiast",
  location: "Matara, Sri Lanka",
  email: "thelasindutharumitha@gmail.com",
  phone: "+94 76 426 7166",
  education: "BEng (Hons) in Software Engineering",
  institution: "London Metropolitan University",
  githubUsername: "TheLasinduTharumithe",
};

export const navItems = [
  "About",
  "Skills",
  "Projects",
  "Recruiter",
  "Experience",
  "Education",
  "GitHub",
  "Contact",
];

export const socialLinks = [
  {
    label: "GitHub",
    href: `https://github.com/${profile.githubUsername}`,
    icon: Github,
  },
  {
    label: "Email",
    href: `mailto:${profile.email}`,
    icon: Sparkles,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/lasindu-tharumitha-270337386",
    icon: BriefcaseBusiness,
  },
];

export const stats = [
  { label: "Years of study", value: 2, suffix: "+" },
  { label: "Project count", value: 12, suffix: "+" },
  { label: "Technologies learned", value: 28, suffix: "+" },
  { label: "GitHub contributions", value: 250, suffix: "+" },
];

export const skillGroups = [
  {
    title: "Frontend",
    icon: LayoutDashboard,
    accent: "cyan",
    skills: [
      ["HTML5", 94],
      ["CSS3", 91],
      ["JavaScript", 88],
      ["TypeScript", 84],
      ["React", 86],
      ["Next.js", 83],
      ["Tailwind CSS", 90],
      ["Bootstrap", 78],
    ],
  },
  {
    title: "Backend",
    icon: Server,
    accent: "emerald",
    skills: [
      ["Node.js", 82],
      ["Express.js", 78],
      ["ASP.NET MVC", 76],
      ["C#", 80],
    ],
  },
  {
    title: "Databases",
    icon: Database,
    accent: "amber",
    skills: [
      ["MySQL", 84],
      ["SQL Server", 81],
      ["Firebase", 82],
      ["Firestore", 79],
    ],
  },
  {
    title: "Languages",
    icon: Code2,
    accent: "rose",
    skills: [
      ["Java", 82],
      ["C#", 80],
      ["JavaScript", 88],
      ["TypeScript", 84],
      ["Python", 74],
      ["SQL", 82],
    ],
  },
  {
    title: "Tools",
    icon: TerminalSquare,
    accent: "violet",
    skills: [
      ["Git", 84],
      ["GitHub", 82],
      ["VS Code", 92],
      ["Visual Studio", 80],
      ["Cisco Packet Tracer", 78],
      ["Figma", 75],
      ["Postman", 77],
    ],
  },
  {
    title: "Networking",
    icon: Network,
    accent: "cyan",
    skills: [
      ["VLANs", 78],
      ["VPN", 74],
      ["TCP/IP", 82],
      ["Routing", 76],
      ["Switching", 76],
      ["Network Security", 73],
    ],
  },
] as const;

export const projects = [
  {
    title: "EcoPlate",
    subtitle: "Food Donation Management Platform",
    category: "Full Stack",
    icon: Rocket,
    stack: ["Next.js", "TypeScript", "Firebase"],
    features: [
      "Role-based authentication",
      "Food donation management",
      "Real-time notifications",
      "Analytics dashboard",
      "Modern UI",
    ],
  },
  {
    title: "IslandLink Sales Distribution Network",
    subtitle: "Distribution and logistics control system",
    category: "Full Stack",
    icon: LayoutDashboard,
    stack: ["Next.js", "Firebase"],
    features: [
      "Order management",
      "Delivery tracking",
      "Inventory management",
      "Multi-role system",
      "Logistics dashboard",
    ],
  },
  {
    title: "GreenLife Organic Store",
    subtitle: "Desktop retail management system",
    category: "Desktop",
    icon: Database,
    stack: ["C#", "WinForms", "SQL Server"],
    features: [
      "Inventory management",
      "Customer management",
      "Sales processing",
      "Reports generation",
    ],
  },
  {
    title: "University Management System",
    subtitle: "Academic administration platform",
    category: "Enterprise",
    icon: GraduationCap,
    stack: ["ASP.NET MVC", "SQL Server"],
    features: [
      "Student management",
      "Lecturer management",
      "Course management",
      "Assignment tracking",
    ],
  },
  {
    title: "BlueScope Network Infrastructure Design",
    subtitle: "Enterprise networking simulation",
    category: "Networking",
    icon: Network,
    stack: ["Cisco Packet Tracer", "VLAN", "VPN"],
    features: [
      "Network architecture",
      "VLAN implementation",
      "VPN connectivity",
      "Cisco Packet Tracer simulation",
      "Enterprise networking",
    ],
  },
];

export const timeline = [
  {
    title: "Software Engineering Student",
    detail:
      "Building strong foundations in software engineering, secure systems, databases, web development, and networking.",
  },
  {
    title: "Full Stack Development Projects",
    detail:
      "Creating production-minded applications with Next.js, TypeScript, Firebase, ASP.NET MVC, and SQL-backed workflows.",
  },
  {
    title: "Networking Projects",
    detail:
      "Designing VLAN, VPN, routing, switching, and enterprise infrastructure simulations with Cisco Packet Tracer.",
  },
  {
    title: "Database Projects",
    detail:
      "Modeling normalized schemas, reports, inventory flows, and CRUD-heavy systems across MySQL, SQL Server, and Firestore.",
  },
  {
    title: "Freelance Learning Journey",
    detail:
      "Practicing client-minded delivery through UI polish, documentation, communication, and iterative improvement.",
  },
];

export const modules = [
  "Programming",
  "Database Design",
  "Networking",
  "Security",
  "Software Development",
  "Web Development",
];

export const educationHistory = [
  {
    period: "2025 Sep — 2026 Sep",
    qualification: "BEng (Hons) Software Engineering",
    institution: "London Metropolitan University",
    location: "United Kingdom",
    status: "Graduated with First Class Honours",
    logo: "london-met",
    accent: "terracotta",
  },
  {
    period: "2024 Feb — 2025 Sep",
    qualification: "Higher National Diploma (HND) in Computing",
    institution: "Pearson",
    location: "United Kingdom",
    status: "Completed",
    logo: "pearson",
    accent: "sage",
  },
] as const;

export const certificates = [
  "Full Stack Development",
  "Database Systems",
  "Network Infrastructure",
  "Software Engineering",
];

export const achievements = [
  {
    title: "Academic Projects",
    icon: GraduationCap,
    detail: "Delivered structured coursework projects with clear documentation and practical engineering decisions.",
  },
  {
    title: "Software Development Projects",
    icon: Code2,
    detail: "Built web, desktop, and enterprise-style systems across multiple technology stacks.",
  },
  {
    title: "Networking Projects",
    icon: Network,
    detail: "Designed secure, segmented, and scalable networks using simulation-first planning.",
  },
  {
    title: "Team Collaborations",
    icon: Users,
    detail: "Contributed to shared planning, communication, issue solving, and delivery responsibilities.",
  },
];

export const services = [
  { title: "Web Development", icon: LayoutDashboard },
  { title: "Full Stack Development", icon: Blocks },
  { title: "Database Design", icon: Database },
  { title: "UI/UX Design", icon: Figma },
  { title: "Software Development", icon: Code2 },
  { title: "Networking Solutions", icon: ShieldCheck },
];

export const testimonials = [
  {
    name: "Academic Mentor",
    role: "Computing Lecturer",
    quote:
      "Lasindu approaches coursework with curiosity, discipline, and a practical mindset for solving real technical problems.",
  },
  {
    name: "Project Collaborator",
    role: "Student Team Member",
    quote:
      "He communicates clearly, takes ownership of complex pieces, and keeps the team moving toward polished results.",
  },
  {
    name: "Future Client",
    role: "Placeholder",
    quote:
      "A professional space reserved for a client or internship testimonial as Lasindu's experience grows.",
  },
];

export const githubFallbackRepos = [
  {
    name: "EcoPlate",
    description: "Food donation platform with Firebase-backed workflows.",
    language: "TypeScript",
    stars: 0,
    url: `https://github.com/${profile.githubUsername}`,
  },
  {
    name: "IslandLink",
    description: "Sales distribution network and logistics dashboard.",
    language: "TypeScript",
    stars: 0,
    url: `https://github.com/${profile.githubUsername}`,
  },
  {
    name: "GreenLife Organic Store",
    description: "C# desktop inventory and sales management system.",
    language: "C#",
    stars: 0,
    url: `https://github.com/${profile.githubUsername}`,
  },
];

export const awardsIcon = Award;

import {
  Blocks,
  Bot,
  Braces,
  Chrome,
  Code2,
  Container,
  Database,
  FileText,
  Figma,
  GitBranch,
  Github,
  Layers3,
  ListChecks,
  MousePointer2,
  NotebookTabs,
  PenTool,
  Search,
  Server,
  Send,
  Terminal,
  Triangle,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react"

export type TechStackItem = {
  name: string
  color: string
  icon: LucideIcon
}

export const skillItems: TechStackItem[] = [
  { name: "React", color: "#61dafb", icon: Blocks },
  { name: "Next.js", color: "#ffffff", icon: Triangle },
  { name: "TypeScript", color: "#3178c6", icon: Braces },
  { name: "Tailwind CSS", color: "#38bdf8", icon: Wind },
  { name: "CSS", color: "#663399", icon: Code2 },
  { name: "Motion.dev", color: "#facc15", icon: Zap },
  { name: "Sanity CMS", color: "#f03e2f", icon: Layers3 },
  { name: "Figma", color: "#a259ff", icon: Figma },
  { name: "Notion", color: "#f5f5f5", icon: NotebookTabs },
  { name: "Markdown", color: "#ffffff", icon: FileText },
  { name: "Node.js", color: "#68a063", icon: Server },
  { name: "Express.js", color: "#f5f5f5", icon: PenTool },
  { name: "Redis", color: "#dc382d", icon: Database },
]

export const toolItems: TechStackItem[] = [
  { name: "Cursor", color: "#ffffff", icon: MousePointer2 },
  { name: "VS Code", color: "#007acc", icon: Code2 },
  { name: "GitHub", color: "#ffffff", icon: Github },
  { name: "Git", color: "#f05032", icon: GitBranch },
  { name: "Docker", color: "#2496ed", icon: Container },
  { name: "Postman", color: "#ff6c37", icon: Send },
  { name: "Vercel", color: "#ffffff", icon: Triangle },
  { name: "Terminal", color: "#7ddf64", icon: Terminal },
  { name: "Chrome", color: "#fbbc05", icon: Chrome },
  { name: "Figma", color: "#a259ff", icon: Figma },
  { name: "Notion", color: "#f5f5f5", icon: NotebookTabs },
  { name: "Obsidian", color: "#7c3aed", icon: FileText },
  { name: "ChatGPT", color: "#10a37f", icon: Bot },
  { name: "Linear", color: "#5e6ad2", icon: ListChecks },
  { name: "Raycast", color: "#ff6363", icon: Search },
]

export type TechStackItemGroup = "skill" | "tool"

export type TechStackSeedItem = {
  slug: string
  name: string
  color: string
  icon: string
  group: TechStackItemGroup
  sortOrder: number
  status: "draft" | "published"
}

export const techStackSeedItems: TechStackSeedItem[] = [
  { slug: "react", name: "React", color: "#61dafb", icon: "https://cdn.simpleicons.org/react", group: "skill", sortOrder: 0, status: "published" },
  { slug: "next-js", name: "Next.js", color: "#ffffff", icon: "https://cdn.simpleicons.org/nextdotjs", group: "skill", sortOrder: 10, status: "published" },
  { slug: "typescript", name: "TypeScript", color: "#3178c6", icon: "https://cdn.simpleicons.org/typescript", group: "skill", sortOrder: 20, status: "published" },
  { slug: "tailwind-css", name: "Tailwind CSS", color: "#38bdf8", icon: "https://cdn.simpleicons.org/tailwindcss", group: "skill", sortOrder: 30, status: "published" },
  { slug: "css", name: "CSS", color: "#663399", icon: "https://cdn.simpleicons.org/css", group: "skill", sortOrder: 40, status: "published" },
  { slug: "motion-dev", name: "Motion.dev", color: "#facc15", icon: "https://cdn.simpleicons.org/framer", group: "skill", sortOrder: 50, status: "published" },
  { slug: "sanity-cms", name: "Sanity CMS", color: "#f03e2f", icon: "https://cdn.simpleicons.org/sanity", group: "skill", sortOrder: 60, status: "published" },
  { slug: "figma-skill", name: "Figma", color: "#a259ff", icon: "https://cdn.simpleicons.org/figma", group: "skill", sortOrder: 70, status: "published" },
  { slug: "notion-skill", name: "Notion", color: "#f5f5f5", icon: "https://cdn.simpleicons.org/notion", group: "skill", sortOrder: 80, status: "published" },
  { slug: "markdown", name: "Markdown", color: "#ffffff", icon: "https://cdn.simpleicons.org/markdown", group: "skill", sortOrder: 90, status: "published" },
  { slug: "node-js", name: "Node.js", color: "#68a063", icon: "https://cdn.simpleicons.org/nodedotjs", group: "skill", sortOrder: 100, status: "published" },
  { slug: "express-js", name: "Express.js", color: "#f5f5f5", icon: "https://cdn.simpleicons.org/express", group: "skill", sortOrder: 110, status: "published" },
  { slug: "redis", name: "Redis", color: "#dc382d", icon: "https://cdn.simpleicons.org/redis", group: "skill", sortOrder: 120, status: "published" },
  { slug: "cursor", name: "Cursor", color: "#ffffff", icon: "https://cdn.simpleicons.org/cursor", group: "tool", sortOrder: 0, status: "published" },
  { slug: "vs-code", name: "VS Code", color: "#007acc", icon: "https://cdn.simpleicons.org/vscodium", group: "tool", sortOrder: 10, status: "published" },
  { slug: "github", name: "GitHub", color: "#ffffff", icon: "https://cdn.simpleicons.org/github", group: "tool", sortOrder: 20, status: "published" },
  { slug: "git", name: "Git", color: "#f05032", icon: "https://cdn.simpleicons.org/git", group: "tool", sortOrder: 30, status: "published" },
  { slug: "docker", name: "Docker", color: "#2496ed", icon: "https://cdn.simpleicons.org/docker", group: "tool", sortOrder: 40, status: "published" },
  { slug: "postman", name: "Postman", color: "#ff6c37", icon: "https://cdn.simpleicons.org/postman", group: "tool", sortOrder: 50, status: "published" },
  { slug: "vercel", name: "Vercel", color: "#ffffff", icon: "https://cdn.simpleicons.org/vercel", group: "tool", sortOrder: 60, status: "published" },
  { slug: "terminal", name: "Terminal", color: "#7ddf64", icon: "https://cdn.simpleicons.org/iterm2", group: "tool", sortOrder: 70, status: "published" },
  { slug: "chrome", name: "Chrome", color: "#fbbc05", icon: "https://cdn.simpleicons.org/googlechrome", group: "tool", sortOrder: 80, status: "published" },
  { slug: "figma-tool", name: "Figma", color: "#a259ff", icon: "https://cdn.simpleicons.org/figma", group: "tool", sortOrder: 90, status: "published" },
  { slug: "notion-tool", name: "Notion", color: "#f5f5f5", icon: "https://cdn.simpleicons.org/notion", group: "tool", sortOrder: 100, status: "published" },
  { slug: "obsidian", name: "Obsidian", color: "#7c3aed", icon: "https://cdn.simpleicons.org/obsidian", group: "tool", sortOrder: 110, status: "published" },
  { slug: "chatgpt", name: "ChatGPT", color: "#10a37f", icon: "https://cdn.simpleicons.org/openaigym", group: "tool", sortOrder: 120, status: "published" },
  { slug: "linear", name: "Linear", color: "#5e6ad2", icon: "https://cdn.simpleicons.org/linear", group: "tool", sortOrder: 130, status: "published" },
  { slug: "raycast", name: "Raycast", color: "#ff6363", icon: "https://cdn.simpleicons.org/raycast", group: "tool", sortOrder: 140, status: "published" },
]

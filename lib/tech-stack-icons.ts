import { resolveMediaUrl } from "./media"

const legacyTechStackIconUrls: Record<string, string> = {
  blocks: "https://cdn.simpleicons.org/react",
  bot: "https://cdn.simpleicons.org/openaigym",
  braces: "https://cdn.simpleicons.org/typescript",
  chrome: "https://cdn.simpleicons.org/googlechrome",
  code2: "https://cdn.simpleicons.org/vscodium",
  container: "https://cdn.simpleicons.org/docker",
  database: "https://cdn.simpleicons.org/redis",
  fileText: "https://cdn.simpleicons.org/markdown",
  figma: "https://cdn.simpleicons.org/figma",
  gitBranch: "https://cdn.simpleicons.org/git",
  github: "https://cdn.simpleicons.org/github",
  layers3: "https://cdn.simpleicons.org/sanity",
  listChecks: "https://cdn.simpleicons.org/linear",
  mousePointer2: "https://cdn.simpleicons.org/cursor",
  notebookTabs: "https://cdn.simpleicons.org/notion",
  penTool: "https://cdn.simpleicons.org/express",
  search: "https://cdn.simpleicons.org/raycast",
  send: "https://cdn.simpleicons.org/postman",
  server: "https://cdn.simpleicons.org/nodedotjs",
  terminal: "https://cdn.simpleicons.org/iterm2",
  triangle: "https://cdn.simpleicons.org/vercel",
  wind: "https://cdn.simpleicons.org/tailwindcss",
  zap: "https://cdn.simpleicons.org/framer",
}

export function resolveTechStackIconUrl(value: string | null | undefined) {
  const icon = resolveMediaUrl(value)

  return legacyTechStackIconUrls[icon] || icon
}

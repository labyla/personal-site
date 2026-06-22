export type ExperienceItemSettings = {
  slug: string
  company: string
  role: string
  period: string
  description: string
  sortOrder: number
  status: "draft" | "published"
}

export const experienceSeedItems: ExperienceItemSettings[] = [
  {
    slug: "independent-full-stack-developer",
    company: "Independent",
    role: "Full Stack Developer",
    period: "2024 - Present",
    description:
      "Building CMS-backed websites, product interfaces, and fast frontend systems for small teams and founders.",
    sortOrder: 0,
    status: "published",
  },
  {
    slug: "product-teams-frontend-engineer",
    company: "Product Teams",
    role: "Frontend Engineer",
    period: "2022 - 2024",
    description:
      "Shipped responsive interfaces, polished interaction patterns, and production-ready React experiences.",
    sortOrder: 10,
    status: "published",
  },
  {
    slug: "client-builds-web-developer",
    company: "Client Builds",
    role: "Web Developer",
    period: "2020 - 2022",
    description:
      "Turned early ideas into usable websites with clear structure, practical tooling, and maintainable UI.",
    sortOrder: 20,
    status: "published",
  },
]

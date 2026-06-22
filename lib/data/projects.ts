import config from "@payload-config"
import { getPayload } from "payload"

import { resolveMediaUrl } from "@/lib/media"

import { projectSeedItems } from "./project-seed"

export type ProjectListItem = {
  id: string
  slug: string
  title: string
  description: string
  image: string
  tags: string[]
  gradient: string
  href: string
}

export type ProjectDetail = {
  id: string
  slug: string
  title: string
  description: string
  excerpt: string
  content: string | null
  imageUrl: string
  tags: string[]
  publishedAt: string | null
  metaTitle: string
  metaDescription: string
  canonicalUrl: string | null
  externalUrl: string | null
}

const projectGradients = [
  "from-purple-500/20 to-pink-500/20",
  "from-blue-500/20 to-cyan-500/20",
  "from-green-500/20 to-emerald-500/20",
  "from-pink-500/20 to-rose-500/20",
  "from-orange-500/20 to-amber-500/20",
]

const fallbackProjects: ProjectListItem[] = projectSeedItems.map((project, index) => ({
  id: `fallback-${project.slug}`,
  slug: project.slug,
  title: project.title,
  description: project.description,
    image: resolveMediaUrl(project.imageUrl),
  tags: project.tags,
  gradient: projectGradients[index % projectGradients.length],
  href: `/projects/${project.slug}`,
}))

type PayloadProject = {
  id: number | string
  slug?: string | null
  title?: string | null
  description?: string | null
  excerpt?: string | null
  content?: string | null
  imageUrl?: string | null
  tags?: Array<{
    label?: string | null
  }> | null
  href?: string | null
  externalUrl?: string | null
  publishedAt?: string | null
  metaTitle?: string | null
  metaDescription?: string | null
  canonicalUrl?: string | null
  sortOrder?: number | null
  createdAt?: string | null
}

function mapProject(project: PayloadProject, index: number): ProjectListItem {
  const tags = project.tags
    ?.map((tag) => tag.label)
    .filter((label): label is string => Boolean(label)) || []

  return {
    id: String(project.id),
    slug: project.slug || "",
    title: project.title || "",
    description: project.description || "",
    image: resolveMediaUrl(project.imageUrl),
    tags,
    gradient: projectGradients[index % projectGradients.length],
    href: project.slug ? `/projects/${project.slug}` : project.href || "#",
  }
}

function mapProjectDetail(project: PayloadProject): ProjectDetail {
  const tags = project.tags
    ?.map((tag) => tag.label)
    .filter((label): label is string => Boolean(label)) || []

  return {
    id: String(project.id),
    slug: project.slug || "",
    title: project.title || "",
    description: project.description || "",
    excerpt: project.excerpt || project.description || "",
    content: project.content || null,
    imageUrl: resolveMediaUrl(project.imageUrl),
    tags,
    publishedAt: project.publishedAt || null,
    metaTitle: project.metaTitle || project.title || "",
    metaDescription: project.metaDescription || project.excerpt || project.description || "",
    canonicalUrl: project.canonicalUrl || null,
    externalUrl: project.externalUrl || null,
  }
}

function sortProjects(projects: PayloadProject[]) {
  return projects.toSorted((a, b) => {
    const sortOrder = (a.sortOrder ?? 0) - (b.sortOrder ?? 0)

    if (sortOrder !== 0) {
      return sortOrder
    }

    const createdAt = (a.createdAt || "").localeCompare(b.createdAt || "")

    if (createdAt !== 0) {
      return createdAt
    }

    return (a.title || "").localeCompare(b.title || "")
  })
}

export async function getProjects(): Promise<ProjectListItem[]> {
  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: "projects",
      depth: 0,
      limit: 50,
      overrideAccess: true,
      sort: "sortOrder",
      where: {
        status: {
          equals: "published",
        },
      },
    })

    return sortProjects(result.docs as PayloadProject[]).map(mapProject)
  } catch (error) {
    console.warn("Falling back to static projects because Payload data is unavailable.", error)

    return fallbackProjects
  }
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: "projects",
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: {
        and: [
          {
            slug: {
              equals: slug,
            },
          },
          {
            status: {
              equals: "published",
            },
          },
        ],
      },
    })

    const project = result.docs[0] as PayloadProject | undefined

    return project ? mapProjectDetail(project) : null
  } catch (error) {
    console.warn(`Project "${slug}" is unavailable because Payload data could not be loaded.`, error)

    return null
  }
}

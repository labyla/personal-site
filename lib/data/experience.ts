import config from "@payload-config"
import { getPayload } from "payload"

import { experienceSeedItems } from "./experience-seed"

export type ExperienceListItem = {
  id: string
  company: string
  role: string
  period: string
  description: string
}

type PayloadExperienceItem = {
  id: number | string
  company?: string | null
  role?: string | null
  period?: string | null
  description?: string | null
  sortOrder?: number | null
  createdAt?: string | null
}

const fallbackExperienceItems: ExperienceListItem[] = experienceSeedItems.map((item) => ({
  id: `fallback-${item.slug}`,
  company: item.company,
  role: item.role,
  period: item.period,
  description: item.description,
}))

function mapExperienceItem(item: PayloadExperienceItem): ExperienceListItem {
  return {
    id: String(item.id),
    company: item.company || "",
    role: item.role || "",
    period: item.period || "",
    description: item.description || "",
  }
}

function sortExperienceItems(items: PayloadExperienceItem[]) {
  return items.toSorted((a, b) => {
    const sortOrder = (a.sortOrder ?? 0) - (b.sortOrder ?? 0)

    if (sortOrder !== 0) {
      return sortOrder
    }

    const createdAt = (a.createdAt || "").localeCompare(b.createdAt || "")

    if (createdAt !== 0) {
      return createdAt
    }

    return (a.role || "").localeCompare(b.role || "")
  })
}

export async function getExperienceItems(): Promise<ExperienceListItem[]> {
  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: "experience-items",
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

    return sortExperienceItems(result.docs as PayloadExperienceItem[]).map(mapExperienceItem)
  } catch (error) {
    console.warn(
      "Falling back to static experience items because Payload data is unavailable.",
      error,
    )

    return fallbackExperienceItems
  }
}

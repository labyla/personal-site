import config from "@payload-config"
import { getPayload } from "payload"

import {
  techStackSeedItems,
  type TechStackItemGroup,
} from "./tech-stack-seed"
import { resolveTechStackIconUrl } from "../tech-stack-icons"

export type TechStackListItem = {
  id: string
  name: string
  color: string
  icon: string
}

export type TechStackGroups = {
  skills: TechStackListItem[]
  tools: TechStackListItem[]
}

type PayloadTechStackItem = {
  id: number | string
  name?: string | null
  color?: string | null
  icon?: string | null
  group?: TechStackItemGroup | null
  sortOrder?: number | null
  createdAt?: string | null
}

const fallbackTechStackItems: PayloadTechStackItem[] = techStackSeedItems.map((item) => ({
  id: `fallback-${item.slug}`,
  name: item.name,
  color: item.color,
  icon: item.icon,
  group: item.group,
  sortOrder: item.sortOrder,
}))

function mapTechStackItem(item: PayloadTechStackItem): TechStackListItem {
  return {
    id: String(item.id),
    name: item.name || "",
    color: item.color || "#ffffff",
    icon: resolveTechStackIconUrl(item.icon),
  }
}

function sortTechStackItems(items: PayloadTechStackItem[]) {
  return items.toSorted((a, b) => {
    const sortOrder = (a.sortOrder ?? 0) - (b.sortOrder ?? 0)

    if (sortOrder !== 0) {
      return sortOrder
    }

    const createdAt = (a.createdAt || "").localeCompare(b.createdAt || "")

    if (createdAt !== 0) {
      return createdAt
    }

    return (a.name || "").localeCompare(b.name || "")
  })
}

function groupTechStackItems(items: PayloadTechStackItem[]): TechStackGroups {
  const sortedItems = sortTechStackItems(items)

  return {
    skills: sortedItems
      .filter((item) => item.group === "skill")
      .map(mapTechStackItem),
    tools: sortedItems
      .filter((item) => item.group === "tool")
      .map(mapTechStackItem),
  }
}

export async function getTechStackItems(): Promise<TechStackGroups> {
  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: "tech-stack-items",
      depth: 0,
      limit: 100,
      overrideAccess: true,
      sort: "sortOrder",
      where: {
        status: {
          equals: "published",
        },
      },
    })

    return groupTechStackItems(result.docs as PayloadTechStackItem[])
  } catch (error) {
    console.warn(
      "Falling back to static tech stack items because Payload data is unavailable.",
      error,
    )

    return groupTechStackItems(fallbackTechStackItems)
  }
}

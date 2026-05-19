import config from "@payload-config"
import { getPayload } from "payload"

import { testimonialSeedItems } from "./testimonial-seed"

export type TestimonialListItem = {
  id: string
  name: string
  role: string
  quote: string
  avatar: string
  rating: number
}

const fallbackTestimonials: TestimonialListItem[] = testimonialSeedItems.map((testimonial) => ({
  id: `fallback-${testimonial.slug}`,
  name: testimonial.name,
  role: testimonial.role,
  quote: testimonial.quote,
  avatar: testimonial.avatarUrl,
  rating: testimonial.rating,
}))

type PayloadTestimonial = {
  id: number | string
  name?: string | null
  role?: string | null
  quote?: string | null
  avatarUrl?: string | null
  rating?: number | null
  sortOrder?: number | null
  createdAt?: string | null
}

function mapTestimonial(testimonial: PayloadTestimonial): TestimonialListItem {
  return {
    id: String(testimonial.id),
    name: testimonial.name || "",
    role: testimonial.role || "",
    quote: testimonial.quote || "",
    avatar: testimonial.avatarUrl || "",
    rating: testimonial.rating || 5,
  }
}

function sortTestimonials(testimonials: PayloadTestimonial[]) {
  return testimonials.toSorted((a, b) => {
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

export async function getTestimonials(): Promise<TestimonialListItem[]> {
  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: "testimonials",
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

    if (result.docs.length === 0) {
      return fallbackTestimonials
    }

    return sortTestimonials(result.docs as PayloadTestimonial[]).map(mapTestimonial)
  } catch (error) {
    console.warn("Falling back to static testimonials because Payload data is unavailable.", error)

    return fallbackTestimonials
  }
}

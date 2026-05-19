import { getPayload, type SanitizedConfig } from "payload"

import { testimonialSeedItems } from "../lib/data/testimonial-seed.ts"

export const script = async (config: SanitizedConfig) => {
  const payload = await getPayload({ config })

  try {
    let createdCount = 0
    let skippedCount = 0

    for (const testimonial of testimonialSeedItems) {
      const existingTestimonial = await payload.find({
        collection: "testimonials",
        depth: 0,
        limit: 1,
        overrideAccess: true,
        where: {
          slug: {
            equals: testimonial.slug,
          },
        },
      })

      if (existingTestimonial.docs.length > 0) {
        skippedCount += 1
        continue
      }

      await payload.create({
        collection: "testimonials",
        data: testimonial,
        overrideAccess: true,
      })

      createdCount += 1
    }

    process.stdout.write(
      `Seeded testimonials: ${createdCount} created, ${skippedCount} skipped.\n`,
    )
  } finally {
    await payload.destroy()
  }
}

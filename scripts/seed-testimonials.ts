import { getPayload, type SanitizedConfig } from "payload"

import { seedTestimonials } from "../lib/payload/bootstrap-content.ts"

export const script = async (config: SanitizedConfig) => {
  const payload = await getPayload({ config })

  try {
    const result = await seedTestimonials(payload)

    process.stdout.write(
      `Seeded testimonials: ${result.created} created, ${result.skipped} skipped.\n`,
    )
  } finally {
    await payload.destroy()
  }
}

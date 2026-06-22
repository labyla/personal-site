import { getPayload, type SanitizedConfig } from "payload"

import { seedExperienceItems } from "../lib/payload/bootstrap-content.ts"

export const script = async (config: SanitizedConfig) => {
  const payload = await getPayload({ config })

  try {
    const result = await seedExperienceItems(payload)

    process.stdout.write(
      `Seeded experience items: ${result.created} created, ${result.skipped} skipped.\n`,
    )
  } finally {
    await payload.destroy()
  }
}

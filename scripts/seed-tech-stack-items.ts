import { getPayload, type SanitizedConfig } from "payload"

import { seedTechStackItems } from "../lib/payload/bootstrap-content.ts"

export const script = async (config: SanitizedConfig) => {
  const payload = await getPayload({ config })

  try {
    const result = await seedTechStackItems(payload)

    process.stdout.write(
      `Seeded tech stack items: ${result.created} created, ${result.skipped} skipped.\n`,
    )
  } finally {
    await payload.destroy()
  }
}

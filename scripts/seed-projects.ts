import { getPayload, type SanitizedConfig } from "payload"

import { seedProjects } from "../lib/payload/bootstrap-content.ts"

export const script = async (config: SanitizedConfig) => {
  const payload = await getPayload({ config })

  try {
    const result = await seedProjects(payload)

    process.stdout.write(
      `Seeded projects: ${result.created} created, ${result.skipped} skipped.\n`,
    )
  } finally {
    await payload.destroy()
  }
}

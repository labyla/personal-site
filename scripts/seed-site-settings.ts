import { getPayload, type SanitizedConfig } from "payload"

import { seedSiteSettings } from "../lib/payload/bootstrap-content.ts"

export const script = async (config: SanitizedConfig) => {
  const payload = await getPayload({ config })

  try {
    await seedSiteSettings(payload)

    process.stdout.write("Seeded missing site settings.\n")
  } finally {
    await payload.destroy()
  }
}

import { getPayload, type SanitizedConfig } from "payload"

import { seedPosts } from "../lib/payload/bootstrap-content.ts"

export const script = async (config: SanitizedConfig) => {
  const payload = await getPayload({ config })

  try {
    const result = await seedPosts(payload)

    process.stdout.write(
      `Seeded posts: ${result.created} created, ${result.skipped} skipped.\n`,
    )
  } finally {
    await payload.destroy()
  }
}

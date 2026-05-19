import { getPayload, type SanitizedConfig } from "payload"

import { postSeedItems } from "../lib/data/post-seed.ts"

export const script = async (config: SanitizedConfig) => {
  const payload = await getPayload({ config })

  try {
    let createdCount = 0
    let skippedCount = 0

    for (const post of postSeedItems) {
      const existingPost = await payload.find({
        collection: "posts",
        depth: 0,
        limit: 1,
        overrideAccess: true,
        where: {
          slug: {
            equals: post.slug,
          },
        },
      })

      if (existingPost.docs.length > 0) {
        skippedCount += 1
        continue
      }

      await payload.create({
        collection: "posts",
        data: post,
        overrideAccess: true,
      })

      createdCount += 1
    }

    process.stdout.write(
      `Seeded posts: ${createdCount} created, ${skippedCount} skipped.\n`,
    )
  } finally {
    await payload.destroy()
  }
}

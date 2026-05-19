import { getPayload, type SanitizedConfig } from "payload"

import { projectSeedItems } from "../lib/data/project-seed.ts"

export const script = async (config: SanitizedConfig) => {
  const payload = await getPayload({ config })

  try {
    let createdCount = 0
    let skippedCount = 0

    for (const project of projectSeedItems) {
      const existingProject = await payload.find({
        collection: "projects",
        depth: 0,
        limit: 1,
        overrideAccess: true,
        where: {
          slug: {
            equals: project.slug,
          },
        },
      })

      if (existingProject.docs.length > 0) {
        skippedCount += 1
        continue
      }

      await payload.create({
        collection: "projects",
        data: {
          ...project,
          tags: project.tags.map((label) => ({ label })),
        },
        overrideAccess: true,
      })

      createdCount += 1
    }

    process.stdout.write(
      `Seeded projects: ${createdCount} created, ${skippedCount} skipped.\n`,
    )
  } finally {
    await payload.destroy()
  }
}

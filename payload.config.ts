import { postgresAdapter } from "@payloadcms/db-postgres"
import path from "path"
import { buildConfig } from "payload"
import { fileURLToPath } from "url"

import { ContactSubmissions } from "./collections/ContactSubmissions.ts"
import { ExperienceItems } from "./collections/ExperienceItems.ts"
import { Media } from "./collections/Media.ts"
import { Posts } from "./collections/Posts.ts"
import { Projects } from "./collections/Projects.ts"
import { TechStackItems } from "./collections/TechStackItems.ts"
import { Testimonials } from "./collections/Testimonials.ts"
import { Users } from "./collections/Users.ts"
import { SiteSettings } from "./globals/SiteSettings.ts"
import { bootstrapInitialContent } from "./lib/payload/bootstrap-content.ts"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isPayloadCliCommand = process.argv.some((arg) => arg.includes("payload"))

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: path.resolve(
        dirname,
        "app",
        "(payload)",
        "admin",
        "importMap.js",
      ),
    },
    user: Users.slug,
  },
  bin: [
    {
      key: "seed:projects",
      scriptPath: path.resolve(dirname, "scripts", "seed-projects.ts"),
    },
    {
      key: "seed:posts",
      scriptPath: path.resolve(dirname, "scripts", "seed-posts.ts"),
    },
    {
      key: "seed:testimonials",
      scriptPath: path.resolve(dirname, "scripts", "seed-testimonials.ts"),
    },
    {
      key: "seed:experience-items",
      scriptPath: path.resolve(dirname, "scripts", "seed-experience-items.ts"),
    },
    {
      key: "seed:tech-stack-items",
      scriptPath: path.resolve(dirname, "scripts", "seed-tech-stack-items.ts"),
    },
    {
      key: "seed:site-settings",
      scriptPath: path.resolve(dirname, "scripts", "seed-site-settings.ts"),
    },
  ],
  collections: [
    Users,
    Media,
    Projects,
    Posts,
    Testimonials,
    ExperienceItems,
    TechStackItems,
    ContactSubmissions,
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
    push: process.env.PAYLOAD_DB_PUSH === "true",
  }),
  onInit: async (payload) => {
    if (isPayloadCliCommand || process.env.PAYLOAD_BOOTSTRAP_CONTENT === "false") {
      return
    }

    try {
      await payload.db.initializing
      await bootstrapInitialContent(payload)
      payload.logger.info("Bootstrapped initial CMS content.")
    } catch (error) {
      payload.logger.warn({
        err: error,
        msg: "Initial CMS content bootstrap skipped.",
      })
    }
  },
  secret: process.env.PAYLOAD_SECRET || "",
  globals: [SiteSettings],
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
})

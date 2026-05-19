import { postgresAdapter } from "@payloadcms/db-postgres"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import path from "path"
import { buildConfig } from "payload"
import { fileURLToPath } from "url"

import { ContactSubmissions } from "./collections/ContactSubmissions.ts"
import { Posts } from "./collections/Posts.ts"
import { Projects } from "./collections/Projects.ts"
import { Testimonials } from "./collections/Testimonials.ts"
import { Users } from "./collections/Users.ts"
import { SiteSettings } from "./globals/SiteSettings.ts"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

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
      key: "seed:site-settings",
      scriptPath: path.resolve(dirname, "scripts", "seed-site-settings.ts"),
    },
  ],
  collections: [Users, Projects, Posts, Testimonials, ContactSubmissions],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || "",
  globals: [SiteSettings],
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
})

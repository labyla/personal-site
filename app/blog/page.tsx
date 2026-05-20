import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { PublicSiteShell } from "@/components/public-site-shell"
import { getPosts } from "@/lib/data/posts"
import { getFooter, getHeader } from "@/lib/data/site-settings"

export const revalidate = 60

export default async function BlogPage() {
  const [header, footer, posts] = await Promise.all([
    getHeader(),
    getFooter(),
    getPosts(),
  ])

  return (
    <PublicSiteShell>
      <Header header={header} />

      <section className="px-4 pb-20 pt-32 md:pb-28">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/#blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>

          <div className="mb-14 mt-10 border-t border-border pt-8">
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              ARTICLES
            </p>
            <h1 className="max-w-4xl text-[clamp(3.25rem,9vw,8rem)] font-bold uppercase leading-[0.88] tracking-normal">
              All articles
            </h1>
            <p className="mt-8 max-w-2xl border-l border-border pl-5 leading-8 text-muted-foreground">
              Notes on building, shipping, tools, and the details that make web
              products feel better.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {posts.map((post, index) => (
              <Link
                key={post.id}
                href={post.href}
                className="group flex h-full min-h-72 flex-col overflow-hidden border border-border bg-card/70 p-5 transition-colors hover:border-accent/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="mb-8 flex items-center justify-between gap-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span className="h-px flex-1 bg-border" />
                  {post.readTime && <span>{post.readTime}</span>}
                </div>

                {post.image && (
                  <div aria-hidden="true" className="mb-6 overflow-hidden border border-border">
                    <div className="relative aspect-video">
                      <Image
                        src={post.image}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover opacity-90 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-background/18" />
                    </div>
                  </div>
                )}

                <h2 className="mb-4 text-2xl font-bold uppercase leading-none transition-colors group-hover:text-accent md:text-3xl">
                  {post.title}
                </h2>
                <p className="mb-8 line-clamp-3 text-sm leading-7 text-muted-foreground">
                  {post.excerpt}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-border pt-4 text-xs uppercase tracking-wider text-muted-foreground">
                  <span>{post.date || "Article"}</span>
                  <span className="inline-flex items-center gap-1 text-foreground transition-colors group-hover:text-accent">
                    Read
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer footer={footer} />
    </PublicSiteShell>
  )
}

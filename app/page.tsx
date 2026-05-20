import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { TechMarquee } from "@/components/tech-marquee"
import { BentoGrid } from "@/components/bento-grid"
import { Projects } from "@/components/projects"
import { Blog } from "@/components/blog"
import { About } from "@/components/about"
import { Testimonials } from "@/components/testimonials"
import { Experiments } from "@/components/experiments"
import { CTA } from "@/components/cta"
import { ContactForm } from "@/components/contact-form"
import { Footer } from "@/components/footer"
import { PublicSiteShell } from "@/components/public-site-shell"
import { getPosts } from "@/lib/data/posts"
import { getProjects } from "@/lib/data/projects"
import { getAbout, getCta, getFooter, getHeader, getHero } from "@/lib/data/site-settings"
import { getTestimonials } from "@/lib/data/testimonials"

export const revalidate = 60

export default async function Home() {
  const header = await getHeader()
  const hero = await getHero()
  const about = await getAbout()
  const cta = await getCta()
  const footer = await getFooter()
  const posts = await getPosts()
  const projects = await getProjects()
  const testimonials = await getTestimonials()

  return (
    <PublicSiteShell>
      <Header header={header} />
      <Hero hero={hero} />
      <TechMarquee />
      <BentoGrid />
      <Projects projects={projects} />
      <Blog posts={posts} />
      <About about={about} />
      <Testimonials testimonials={testimonials} />
      <Experiments />
      <CTA cta={cta} />
      <ContactForm />
      <Footer footer={footer} />
    </PublicSiteShell>
  )
}

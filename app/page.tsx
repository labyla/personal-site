import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { TechMarquee } from "@/components/tech-marquee"
import { BentoGrid } from "@/components/bento-grid"
import { Experience } from "@/components/experience"
import { Projects } from "@/components/projects"
import { Blog } from "@/components/blog"
import { About } from "@/components/about"
import { Testimonials } from "@/components/testimonials"
import { Experiments } from "@/components/experiments"
import { CTA } from "@/components/cta"
import { ContactForm } from "@/components/contact-form"
import { Footer } from "@/components/footer"
import { PublicSiteShell } from "@/components/public-site-shell"
import { getExperienceItems } from "@/lib/data/experience"
import { getPosts } from "@/lib/data/posts"
import { getProjects } from "@/lib/data/projects"
import {
  getAbout,
  getBento,
  getContact,
  getCta,
  getExperience,
  getFooter,
  getHeader,
  getHero,
  getHomeBlog,
  getHomeProjects,
  getTechStack,
  getTestimonialsSection,
} from "@/lib/data/site-settings"
import { getTechStackItems } from "@/lib/data/tech-stack"
import { getTestimonials } from "@/lib/data/testimonials"

export const revalidate = 60

export default async function Home() {
  const header = await getHeader()
  const hero = await getHero()
  const about = await getAbout()
  const bento = await getBento()
  const contact = await getContact()
  const cta = await getCta()
  const experienceSection = await getExperience()
  const experienceItems = await getExperienceItems()
  const footer = await getFooter()
  const homeBlog = await getHomeBlog()
  const homeProjects = await getHomeProjects()
  const posts = await getPosts()
  const projects = await getProjects()
  const techStack = await getTechStack()
  const techStackItems = await getTechStackItems()
  const testimonials = await getTestimonials()
  const testimonialsSection = await getTestimonialsSection()

  return (
    <PublicSiteShell>
      <Header header={header} />
      <Hero hero={hero} />
      <TechMarquee skills={techStackItems.skills} tools={techStackItems.tools} />
      <BentoGrid bento={bento} />
      <Experience items={experienceItems} section={experienceSection} />
      <Projects projects={projects} section={homeProjects} />
      <Blog posts={posts} section={homeBlog} />
      <About about={about} />
      <Testimonials section={testimonialsSection} testimonials={testimonials} />
      <Experiments
        skills={techStackItems.skills}
        techStack={techStack}
        tools={techStackItems.tools}
      />
      <CTA cta={cta} />
      <ContactForm contact={contact} />
      <Footer footer={footer} />
    </PublicSiteShell>
  )
}

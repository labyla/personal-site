import config from "@payload-config"
import { getPayload } from "payload"

import { resolveMediaUrl } from "@/lib/media"

import {
  aboutSeed,
  bentoSeed,
  blogPageSeed,
  contactSeed,
  ctaSeed,
  experienceSeed,
  footerSeed,
  headerSeed,
  heroSeed,
  homeBlogSeed,
  homeProjectsSeed,
  projectsPageSeed,
  techStackSeed,
  testimonialsSectionSeed,
  type AboutSettings,
  type ArchivePageSettings,
  type BentoSettings,
  type ContactSettings,
  type CtaSettings,
  type ExperienceSettings,
  type FooterSettings,
  type HeaderSettings,
  type HeroSettings,
  type HomeBlogSettings,
  type HomeProjectsSettings,
  type TechStackSettings,
  type TestimonialsSectionSettings,
} from "./site-settings-seed"

type PayloadSiteSettings = {
  about?: Partial<Omit<AboutSettings, "paragraphs">> & {
    paragraphs?: Array<{ text?: string | null }> | null
  } | null
  bento?: Partial<Omit<BentoSettings, "stackTags">> & {
    stackTags?: Array<{ label?: string | null }> | null
  } | null
  blogPage?: Partial<ArchivePageSettings> | null
  contact?: Partial<ContactSettings> | null
  cta?: Partial<CtaSettings> | null
  experience?: Partial<ExperienceSettings> | null
  footer?: Partial<FooterSettings> | null
  header?: Partial<HeaderSettings> | null
  hero?: Partial<HeroSettings> | null
  homeBlog?: Partial<HomeBlogSettings> | null
  homeProjects?: Partial<HomeProjectsSettings> | null
  projectsPage?: Partial<ArchivePageSettings> | null
  techStack?: Partial<TechStackSettings> | null
  testimonialsSection?: Partial<TestimonialsSectionSettings> | null
}

function normalizeHero(hero: Partial<HeroSettings> | null | undefined): HeroSettings {
  const normalized = {
    ...heroSeed,
    ...hero,
  }

  return {
    ...normalized,
    avatarUrl: resolveMediaUrl(normalized.avatarUrl),
  }
}

function normalizeAbout(
  about: PayloadSiteSettings["about"] | null | undefined,
): AboutSettings {
  const normalized = {
    ...aboutSeed,
    ...about,
    paragraphs: about?.paragraphs
      ?.map((paragraph) => paragraph.text)
      .filter((text): text is string => Boolean(text)) || aboutSeed.paragraphs,
    socialLinks: about?.socialLinks || aboutSeed.socialLinks,
  }

  return {
    ...normalized,
    imageUrl: resolveMediaUrl(normalized.imageUrl),
  }
}

function normalizeBento(bento: PayloadSiteSettings["bento"] | null | undefined): BentoSettings {
  return {
    ...bentoSeed,
    ...bento,
    stackTags: bento?.stackTags
      ?.map((tag) => tag.label)
      .filter((label): label is string => Boolean(label)) || bentoSeed.stackTags,
  }
}

function normalizeExperience(experience: Partial<ExperienceSettings> | null | undefined): ExperienceSettings {
  return {
    ...experienceSeed,
    ...experience,
  }
}

function normalizeHomeProjects(
  homeProjects: Partial<HomeProjectsSettings> | null | undefined,
): HomeProjectsSettings {
  return {
    ...homeProjectsSeed,
    ...homeProjects,
  }
}

function normalizeHomeBlog(
  homeBlog: Partial<HomeBlogSettings> | null | undefined,
): HomeBlogSettings {
  return {
    ...homeBlogSeed,
    ...homeBlog,
  }
}

function normalizeTestimonialsSection(
  testimonialsSection: Partial<TestimonialsSectionSettings> | null | undefined,
): TestimonialsSectionSettings {
  return {
    ...testimonialsSectionSeed,
    ...testimonialsSection,
  }
}

function normalizeTechStack(
  techStack: Partial<TechStackSettings> | null | undefined,
): TechStackSettings {
  return {
    ...techStackSeed,
    ...techStack,
  }
}

function normalizeContact(
  contact: Partial<ContactSettings> | null | undefined,
): ContactSettings {
  return {
    ...contactSeed,
    ...contact,
  }
}

function normalizeArchivePage(
  page: Partial<ArchivePageSettings> | null | undefined,
  seed: ArchivePageSettings,
): ArchivePageSettings {
  return {
    ...seed,
    ...page,
  }
}

function normalizeCta(cta: Partial<CtaSettings> | null | undefined): CtaSettings {
  return {
    ...ctaSeed,
    ...cta,
  }
}

function normalizeFooter(footer: Partial<FooterSettings> | null | undefined): FooterSettings {
  return {
    ...footerSeed,
    ...footer,
    mainLinks: footer?.mainLinks?.length ? footer.mainLinks : footerSeed.mainLinks,
    workLinks: footer?.workLinks?.length ? footer.workLinks : footerSeed.workLinks,
    socialLinks: footer?.socialLinks?.length ? footer.socialLinks : footerSeed.socialLinks,
  }
}

function normalizeHeader(header: Partial<HeaderSettings> | null | undefined): HeaderSettings {
  return {
    ...headerSeed,
    ...header,
    navLinks: header?.navLinks?.length ? header.navLinks : headerSeed.navLinks,
  }
}

export async function getHero(): Promise<HeroSettings> {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({
      slug: "site-settings",
      depth: 0,
      overrideAccess: true,
    }) as PayloadSiteSettings

    return normalizeHero(settings.hero)
  } catch (error) {
    console.warn("Falling back to static hero settings because Payload data is unavailable.", error)

    return heroSeed
  }
}

export async function getHeader(): Promise<HeaderSettings> {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({
      slug: "site-settings",
      depth: 0,
      overrideAccess: true,
    }) as PayloadSiteSettings

    return normalizeHeader(settings.header)
  } catch (error) {
    console.warn("Falling back to static header settings because Payload data is unavailable.", error)

    return headerSeed
  }
}

export async function getFooter(): Promise<FooterSettings> {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({
      slug: "site-settings",
      depth: 0,
      overrideAccess: true,
    }) as PayloadSiteSettings

    return normalizeFooter(settings.footer)
  } catch (error) {
    console.warn("Falling back to static footer settings because Payload data is unavailable.", error)

    return footerSeed
  }
}

export async function getCta(): Promise<CtaSettings> {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({
      slug: "site-settings",
      depth: 0,
      overrideAccess: true,
    }) as PayloadSiteSettings

    return normalizeCta(settings.cta)
  } catch (error) {
    console.warn("Falling back to static CTA settings because Payload data is unavailable.", error)

    return ctaSeed
  }
}

export async function getAbout(): Promise<AboutSettings> {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({
      slug: "site-settings",
      depth: 0,
      overrideAccess: true,
    }) as PayloadSiteSettings

    return normalizeAbout(settings.about)
  } catch (error) {
    console.warn("Falling back to static about settings because Payload data is unavailable.", error)

    return aboutSeed
  }
}

export async function getBento(): Promise<BentoSettings> {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({
      slug: "site-settings",
      depth: 0,
      overrideAccess: true,
    }) as PayloadSiteSettings

    return normalizeBento(settings.bento)
  } catch (error) {
    console.warn("Falling back to static bento settings because Payload data is unavailable.", error)

    return bentoSeed
  }
}

export async function getExperience(): Promise<ExperienceSettings> {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({
      slug: "site-settings",
      depth: 0,
      overrideAccess: true,
    }) as PayloadSiteSettings

    return normalizeExperience(settings.experience)
  } catch (error) {
    console.warn(
      "Falling back to static experience settings because Payload data is unavailable.",
      error,
    )

    return experienceSeed
  }
}

export async function getHomeProjects(): Promise<HomeProjectsSettings> {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({
      slug: "site-settings",
      depth: 0,
      overrideAccess: true,
    }) as PayloadSiteSettings

    return normalizeHomeProjects(settings.homeProjects)
  } catch (error) {
    console.warn(
      "Falling back to static home projects settings because Payload data is unavailable.",
      error,
    )

    return homeProjectsSeed
  }
}

export async function getHomeBlog(): Promise<HomeBlogSettings> {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({
      slug: "site-settings",
      depth: 0,
      overrideAccess: true,
    }) as PayloadSiteSettings

    return normalizeHomeBlog(settings.homeBlog)
  } catch (error) {
    console.warn(
      "Falling back to static home blog settings because Payload data is unavailable.",
      error,
    )

    return homeBlogSeed
  }
}

export async function getTestimonialsSection(): Promise<TestimonialsSectionSettings> {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({
      slug: "site-settings",
      depth: 0,
      overrideAccess: true,
    }) as PayloadSiteSettings

    return normalizeTestimonialsSection(settings.testimonialsSection)
  } catch (error) {
    console.warn(
      "Falling back to static testimonials section settings because Payload data is unavailable.",
      error,
    )

    return testimonialsSectionSeed
  }
}

export async function getTechStack(): Promise<TechStackSettings> {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({
      slug: "site-settings",
      depth: 0,
      overrideAccess: true,
    }) as PayloadSiteSettings

    return normalizeTechStack(settings.techStack)
  } catch (error) {
    console.warn(
      "Falling back to static tech stack settings because Payload data is unavailable.",
      error,
    )

    return techStackSeed
  }
}

export async function getContact(): Promise<ContactSettings> {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({
      slug: "site-settings",
      depth: 0,
      overrideAccess: true,
    }) as PayloadSiteSettings

    return normalizeContact(settings.contact)
  } catch (error) {
    console.warn("Falling back to static contact settings because Payload data is unavailable.", error)

    return contactSeed
  }
}

export async function getProjectsPage(): Promise<ArchivePageSettings> {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({
      slug: "site-settings",
      depth: 0,
      overrideAccess: true,
    }) as PayloadSiteSettings

    return normalizeArchivePage(settings.projectsPage, projectsPageSeed)
  } catch (error) {
    console.warn(
      "Falling back to static projects page settings because Payload data is unavailable.",
      error,
    )

    return projectsPageSeed
  }
}

export async function getBlogPage(): Promise<ArchivePageSettings> {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({
      slug: "site-settings",
      depth: 0,
      overrideAccess: true,
    }) as PayloadSiteSettings

    return normalizeArchivePage(settings.blogPage, blogPageSeed)
  } catch (error) {
    console.warn(
      "Falling back to static blog page settings because Payload data is unavailable.",
      error,
    )

    return blogPageSeed
  }
}

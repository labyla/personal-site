import type { Payload } from "payload"

import { experienceSeedItems } from "../data/experience-seed.ts"
import { postSeedItems } from "../data/post-seed.ts"
import { projectSeedItems } from "../data/project-seed.ts"
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
} from "../data/site-settings-seed.ts"
import { techStackSeedItems } from "../data/tech-stack-seed.ts"
import { testimonialSeedItems } from "../data/testimonial-seed.ts"

type SeedResult = {
  created: number
  skipped: number
}

type CurrentSiteSettings = {
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

function fillMissingValue<T>(currentValue: T | null | undefined, seedValue: T): T {
  if (Array.isArray(currentValue)) {
    return (currentValue.length > 0 ? currentValue : seedValue) as T
  }

  return currentValue ?? seedValue
}

function mergeHero(currentHero: CurrentSiteSettings["hero"]): HeroSettings {
  return Object.fromEntries(
    Object.entries(heroSeed).map(([key, seedValue]) => [
      key,
      fillMissingValue(currentHero?.[key as keyof HeroSettings], seedValue),
    ]),
  ) as HeroSettings
}

function mergeBento(currentBento: CurrentSiteSettings["bento"]) {
  const currentStackTags = currentBento?.stackTags
    ?.map((tag) => tag.label)
    .filter((label): label is string => Boolean(label))

  return {
    buildEyebrow: fillMissingValue(currentBento?.buildEyebrow, bentoSeed.buildEyebrow),
    buildText: fillMissingValue(currentBento?.buildText, bentoSeed.buildText),
    buildHref: fillMissingValue(currentBento?.buildHref, bentoSeed.buildHref),
    stackEyebrow: fillMissingValue(currentBento?.stackEyebrow, bentoSeed.stackEyebrow),
    stackText: fillMissingValue(currentBento?.stackText, bentoSeed.stackText),
    stackHref: fillMissingValue(currentBento?.stackHref, bentoSeed.stackHref),
    stackTags: fillMissingValue(currentStackTags, bentoSeed.stackTags).map((label) => ({
      label,
    })),
    projectsEyebrow: fillMissingValue(currentBento?.projectsEyebrow, bentoSeed.projectsEyebrow),
    projectsValue: fillMissingValue(currentBento?.projectsValue, bentoSeed.projectsValue),
    projectsText: fillMissingValue(currentBento?.projectsText, bentoSeed.projectsText),
    workflowEyebrow: fillMissingValue(currentBento?.workflowEyebrow, bentoSeed.workflowEyebrow),
    workflowText: fillMissingValue(currentBento?.workflowText, bentoSeed.workflowText),
    workflowHref: fillMissingValue(currentBento?.workflowHref, bentoSeed.workflowHref),
    experienceEyebrow: fillMissingValue(
      currentBento?.experienceEyebrow,
      bentoSeed.experienceEyebrow,
    ),
    experienceValue: fillMissingValue(currentBento?.experienceValue, bentoSeed.experienceValue),
  }
}

function mergeExperience(currentExperience: CurrentSiteSettings["experience"]): ExperienceSettings {
  return {
    eyebrow: fillMissingValue(currentExperience?.eyebrow, experienceSeed.eyebrow),
    title: fillMissingValue(currentExperience?.title, experienceSeed.title),
  }
}

function mergeHomeProjects(
  currentHomeProjects: CurrentSiteSettings["homeProjects"],
): HomeProjectsSettings {
  return Object.fromEntries(
    Object.entries(homeProjectsSeed).map(([key, seedValue]) => [
      key,
      fillMissingValue(currentHomeProjects?.[key as keyof HomeProjectsSettings], seedValue),
    ]),
  ) as HomeProjectsSettings
}

function mergeHomeBlog(currentHomeBlog: CurrentSiteSettings["homeBlog"]): HomeBlogSettings {
  return Object.fromEntries(
    Object.entries(homeBlogSeed).map(([key, seedValue]) => [
      key,
      fillMissingValue(currentHomeBlog?.[key as keyof HomeBlogSettings], seedValue),
    ]),
  ) as HomeBlogSettings
}

function mergeTestimonialsSection(
  currentTestimonialsSection: CurrentSiteSettings["testimonialsSection"],
): TestimonialsSectionSettings {
  return Object.fromEntries(
    Object.entries(testimonialsSectionSeed).map(([key, seedValue]) => [
      key,
      fillMissingValue(
        currentTestimonialsSection?.[key as keyof TestimonialsSectionSettings],
        seedValue,
      ),
    ]),
  ) as TestimonialsSectionSettings
}

function mergeTechStack(currentTechStack: CurrentSiteSettings["techStack"]): TechStackSettings {
  return Object.fromEntries(
    Object.entries(techStackSeed).map(([key, seedValue]) => [
      key,
      fillMissingValue(currentTechStack?.[key as keyof TechStackSettings], seedValue),
    ]),
  ) as TechStackSettings
}

function mergeContact(currentContact: CurrentSiteSettings["contact"]): ContactSettings {
  return Object.fromEntries(
    Object.entries(contactSeed).map(([key, seedValue]) => [
      key,
      fillMissingValue(currentContact?.[key as keyof ContactSettings], seedValue),
    ]),
  ) as ContactSettings
}

function mergeArchivePage(
  currentPage: CurrentSiteSettings["projectsPage"] | CurrentSiteSettings["blogPage"],
  seed: ArchivePageSettings,
): ArchivePageSettings {
  return Object.fromEntries(
    Object.entries(seed).map(([key, seedValue]) => [
      key,
      fillMissingValue(currentPage?.[key as keyof ArchivePageSettings], seedValue),
    ]),
  ) as ArchivePageSettings
}

function mergeAbout(currentAbout: CurrentSiteSettings["about"]) {
  const currentParagraphs = currentAbout?.paragraphs
    ?.map((paragraph) => paragraph.text)
    .filter((text): text is string => Boolean(text))

  return {
    eyebrow: fillMissingValue(currentAbout?.eyebrow, aboutSeed.eyebrow),
    titlePrefix: fillMissingValue(currentAbout?.titlePrefix, aboutSeed.titlePrefix),
    titleMuted: fillMissingValue(currentAbout?.titleMuted, aboutSeed.titleMuted),
    paragraphs: fillMissingValue(currentParagraphs, aboutSeed.paragraphs).map((text) => ({
      text,
    })),
    imageUrl: fillMissingValue(currentAbout?.imageUrl, aboutSeed.imageUrl),
    imageAlt: fillMissingValue(currentAbout?.imageAlt, aboutSeed.imageAlt),
    socialLinks: fillMissingValue(currentAbout?.socialLinks, aboutSeed.socialLinks),
  }
}

function mergeCta(currentCta: CurrentSiteSettings["cta"]): CtaSettings {
  return Object.fromEntries(
    Object.entries(ctaSeed).map(([key, seedValue]) => [
      key,
      fillMissingValue(currentCta?.[key as keyof CtaSettings], seedValue),
    ]),
  ) as CtaSettings
}

function mergeFooter(currentFooter: CurrentSiteSettings["footer"]): FooterSettings {
  return {
    brandInitial: fillMissingValue(currentFooter?.brandInitial, footerSeed.brandInitial),
    brandName: fillMissingValue(currentFooter?.brandName, footerSeed.brandName),
    description: fillMissingValue(currentFooter?.description, footerSeed.description),
    copyrightName: fillMissingValue(currentFooter?.copyrightName, footerSeed.copyrightName),
    mainLinks: fillMissingValue(currentFooter?.mainLinks, footerSeed.mainLinks),
    workLinks: fillMissingValue(currentFooter?.workLinks, footerSeed.workLinks),
    socialLinks: fillMissingValue(currentFooter?.socialLinks, footerSeed.socialLinks),
  }
}

function mergeHeader(currentHeader: CurrentSiteSettings["header"]): HeaderSettings {
  return {
    logoText: fillMissingValue(currentHeader?.logoText, headerSeed.logoText),
    navLinks: fillMissingValue(currentHeader?.navLinks, headerSeed.navLinks),
    ctaLabel: fillMissingValue(currentHeader?.ctaLabel, headerSeed.ctaLabel),
    ctaHref: fillMissingValue(currentHeader?.ctaHref, headerSeed.ctaHref),
  }
}

export async function seedProjects(payload: Payload): Promise<SeedResult> {
  let created = 0
  let skipped = 0

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
      skipped += 1
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

    created += 1
  }

  return { created, skipped }
}

export async function seedPosts(payload: Payload): Promise<SeedResult> {
  let created = 0
  let skipped = 0

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
      skipped += 1
      continue
    }

    await payload.create({
      collection: "posts",
      data: post,
      overrideAccess: true,
    })

    created += 1
  }

  return { created, skipped }
}

export async function seedTestimonials(payload: Payload): Promise<SeedResult> {
  let created = 0
  let skipped = 0

  for (const testimonial of testimonialSeedItems) {
    const existingTestimonial = await payload.find({
      collection: "testimonials",
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: {
        slug: {
          equals: testimonial.slug,
        },
      },
    })

    if (existingTestimonial.docs.length > 0) {
      skipped += 1
      continue
    }

    await payload.create({
      collection: "testimonials",
      data: testimonial,
      overrideAccess: true,
    })

    created += 1
  }

  return { created, skipped }
}

export async function seedExperienceItems(payload: Payload): Promise<SeedResult> {
  let created = 0
  let skipped = 0

  for (const item of experienceSeedItems) {
    const existingItem = await payload.find({
      collection: "experience-items",
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: {
        slug: {
          equals: item.slug,
        },
      },
    })

    if (existingItem.docs.length > 0) {
      skipped += 1
      continue
    }

    await payload.create({
      collection: "experience-items",
      data: item,
      overrideAccess: true,
    })

    created += 1
  }

  return { created, skipped }
}

export async function seedTechStackItems(payload: Payload): Promise<SeedResult> {
  let created = 0
  let skipped = 0

  for (const item of techStackSeedItems) {
    const existingItem = await payload.find({
      collection: "tech-stack-items",
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: {
        slug: {
          equals: item.slug,
        },
      },
    })

    if (existingItem.docs.length > 0) {
      skipped += 1
      continue
    }

    await payload.create({
      collection: "tech-stack-items",
      data: item,
      overrideAccess: true,
    })

    created += 1
  }

  return { created, skipped }
}

export async function seedSiteSettings(payload: Payload) {
  const currentSettings = await payload.findGlobal({
    slug: "site-settings",
    depth: 0,
    overrideAccess: true,
  }) as CurrentSiteSettings

  await payload.updateGlobal({
    slug: "site-settings",
    data: {
      header: mergeHeader(currentSettings.header),
      hero: mergeHero(currentSettings.hero),
      bento: mergeBento(currentSettings.bento),
      experience: mergeExperience(currentSettings.experience),
      homeProjects: mergeHomeProjects(currentSettings.homeProjects),
      homeBlog: mergeHomeBlog(currentSettings.homeBlog),
      about: mergeAbout(currentSettings.about),
      testimonialsSection: mergeTestimonialsSection(currentSettings.testimonialsSection),
      techStack: mergeTechStack(currentSettings.techStack),
      cta: mergeCta(currentSettings.cta),
      contact: mergeContact(currentSettings.contact),
      footer: mergeFooter(currentSettings.footer),
      projectsPage: mergeArchivePage(currentSettings.projectsPage, projectsPageSeed),
      blogPage: mergeArchivePage(currentSettings.blogPage, blogPageSeed),
    },
    overrideAccess: true,
  })
}

export async function bootstrapInitialContent(payload: Payload) {
  await seedSiteSettings(payload)
  await seedProjects(payload)
  await seedPosts(payload)
  await seedTestimonials(payload)
  await seedExperienceItems(payload)
  await seedTechStackItems(payload)
}

import config from "@payload-config"
import { getPayload } from "payload"

import {
  aboutSeed,
  ctaSeed,
  footerSeed,
  headerSeed,
  heroSeed,
  type AboutSettings,
  type CtaSettings,
  type FooterSettings,
  type HeaderSettings,
  type HeroSettings,
} from "./site-settings-seed"

type PayloadSiteSettings = {
  about?: Partial<Omit<AboutSettings, "paragraphs">> & {
    paragraphs?: Array<{ text?: string | null }> | null
  } | null
  cta?: Partial<CtaSettings> | null
  footer?: Partial<FooterSettings> | null
  header?: Partial<HeaderSettings> | null
  hero?: Partial<HeroSettings> | null
}

function normalizeHero(hero: Partial<HeroSettings> | null | undefined): HeroSettings {
  return {
    ...heroSeed,
    ...hero,
  }
}

function normalizeAbout(
  about: PayloadSiteSettings["about"] | null | undefined,
): AboutSettings {
  return {
    ...aboutSeed,
    ...about,
    paragraphs: about?.paragraphs
      ?.map((paragraph) => paragraph.text)
      .filter((text): text is string => Boolean(text)) || aboutSeed.paragraphs,
    socialLinks: about?.socialLinks || aboutSeed.socialLinks,
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

import { getPayload, type SanitizedConfig } from "payload"

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
} from "../lib/data/site-settings-seed.ts"

type CurrentSiteSettings = {
  about?: Partial<Omit<AboutSettings, "paragraphs">> & {
    paragraphs?: Array<{ text?: string | null }> | null
  } | null
  cta?: Partial<CtaSettings> | null
  footer?: Partial<FooterSettings> | null
  header?: Partial<HeaderSettings> | null
  hero?: Partial<HeroSettings> | null
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

export const script = async (config: SanitizedConfig) => {
  const payload = await getPayload({ config })

  try {
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
        about: mergeAbout(currentSettings.about),
        cta: mergeCta(currentSettings.cta),
        footer: mergeFooter(currentSettings.footer),
      },
      overrideAccess: true,
    })

    process.stdout.write("Seeded missing site settings.\n")
  } finally {
    await payload.destroy()
  }
}

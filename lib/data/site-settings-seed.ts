export type HeaderLink = {
  label: string
  href: string
}

export type HeaderSettings = {
  logoText: string
  navLinks: HeaderLink[]
  ctaLabel: string
  ctaHref: string
}

export const headerSeed: HeaderSettings = {
  logoText: "A",
  navLinks: [
    {
      label: "Home",
      href: "#home",
    },
    {
      label: "About",
      href: "#about",
    },
    {
      label: "Work",
      href: "#work",
    },
    {
      label: "Blog",
      href: "#blog",
    },
    {
      label: "Contact",
      href: "#contact",
    },
  ],
  ctaLabel: "Book a Call",
  ctaHref: "#contact",
}

export type HeroSettings = {
  badgeLabel: string
  badgeText: string
  badgeHref: string
  availabilityLabel: string
  headlinePrefix: string
  headlineAccent: string
  headlineSuffix: string
  headlineSubline: string
  introPrefix: string
  name: string
  role: string
  email: string
  avatarUrl: string
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel: string
  secondaryCtaHref: string
  focusLabel: string
  focusText: string
}

export const heroSeed: HeroSettings = {
  badgeLabel: "New",
  badgeText: "Keythm — feel every keystroke",
  badgeHref: "#work",
  availabilityLabel: "Available for selected builds",
  headlinePrefix: "Code that ",
  headlineAccent: "feels",
  headlineSuffix: " designed.",
  headlineSubline: "Engineering that actually ships.",
  introPrefix: "Hello, I'm",
  name: "Aayush Bharti",
  role: "a Full Stack Developer",
  email: "hello@aayushbharti.in",
  avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  primaryCtaLabel: "Let's Connect",
  primaryCtaHref: "#contact",
  secondaryCtaLabel: "hello@aayushbharti.in",
  secondaryCtaHref: "mailto:hello@aayushbharti.in",
  focusLabel: "Focus",
  focusText:
    "Frontend systems, product interfaces, motion-light interaction, and CMS-backed sites that stay clean after launch.",
}

export type BentoSettings = {
  buildEyebrow: string
  buildText: string
  buildHref: string
  stackEyebrow: string
  stackText: string
  stackHref: string
  stackTags: string[]
  projectsEyebrow: string
  projectsValue: string
  projectsText: string
  workflowEyebrow: string
  workflowText: string
  workflowHref: string
  experienceEyebrow: string
  experienceValue: string
}

export const bentoSeed: BentoSettings = {
  buildEyebrow: "LET'S BUILD TOGETHER",
  buildText: "Clear communication, fast iterations, no surprises",
  buildHref: "#contact",
  stackEyebrow: "THE STACK",
  stackText: "What you see, pixel-perfect UI, elegance in motion.",
  stackHref: "#tools",
  stackTags: ["React", "Next.js", "TypeScript"],
  projectsEyebrow: "PROJECTS",
  projectsValue: "20+",
  projectsText: "Globally shipped",
  workflowEyebrow: "WORKFLOW",
  workflowText: "Check out my favorite tools",
  workflowHref: "#tools",
  experienceEyebrow: "EXPERIENCE",
  experienceValue: "4+ Years",
}

export type ExperienceSettings = {
  eyebrow: string
  title: string
}

export const experienceSeed: ExperienceSettings = {
  eyebrow: "MY EXPERIENCE",
  title: "Scroll through the build record.",
}

export type HomeProjectsSettings = {
  eyebrow: string
  title: string
  archiveCtaLabel: string
  archiveCtaHref: string
}

export const homeProjectsSeed: HomeProjectsSettings = {
  eyebrow: "FEATURED PROJECTS",
  title: "Selected work, built to hold up.",
  archiveCtaLabel: "See more projects",
  archiveCtaHref: "/projects",
}

export type HomeBlogSettings = {
  eyebrow: string
  title: string
  description: string
  archiveCtaLabel: string
  archiveCtaHref: string
}

export const homeBlogSeed: HomeBlogSettings = {
  eyebrow: "LATEST ARTICLES",
  title: "Notes from the build floor.",
  description:
    "Short reads on frontend craft, product clarity, and the practical details behind durable interfaces.",
  archiveCtaLabel: "Read more articles",
  archiveCtaHref: "/blog",
}

export type TestimonialsSectionSettings = {
  eyebrow: string
  title: string
}

export const testimonialsSectionSeed: TestimonialsSectionSettings = {
  eyebrow: "TESTIMONIALS",
  title: "Word on the street",
}

export type TechStackSettings = {
  eyebrow: string
  title: string
  description: string
  skillsEyebrow: string
  skillsTitle: string
  toolsEyebrow: string
  toolsTitle: string
}

export const techStackSeed: TechStackSettings = {
  eyebrow: "STACK",
  title: "Tech stack",
  description: "The languages, frameworks, and daily tools I use to build and ship.",
  skillsEyebrow: "01",
  skillsTitle: "Skills",
  toolsEyebrow: "02",
  toolsTitle: "Tools",
}

export type ContactSettings = {
  eyebrow: string
  title: string
  description: string
  submitLabel: string
}

export const contactSeed: ContactSettings = {
  eyebrow: "CONTACT",
  title: "Let's make something useful.",
  description:
    "Tell me what you are building, what feels stuck, or where you need another pair of hands. I'll get back to you as soon as I can.",
  submitLabel: "Send message",
}

export type ArchivePageSettings = {
  backLabel: string
  backHref: string
  eyebrow: string
  title: string
  description: string
  footerCtaLabel: string
  footerCtaHref: string
}

export const projectsPageSeed: ArchivePageSettings = {
  backLabel: "Back home",
  backHref: "/#work",
  eyebrow: "PROJECTS",
  title: "All projects",
  description: "A closer look at selected product, engineering, and interface work.",
  footerCtaLabel: "Back to selected work",
  footerCtaHref: "/#work",
}

export const blogPageSeed: ArchivePageSettings = {
  backLabel: "Back home",
  backHref: "/#blog",
  eyebrow: "ARTICLES",
  title: "All articles",
  description:
    "Notes on building, shipping, tools, and the details that make web products feel better.",
  footerCtaLabel: "Back to latest articles",
  footerCtaHref: "/#blog",
}

export type SocialPlatform = "github" | "twitter" | "linkedin" | "instagram"

export type AboutSettings = {
  eyebrow: string
  titlePrefix: string
  titleMuted: string
  paragraphs: string[]
  imageUrl: string
  imageAlt: string
  socialLinks: Array<{
    platform: SocialPlatform
    label: string
    href: string
  }>
}

export const aboutSeed: AboutSettings = {
  eyebrow: "HELLO AGAIN",
  titlePrefix: "Full-Stack Developer and",
  titleMuted: "a little bit of",
  paragraphs: [
    "Hi, Aayush Bharti. A versatile full stack developer passionate about creating dynamic and user-centric experiences. From frontend finesse to backend mastery, I bring a comprehensive skill set to every project.",
    "When I'm not immersed in work, I'm exploring new ideas and embracing continuous growth. Let's collaborate and create seamless solutions that make an impact.",
    "I believe in waking up each day eager to make a difference!",
  ],
  imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=face",
  imageAlt: "Aayush Bharti",
  socialLinks: [
    {
      platform: "github",
      href: "#",
      label: "GitHub",
    },
    {
      platform: "twitter",
      href: "#",
      label: "Twitter",
    },
    {
      platform: "linkedin",
      href: "#",
      label: "LinkedIn",
    },
    {
      platform: "instagram",
      href: "#",
      label: "Instagram",
    },
  ],
}

export type CtaSettings = {
  isEnabled: boolean
  avatarLetter: string
  titlePrefix: string
  titleAccent: string
  titleMiddle: string
  titleSuffix: string
  name: string
  availability: string
  description: string
  primaryCtaLabel: string
  primaryCtaHref: string
}

export const ctaSeed: CtaSettings = {
  isEnabled: true,
  avatarLetter: "A",
  titlePrefix: "FROM CONCEPT TO ",
  titleAccent: "CREATION",
  titleMiddle: "LET'S MAKE IT",
  titleSuffix: "HAPPEN!",
  name: "Aayush Bharti",
  availability: "I'm available for full-time roles & freelance projects.",
  description: "I develop outstanding, performant, web applications, and everything in between that helps solve problems.",
  primaryCtaLabel: "Let's Connect",
  primaryCtaHref: "#contact",
}

export type FooterSocialPlatform = SocialPlatform | "email"

export type FooterLink = {
  label: string
  href: string
}

export type FooterSocialLink = FooterLink & {
  platform: FooterSocialPlatform
}

export type FooterSettings = {
  brandInitial: string
  brandName: string
  description: string
  copyrightName: string
  mainLinks: FooterLink[]
  workLinks: FooterLink[]
  socialLinks: FooterSocialLink[]
}

export const footerSeed: FooterSettings = {
  brandInitial: "A",
  brandName: "Aayush",
  description: "Full Stack Developer crafting beautiful digital experiences.",
  copyrightName: "Aayush Bharti",
  mainLinks: [
    {
      label: "About",
      href: "#about",
    },
    {
      label: "Blog",
      href: "#blog",
    },
    {
      label: "Bookmarks",
      href: "#",
    },
    {
      label: "Colophon",
      href: "#",
    },
  ],
  workLinks: [
    {
      label: "Projects",
      href: "#work",
    },
    {
      label: "Services",
      href: "#",
    },
    {
      label: "Resume",
      href: "#",
    },
    {
      label: "Contact",
      href: "#contact",
    },
  ],
  socialLinks: [
    {
      platform: "email",
      label: "Email",
      href: "mailto:hello@aayushbharti.in",
    },
    {
      platform: "github",
      label: "GitHub",
      href: "#",
    },
    {
      platform: "twitter",
      label: "Twitter",
      href: "#",
    },
    {
      platform: "linkedin",
      label: "LinkedIn",
      href: "#",
    },
    {
      platform: "instagram",
      label: "Instagram",
      href: "#",
    },
  ],
}

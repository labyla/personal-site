import type { Field, GlobalConfig } from "payload"

import { canUpdateContent } from "../lib/payload/access.ts"

function createLinkFields(): Field[] {
  return [
    {
      name: "label",
      type: "text",
      admin: {
        description: "Visible link text.",
      },
    },
    {
      name: "href",
      type: "text",
      admin: {
        description:
          "Link target. Use /path for site pages, #section for homepage anchors, or a full URL.",
      },
    },
  ]
}

function createArchivePageFields(): Field[] {
  return [
    {
      name: "backLabel",
      type: "text",
      admin: {
        description: "Text for the small back link at the top of the archive page.",
      },
    },
    {
      name: "backHref",
      type: "text",
      admin: {
        description:
          "Target for the back link. Usually a homepage section such as /#work or /#blog.",
      },
    },
    {
      name: "eyebrow",
      type: "text",
      admin: {
        description: "Small uppercase label above the archive page title.",
      },
    },
    {
      name: "title",
      type: "text",
      admin: {
        description: "Main heading shown at the top of the archive page.",
      },
    },
    {
      name: "description",
      type: "textarea",
      admin: {
        description: "Short intro copy below the archive page heading.",
      },
    },
    {
      name: "footerCtaLabel",
      type: "text",
      admin: {
        description: "Text for the footer link shown after the archive list, where the page uses one.",
      },
    },
    {
      name: "footerCtaHref",
      type: "text",
      admin: {
        description: "Target for the archive footer link.",
      },
    },
  ]
}

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  access: {
    read: () => true,
    update: canUpdateContent,
  },
  admin: {
    group: "Content",
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Home Edit",
          fields: [
            {
              name: "header",
              type: "group",
              admin: {
                description: "Global site header: logo text, navigation links, and the header CTA.",
              },
              fields: [
                {
                  name: "logoText",
                  type: "text",
                  admin: {
                    description: "Short brand mark shown in the header.",
                  },
                },
                {
                  name: "navLinks",
                  type: "array",
                  admin: {
                    description: "Header navigation links shown across the site.",
                  },
                  fields: createLinkFields(),
                },
                {
                  name: "ctaLabel",
                  type: "text",
                  admin: {
                    description: "Visible text for the header call-to-action link.",
                  },
                },
                {
                  name: "ctaHref",
                  type: "text",
                  admin: {
                    description: "Target for the header call-to-action link.",
                  },
                },
              ],
            },
            {
              name: "hero",
              type: "group",
              admin: {
                description: "First screen of the homepage: badge, headline, profile, and main CTAs.",
              },
              fields: [
                {
                  name: "badgeLabel",
                  type: "text",
                  admin: {
                    description: "Short label in the small hero badge, such as New.",
                  },
                  required: true,
                },
                {
                  name: "badgeText",
                  type: "text",
                  admin: {
                    description: "Main text inside the hero badge.",
                  },
                  required: true,
                },
                {
                  name: "badgeHref",
                  type: "text",
                  admin: {
                    description: "Target opened when the hero badge is clicked.",
                  },
                  required: true,
                },
                {
                  name: "availabilityLabel",
                  type: "text",
                  admin: {
                    description: "Small availability line shown in the hero profile area.",
                  },
                },
                {
                  name: "headlinePrefix",
                  type: "text",
                  admin: {
                    description: "First part of the large hero headline before the accent word.",
                  },
                  required: true,
                },
                {
                  name: "headlineAccent",
                  type: "text",
                  admin: {
                    description: "Accent word in the large hero headline.",
                  },
                  required: true,
                },
                {
                  name: "headlineSuffix",
                  type: "text",
                  admin: {
                    description: "Text after the accent word in the large hero headline.",
                  },
                  required: true,
                },
                {
                  name: "headlineSubline",
                  type: "text",
                  admin: {
                    description: "Second line below the main hero headline.",
                  },
                  required: true,
                },
                {
                  name: "introPrefix",
                  type: "text",
                  admin: {
                    description: "Small intro before the name, such as Hello, I'm.",
                  },
                  required: true,
                },
                {
                  name: "name",
                  type: "text",
                  admin: {
                    description: "Name shown in the hero profile line.",
                  },
                  required: true,
                },
                {
                  name: "role",
                  type: "text",
                  admin: {
                    description: "Role shown after the name in the hero profile line.",
                  },
                  required: true,
                },
                {
                  name: "email",
                  type: "email",
                  admin: {
                    description: "Contact email displayed by the secondary hero CTA.",
                  },
                  required: true,
                },
                {
                  name: "avatarUrl",
                  type: "text",
                  admin: {
                    components: {
                      Field: "@/components/admin/local-media-field#default",
                    },
                    description:
                      "Public image URL for the small hero avatar. Use local: to choose from the local media library.",
                  },
                  required: true,
                },
                {
                  name: "primaryCtaLabel",
                  type: "text",
                  admin: {
                    description: "Visible text for the main hero button.",
                  },
                  required: true,
                },
                {
                  name: "primaryCtaHref",
                  type: "text",
                  admin: {
                    description: "Target for the main hero button.",
                  },
                  required: true,
                },
                {
                  name: "secondaryCtaLabel",
                  type: "text",
                  admin: {
                    description: "Visible text for the secondary hero link, usually the email.",
                  },
                  required: true,
                },
                {
                  name: "secondaryCtaHref",
                  type: "text",
                  admin: {
                    description: "Target for the secondary hero link, usually a mailto: URL.",
                  },
                  required: true,
                },
                {
                  name: "focusLabel",
                  type: "text",
                  admin: {
                    description: "Small label above the hero focus statement.",
                  },
                },
                {
                  name: "focusText",
                  type: "textarea",
                  admin: {
                    description: "Short statement explaining the kind of work highlighted in the hero.",
                  },
                },
              ],
            },
            {
              name: "bento",
              type: "group",
              admin: {
                description: "Compact homepage grid below the hero: build CTA, stack tags, stats, and workflow.",
              },
              fields: [
                {
                  name: "buildEyebrow",
                  type: "text",
                  admin: {
                    description: "Small label for the build CTA card.",
                  },
                },
                {
                  name: "buildText",
                  type: "textarea",
                  admin: {
                    description: "Main text in the build CTA card.",
                  },
                },
                {
                  name: "buildHref",
                  type: "text",
                  admin: {
                    description: "Target for the build CTA card.",
                  },
                },
                {
                  name: "stackEyebrow",
                  type: "text",
                  admin: {
                    description: "Small label for the stack card.",
                  },
                },
                {
                  name: "stackText",
                  type: "textarea",
                  admin: {
                    description: "Short sentence shown in the stack card.",
                  },
                },
                {
                  name: "stackHref",
                  type: "text",
                  admin: {
                    description: "Target for the stack card.",
                  },
                },
                {
                  name: "stackTags",
                  type: "array",
                  admin: {
                    description: "Short labels shown as stack chips in the bento grid.",
                  },
                  fields: [
                    {
                      name: "label",
                      type: "text",
                      admin: {
                        description: "One stack chip label.",
                      },
                    },
                  ],
                },
                {
                  name: "projectsEyebrow",
                  type: "text",
                  admin: {
                    description: "Small label for the project-count card.",
                  },
                },
                {
                  name: "projectsValue",
                  type: "text",
                  admin: {
                    description: "Large project-count value shown in the card.",
                  },
                },
                {
                  name: "projectsText",
                  type: "text",
                  admin: {
                    description: "Caption below the project-count value.",
                  },
                },
                {
                  name: "workflowEyebrow",
                  type: "text",
                  admin: {
                    description: "Small label for the workflow/tools card.",
                  },
                },
                {
                  name: "workflowText",
                  type: "textarea",
                  admin: {
                    description: "Main text in the workflow/tools card.",
                  },
                },
                {
                  name: "workflowHref",
                  type: "text",
                  admin: {
                    description: "Target for the workflow/tools card.",
                  },
                },
                {
                  name: "experienceEyebrow",
                  type: "text",
                  admin: {
                    description: "Small label for the experience stat card.",
                  },
                },
                {
                  name: "experienceValue",
                  type: "text",
                  admin: {
                    description: "Large experience value shown in the stat card.",
                  },
                },
              ],
            },
            {
              name: "experience",
              type: "group",
              admin: {
                description:
                  "Homepage experience section heading. Individual experience items are edited separately.",
              },
              fields: [
                {
                  name: "eyebrow",
                  type: "text",
                  admin: {
                    description: "Small uppercase label above the experience heading.",
                  },
                },
                {
                  name: "title",
                  type: "text",
                  admin: {
                    description: "Main heading for the experience section.",
                  },
                },
              ],
            },
            {
              name: "homeProjects",
              type: "group",
              admin: {
                description: "Homepage heading and archive link for the selected projects section.",
              },
              fields: [
                {
                  name: "eyebrow",
                  type: "text",
                  admin: {
                    description: "Small uppercase label above selected projects.",
                  },
                },
                {
                  name: "title",
                  type: "text",
                  admin: {
                    description: "Main heading for the selected projects section.",
                  },
                },
                {
                  name: "archiveCtaLabel",
                  type: "text",
                  admin: {
                    description: "Text for the link to the full projects page.",
                  },
                },
                {
                  name: "archiveCtaHref",
                  type: "text",
                  admin: {
                    description: "Target for the full projects link.",
                  },
                },
              ],
            },
            {
              name: "homeBlog",
              type: "group",
              admin: {
                description: "Homepage heading, intro, and archive link for latest articles.",
              },
              fields: [
                {
                  name: "eyebrow",
                  type: "text",
                  admin: {
                    description: "Small uppercase label above latest articles.",
                  },
                },
                {
                  name: "title",
                  type: "text",
                  admin: {
                    description: "Main heading for the latest articles section.",
                  },
                },
                {
                  name: "description",
                  type: "textarea",
                  admin: {
                    description: "Short intro text shown near the latest articles heading.",
                  },
                },
                {
                  name: "archiveCtaLabel",
                  type: "text",
                  admin: {
                    description: "Text for the link to the full blog page.",
                  },
                },
                {
                  name: "archiveCtaHref",
                  type: "text",
                  admin: {
                    description: "Target for the full blog link.",
                  },
                },
              ],
            },
            {
              name: "about",
              type: "group",
              admin: {
                description: "Homepage about/profile section.",
              },
              fields: [
                {
                  name: "eyebrow",
                  type: "text",
                  admin: {
                    description: "Small uppercase label above the about heading.",
                  },
                },
                {
                  name: "titlePrefix",
                  type: "text",
                  admin: {
                    description: "First part of the about title.",
                  },
                },
                {
                  name: "titleMuted",
                  type: "text",
                  admin: {
                    description: "Muted text segment in the about title.",
                  },
                },
                {
                  name: "paragraphs",
                  type: "array",
                  admin: {
                    description: "About section paragraphs shown in order.",
                  },
                  fields: [
                    {
                      name: "text",
                      type: "textarea",
                      admin: {
                        description: "One paragraph of about/profile copy.",
                      },
                    },
                  ],
                },
                {
                  name: "imageUrl",
                  type: "text",
                  admin: {
                    components: {
                      Field: "@/components/admin/local-media-field#default",
                    },
                    description:
                      "Public image URL shown in the about section. Use local: to choose from the local media library.",
                  },
                },
                {
                  name: "imageAlt",
                  type: "text",
                  admin: {
                    description: "Accessible alt text for the about image.",
                  },
                },
                {
                  name: "socialLinks",
                  type: "array",
                  admin: {
                    description: "Social links shown in the about section.",
                  },
                  fields: [
                    {
                      name: "platform",
                      type: "select",
                      admin: {
                        description: "Icon/platform used for this social link.",
                      },
                      options: [
                        {
                          label: "GitHub",
                          value: "github",
                        },
                        {
                          label: "Twitter",
                          value: "twitter",
                        },
                        {
                          label: "LinkedIn",
                          value: "linkedin",
                        },
                        {
                          label: "Instagram",
                          value: "instagram",
                        },
                      ],
                    },
                    ...createLinkFields(),
                  ],
                },
              ],
            },
            {
              name: "testimonialsSection",
              type: "group",
              admin: {
                description: "Homepage testimonials section heading. Individual testimonials are edited separately.",
              },
              fields: [
                {
                  name: "eyebrow",
                  type: "text",
                  admin: {
                    description: "Small uppercase label above testimonials.",
                  },
                },
                {
                  name: "title",
                  type: "text",
                  admin: {
                    description: "Main heading for the testimonials section.",
                  },
                },
              ],
            },
            {
              name: "techStack",
              type: "group",
              admin: {
                description: "Homepage skills/tools section heading. Skill and tool items are edited in Tech Stack Items.",
              },
              fields: [
                {
                  name: "eyebrow",
                  type: "text",
                  admin: {
                    description: "Small uppercase label above the tech stack heading.",
                  },
                },
                {
                  name: "title",
                  type: "text",
                  admin: {
                    description: "Main heading for the tech stack section.",
                  },
                },
                {
                  name: "description",
                  type: "textarea",
                  admin: {
                    description: "Short intro text for the tech stack section.",
                  },
                },
                {
                  name: "skillsEyebrow",
                  type: "text",
                  admin: {
                    description: "Small label shown above the skills group title.",
                  },
                },
                {
                  name: "skillsTitle",
                  type: "text",
                  admin: {
                    description: "Heading for the skills group.",
                  },
                },
                {
                  name: "toolsEyebrow",
                  type: "text",
                  admin: {
                    description: "Small label shown above the tools group title.",
                  },
                },
                {
                  name: "toolsTitle",
                  type: "text",
                  admin: {
                    description: "Heading for the tools group.",
                  },
                },
              ],
            },
            {
              name: "cta",
              type: "group",
              admin: {
                description: "Homepage call-to-action section before the footer.",
              },
              fields: [
                {
                  name: "isEnabled",
                  type: "checkbox",
                  admin: {
                    description: "Turn this CTA section on or off on the public homepage.",
                  },
                  defaultValue: true,
                },
                {
                  name: "avatarLetter",
                  type: "text",
                  admin: {
                    description: "Single character shown in the CTA avatar mark.",
                  },
                },
                {
                  name: "titlePrefix",
                  type: "text",
                  admin: {
                    description: "First part of the CTA title.",
                  },
                },
                {
                  name: "titleAccent",
                  type: "text",
                  admin: {
                    description: "Accent word in the CTA title.",
                  },
                },
                {
                  name: "titleMiddle",
                  type: "text",
                  admin: {
                    description: "Middle text in the CTA title.",
                  },
                },
                {
                  name: "titleSuffix",
                  type: "text",
                  admin: {
                    description: "Last part of the CTA title.",
                  },
                },
                {
                  name: "name",
                  type: "text",
                  admin: {
                    description: "Name shown in the CTA profile line.",
                  },
                },
                {
                  name: "availability",
                  type: "text",
                  admin: {
                    description: "Short availability/status line in the CTA.",
                  },
                },
                {
                  name: "description",
                  type: "textarea",
                  admin: {
                    description: "Supporting CTA copy.",
                  },
                },
                {
                  name: "primaryCtaLabel",
                  type: "text",
                  admin: {
                    description: "Visible text for the CTA button.",
                  },
                },
                {
                  name: "primaryCtaHref",
                  type: "text",
                  admin: {
                    description: "Target for the CTA button.",
                  },
                },
              ],
            },
            {
              name: "contact",
              type: "group",
              admin: {
                description: "Homepage contact form heading and submit button text.",
              },
              fields: [
                {
                  name: "eyebrow",
                  type: "text",
                  admin: {
                    description: "Small uppercase label above the contact form heading.",
                  },
                },
                {
                  name: "title",
                  type: "text",
                  admin: {
                    description: "Main heading above the contact form.",
                  },
                },
                {
                  name: "description",
                  type: "textarea",
                  admin: {
                    description: "Short intro text beside the contact form.",
                  },
                },
                {
                  name: "submitLabel",
                  type: "text",
                  admin: {
                    description: "Text shown on the contact form submit button.",
                  },
                },
              ],
            },
            {
              name: "footer",
              type: "group",
              admin: {
                description: "Global site footer: brand text, footer link columns, and social links.",
              },
              fields: [
                {
                  name: "brandInitial",
                  type: "text",
                  admin: {
                    description: "Single character shown in the footer brand mark.",
                  },
                },
                {
                  name: "brandName",
                  type: "text",
                  admin: {
                    description: "Brand/name shown in the footer.",
                  },
                },
                {
                  name: "description",
                  type: "textarea",
                  admin: {
                    description: "Short footer description below the brand.",
                  },
                },
                {
                  name: "copyrightName",
                  type: "text",
                  admin: {
                    description: "Name used in the copyright line.",
                  },
                },
                {
                  name: "mainLinks",
                  type: "array",
                  admin: {
                    description: "Primary footer links.",
                  },
                  fields: createLinkFields(),
                },
                {
                  name: "workLinks",
                  type: "array",
                  admin: {
                    description: "Footer links related to work/projects/contact.",
                  },
                  fields: createLinkFields(),
                },
                {
                  name: "socialLinks",
                  type: "array",
                  admin: {
                    description: "Footer social/contact links.",
                  },
                  fields: [
                    {
                      name: "platform",
                      type: "select",
                      admin: {
                        description: "Icon/platform used for this footer link.",
                      },
                      options: [
                        {
                          label: "Email",
                          value: "email",
                        },
                        {
                          label: "GitHub",
                          value: "github",
                        },
                        {
                          label: "Twitter",
                          value: "twitter",
                        },
                        {
                          label: "LinkedIn",
                          value: "linkedin",
                        },
                        {
                          label: "Instagram",
                          value: "instagram",
                        },
                      ],
                    },
                    ...createLinkFields(),
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Home Preview",
          fields: [
            {
              name: "homePreview",
              type: "ui",
              admin: {
                components: {
                  Field: "@/components/admin/home-page-preview-field#default",
                },
              },
            },
          ],
        },
        {
          label: "Projects Page Edit",
          fields: [
            {
              name: "projectsPage",
              type: "group",
              admin: {
                description: "Text controls for the /projects archive page.",
              },
              fields: createArchivePageFields(),
            },
          ],
        },
        {
          label: "Projects Page Preview",
          fields: [
            {
              name: "projectsArchivePreview",
              type: "ui",
              admin: {
                components: {
                  Field: "@/components/admin/archive-page-preview-field#ProjectsPreview",
                },
              },
            },
          ],
        },
        {
          label: "Blog Page Edit",
          fields: [
            {
              name: "blogPage",
              type: "group",
              admin: {
                description: "Text controls for the /blog archive page.",
              },
              fields: createArchivePageFields(),
            },
          ],
        },
        {
          label: "Blog Page Preview",
          fields: [
            {
              name: "blogArchivePreview",
              type: "ui",
              admin: {
                components: {
                  Field: "@/components/admin/archive-page-preview-field#BlogPreview",
                },
              },
            },
          ],
        },
      ],
    },
  ],
}

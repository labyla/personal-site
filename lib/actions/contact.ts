"use server"

import config from "@payload-config"
import { headers } from "next/headers"
import { getPayload } from "payload"
import { z } from "zod"

export type ContactActionState =
  | { ok: true; message: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> }

const contactSchema = z.object({
  email: z.string().trim().min(1, "Email is required.").max(254, "Email is too long.").email("Enter a valid email."),
  message: z.string().trim().min(1, "Message is required.").max(5000, "Message is too long."),
  name: z.string().trim().min(1, "Name is required.").max(120, "Name is too long."),
  subject: z.string().trim().max(160, "Subject is too long.").optional(),
  website: z.string().trim().optional(),
})

function formValue(formData: FormData, key: string) {
  const value = formData.get(key)

  return typeof value === "string" ? value : ""
}

function fieldErrors(error: z.ZodError): Record<string, string[]> {
  const errors = error.flatten().fieldErrors

  return Object.fromEntries(
    Object.entries(errors).filter((entry): entry is [string, string[]] =>
      Array.isArray(entry[1]) && entry[1].length > 0,
    ),
  )
}

export async function submitContactForm(
  _previousState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const parsed = contactSchema.safeParse({
    email: formValue(formData, "email"),
    message: formValue(formData, "message"),
    name: formValue(formData, "name"),
    subject: formValue(formData, "subject"),
    website: formValue(formData, "website"),
  })

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: fieldErrors(parsed.error),
    }
  }

  if (parsed.data.website) {
    return {
      ok: false,
      message: "Unable to submit the form.",
    }
  }

  try {
    const payload = await getPayload({ config })
    const requestHeaders = await headers()

    await payload.create({
      collection: "contact-submissions",
      data: {
        email: parsed.data.email,
        message: parsed.data.message,
        name: parsed.data.name,
        source: "website",
        status: "new",
        subject: parsed.data.subject || undefined,
        userAgent: requestHeaders.get("user-agent") || undefined,
      },
      overrideAccess: true,
    })

    return {
      ok: true,
      message: "Thanks. Your message has been sent.",
    }
  } catch (error) {
    console.error("Contact form submission failed.", error)

    return {
      ok: false,
      message: "Unable to submit the form right now.",
    }
  }
}

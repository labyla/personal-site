"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { LoaderCircle, Send } from "lucide-react"

import { submitContactForm, type ContactActionState } from "@/lib/actions/contact"
import { Button } from "@/components/ui/button"

const initialState: ContactActionState = {
  ok: false,
  message: "",
}

const initialValues = {
  email: "",
  message: "",
  name: "",
  subject: "",
}

function getFieldError(state: ContactActionState, field: string) {
  return state.ok ? undefined : state.fieldErrors?.[field]?.[0]
}

const fieldClassName =
  "w-full border-0 border-b border-border bg-transparent px-0 py-3 text-base text-foreground placeholder:text-muted-foreground/45 transition-colors focus:border-accent focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-destructive"

const labelClassName =
  "text-xs font-medium uppercase tracking-wider text-muted-foreground"

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [values, setValues] = useState(initialValues)
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    initialState,
  )

  useEffect(() => {
    if (state.ok) {
      setValues(initialValues)
      formRef.current?.reset()
    }
  }, [state.ok])

  function updateField(field: keyof typeof initialValues, value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }))
  }

  const nameError = getFieldError(state, "name")
  const emailError = getFieldError(state, "email")
  const subjectError = getFieldError(state, "subject")
  const messageError = getFieldError(state, "message")

  return (
    <section id="contact" className="px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 border-t border-border pt-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="max-w-xl">
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              CONTACT
            </p>
            <h2 className="text-4xl font-bold uppercase leading-none md:text-6xl">
              Let&apos;s make something useful.
            </h2>
            <p className="mt-6 border-l border-border pl-5 leading-8 text-muted-foreground">
              Tell me what you are building, what feels stuck, or where you need
              another pair of hands. I&apos;ll get back to you as soon as I can.
            </p>
          </div>

          <div className="contact-gradient-border">
            <form
              ref={formRef}
              action={formAction}
              className="contact-form-panel p-5 md:p-8"
            >
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className={labelClassName}>
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={values.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    autoComplete="name"
                    aria-invalid={Boolean(nameError)}
                    aria-describedby={nameError ? "name-error" : undefined}
                    disabled={isPending}
                    className={fieldClassName}
                    placeholder="Your name"
                  />
                  {nameError && <p id="name-error" className="text-sm text-destructive">{nameError}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className={labelClassName}>
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    autoComplete="email"
                    aria-invalid={Boolean(emailError)}
                    aria-describedby={emailError ? "email-error" : undefined}
                    disabled={isPending}
                    className={fieldClassName}
                    placeholder="you@example.com"
                  />
                  {emailError && <p id="email-error" className="text-sm text-destructive">{emailError}</p>}
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <label htmlFor="subject" className={labelClassName}>
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  value={values.subject}
                  onChange={(event) => updateField("subject", event.target.value)}
                  aria-invalid={Boolean(subjectError)}
                  aria-describedby={subjectError ? "subject-error" : undefined}
                  disabled={isPending}
                  className={fieldClassName}
                  placeholder="Project, collaboration, or question"
                />
                {subjectError && <p id="subject-error" className="text-sm text-destructive">{subjectError}</p>}
              </div>

              <div className="mt-5 space-y-2">
                <label htmlFor="message" className={labelClassName}>
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={values.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  rows={6}
                  aria-invalid={Boolean(messageError)}
                  aria-describedby={messageError ? "message-error" : undefined}
                  disabled={isPending}
                  className={`${fieldClassName} min-h-40 resize-y`}
                  placeholder="Tell me what you want to build."
                />
                {messageError && <p id="message-error" className="text-sm text-destructive">{messageError}</p>}
              </div>

              {state.message && (
                <p
                  className={`mt-5 text-sm ${state.ok ? "text-accent" : "text-destructive"}`}
                  role="status"
                >
                  {state.message}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                className="mt-6 rounded-none border border-accent bg-accent px-5 text-accent-foreground hover:bg-accent/90 disabled:border-border disabled:bg-secondary disabled:text-muted-foreground"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    Pending
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Send message
                    <Send className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

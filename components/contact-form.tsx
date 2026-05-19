"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { Send } from "lucide-react"

import { submitContactForm, type ContactActionState } from "@/lib/actions/contact"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

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
    <section id="contact" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-4 uppercase tracking-wider">
              CONTACT
            </p>
            <h2 className="text-4xl md:text-5xl font-bold">
              Let&apos;s make something useful.
            </h2>
            <p className="mt-6 text-muted-foreground leading-8">
              Tell me what you are building, what feels stuck, or where you need
              another pair of hands. I&apos;ll get back to you as soon as I can.
            </p>
          </div>

          <form
            ref={formRef}
            action={formAction}
            className="rounded-3xl border border-border bg-card p-6 md:p-8"
          >
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={values.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  autoComplete="name"
                  aria-invalid={Boolean(nameError)}
                  disabled={isPending}
                />
                {nameError && <p className="text-sm text-destructive">{nameError}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  autoComplete="email"
                  aria-invalid={Boolean(emailError)}
                  disabled={isPending}
                />
                {emailError && <p className="text-sm text-destructive">{emailError}</p>}
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <Input
                id="subject"
                name="subject"
                value={values.subject}
                onChange={(event) => updateField("subject", event.target.value)}
                aria-invalid={Boolean(subjectError)}
                disabled={isPending}
              />
              {subjectError && <p className="text-sm text-destructive">{subjectError}</p>}
            </div>

            <div className="mt-5 space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                value={values.message}
                onChange={(event) => updateField("message", event.target.value)}
                rows={6}
                aria-invalid={Boolean(messageError)}
                disabled={isPending}
                className="min-h-40 resize-y"
              />
              {messageError && <p className="text-sm text-destructive">{messageError}</p>}
            </div>

            {state.message && (
              <p
                className={`mt-5 text-sm ${state.ok ? "text-green-400" : "text-destructive"}`}
                role="status"
              >
                {state.message}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              className="mt-6 rounded-full"
              disabled={isPending}
            >
              {isPending ? "Sending..." : "Send message"}
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}

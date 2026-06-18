"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { AlertCircle, LoaderCircle, Send } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

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

type FieldName = keyof typeof initialValues

const fieldClassName =
  "w-full border-0 border-b border-border bg-transparent px-0 py-3 text-base text-foreground placeholder:text-muted-foreground/45 transition-colors duration-200 focus:border-accent focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-destructive"

const labelClassName =
  "text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors duration-200"

const fieldErrorMotion = {
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  initial: { opacity: 0, y: -4 },
  transition: { duration: 0.16 },
}

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [values, setValues] = useState(initialValues)
  const [focusedField, setFocusedField] = useState<FieldName | null>(null)
  const [hiddenFieldErrors, setHiddenFieldErrors] = useState<Set<FieldName>>(
    () => new Set(),
  )
  const [showSubmitError, setShowSubmitError] = useState(false)
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    initialState,
  )

  useEffect(() => {
    if (state.ok) {
      setValues(initialValues)
      setFocusedField(null)
      setHiddenFieldErrors(new Set())
      setShowSubmitError(false)
      formRef.current?.reset()
    } else if (state.message) {
      setHiddenFieldErrors(new Set())
      setShowSubmitError(true)
    }
  }, [state])

  function updateField(field: keyof typeof initialValues, value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }))
  }

  function handleFieldFocus(field: FieldName) {
    setFocusedField(field)
    setShowSubmitError(false)
    setHiddenFieldErrors((currentFields) => {
      const nextFields = new Set(currentFields)
      nextFields.add(field)
      return nextFields
    })
  }

  function getFieldError(field: FieldName) {
    if (state.ok || hiddenFieldErrors.has(field)) {
      return undefined
    }

    return state.fieldErrors?.[field]?.[0]
  }

  const nameError = getFieldError("name")
  const emailError = getFieldError("email")
  const subjectError = getFieldError("subject")
  const messageError = getFieldError("message")
  const hasSubmitError = !state.ok && showSubmitError && Boolean(state.message)
  const submitErrorLabel =
    hasSubmitError && state.fieldErrors ? "Fix highlighted fields." : state.message

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

          <div className="contact-gradient-border" data-status={hasSubmitError ? "error" : "idle"}>
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
                    onFocus={() => handleFieldFocus("name")}
                    onBlur={() => setFocusedField(null)}
                    autoComplete="name"
                    aria-invalid={Boolean(nameError)}
                    aria-describedby={nameError ? "name-error" : undefined}
                    disabled={isPending}
                    className={fieldClassName}
                    placeholder="Your name"
                  />
                  <AnimatePresence initial={false}>
                    {nameError && focusedField !== "name" && (
                      <motion.p
                        id="name-error"
                        className="text-sm text-destructive"
                        {...fieldErrorMotion}
                      >
                        {nameError}
                      </motion.p>
                    )}
                  </AnimatePresence>
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
                    onFocus={() => handleFieldFocus("email")}
                    onBlur={() => setFocusedField(null)}
                    autoComplete="email"
                    aria-invalid={Boolean(emailError)}
                    aria-describedby={emailError ? "email-error" : undefined}
                    disabled={isPending}
                    className={fieldClassName}
                    placeholder="you@example.com"
                  />
                  <AnimatePresence initial={false}>
                    {emailError && focusedField !== "email" && (
                      <motion.p
                        id="email-error"
                        className="text-sm text-destructive"
                        {...fieldErrorMotion}
                      >
                        {emailError}
                      </motion.p>
                    )}
                  </AnimatePresence>
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
                  onFocus={() => handleFieldFocus("subject")}
                  onBlur={() => setFocusedField(null)}
                  aria-invalid={Boolean(subjectError)}
                  aria-describedby={subjectError ? "subject-error" : undefined}
                  disabled={isPending}
                  className={fieldClassName}
                  placeholder="Project, collaboration, or question"
                />
                <AnimatePresence initial={false}>
                  {subjectError && focusedField !== "subject" && (
                    <motion.p
                      id="subject-error"
                      className="text-sm text-destructive"
                      {...fieldErrorMotion}
                    >
                      {subjectError}
                    </motion.p>
                  )}
                </AnimatePresence>
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
                  onFocus={() => handleFieldFocus("message")}
                  onBlur={() => setFocusedField(null)}
                  rows={6}
                  aria-invalid={Boolean(messageError)}
                  aria-describedby={messageError ? "message-error" : undefined}
                  disabled={isPending}
                  className={`${fieldClassName} min-h-40 resize-y`}
                  placeholder="Tell me what you want to build."
                />
                <AnimatePresence initial={false}>
                  {messageError && focusedField !== "message" && (
                    <motion.p
                      id="message-error"
                      className="text-sm text-destructive"
                      {...fieldErrorMotion}
                    >
                      {messageError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence initial={false}>
                {state.ok && state.message && (
                  <motion.p
                    className="mt-5 text-sm text-accent"
                    role="status"
                    {...fieldErrorMotion}
                  >
                    {state.message}
                  </motion.p>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                size="lg"
                className={`mt-6 rounded-none px-5 transition-all duration-200 ${
                  hasSubmitError
                    ? "max-w-full border border-destructive bg-destructive text-white hover:bg-destructive/90"
                    : "border border-accent bg-accent text-accent-foreground hover:bg-accent/90"
                } disabled:border-border disabled:bg-secondary disabled:text-muted-foreground`}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    Pending
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  </>
                ) : hasSubmitError ? (
                  <>
                    <span className="min-w-0 truncate">{submitErrorLabel}</span>
                    <AlertCircle className="h-4 w-4" />
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

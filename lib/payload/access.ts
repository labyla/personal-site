import type { Access } from "payload"

export const CONTENT_PERMISSIONS = [
  "content.read",
  "content.update",
] as const

export const FEEDBACK_PERMISSIONS = [
  "feedback.read",
  "feedback.update",
] as const

export const USER_PERMISSIONS = [
  ...CONTENT_PERMISSIONS,
  ...FEEDBACK_PERMISSIONS,
] as const

export type ContentPermission = (typeof CONTENT_PERMISSIONS)[number]
export type FeedbackPermission = (typeof FEEDBACK_PERMISSIONS)[number]
export type UserPermission = (typeof USER_PERMISSIONS)[number]

type UserWithPermissions = {
  permissions?: UserPermission[] | null
}

export function hasPermission(
  user: unknown,
  permission: UserPermission,
): boolean {
  const permissions = (user as UserWithPermissions | null)?.permissions

  return Array.isArray(permissions) && permissions.includes(permission)
}

export const canReadContent: Access = ({ req: { user } }) =>
  hasPermission(user, "content.read") || hasPermission(user, "content.update")

export const canUpdateContent: Access = ({ req: { user } }) =>
  hasPermission(user, "content.update")

export const canReadFeedback: Access = ({ req: { user } }) =>
  hasPermission(user, "feedback.read") || hasPermission(user, "feedback.update")

export const canUpdateFeedback: Access = ({ req: { user } }) =>
  hasPermission(user, "feedback.update")

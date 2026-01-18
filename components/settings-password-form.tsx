"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updatePassword } from "@/lib/supabase/auth"
import { changePasswordSchema, type ChangePasswordInput } from "@/lib/validations/auth"

export function SettingsPasswordForm() {
  const [isPending, startTransition] = React.useTransition()
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)
  const [fieldErrors, setFieldErrors] = React.useState<Partial<Record<keyof ChangePasswordInput, string>>>({})

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const data = {
      currentPassword: formData.get("currentPassword") as string,
      newPassword: formData.get("newPassword") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    }

    const result = changePasswordSchema.safeParse(data)
    if (!result.success) {
      const errors: Partial<Record<keyof ChangePasswordInput, string>> = {}
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0] as keyof ChangePasswordInput] = issue.message
        }
      })
      setFieldErrors(errors)
      return
    }

    startTransition(async () => {
      try {
        await updatePassword(result.data.newPassword)
        setSuccess(true)
        ;(e.target as HTMLFormElement).reset()
        setTimeout(() => setSuccess(false), 3000)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("An unexpected error occurred")
        }
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Update your password to keep your account secure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950 p-3 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="text-sm text-green-600 bg-green-50 dark:bg-green-950 p-3 rounded-md">
              Password updated successfully
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              disabled={isPending}
              aria-invalid={!!fieldErrors.currentPassword}
            />
            {fieldErrors.currentPassword && (
              <p className="text-sm text-red-500">{fieldErrors.currentPassword}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              disabled={isPending}
              aria-invalid={!!fieldErrors.newPassword}
            />
            {fieldErrors.newPassword && (
              <p className="text-sm text-red-500">{fieldErrors.newPassword}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              disabled={isPending}
              aria-invalid={!!fieldErrors.confirmPassword}
            />
            {fieldErrors.confirmPassword && (
              <p className="text-sm text-red-500">{fieldErrors.confirmPassword}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Must be at least 8 characters with uppercase, lowercase, and a number
            </p>
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

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
import { updateUserProfile, getCurrentUser } from "@/lib/supabase/auth"
import { updateProfileSchema, type UpdateProfileInput } from "@/lib/validations/auth"

interface SettingsProfileFormProps {
  initialName?: string
  initialEmail?: string
}

export function SettingsProfileForm({ initialName, initialEmail }: SettingsProfileFormProps) {
  const [isPending, startTransition] = React.useTransition()
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)
  const [fieldErrors, setFieldErrors] = React.useState<Partial<Record<keyof UpdateProfileInput, string>>>({})

  const [name, setName] = React.useState(initialName ?? "")
  const [email, setEmail] = React.useState(initialEmail ?? "")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    setSuccess(false)

    const data: UpdateProfileInput = {}
    if (name !== initialName) data.name = name
    if (email !== initialEmail) data.email = email

    if (Object.keys(data).length === 0) {
      setError("No changes to save")
      return
    }

    const result = updateProfileSchema.safeParse(data)
    if (!result.success) {
      const errors: Partial<Record<keyof UpdateProfileInput, string>> = {}
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0] as keyof UpdateProfileInput] = issue.message
        }
      })
      setFieldErrors(errors)
      return
    }

    startTransition(async () => {
      try {
        const updates: { email?: string; data?: { full_name?: string } } = {}
        if (result.data.email) updates.email = result.data.email
        if (result.data.name) updates.data = { full_name: result.data.name }

        await updateUserProfile(updates)
        setSuccess(true)
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
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          Update your profile information
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
              Profile updated successfully
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              aria-invalid={!!fieldErrors.name}
            />
            {fieldErrors.name && (
              <p className="text-sm text-red-500">{fieldErrors.name}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
              aria-invalid={!!fieldErrors.email}
            />
            {fieldErrors.email && (
              <p className="text-sm text-red-500">{fieldErrors.email}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Changing your email will require verification
            </p>
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

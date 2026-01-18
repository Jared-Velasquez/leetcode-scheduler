import { createClient } from "@/lib/supabase/server";
import { SettingsProfileForm } from "@/components/settings-profile-form";
import { SettingsPasswordForm } from "@/components/settings-password-form";
import { SettingsDangerZone } from "@/components/settings-danger-zone";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const name = user?.user_metadata?.full_name ?? "";
  const email = user?.email ?? "";

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="max-w-2xl mx-auto w-full space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <SettingsProfileForm initialName={name} initialEmail={email} />
        <SettingsPasswordForm />
        <SettingsDangerZone />
      </div>
    </div>
  );
}

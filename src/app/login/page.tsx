import { redirect } from "next/navigation"
import dynamic from "next/dynamic"
import { isFeatureEnabled } from "@/lib/feature-flags"

const LoginForm = dynamic(() =>
  import("@/components/login-form").then((module) => module.LoginForm)
)

export default function LoginPage() {
  if (!isFeatureEnabled("GoogleAuth")) {
    redirect("/")
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  )
}

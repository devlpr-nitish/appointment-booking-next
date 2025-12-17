import { ExpertOnboardingForm } from "@/components/expert/expert-onboarding-form"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getExpertApplication } from "@/lib/data/expert-onboarding"

export default async function BecomeExpertPage() {
  const user = await getSession()

  if (!user) {
    redirect("/login")
  }

  // Check if user is already an expert
  if (user.role === "expert" || user.isExpert) {
    redirect("/expert")
  }

  // Check if user has already applied
  const application = await getExpertApplication(user.id)

  if (application) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Application Submitted</h1>
          <p className="text-muted-foreground mb-4">
            Your expert application is currently under review. We&apos;ll notify you once it&apos;s been processed.
          </p>
          <p className="text-sm text-muted-foreground">Status: {application.status}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <ExpertOnboardingForm />
    </div>
  )
}

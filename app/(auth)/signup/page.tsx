import { SignupForm } from "@/components/auth/signup-form"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function SignupPage() {
    const user = await getSession()

    // Redirect if already logged in
    if (user) {
        if (user.role === "admin") {
            redirect("/admin")
        } else if (user.role === "expert" || user.isExpert) {
            redirect("/expert")
        } else {
            redirect("/dashboard")
        }
    }

    return <SignupForm />
}

import { LoginForm } from "@/components/auth/login-form"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function LoginPage() {
    const user = await getSession()

    // Redirect if already logged in
    if (user) {
        if (user.role === "admin") {
            redirect("/admin")
        } else if (user.role === "expert" || user.isExpert) {
            redirect("/expert")
        } else {
            redirect("/user")
        }
    }

    return <LoginForm />
}

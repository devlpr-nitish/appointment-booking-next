import Link from "next/link"
import { AuthSideContent } from "@/components/auth/auth-side-content"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <AuthSideContent />
            <div className="p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    {children}
                </div>
            </div>
        </div>
    )
}

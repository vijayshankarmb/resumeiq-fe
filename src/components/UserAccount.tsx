"use client"

import { signOut, useSession } from "next-auth/react"

export default function UserAccount() {
    const { data: session } = useSession()

    if (!session?.user) return null

    return (
        <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-[var(--foreground)]">
                    {session.user.name}
                </span>
                <span className="text-xs text-[var(--muted)]">
                    {session.user.email}
                </span>
            </div>
            <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-md bg-white/5 px-3 py-1.5 text-sm font-medium text-[var(--foreground)] ring-1 ring-[var(--card-border)] transition-all hover:bg-white/10 hover:ring-[var(--primary)]/50"
            >
                Sign Out
            </button>
        </div>
    )
}

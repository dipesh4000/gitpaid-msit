'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { WalletButton } from './WalletButton'

export function Navbar() {
    const pathname = usePathname()

    const links = [
        { href: '/listings', label: 'Explore' },
        { href: '/dashboard', label: 'Dashboard' },
    ]

    return (
        <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold gradient-text">
                    X-Banner
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    {links.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname === link.href ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/create-listing" className="hidden md:block text-sm font-medium text-muted-foreground hover:text-primary">
                        Become a Creator
                    </Link>
                    <WalletButton />
                </div>
            </div>
        </nav>
    )
}

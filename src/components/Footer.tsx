export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-black py-8">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} X-Banner Marketplace. All rights reserved.
                </p>
                <div className="flex gap-4">
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary">Terms</a>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy</a>
                </div>
            </div>
        </footer>
    )
}

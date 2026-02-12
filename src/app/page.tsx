import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowRight, Twitter, ShieldCheck, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16">

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-32 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto text-center relative z-10 flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Live on Base Sepolia
          </div>

          <h1 className="text-4xl md:text-7xl font-bold tracking-tight">
            Rent Verified Banner<br />
            Space on <span className="gradient-text">X (Twitter)</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            The first decentralized marketplace for renting profile banners.
            Automated verification, secure USDC payments, and instant activation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link href="/listings">
              <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/25">
                Start Exploring
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/create-listing">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base glass border-white/10 hover:bg-white/5">
                Become a Creator
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats/Social Proof (Mock) */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-white/5">
          {[
            { label: 'Active Creators', value: '100+' },
            { label: 'Total Volume', value: '$50k+' },
            { label: 'Rentals Filled', value: '500+' },
            { label: 'Avg ROI', value: '3.5x' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How it works</h2>
          <p className="text-muted-foreground">Simple, transparent, and secure.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Twitter,
              title: 'Connect & List',
              desc: 'Creators connect their X account and set a daily price for their banner space.'
            },
            {
              icon: Zap,
              title: 'Instant Rental',
              desc: 'Advertisers browse listings and pay with USDC. No negotiation needed.'
            },
            {
              icon: ShieldCheck,
              title: 'Verified Results',
              desc: 'Our system automatically verifies the banner update. Refunds if anything goes wrong.'
            }
          ].map((item, i) => (
            <Card key={i} className="bg-black/20 border-white/10 relative overflow-hidden group hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="mb-4 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <item.icon className="h-6 w-6" />
                </div>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Listings (Mock) */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Creators</h2>
            <p className="text-muted-foreground">Top trending spaces available now.</p>
          </div>
          <Link href="/listings">
            <Button variant="ghost" className="hidden md:flex">View all <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Link href={`/listings/${i}`} key={i} className="group">
              <Card className="overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
                <div className="h-32 bg-gradient-to-r from-gray-800 to-gray-700 relative">
                  {/* Banner Placeholder */}
                </div>
                <div className="px-6 -mt-8 relative z-10 flex justify-between items-end">
                  <div className="h-16 w-16 rounded-full bg-black border-4 border-background overflow-hidden">
                    <div className="h-full w-full bg-gray-600" />
                  </div>
                  <div className="mb-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    $50 / day
                  </div>
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-bold text-lg">Crypto Influencer {i}</h3>
                  <p className="text-sm text-muted-foreground">@crypto_whale_{i}</p>
                  <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
                    <div><span className="text-foreground font-medium">125k</span> Followers</div>
                    <div><span className="text-foreground font-medium">Verified</span> ID</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/listings">
            <Button variant="outline" className="w-full">View all listings</Button>
          </Link>
        </div>
      </section>

    </div>
  )
}

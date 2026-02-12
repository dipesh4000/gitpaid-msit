'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ListingCard } from "@/components/ListingCard"
import type { Listing } from "@/types/listing"
import { useRouter } from 'next/navigation'
import { DollarSign, TrendingUp, Calendar, Plus } from 'lucide-react'

export default function DashboardPage() {
    const router = useRouter()

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
                    <p className="text-muted-foreground">Manage your listings and rentals</p>
                </div>
            </div>

            <Tabs defaultValue="advertiser" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 p-1 rounded-lg">
                    <TabsTrigger value="advertiser" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm py-3">As Advertiser</TabsTrigger>
                    <TabsTrigger value="creator" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm py-3">As Creator</TabsTrigger>
                </TabsList>

                <TabsContent value="advertiser" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">0</div>
                                <p className="text-xs text-muted-foreground">No active campaigns</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">$0.00</div>
                                <p className="text-xs text-muted-foreground">USDC</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Impressions</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">0</div>
                                <p className="text-xs text-muted-foreground">Total views</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Active Campaigns</CardTitle>
                            <CardDescription>Banners you are currently renting</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
                                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="font-semibold mb-2">No active rentals</h3>
                                <p className="text-sm text-muted-foreground mb-4">Start advertising by browsing available banner spaces</p>
                                <Button onClick={() => router.push('/listings')}>Browse Listings</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="creator" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">$0.00</div>
                                <p className="text-xs text-muted-foreground">USDC earned</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">0</div>
                                <p className="text-xs text-muted-foreground">Live on marketplace</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Rentals</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">0</div>
                                <p className="text-xs text-muted-foreground">All time</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>My Listings</CardTitle>
                                    <CardDescription>Manage your banner spaces</CardDescription>
                                </div>
                                <Button onClick={() => router.push('/create-listing')} className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Create New Listing
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
                                <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="font-semibold mb-2">No listings yet</h3>
                                <p className="text-sm text-muted-foreground mb-4">Create your first listing to start earning</p>
                                <Button onClick={() => router.push('/create-listing')} variant="outline">Get Started</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

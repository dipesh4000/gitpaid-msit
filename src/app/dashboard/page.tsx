'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs" // Need to create Tabs component
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ListingCard } from "@/components/ListingCard"
import type { Listing } from "@/types/listing" // Use type-only import

export default function DashboardPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

            <Tabs defaultValue="advertiser" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 p-1 rounded-lg">
                    <TabsTrigger value="advertiser" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm py-2">As Advertiser</TabsTrigger>
                    <TabsTrigger value="creator" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm py-2">As Creator</TabsTrigger>
                </TabsList>

                <TabsContent value="advertiser">
                    <div className="grid gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Active Rentals</CardTitle>
                                <CardDescription>Banners you are currently renting.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                                    No active rentals found.
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Past History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                                    No history yet.
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="creator">
                    <div className="grid gap-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">My Listings</h2>
                            <Button>Create New Listing</Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Mock Listing */}
                            {/* <ListingCard listing={...} /> */}
                            <div className="text-center py-12 text-muted-foreground col-span-full border border-dashed rounded-lg">
                                You haven't created any listings yet.
                            </div>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Earnings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">$0.00 USDC</div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

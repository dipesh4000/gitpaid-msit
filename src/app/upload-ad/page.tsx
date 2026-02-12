'use client'

import React, { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Upload, CheckCircle2, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

function UploadAdContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const listingId = searchParams.get('listingId')

    const [preview, setPreview] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleActivate = async () => {
        if (!preview) return

        setUploading(true)
        // Mock API call to save banner
        await new Promise(resolve => setTimeout(resolve, 1500))

        toast.success('Banner activated! It will appear on X shortly.')
        router.push('/dashboard')
        setUploading(false)
    }

    if (!listingId) {
        return <div className="container py-8">Invalid session. Please rent a space first.</div>
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Upload Banner</h1>

            <div className="grid gap-8">
                {/* Visual Preview */}
                <Card className="overflow-hidden border-primary/20">
                    <div className="relative h-48 md:h-64 bg-gray-800">
                        {preview ? (
                            <img src={preview} alt="Banner Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                <ImageIcon className="mr-2 h-6 w-6" />
                                Banner Preview Area (1500x500px)
                            </div>
                        )}

                        {/* Mock X UI Overlay */}
                        <div className="absolute bottom-[-40px] left-4 flex items-end">
                            <div className="h-24 w-24 rounded-full bg-black border-4 border-background overflow-hidden relative z-10">
                                <div className="h-full w-full bg-gray-600" />
                            </div>
                        </div>
                    </div>
                    <div className="pt-12 px-4 pb-4 bg-background/50">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg">Your Ad Here</h3>
                                <p className="text-sm text-muted-foreground">@your_handle</p>
                            </div>
                            <Button size="sm" variant="outline">Follow</Button>
                        </div>
                    </div>
                </Card>

                {/* Upload Controls */}
                <Card>
                    <CardHeader>
                        <CardTitle>Select Image</CardTitle>
                        <CardDescription>
                            Recommended size: 1500x500px. formats: JPG, PNG.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Input id="picture" type="file" onChange={handleFileChange} accept="image/*" />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                size="lg"
                                onClick={handleActivate}
                                disabled={!preview || uploading}
                                className="w-full md:w-auto"
                            >
                                {uploading ? 'Activating...' : (
                                    <>
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Confirm & Activate
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default function UploadAdPage() {
    return (
        <Suspense fallback={<div className="container py-8">Loading...</div>}>
            <UploadAdContent />
        </Suspense>
    )
}

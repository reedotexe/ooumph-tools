'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface WorkflowNavigationProps {
    currentAgent: string
    nextAgent?: {
        name: string
        path: string
        description: string
    }
    onNavigate?: () => void
}

export function WorkflowNavigation({ currentAgent, nextAgent, onNavigate }: WorkflowNavigationProps) {
    const router = useRouter()

    if (!nextAgent) return null

    const handleNavigate = () => {
        if (onNavigate) {
            onNavigate()
        }
        router.push(nextAgent.path)
    }

    return (
        <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 mt-8 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Sparkles className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold">Continue Your Workflow</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                            {nextAgent.description}
                        </p>
                        <div className="inline-flex items-center gap-2 text-sm bg-background/50 px-4 py-2 rounded-full border border-primary/10">
                            <span className="font-medium text-foreground">{currentAgent}</span>
                            <ArrowRight className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-primary">{nextAgent.name}</span>
                        </div>
                    </div>
                    <Button
                        onClick={handleNavigate}
                        size="lg"
                        className="lg:ml-4 shrink-0 text-base px-6 py-6 shadow-md hover:shadow-lg transition-all duration-200"
                        style={{ backgroundColor: "#8B5CF6" }}
                    >
                        Use {nextAgent.name}
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

// Workflow configuration
export const WORKFLOW_STEPS = {
    'market-analysis': {
        name: 'Market Analysis',
        next: {
            name: 'Brandbook Generator',
            path: '/brandbook',
            description: 'Create your complete brand identity based on the market insights and positioning strategy.',
        },
    },
    brandbook: {
        name: 'Brandbook Generator',
        next: {
            name: 'Content Ideas Generator',
            path: '/content-ideas',
            description: 'Generate a comprehensive content strategy using your brand guidelines and messaging pillars.',
        },
    },
    'content-ideas': {
        name: 'Content Ideas Generator',
        next: {
            name: 'Landing Page Generator',
            path: '/landing-page-generator',
            description: 'Create a high-converting landing page with your content strategy and brand voice.',
        },
    },
    'landing-page-generator': {
        name: 'Landing Page Generator',
        next: {
            name: 'LinkedIn Post Generator',
            path: '/linkedin-post-generator',
            description: 'Generate engaging LinkedIn posts to promote your landing page and build your brand presence.',
        },
    },
    'linkedin-post-generator': {
        name: 'LinkedIn Post Generator',
        next: {
            name: 'SEO Audit',
            path: '/seo-audit',
            description: 'Audit your website or landing page for SEO performance and optimization opportunities.',
        },
    },
    'seo-audit': {
        name: 'SEO Audit',
        next: undefined,
    },
}

'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

// Define the workflow data structure
export interface WorkflowData {
    marketAnalysis?: {
        result: any
        timestamp: string
    }
    brandbook?: {
        result: any
        timestamp: string
    }
    contentIdeas?: {
        result: any
        timestamp: string
    }
    landingPage?: {
        result: any
        timestamp: string
    }
    linkedinPost?: {
        result: any
        timestamp: string
    }
    seoAudit?: {
        result: any
        timestamp: string
    }
}

interface WorkflowContextType {
    workflowData: WorkflowData
    setWorkflowData: (data: Partial<WorkflowData>) => void
    clearWorkflowData: () => void
    getInputForAgent: (agentName: string) => any
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined)

const STORAGE_KEY = 'ooumph_workflow_data'

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
    const [workflowData, setWorkflowDataState] = useState<WorkflowData>({})

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            try {
                setWorkflowDataState(JSON.parse(saved))
            } catch (e) {
                console.error('[Workflow] Failed to parse saved data:', e)
            }
        }
    }, [])

    // Save to localStorage whenever data changes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(workflowData))
    }, [workflowData])

    const setWorkflowData = (data: Partial<WorkflowData>) => {
        setWorkflowDataState(prev => ({
            ...prev,
            ...data,
        }))
    }

    const clearWorkflowData = () => {
        setWorkflowDataState({})
        localStorage.removeItem(STORAGE_KEY)
    }

    // Intelligent input mapping for each agent
    const getInputForAgent = (agentName: string): any => {
        const { marketAnalysis, brandbook, contentIdeas, landingPage } = workflowData

        switch (agentName) {
            case 'brandbook':
                // Brandbook needs business context from market analysis
                if (marketAnalysis?.result) {
                    const ma = marketAnalysis.result
                    return {
                        businessIdea: `
Industry: ${ma.Overview?.industry || 'Not specified'}
Product Category: ${ma.Overview?.product_category || 'Not specified'}
Target Audience: ${ma.Overview?.target_audience || 'Not specified'}
Geographic Focus: ${ma.Overview?.geographic_focus || 'Not specified'}

Key Trends:
${ma.trends?.summary_of_key_trends?.map((t: any) => `- ${t.title}: ${t.insight}`).join('\n') || 'None'}

Best Opportunity: ${ma['best idea']?.best_summary_of_key_trends?.[0]?.title || 'Not specified'}

Target Personas:
${ma['Persona for best idea']?.personas?.map((p: any) =>
                            `- ${p.name} (${p.demographics?.age_range}, ${p.demographics?.location}): ${p.needs?.join(', ')}`
                        ).join('\n') || 'None'}

Brand Positioning:
${ma['Brand Positioning for best idea']?.positioning_statement || 'Not specified'}

Unique Value Proposition:
${ma['Brand Positioning for best idea']?.uvp || 'Not specified'}
`.trim()
                    }
                }
                return null

            case 'content':
                // Content Ideas needs brand guidelines from brandbook
                if (brandbook?.result) {
                    const bb = brandbook.result
                    return {
                        brandContext: {
                            voiceAndTone: bb['messaging framer worker']?.voice_and_tone,
                            messagingPillars: bb['messaging framer worker']?.messaging_pillars,
                            taglines: bb['messaging framer worker']?.taglines,
                            visualIdentity: bb['visual identity advisor'],
                            brandGuidelines: bb['brand guidelines generator'],
                        }
                    }
                }
                return null

            case 'landingPage':
                // Landing Page needs content strategy and brand context
                if (contentIdeas?.result) {
                    const ci = contentIdeas.result
                    return {
                        contentContext: {
                            contentPillars: ci['conten strategy']?.content_strategy?.content_pillars,
                            monthlyThemes: ci['conten strategy']?.content_strategy?.monthly_themes,
                            campaignIdeas: ci['conten strategy']?.content_strategy?.campaign_ideas,
                            styleGuide: ci['style guide']?.style_guide,
                            topicResearch: ci['Topic Research'],
                        },
                        brandVoice: ci['style guide']?.style_guide?.voice,
                        targetAudience: ci['content writer output']?.target_audience,
                    }
                }
                if (brandbook?.result) {
                    const bb = brandbook.result
                    return {
                        brandContext: {
                            voiceAndTone: bb['messaging framer worker']?.voice_and_tone,
                            messagingPillars: bb['messaging framer worker']?.messaging_pillars,
                            taglines: bb['messaging framer worker']?.taglines,
                            visualIdentity: bb['visual identity advisor'],
                            brandGuidelines: bb['brand guidelines generator'],
                        },
                        brandVoice: bb['messaging framer worker']?.voice_and_tone,
                    }
                }
                return null

            case 'linkedin':
                // LinkedIn Post needs content strategy and brand voice
                if (contentIdeas?.result) {
                    const ci = contentIdeas.result
                    return {
                        contentContext: {
                            styleGuide: ci['style guide']?.style_guide,
                            topicResearch: ci['Topic Research'],
                            contentTopics: ci['conten strategy']?.content_strategy?.content_topics?.social_media,
                        },
                        targetAudience: ci['content writer output']?.target_audience,
                    }
                }
                if (brandbook?.result) {
                    const bb = brandbook.result
                    return {
                        voiceAndTone: bb['messaging framer worker']?.voice_and_tone,
                        messagingPillars: bb['messaging framer worker']?.messaging_pillars,
                    }
                }
                return null

            case 'seo':
                // SEO Audit needs the landing page URL if available
                if (landingPage?.result?.url) {
                    return {
                        url: landingPage.result.url
                    }
                }
                return null

            default:
                return null
        }
    }

    return (
        <WorkflowContext.Provider
            value={{
                workflowData,
                setWorkflowData,
                clearWorkflowData,
                getInputForAgent,
            }}
        >
            {children}
        </WorkflowContext.Provider>
    )
}

export function useWorkflow() {
    const context = useContext(WorkflowContext)
    if (!context) {
        throw new Error('useWorkflow must be used within WorkflowProvider')
    }
    return context
}

"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResumeBuilder } from "@/components/resume/resume-builder"
import { ResumeAnalyzer } from "@/components/resume/resume-analyzer"

export default function ResumePage() {
  const [activeTab, setActiveTab] = useState("builder")

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Resume Tools</h1>

      <Tabs defaultValue="builder" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="builder">Resume Builder</TabsTrigger>
          <TabsTrigger value="analyzer">Resume Analyzer</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="mt-6">
          <ResumeBuilder />
        </TabsContent>

        <TabsContent value="analyzer" className="mt-6">
          <ResumeAnalyzer />
        </TabsContent>
      </Tabs>
    </div>
  )
}


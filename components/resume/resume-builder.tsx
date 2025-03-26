"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Save, FileText } from "lucide-react"
import type { Resume, ResumeSection } from "@/types/resume"
import { loadResumes, saveResume } from "@/lib/resume-storage"
import { FileUpload, FileDownload } from "./file-upload"
import { v4 as uuidv4 } from "uuid"

export function ResumeBuilder() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [currentResume, setCurrentResume] = useState<Resume>({
    id: uuidv4(),
    name: "Untitled Resume",
    sections: [
      { id: uuidv4(), title: "Professional Summary", content: "" },
      { id: uuidv4(), title: "Work Experience", content: "" },
      { id: uuidv4(), title: "Education", content: "" },
      { id: uuidv4(), title: "Skills", content: "" },
    ],
    lastUpdated: new Date().toISOString(),
  })
  const [resumeContent, setResumeContent] = useState<string>("")
  const [fileType, setFileType] = useState<string>(".md")

  useEffect(() => {
    const loadedResumes = loadResumes()
    setResumes(loadedResumes)

    if (loadedResumes.length > 0) {
      setCurrentResume(loadedResumes[0])
    }
  }, [])

  useEffect(() => {
    // Generate markdown content from resume sections
    const content = generateResumeContent(currentResume)
    setResumeContent(content)
  }, [currentResume])

  const generateResumeContent = (resume: Resume): string => {
    let content = `# ${resume.name}\n\n`

    resume.sections.forEach((section) => {
      content += `## ${section.title}\n\n${section.content}\n\n`
    })

    return content
  }

  const handleResumeNameChange = (name: string) => {
    setCurrentResume((prev) => ({ ...prev, name, lastUpdated: new Date().toISOString() }))
  }

  const handleSectionTitleChange = (id: string, title: string) => {
    setCurrentResume((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => (section.id === id ? { ...section, title } : section)),
      lastUpdated: new Date().toISOString(),
    }))
  }

  const handleSectionContentChange = (id: string, content: string) => {
    setCurrentResume((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => (section.id === id ? { ...section, content } : section)),
      lastUpdated: new Date().toISOString(),
    }))
  }

  const addSection = () => {
    setCurrentResume((prev) => ({
      ...prev,
      sections: [...prev.sections, { id: uuidv4(), title: "New Section", content: "" }],
      lastUpdated: new Date().toISOString(),
    }))
  }

  const removeSection = (id: string) => {
    setCurrentResume((prev) => ({
      ...prev,
      sections: prev.sections.filter((section) => section.id !== id),
      lastUpdated: new Date().toISOString(),
    }))
  }

  const handleSaveResume = () => {
    const updatedResumes = saveResume(currentResume)
    setResumes(updatedResumes)
  }

  const createNewResume = () => {
    const newResume: Resume = {
      id: uuidv4(),
      name: "Untitled Resume",
      sections: [
        { id: uuidv4(), title: "Professional Summary", content: "" },
        { id: uuidv4(), title: "Work Experience", content: "" },
        { id: uuidv4(), title: "Education", content: "" },
        { id: uuidv4(), title: "Skills", content: "" },
      ],
      lastUpdated: new Date().toISOString(),
    }

    setCurrentResume(newResume)
  }

  const loadResumeFromFile = (content: string, fileName: string, fileType: string) => {
    setFileType(fileType)

    // For markdown files, parse the content into sections
    if (fileType === ".md" || fileType === ".txt") {
      const sections: ResumeSection[] = []
      let currentTitle = ""
      let currentContent = ""

      // Simple markdown parser
      const lines = content.split("\n")
      let resumeName = "Imported Resume"

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]

        // Parse resume name (first h1)
        if (line.startsWith("# ") && resumeName === "Imported Resume") {
          resumeName = line.substring(2).trim()
          continue
        }

        // Parse section titles (h2)
        if (line.startsWith("## ")) {
          // Save previous section if exists
          if (currentTitle) {
            sections.push({
              id: uuidv4(),
              title: currentTitle,
              content: currentContent.trim(),
            })
          }

          currentTitle = line.substring(3).trim()
          currentContent = ""
        } else if (currentTitle) {
          currentContent += line + "\n"
        }
      }

      // Add the last section
      if (currentTitle) {
        sections.push({
          id: uuidv4(),
          title: currentTitle,
          content: currentContent.trim(),
        })
      }

      // If no sections were found, create a default one with all content
      if (sections.length === 0) {
        sections.push({
          id: uuidv4(),
          title: "Content",
          content: content.trim(),
        })
      }

      const newResume: Resume = {
        id: uuidv4(),
        name: resumeName || fileName.replace(/\.[^/.]+$/, ""),
        sections,
        lastUpdated: new Date().toISOString(),
      }

      setCurrentResume(newResume)
    } else {
      // For other file types, just store the raw content in a single section
      const newResume: Resume = {
        id: uuidv4(),
        name: fileName.replace(/\.[^/.]+$/, ""),
        sections: [
          {
            id: uuidv4(),
            title: "Imported Content",
            content: "Imported from " + fileName,
          },
        ],
        lastUpdated: new Date().toISOString(),
      }

      setCurrentResume(newResume)
      setResumeContent(content)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FileUpload onFileUpload={loadResumeFromFile} />

        <Card>
          <CardHeader>
            <CardTitle>Resume Builder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="resume-name">Resume Name</Label>
              <Input
                id="resume-name"
                value={currentResume.name}
                onChange={(e) => handleResumeNameChange(e.target.value)}
              />
            </div>

            {currentResume.sections.map((section) => (
              <div key={section.id} className="space-y-2 border p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <Input
                    value={section.title}
                    onChange={(e) => handleSectionTitleChange(section.id, e.target.value)}
                    className="font-medium"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSection(section.id)}
                    disabled={currentResume.sections.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea
                  value={section.content}
                  onChange={(e) => handleSectionContentChange(section.id, e.target.value)}
                  rows={5}
                  placeholder={`Enter ${section.title.toLowerCase()} details...`}
                />
              </div>
            ))}

            <Button onClick={addSection} variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Section
            </Button>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={createNewResume}>
              <FileText className="mr-2 h-4 w-4" /> New Resume
            </Button>
            <Button onClick={handleSaveResume}>
              <Save className="mr-2 h-4 w-4" /> Save Resume
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resume Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap font-mono text-sm">{resumeContent}</div>
        </CardContent>
        <CardFooter>
          <FileDownload
            content={resumeContent}
            fileName={`${currentResume.name.replace(/\s+/g, "_")}`}
            fileType={fileType}
          />
        </CardFooter>
      </Card>
    </div>
  )
}


"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Upload, Download, FileText, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface FileUploadProps {
  onFileUpload: (content: string, fileName: string, fileType: string) => void
  acceptedFormats?: string[]
}

export function FileUpload({
  onFileUpload,
  acceptedFormats = [".md", ".pdf", ".docx", ".csv", ".txt"],
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const validateFile = (file: File): boolean => {
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`
    if (!acceptedFormats.includes(fileExtension)) {
      setError(`Invalid file format. Accepted formats: ${acceptedFormats.join(", ")}`)
      return false
    }

    // 10MB max file size
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit")
      return false
    }

    return true
  }

  const processFile = async (file: File) => {
    if (!validateFile(file)) return

    setError(null)
    setFileName(file.name)

    try {
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`

      // For text-based files, read as text
      if ([".txt", ".md", ".csv"].includes(fileExtension)) {
        const text = await file.text()
        onFileUpload(text, file.name, fileExtension)
      }
      // For binary files, read as base64
      else {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          onFileUpload(result, file.name, fileExtension)
        }
        reader.readAsDataURL(file)
      }
    } catch (err) {
      console.error("Error processing file:", err)
      setError("Failed to process file")
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Resume</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            dragActive ? "border-primary bg-primary/10" : "border-gray-300"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <Upload className="h-10 w-10 text-gray-400" />
            <div>
              <p className="text-sm font-medium">Drag and drop your resume file here, or</p>
              <p className="text-xs text-gray-500 mt-1">Supported formats: {acceptedFormats.join(", ")}</p>
            </div>
            <Button onClick={handleButtonClick} variant="outline">
              Browse Files
            </Button>
            <Input
              ref={inputRef}
              type="file"
              className="hidden"
              accept={acceptedFormats.join(",")}
              onChange={handleChange}
            />
          </div>
        </div>

        {fileName && (
          <div className="mt-4 p-3 bg-gray-100 rounded-md flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-500" />
              <span className="text-sm font-medium">{fileName}</span>
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

interface FileDownloadProps {
  content: string
  fileName: string
  fileType: string
}

export function FileDownload({ content, fileName, fileType }: FileDownloadProps) {
  const handleDownload = () => {
    let blob
    const downloadFileName = fileName || `resume${fileType}`

    // Create appropriate blob based on file type
    if (fileType === ".txt" || fileType === ".md" || fileType === ".csv") {
      blob = new Blob([content], { type: "text/plain" })
    } else if (fileType === ".pdf") {
      // For PDF, the content should be base64 encoded
      const base64Data = content.split(",")[1]
      const binaryData = atob(base64Data)
      const bytes = new Uint8Array(binaryData.length)
      for (let i = 0; i < binaryData.length; i++) {
        bytes[i] = binaryData.charCodeAt(i)
      }
      blob = new Blob([bytes], { type: "application/pdf" })
    } else {
      // Default case
      blob = new Blob([content], { type: "application/octet-stream" })
    }

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = downloadFileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Button onClick={handleDownload} className="w-full">
      <Download className="mr-2 h-4 w-4" /> Download Resume
    </Button>
  )
}


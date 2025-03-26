"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileUpload } from "./file-upload"
import { AIConfigPanel } from "./ai-config"
import { loadAIConfigurations } from "@/lib/resume-storage"
import { callMistralAPI, callGeminiAPI } from "@/lib/ai-utils"
import type { AnalysisResult } from "@/types/resume"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

export function ResumeAnalyzer() {
  const [resumeContent, setResumeContent] = useState<string>("")
  const [fileName, setFileName] = useState<string>("")
  const [fileType, setFileType] = useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const handleFileUpload = (content: string, fileName: string, fileType: string) => {
    setResumeContent(content)
    setFileName(fileName)
    setFileType(fileType)
    setAnalysisResult(null)
    setError(null)
  }

  const analyzeResume = async () => {
    if (!resumeContent) {
      setError("Please upload a resume to analyze")
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setProgress(10)

    try {
      const config = loadAIConfigurations()
      const activeProvider = config.activeProvider
      const providerConfig = config[activeProvider]

      if (!providerConfig.apiKey) {
        setError(`Please configure your ${activeProvider === "mistral" ? "Mistral AI" : "Google Gemini"} API key first`)
        setIsAnalyzing(false)
        return
      }

      setProgress(30)

      // Prepare the prompt for resume analysis
      const prompt = `
If the information not a personal/professional/educational resume about an individual/corporate personality, then show a message to change the document to a vlid resume. So only real resume will accept and go to the next steps.

Please analyze the following resume and provide feedback in this JSON format:
{
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
  "score": (a number between 0-100),
  "detailedFeedback": "detailed paragraph of feedback"
}

Resume content:
${resumeContent}
`

      setProgress(50)

      let result
      if (activeProvider === "mistral") {
        const content = await callMistralAPI(providerConfig, prompt)
        result = JSON.parse(content)
      } else {
        result = await callGeminiAPI(providerConfig, prompt)
      }

      setProgress(90)
      setAnalysisResult(result)
      setProgress(100)
      setIsAnalyzing(false)
    } catch (err) {
      console.error("Error analyzing resume:", err)
      setError(`Failed to analyze resume: ${err instanceof Error ? err.message : "Unknown error"}`)
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <FileUpload onFileUpload={handleFileUpload} />

          <Card>
            <CardHeader>
              <CardTitle>Resume Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {fileName ? (
                <div className="space-y-4">
                  <p className="text-sm">
                    Ready to analyze: <span className="font-medium">{fileName}</span>
                  </p>
                  <Button onClick={analyzeResume} disabled={isAnalyzing || !resumeContent} className="w-full">
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
                      </>
                    ) : (
                      "Analyze Resume"
                    )}
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Upload a resume to analyze its strengths and weaknesses.</p>
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
        </div>

        <AIConfigPanel />
      </div>

      {isAnalyzing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p className="text-center font-medium">Analyzing your resume...</p>
              <Progress value={progress} className="w-full" />
              <p className="text-center text-sm text-gray-500">
                This may take a few moments. We're using AI to evaluate your resume.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Analysis Results</span>
              <div className="flex items-center">
                <span className="text-sm mr-2">Resume Score:</span>
                <span
                  className={`text-lg font-bold ${
                    analysisResult.score >= 80
                      ? "text-green-600"
                      : analysisResult.score >= 60
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {analysisResult.score}/100
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-green-600 mb-2">Strengths</h3>
              <ul className="list-disc pl-5 space-y-1">
                {analysisResult.strengths.map((strength, index) => (
                  <li key={index} className="text-sm">
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-red-600 mb-2">Areas for Improvement</h3>
              <ul className="list-disc pl-5 space-y-1">
                {analysisResult.weaknesses.map((weakness, index) => (
                  <li key={index} className="text-sm">
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-blue-600 mb-2">Suggestions</h3>
              <ul className="list-disc pl-5 space-y-1">
                {analysisResult.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm">
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-orange-500 mb-2">Recommendations</h3>
              <ul className="list-disc pl-5 space-y-1">
                {analysisResult.recommendations.map((recommendation, index) => (
                  <li key={index} className="text-sm">
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Detailed Feedback</h3>
              <p className="text-sm">{analysisResult.detailedFeedback}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


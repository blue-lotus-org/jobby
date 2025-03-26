export type AIProvider = "mistral" | "gemini"

export type AIConfig = {
  provider: AIProvider
  apiKey: string
  apiEndpoint: string
  mode: "standard" | "advanced"
}

export type AIConfigurations = {
  mistral: AIConfig
  gemini: AIConfig
  activeProvider: AIProvider
}

export type ResumeSection = {
  id: string
  title: string
  content: string
}

export type Resume = {
  id: string
  name: string
  sections: ResumeSection[]
  lastUpdated: string
}

export type AnalysisResult = {
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  score: number
  detailedFeedback: string
}


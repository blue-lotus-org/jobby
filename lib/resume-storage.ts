import type { AIConfigurations, AIProvider, Resume } from "@/types/resume"

const AI_CONFIG_KEY = "jobapps_ai_config"
const RESUMES_KEY = "jobapps_resumes"

// Default AI configurations
export const defaultAIConfigurations: AIConfigurations = {
  mistral: {
    provider: "mistral",
    apiKey: "",
    apiEndpoint: "https://api.mistral.ai/v1/chat/completions",
    mode: "standard",
  },
  gemini: {
    provider: "gemini",
    apiKey: "",
    apiEndpoint: "https://generativelanguage.googleapis.com/v1beta",
    mode: "standard",
  },
  activeProvider: "mistral",
}

// Load AI configurations from localStorage
export function loadAIConfigurations(): AIConfigurations {
  if (typeof window === "undefined") {
    return defaultAIConfigurations
  }

  const storedConfig = localStorage.getItem(AI_CONFIG_KEY)
  if (!storedConfig) {
    return defaultAIConfigurations
  }

  try {
    return JSON.parse(storedConfig) as AIConfigurations
  } catch (error) {
    console.error("Failed to parse AI configurations:", error)
    return defaultAIConfigurations
  }
}

// Save AI configurations to localStorage
export function saveAIConfigurations(config: AIConfigurations): void {
  if (typeof window === "undefined") {
    return
  }

  localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(config))
}

// Update a specific AI provider configuration
export function updateAIConfiguration(
  provider: AIProvider,
  config: Partial<AIConfigurations[AIProvider]>,
): AIConfigurations {
  const currentConfig = loadAIConfigurations()
  const updatedConfig = {
    ...currentConfig,
    [provider]: {
      ...currentConfig[provider],
      ...config,
    },
  }

  saveAIConfigurations(updatedConfig)
  return updatedConfig
}

// Set the active AI provider
export function setActiveAIProvider(provider: AIProvider): AIConfigurations {
  const currentConfig = loadAIConfigurations()
  const updatedConfig = {
    ...currentConfig,
    activeProvider: provider,
  }

  saveAIConfigurations(updatedConfig)
  return updatedConfig
}

// Load resumes from localStorage
export function loadResumes(): Resume[] {
  if (typeof window === "undefined") {
    return []
  }

  const storedResumes = localStorage.getItem(RESUMES_KEY)
  if (!storedResumes) {
    return []
  }

  try {
    return JSON.parse(storedResumes) as Resume[]
  } catch (error) {
    console.error("Failed to parse resumes:", error)
    return []
  }
}

// Save resumes to localStorage
export function saveResumes(resumes: Resume[]): void {
  if (typeof window === "undefined") {
    return
  }

  localStorage.setItem(RESUMES_KEY, JSON.stringify(resumes))
}

// Add or update a resume
export function saveResume(resume: Resume): Resume[] {
  const resumes = loadResumes()
  const existingIndex = resumes.findIndex((r) => r.id === resume.id)

  if (existingIndex >= 0) {
    resumes[existingIndex] = resume
  } else {
    resumes.push(resume)
  }

  saveResumes(resumes)
  return resumes
}

// Delete a resume
export function deleteResume(id: string): Resume[] {
  const resumes = loadResumes().filter((r) => r.id !== id)
  saveResumes(resumes)
  return resumes
}


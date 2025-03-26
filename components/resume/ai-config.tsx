"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { AIConfigurations, AIProvider } from "@/types/resume"
import {
  loadAIConfigurations,
  saveAIConfigurations,
  updateAIConfiguration,
  setActiveAIProvider,
} from "@/lib/resume-storage"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function AIConfigPanel() {
  const [config, setConfig] = useState<AIConfigurations | null>(null)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")

  useEffect(() => {
    setConfig(loadAIConfigurations())
  }, [])

  if (!config) {
    return <div>Loading configurations...</div>
  }

  const handleProviderChange = (provider: AIProvider) => {
    const updatedConfig = setActiveAIProvider(provider)
    setConfig(updatedConfig)
    setSaveStatus("success")
    setTimeout(() => setSaveStatus("idle"), 2000)
  }

  const handleConfigChange = (provider: AIProvider, field: keyof AIConfigurations[AIProvider], value: string) => {
    const updatedConfig = updateAIConfiguration(provider, { [field]: value })
    setConfig(updatedConfig)
  }

  const handleModeChange = (provider: AIProvider, mode: "standard" | "advanced") => {
    const updatedConfig = updateAIConfiguration(provider, { mode })
    setConfig(updatedConfig)
  }

  const saveConfig = () => {
    try {
      saveAIConfigurations(config)
      setSaveStatus("success")
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch (error) {
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 2000)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Active AI Provider</Label>
            <Select value={config.activeProvider} onValueChange={(value) => handleProviderChange(value as AIProvider)}>
              <SelectTrigger>
                <SelectValue placeholder="Select AI Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mistral">Mistral AI</SelectItem>
                <SelectItem value="gemini">Google Gemini</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="mistral">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="mistral">Mistral AI</TabsTrigger>
              <TabsTrigger value="gemini">Google Gemini</TabsTrigger>
            </TabsList>

            <TabsContent value="mistral" className="space-y-4">
              <div>
                <Label htmlFor="mistral-api-key">API Key</Label>
                <Input
                  id="mistral-api-key"
                  type="password"
                  value={config.mistral.apiKey}
                  onChange={(e) => handleConfigChange("mistral", "apiKey", e.target.value)}
                  placeholder="Enter your Mistral AI API key"
                />
              </div>
              <div>
                <Label htmlFor="mistral-endpoint">API Endpoint</Label>
                <Input
                  id="mistral-endpoint"
                  value={config.mistral.apiEndpoint}
                  onChange={(e) => handleConfigChange("mistral", "apiEndpoint", e.target.value)}
                  placeholder="https://api.mistral.ai/v1/chat/completions"
                />
              </div>
              <div>
                <Label>Mode</Label>
                <Select
                  value={config.mistral.mode}
                  onValueChange={(value) => handleModeChange("mistral", value as "standard" | "advanced")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="gemini" className="space-y-4">
              <div>
                <Label htmlFor="gemini-api-key">API Key</Label>
                <Input
                  id="gemini-api-key"
                  type="password"
                  value={config.gemini.apiKey}
                  onChange={(e) => handleConfigChange("gemini", "apiKey", e.target.value)}
                  placeholder="Enter your Google Gemini API key"
                />
              </div>
              <div>
                <Label htmlFor="gemini-endpoint">API Endpoint</Label>
                <Input
                  id="gemini-endpoint"
                  value={config.gemini.apiEndpoint}
                  onChange={(e) => handleConfigChange("gemini", "apiEndpoint", e.target.value)}
                  placeholder="https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
                />
              </div>
              <div>
                <Label>Mode</Label>
                <Select
                  value={config.gemini.mode}
                  onValueChange={(value) => handleModeChange("gemini", value as "standard" | "advanced")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>

          <Button onClick={saveConfig} className="w-full">
            Save Configuration
          </Button>

          {saveStatus === "success" && (
            <Alert variant="default" className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>AI configuration saved successfully.</AlertDescription>
            </Alert>
          )}

          {saveStatus === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Failed to save AI configuration.</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  )
}


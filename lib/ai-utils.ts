import type { AIConfig } from "@/types/resume"

export async function callMistralAPI(config: AIConfig, prompt: string) {
  const response = await fetch(config.apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.mode === "advanced" ? "mistral-large-latest" : "mistral-small-latest",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    }),
  })

  if (!response.ok) {
    throw new Error(`Mistral API error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

export async function callGeminiAPI(config: AIConfig, prompt: string) {
  // Fix the Gemini API endpoint format
  const apiEndpoint = config.apiEndpoint.endsWith("/") ? config.apiEndpoint : `${config.apiEndpoint}/`

  // The correct endpoint format for Gemini
  const url = `${apiEndpoint}models/gemini-pro:generateContent?key=${config.apiKey}`

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} - ${await response.text()}`)
  }

  const data = await response.json()
  const content = data.candidates[0].content.parts[0].text

  // Extract JSON from the response (Gemini might wrap it in markdown code blocks)
  const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) ||
    content.match(/```\n([\s\S]*?)\n```/) || [null, content]
  const jsonContent = jsonMatch[1] || content

  try {
    return JSON.parse(jsonContent)
  } catch (e) {
    // If parsing fails, try to extract just the JSON part
    const startBrace = content.indexOf("{")
    const endBrace = content.lastIndexOf("}")
    if (startBrace >= 0 && endBrace >= 0) {
      const jsonSubstring = content.substring(startBrace, endBrace + 1)
      return JSON.parse(jsonSubstring)
    } else {
      throw new Error("Failed to parse JSON response from Gemini")
    }
  }
}


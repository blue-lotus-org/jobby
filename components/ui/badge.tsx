"use client"

import { useEffect, useState } from "react"
import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  industry?: string
}

const defaultIndustryColors: { [key: string]: string } = {
  Technology: "bg-blue-100 text-blue-800",
  Healthcare: "bg-green-100 text-green-800",
  Finance: "bg-yellow-100 text-yellow-800",
  Education: "bg-purple-100 text-purple-800",
  Manufacturing: "bg-gray-100 text-gray-800",
  Retail: "bg-pink-100 text-pink-800",
  Hospitality: "bg-orange-100 text-orange-800",
  Media: "bg-indigo-100 text-indigo-800",
  Transportation: "bg-teal-100 text-teal-800",
  Energy: "bg-red-100 text-red-800",
  Agriculture: "bg-lime-100 text-lime-800",
  Construction: "bg-amber-100 text-amber-800",
}

function Badge({ className, variant, industry, ...props }: BadgeProps) {
  const [industryColors, setIndustryColors] = useState(defaultIndustryColors)

  // Load custom industries from localStorage and assign colors
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedIndustries = localStorage.getItem("jobapps_industries")
      if (savedIndustries) {
        try {
          const parsedIndustries = JSON.parse(savedIndustries)
          const colors = { ...defaultIndustryColors }

          // Assign colors to any new industries not in the default list
          parsedIndustries.forEach((ind: any, index: number) => {
            if (!colors[ind.name]) {
              // Cycle through a set of predefined colors for new industries
              const colorOptions = [
                "bg-blue-100 text-blue-800",
                "bg-green-100 text-green-800",
                "bg-yellow-100 text-yellow-800",
                "bg-purple-100 text-purple-800",
                "bg-gray-100 text-gray-800",
                "bg-pink-100 text-pink-800",
                "bg-orange-100 text-orange-800",
                "bg-indigo-100 text-indigo-800",
                "bg-teal-100 text-teal-800",
                "bg-red-100 text-red-800",
                "bg-lime-100 text-lime-800",
                "bg-amber-100 text-amber-800",
              ]
              colors[ind.name] = colorOptions[index % colorOptions.length]
            }
          })

          setIndustryColors(colors)
        } catch (error) {
          console.error("Error parsing industries for badge colors:", error)
        }
      }
    }
  }, [])

  const industryClass = industry && industryColors[industry] ? industryColors[industry] : ""
  return <div className={cn(badgeVariants({ variant }), industryClass, className)} {...props} />
}

export { Badge, badgeVariants }


"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Laptop,
  Stethoscope,
  Banknote,
  GraduationCap,
  Factory,
  ShoppingBag,
  Utensils,
  Video,
  Truck,
  Zap,
  Wheat,
  HardHat,
  FileText,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  ArrowUpRight,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const defaultIndustries = [
  { name: "Technology", icon: Laptop },
  { name: "Healthcare", icon: Stethoscope },
  { name: "Finance", icon: Banknote },
  { name: "Education", icon: GraduationCap },
  { name: "Manufacturing", icon: Factory },
  { name: "Retail", icon: ShoppingBag },
  { name: "Hospitality", icon: Utensils },
  { name: "Media", icon: Video },
  { name: "Transportation", icon: Truck },
  { name: "Energy", icon: Zap },
  { name: "Agriculture", icon: Wheat },
  { name: "Construction", icon: HardHat },
]

// Map of industry names to icon components
const industryIcons = {
  Laptop,
  Stethoscope,
  Banknote,
  GraduationCap,
  Factory,
  ShoppingBag,
  Utensils,
  Video,
  Truck,
  Zap,
  Wheat,
  HardHat,
}

interface SidebarProps {
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void
}

export function Sidebar({ selectedCategory, setSelectedCategory }: SidebarProps) {
  const pathname = usePathname()
  const [industries, setIndustries] = useState(() => {
    if (typeof window !== "undefined") {
      const savedIndustries = localStorage.getItem("jobapps_industries")
      return savedIndustries ? JSON.parse(savedIndustries) : defaultIndustries
    }
    return defaultIndustries
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newIndustryName, setNewIndustryName] = useState("")
  const [newIndustryIcon, setNewIndustryIcon] = useState("Laptop")
  const [editingIndustry, setEditingIndustry] = useState<{ index: number; name: string; icon: string } | null>(null)

  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null) // Deselect if already selected
    } else {
      setSelectedCategory(category) // Select the new category
    }
  }

  const saveIndustries = (updatedIndustries: typeof industries) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("jobapps_industries", JSON.stringify(updatedIndustries))
    }
    setIndustries(updatedIndustries)
  }

  const addIndustry = () => {
    if (!newIndustryName.trim()) return

    const updatedIndustries = [
      ...industries,
      { name: newIndustryName, icon: newIndustryIcon as keyof typeof industryIcons },
    ]

    saveIndustries(updatedIndustries)
    setNewIndustryName("")
    setNewIndustryIcon("Laptop")
    setIsAddDialogOpen(false)
  }

  const startEditIndustry = (index: number) => {
    const industry = industries[index]
    setEditingIndustry({
      index,
      name: industry.name,
      icon: industry.icon,
    })
  }

  const saveEditIndustry = () => {
    if (!editingIndustry) return

    const updatedIndustries = [...industries]
    updatedIndustries[editingIndustry.index] = {
      name: editingIndustry.name,
      icon: editingIndustry.icon as keyof typeof industryIcons,
    }

    saveIndustries(updatedIndustries)
    setEditingIndustry(null)
  }

  const cancelEditIndustry = () => {
    setEditingIndustry(null)
  }

  const removeIndustry = (index: number) => {
    const updatedIndustries = industries.filter((_, i) => i !== index)
    saveIndustries(updatedIndustries)

    // If the deleted industry was selected, clear the selection
    if (selectedCategory === industries[index].name) {
      setSelectedCategory(null)
    }
  }

  return (
    <div className="hidden w-64 border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-4">
          <Link className="flex items-center gap-2 font-semibold" href="/">
            <span className="text-lg">JobApps</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-4 py-4 px-2">
            {/* Tools section moved to the top */}
            <div>
              <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Tools</h2>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/resume">
                    <FileText className="mr-2 h-4 w-4" />
                    Resume Tools
                  </Link>
                </Button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 px-2">
                <h2 className="text-lg font-semibold tracking-tight">Industry</h2>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Industry</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Industry Name</label>
                        <Input
                          value={newIndustryName}
                          onChange={(e) => setNewIndustryName(e.target.value)}
                          placeholder="Enter industry name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Icon</label>
                        <div className="grid grid-cols-6 gap-2">
                          {Object.keys(industryIcons).map((iconName) => {
                            const IconComponent = industryIcons[iconName as keyof typeof industryIcons]
                            return (
                              <Button
                                key={iconName}
                                variant={newIndustryIcon === iconName ? "default" : "outline"}
                                className="h-10 w-10 p-0"
                                onClick={() => setNewIndustryIcon(iconName)}
                              >
                                <IconComponent className="h-5 w-5" />
                              </Button>
                            )
                          })}
                        </div>
                      </div>
                      <Button onClick={addIndustry} className="w-full">
                        Add Industry
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="space-y-1">
                {industries.map((industry, index) => {
                  const IconComponent = industryIcons[industry.icon as keyof typeof industryIcons] || Laptop
                  const isEditing = editingIndustry?.index === index

                  return (
                    <div key={`${industry.name}-${index}`} className="flex items-center">
                      {isEditing ? (
                        <div className="flex items-center w-full space-x-1 pr-1">
                          <Input
                            value={editingIndustry.name}
                            onChange={(e) => setEditingIndustry({ ...editingIndustry, name: e.target.value })}
                            className="h-8 text-sm"
                          />
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={saveEditIndustry}>
                            <Check className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={cancelEditIndustry}>
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Button
                            variant={selectedCategory === industry.name ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => handleCategoryClick(industry.name)}
                          >
                            <IconComponent className="mr-2 h-4 w-4" />
                            {industry.name}
                          </Button>
                          <div className="flex">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => startEditIndustry(index)}
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => removeIndustry(index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="mt-auto p-4 border-t">
          <div className="flex items-center justify-center">
            <a
              href="https://lotuschain.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:underline"
            >
              Blue Lotus
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}


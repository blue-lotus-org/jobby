"use client"

import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import React, { useState } from "react"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen">
          <Sidebar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
          <main className="flex-1 overflow-y-auto p-8">
            {React.Children.map(children, (child) =>
              React.isValidElement(child)
                ? React.cloneElement(child, { selectedCategory, setSelectedCategory })
                : child,
            )}
          </main>
        </div>
      </body>
    </html>
  )
}


"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { JobCard } from "@/components/job-card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { JobForm } from "@/components/job-form"
import type { Job } from "@/types/job"

const initialJobs: Job[] = [
  {
    id: "1",
    company: "Tech Corp",
    position: "Software Engineer",
    dateApplied: "2023-05-01",
    status: "Applied",
    industry: "Technology",
    estimatedSalary: 80000,
  },
  {
    id: "2",
    company: "Data Inc",
    position: "Data Analyst",
    dateApplied: "2023-05-03",
    status: "Applied",
    industry: "Technology",
    estimatedSalary: 70000,
  },
  {
    id: "3",
    company: "Design Solutions",
    position: "UX Designer",
    dateApplied: "2023-05-05",
    status: "Applied",
    industry: "Technology",
    estimatedSalary: 75000,
  },
  {
    id: "4",
    company: "City High School",
    position: "Teacher",
    dateApplied: "2023-04-15",
    status: "Interviewing",
    industry: "Education",
    estimatedSalary: 55000,
  },
  {
    id: "5",
    company: "Investment Bank",
    position: "Financial Analyst",
    dateApplied: "2023-04-20",
    status: "Interviewing",
    industry: "Finance",
    estimatedSalary: 85000,
  },
  {
    id: "6",
    company: "Retail Chain",
    position: "Store Manager",
    dateApplied: "2023-03-10",
    status: "Offer",
    industry: "Retail",
    estimatedSalary: 60000,
  },
  {
    id: "7",
    company: "City Hospital",
    position: "Nurse",
    dateApplied: "2023-03-15",
    status: "Offer",
    industry: "Healthcare",
    estimatedSalary: 70000,
  },
  {
    id: "8",
    company: "University",
    position: "Professor",
    dateApplied: "2023-02-01",
    status: "Rejected",
    industry: "Education",
    estimatedSalary: 90000,
  },
  {
    id: "9",
    company: "Fashion Outlet",
    position: "Sales Associate",
    dateApplied: "2023-02-15",
    status: "Rejected",
    industry: "Retail",
    estimatedSalary: 35000,
  },
]

interface DashboardPageProps {
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void
}

export default function DashboardPage({ selectedCategory, setSelectedCategory }: DashboardPageProps) {
  const [jobs, setJobs] = useState(initialJobs)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const filteredJobs = selectedCategory ? jobs.filter((job) => job.industry === selectedCategory) : jobs

  const appliedJobs = filteredJobs.filter((job) => job.status === "Applied")
  const interviewingJobs = filteredJobs.filter((job) => job.status === "Interviewing")
  const offerJobs = filteredJobs.filter((job) => job.status === "Offer")
  const rejectedJobs = filteredJobs.filter((job) => job.status === "Rejected")

  const handleAddJob = (newJob: Omit<Job, "id">) => {
    const jobWithId = { ...newJob, id: (jobs.length + 1).toString() }
    setJobs([...jobs, jobWithId])
    setIsDialogOpen(false)
  }

  const handleUpdateJob = (updatedJob: Job) => {
    setJobs(jobs.map((job) => (job.id === updatedJob.id ? updatedJob : job)))
  }

  const handleDeleteJob = (jobToDelete: Job) => {
    setJobToDelete(jobToDelete)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteJob = () => {
    if (jobToDelete) {
      setJobs(jobs.filter((job) => job.id !== jobToDelete.id))
      setJobToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const handleMoveStatus = (job: Job, direction: "forward" | "backward") => {
    const statusOrder = ["Applied", "Interviewing", "Offer", "Rejected"]
    const currentIndex = statusOrder.indexOf(job.status)
    const newIndex = direction === "forward" ? currentIndex + 1 : currentIndex - 1

    if (newIndex >= 0 && newIndex < statusOrder.length) {
      const updatedJob = { ...job, status: statusOrder[newIndex] as Job["status"] }
      setJobs(jobs.map((j) => (j.id === job.id ? updatedJob : j)))
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> New Job Application
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Job Application</DialogTitle>
            </DialogHeader>
            <JobForm onSubmit={handleAddJob} />
          </DialogContent>
        </Dialog>
      </div>

      {selectedCategory && (
        <div className="flex items-center space-x-2">
          <p className="text-lg font-semibold">Filtered by: {selectedCategory}</p>
          <button onClick={() => setSelectedCategory(null)} className="text-sm text-blue-500 hover:underline">
            Clear filter
          </button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredJobs.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interviewingJobs.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offers Received</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{offerJobs.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-red-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejection Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredJobs.length > 0 ? Math.round((rejectedJobs.length / filteredJobs.length) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-auto">
        <div className={`space-y-4 ${appliedJobs.length > 5 ? "sm:col-span-2 lg:col-span-2" : ""}`}>
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Applied Jobs ({appliedJobs.length})</h2>
          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <div className="space-y-4">
              {appliedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  className="bg-white border-blue-200 shadow-sm"
                  onUpdate={handleUpdateJob}
                  onDelete={handleDeleteJob}
                  onMoveStatus={handleMoveStatus}
                />
              ))}
              {appliedJobs.length === 0 && <p className="text-center text-gray-500 py-4">No applied jobs</p>}
            </div>
          </div>
        </div>
        <div className={`space-y-4 ${interviewingJobs.length > 5 ? "sm:col-span-2 lg:col-span-2" : ""}`}>
          <h2 className="text-xl font-semibold mb-4 text-yellow-600">Interviewing ({interviewingJobs.length})</h2>
          <div className="p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
            <div className="space-y-4">
              {interviewingJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  className="bg-white border-yellow-200 shadow-sm"
                  onUpdate={handleUpdateJob}
                  onDelete={handleDeleteJob}
                  onMoveStatus={handleMoveStatus}
                />
              ))}
              {interviewingJobs.length === 0 && (
                <p className="text-center text-gray-500 py-4">No interviews scheduled</p>
              )}
            </div>
          </div>
        </div>
        <div className={`space-y-4 ${offerJobs.length > 5 ? "sm:col-span-2 lg:col-span-2" : ""}`}>
          <h2 className="text-xl font-semibold mb-4 text-green-600">Offers ({offerJobs.length})</h2>
          <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <div className="space-y-4">
              {offerJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  className="bg-white border-green-200 shadow-sm"
                  onUpdate={handleUpdateJob}
                  onDelete={handleDeleteJob}
                  onMoveStatus={handleMoveStatus}
                />
              ))}
              {offerJobs.length === 0 && <p className="text-center text-gray-500 py-4">No offers received</p>}
            </div>
          </div>
        </div>
        <div className={`space-y-4 ${rejectedJobs.length > 5 ? "sm:col-span-2 lg:col-span-2" : ""}`}>
          <h2 className="text-xl font-semibold mb-4 text-red-600">Rejected ({rejectedJobs.length})</h2>
          <div className="p-4 rounded-lg bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
            <div className="space-y-4">
              {rejectedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  className="bg-white border-red-200 shadow-sm"
                  onUpdate={handleUpdateJob}
                  onDelete={handleDeleteJob}
                  onMoveStatus={handleMoveStatus}
                />
              ))}
              {rejectedJobs.length === 0 && <p className="text-center text-gray-500 py-4">No rejections</p>}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete the job application for {jobToDelete?.position} at {jobToDelete?.company}?
            This action is final and cannot be undone.
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteJob}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


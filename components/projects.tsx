"use client"

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PlusCircle, Pencil, Trash2, CheckCircle, RotateCcw, Filter } from 'lucide-react'
import { useGlobalState } from '@/contexts/GlobalStateContext'

interface Project {
  id: number;
  name: string;
  clientId: number;
  status: string;
  deadline: string;
  fee: number;
}

export default function Projects() {
  const { projects, setProjects, clients } = useGlobalState();
  const [newProject, setNewProject] = useState<Project>({ id: 0, name: '', clientId: 0, status: '', deadline: '', fee: 0 })
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [filters, setFilters] = useState({ status: 'all', clientId: 'all', minFee: '', maxFee: '' })

  const handleProjectInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewProject(prev => ({ ...prev, [name]: name === 'fee' ? parseFloat(value) || 0 : value }))
  }

  const handleProjectSelectChange = (name: string, value: string) => {
    setNewProject(prev => ({ ...prev, [name]: name === 'clientId' ? parseInt(value) : value }))
  }

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditing) {
      setProjects(prev => prev.map(project => project.id === newProject.id ? newProject : project))
    } else {
      const id = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1
      setProjects(prev => [{ ...newProject, id }, ...prev])
    }
    setNewProject({ id: 0, name: '', clientId: 0, status: '', deadline: '', fee: 0 })
    setIsProjectDialogOpen(false)
    setIsEditing(false)
  }

  const handleEditProject = (project: Project) => {
    setNewProject(project)
    setIsEditing(true)
    setIsProjectDialogOpen(true)
  }

  const handleDeleteProject = (id: number) => {
    setProjects(prev => prev.filter(project => project.id !== id))
  }

  const handleCompleteProject = (id: number) => {
    setProjects(prev => prev.map(project => 
      project.id === id ? { ...project, status: project.status === 'Completed' ? 'In Progress' : 'Completed' } : project
    ))
  }

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      return (
        (filters.status === 'all' || project.status === filters.status) &&
        (filters.clientId === 'all' || project.clientId === parseInt(filters.clientId)) &&
        (filters.minFee === '' || project.fee >= parseFloat(filters.minFee)) &&
        (filters.maxFee === '' || project.fee <= parseFloat(filters.maxFee))
      )
    })
  }, [projects, filters])

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="flex gap-2">
          <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter Projects
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filter Projects</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="statusFilter">Status</Label>
                  <Select onValueChange={(value) => handleFilterChange('status', value)} value={filters.status}>
                    <SelectTrigger id="statusFilter">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientFilter">Client</Label>
                  <Select onValueChange={(value) => handleFilterChange('clientId', value)} value={filters.clientId}>
                    <SelectTrigger id="clientFilter">
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {clients.map(client => (
                        <SelectItem key={client.id} value={client.id.toString()}>{client.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minFee">Minimum Fee</Label>
                  <Input
                    id="minFee"
                    type="number"
                    value={filters.minFee}
                    onChange={(e) => handleFilterChange('minFee', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxFee">Maximum Fee</Label>
                  <Input
                    id="maxFee"
                    type="number"
                    value={filters.maxFee}
                    onChange={(e) => handleFilterChange('maxFee', e.target.value)}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Add New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit Project' : 'Add New Project'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input id="projectName" name="name" value={newProject.name} onChange={handleProjectInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectClient">Client</Label>
                  <Select onValueChange={(value) => handleProjectSelectChange('clientId', value)} value={newProject.clientId.toString()}>
                    <SelectTrigger id="projectClient">
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map(client => (
                        <SelectItem key={client.id} value={client.id.toString()}>{client.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectStatus">Status</Label>
                  <Select onValueChange={(value) => handleProjectSelectChange('status', value)} value={newProject.status}>
                    <SelectTrigger id="projectStatus">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectDeadline">Deadline</Label>
                  <Input id="projectDeadline" name="deadline" type="date" value={newProject.deadline} onChange={handleProjectInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectFee">Project Fee</Label>
                  <Input id="projectFee" name="fee" type="number" value={newProject.fee} onChange={handleProjectInputChange} required />
                </div>
                <Button type="submit">{isEditing ? 'Update Project' : 'Add Project'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Project List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{clients.find(c => c.id === project.clientId)?.name}</TableCell>
                  <TableCell>{project.status}</TableCell>
                  <TableCell>{project.deadline}</TableCell>
                  <TableCell>${project.fee.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditProject(project)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteProject(project.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={project.status === 'Completed' ? "outline" : "default"}
                        size="sm"
                        onClick={() => handleCompleteProject(project.id)}
                        className="flex items-center"
                      >
                        {project.status === 'Completed' ? (
                          <>
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Reopen
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Complete
                          </>
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
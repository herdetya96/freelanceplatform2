"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PlusCircle, Pencil, Trash2 } from 'lucide-react'
import { useGlobalState } from '@/contexts/GlobalStateContext'

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  lead: string;
}

export default function Clients() {
  const { clients, setClients } = useGlobalState();
  const [newClient, setNewClient] = useState<Client>({ id: 0, name: '', email: '', phone: '', lead: '' })
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const handleClientInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewClient(prev => ({ ...prev, [name]: value }))
  }

  const handleClientSelectChange = (value: string) => {
    setNewClient(prev => ({ ...prev, lead: value }))
  }

  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditing) {
      setClients(prev => prev.map(client => client.id === newClient.id ? newClient : client))
    } else {
      const id = clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1
      setClients(prev => [{ ...newClient, id }, ...prev])
    }
    setNewClient({ id: 0, name: '', email: '', phone: '', lead: '' })
    setIsClientDialogOpen(false)
    setIsEditing(false)
  }

  const handleEditClient = (client: Client) => {
    setNewClient(client)
    setIsEditing(true)
    setIsClientDialogOpen(true)
  }

  const handleDeleteClient = (id: number) => {
    setClients(prev => prev.filter(client => client.id !== id))
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add New Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Client' : 'Add New Client'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleClientSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Client Name</Label>
                <Input id="name" name="name" value={newClient.name} onChange={handleClientInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={newClient.email} onChange={handleClientInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" value={newClient.phone} onChange={handleClientInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead">Lead Source</Label>
                <Select onValueChange={handleClientSelectChange} value={newClient.lead}>
                  <SelectTrigger id="lead">
                    <SelectValue placeholder="Select lead source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Direct Email">Direct Email</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">{isEditing ? 'Update Client' : 'Add Client'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Client List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Lead Source</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.lead}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleEditClient(client)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClient(client.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
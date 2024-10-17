"use client"

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, FolderKanban, Users, Target } from 'lucide-react'
import { useGlobalState } from '@/contexts/GlobalStateContext'

export default function Statistics() {
  const [timeFilter, setTimeFilter] = useState('all')
  const { clients, projects } = useGlobalState();

  const stats = useMemo(() => {
    const completedProjects = projects.filter(project => project.status === 'Completed');
    const totalEarnings = completedProjects.reduce((sum, project) => sum + project.fee, 0);
    const activeClients = new Set(projects.map(project => project.clientId)).size;
    const averageProjectValue = completedProjects.length > 0 ? totalEarnings / completedProjects.length : 0;

    return [
      { title: "Total Earnings", value: `$${totalEarnings.toLocaleString()}`, icon: DollarSign },
      { title: "Projects Completed", value: completedProjects.length.toString(), icon: FolderKanban },
      { title: "Total Clients", value: clients.length.toString(), icon: Users },
      { title: "Average Project Value", value: `$${averageProjectValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: Target },
    ];
  }, [clients, projects]);

  const filterEarnings = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    return projects.filter(project => {
      const projectDate = new Date(project.deadline);
      const projectYear = projectDate.getFullYear();
      const projectMonth = projectDate.getMonth() + 1;

      return project.status === 'Completed' && (
        timeFilter === 'all' ||
        (timeFilter === 'year' && projectYear === currentYear) ||
        (timeFilter === 'quarter' && projectYear === currentYear && 
         projectMonth >= Math.floor((currentMonth - 1) / 3) * 3 + 1 && 
         projectMonth < Math.floor((currentMonth - 1) / 3) * 3 + 4) ||
        (timeFilter === 'month' && projectYear === currentYear && projectMonth === currentMonth)
      );
    }).map(project => ({
      year: new Date(project.deadline).getFullYear(),
      month: new Date(project.deadline).getMonth() + 1,
      earnings: project.fee
    }));
  }

  const filteredEarnings = useMemo(filterEarnings, [projects, timeFilter]);

  const getMonthName = (month: number) => {
    return new Date(2000, month - 1, 1).toLocaleString('default', { month: 'short' });
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Statistics</h1>
        <Select onValueChange={setTimeFilter} defaultValue={timeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Earnings {timeFilter !== 'all' ? `(${timeFilter})` : ''}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Earnings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEarnings.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{`${getMonthName(item.month)} ${item.year}`}</TableCell>
                  <TableCell>${item.earnings.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { mockStaffMembers } from '@/lib/mock-data'
import { Trash2, Edit, Plus, Search } from 'lucide-react'

export default function AdminStaffPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)

  const departments = [...new Set(mockStaffMembers.map((m) => m.department))]

  const filteredMembers = mockStaffMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = !selectedDepartment || member.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const handleDelete = (id: string) => {
    console.log('Delete staff member:', id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Staff Directory</h1>
          <p className="text-foreground/70 mt-1">Manage staff members and their information</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Staff
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-foreground/40" />
              <Input
                placeholder="Search staff members..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Department Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!selectedDepartment ? 'default' : 'outline'}
                onClick={() => setSelectedDepartment(null)}
              >
                All Departments
              </Button>
              {departments.map((dept) => (
                <Button
                  key={dept}
                  variant={selectedDepartment === dept ? 'default' : 'outline'}
                  onClick={() => setSelectedDepartment(dept)}
                >
                  {dept}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <Card
            key={member.id}
            className="border-border overflow-hidden hover:shadow-lg transition"
          >
            <div className="relative w-full h-40 bg-muted">
              <Image
                src={member.profileImage}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="pt-4">
              <h3 className="font-bold text-primary text-lg mb-1">{member.name}</h3>
              <p className="text-sm text-accent font-semibold mb-2">{member.role}</p>
              <p className="text-xs text-foreground/70 mb-4 capitalize">{member.department}</p>

              {member.email && (
                <p className="text-xs text-foreground/70 mb-1 truncate">{member.email}</p>
              )}
              {member.phone && (
                <p className="text-xs text-foreground/70 mb-4">{member.phone}</p>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(member.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-foreground/70">No staff members found</p>
        </div>
      )}
    </div>
  )
}

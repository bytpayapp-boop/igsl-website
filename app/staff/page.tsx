'use client'

import { useState, useMemo } from 'react'
import { mockStaffMembers } from '@/lib/mock-data'
import { StaffCard } from '@/components/cards/staff-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export default function StaffPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')

  const departments = [...new Set(mockStaffMembers.map((member) => member.department))]

  const filteredMembers = useMemo(() => {
    return mockStaffMembers.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDepartment = !selectedDepartment || member.department === selectedDepartment
      return matchesSearch && matchesDepartment
    })
  }, [searchTerm, selectedDepartment])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Staff Directory</h1>
          <p className="text-lg text-foreground/70">
            Meet the dedicated team members serving IGSL Local Government
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-6 mb-12">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
            <Input
              placeholder="Search staff members..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Department Filter */}
          <div>
            <p className="text-sm font-medium text-foreground/70 mb-2">Department</p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!selectedDepartment ? 'default' : 'outline'}
                onClick={() => setSelectedDepartment('')}
                className="text-sm"
              >
                All Departments
              </Button>
              {departments.map((dept) => (
                <Button
                  key={dept}
                  variant={selectedDepartment === dept ? 'default' : 'outline'}
                  onClick={() => setSelectedDepartment(dept)}
                  className="text-sm"
                >
                  {dept}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Staff Grid */}
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <StaffCard key={member.id} member={member} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-foreground/70 text-lg">
              No staff members found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

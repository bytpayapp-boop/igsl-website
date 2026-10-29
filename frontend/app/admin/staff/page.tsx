'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { StaffMember } from '@/lib/types'
import { adminApi, getAdminToken } from '@/lib/api/adminApi'
import { Trash2, Edit, Plus, Search, Upload, X } from 'lucide-react'
import { toast } from 'sonner'

type StaffFormState = {
  name: string
  title: string
  role: string
  department: string
  bio: string
  email: string
  phone: string
  facebook: string
  profileImage: string
}

function toFormState(member?: Partial<StaffMember> | null): StaffFormState {
  return {
    name: member?.name || '',
    title: member?.title || '',
    role: member?.role || '',
    department: member?.department || '',
    bio: member?.bio || '',
    email: member?.email || '',
    phone: member?.phone || '',
    facebook: member?.facebook || '',
    profileImage: member?.profileImage || '',
  }
}

export default function AdminStaffPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [members, setMembers] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<StaffFormState>(toFormState())
  const [profileFile, setProfileFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const loadStaff = async () => {
    const token = getAdminToken()
    if (!token) return
    try {
      const res = await adminApi.listStaff(token)
      setMembers(res.data || [])
    } catch {
      toast.error('Failed to load staff members')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStaff()
  }, [])

  const departments = useMemo(
    () => [...new Set(members.map((m) => m.department).filter(Boolean))],
    [members]
  )

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.title || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = !selectedDepartment || member.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const openCreate = () => {
    setEditingId(null)
    setFormData(toFormState())
    setProfileFile(null)
    setImagePreview(null)
    setDialogOpen(true)
  }

  const openEdit = (member: StaffMember) => {
    setEditingId(member.id)
    setFormData(toFormState(member))
    setProfileFile(null)
    setImagePreview(member.profileImage || null)
    setDialogOpen(true)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    setProfileFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const uploadProfileImage = async (file: File) => {
    const imageForm = new FormData()
    imageForm.append('file', file)
    imageForm.append('upload_preset', 'igsl_news_uploads')
    const response = await axios.post(
      'https://api.cloudinary.com/v1_1/dadvxxgl1/upload',
      imageForm
    )
    return response.data.secure_url as string
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = getAdminToken()
    if (!token) {
      toast.error('Please log in as an admin')
      return
    }

    if (!formData.name.trim() || !formData.role.trim() || !formData.department.trim() || !formData.bio.trim()) {
      toast.error('Name, role, department, and bio are required')
      return
    }

    if (!editingId && !profileFile && !formData.profileImage) {
      toast.error('Profile image is required')
      return
    }

    setSaving(true)
    try {
      let profileImage = formData.profileImage
      if (profileFile) {
        profileImage = await uploadProfileImage(profileFile)
      }

      const payload = {
        name: formData.name.trim(),
        title: formData.title,
        role: formData.role.trim(),
        department: formData.department.trim(),
        bio: formData.bio.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        facebook: formData.facebook.trim() || null,
        profileImage,
      }

      if (editingId) {
        await adminApi.updateStaff(token, editingId, payload)
        toast.success('Staff member updated')
      } else {
        await adminApi.createStaff(token, payload)
        toast.success('Staff member added')
      }

      setDialogOpen(false)
      await loadStaff()
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Could not save staff member'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Delete this staff member? This cannot be undone.')
    if (!confirmed) return
    const token = getAdminToken()
    if (!token) return
    try {
      await adminApi.deleteStaff(token, id)
      toast.success('Staff member deleted')
      setMembers((prev) => prev.filter((member) => member.id !== id))
    } catch {
      toast.error('Failed to delete staff member')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Staff Directory</h1>
          <p className="text-foreground/70 mt-1">Add, edit, and manage public staff profiles</p>
        </div>
        <Button className="flex items-center gap-2" onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Add Staff
        </Button>
      </div>

      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-foreground/40" />
              <Input
                placeholder="Search staff members..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

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

      {loading ? (
        <p className="text-foreground/70">Loading staff members…</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <Card
              key={member.id}
              className="border-border overflow-hidden hover:shadow-lg transition"
            >
              <div className="relative w-full h-40 bg-muted">
                {member.profileImage ? (
                  <Image
                    src={member.profileImage}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                ) : null}
              </div>
              <CardContent className="pt-4">
                <h3 className="font-bold text-primary text-lg mb-1">
                  {member.title ? `${member.title} ` : ''}
                  {member.name}
                </h3>
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
                    onClick={() => openEdit(member)}
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
      )}

      {!loading && filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-foreground/70">No staff members found</p>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit staff member' : 'Add staff member'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Hon., Mr., Mrs."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" name="role" value={formData.role} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} rows={4} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                name="facebook"
                value={formData.facebook}
                onChange={handleInputChange}
                placeholder="https://www.facebook.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profileImage">Profile image</Label>
              <Input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Profile preview" className="h-40 w-full rounded-md object-cover" />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 bg-background/80"
                    onClick={() => {
                      setProfileFile(null)
                      if (!editingId) {
                        setImagePreview(null)
                        setFormData((prev) => ({ ...prev, profileImage: '' }))
                      }
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor="profileImage"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-6 text-sm text-foreground/70"
                >
                  <Upload className="mb-2 h-6 w-6" />
                  Upload profile photo
                </label>
              )}
              {imagePreview && (
                <label htmlFor="profileImage" className="text-xs text-primary cursor-pointer">
                  Choose a different image
                </label>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add staff'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

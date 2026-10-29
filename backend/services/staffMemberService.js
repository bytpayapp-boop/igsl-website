const prisma = require('../lib/prisma')

function optionalString(value) {
  if (value === undefined || value === null) return null
  const trimmed = String(value).trim()
  return trimmed || null
}

function normalizeStaffPayload(payload, { requireProfileImage = true } = {}) {
  const name = String(payload.name || '').trim()
  const title = String(payload.title || '')
  const role = String(payload.role || '').trim()
  const department = String(payload.department || '').trim()
  const bio = String(payload.bio || '').trim()
  const profileImage = String(payload.profileImage || '').trim()

  if (!name) throw new Error('name is required')
  if (!role) throw new Error('role is required')
  if (!department) throw new Error('department is required')
  if (!bio) throw new Error('bio is required')
  if (requireProfileImage && !profileImage) {
    throw new Error('profileImage is required')
  }

  return {
    name,
    title,
    role,
    department,
    bio,
    email: optionalString(payload.email),
    phone: optionalString(payload.phone),
    facebook: optionalString(payload.facebook),
    ...(profileImage ? { profileImage } : {}),
  }
}

class StaffMemberService {
  static async list() {
    return prisma.staffMember.findMany({
      orderBy: { createdAt: 'asc' },
    })
  }

  static async getById(id) {
    return prisma.staffMember.findUnique({ where: { id } })
  }

  static async create(payload) {
    const data = normalizeStaffPayload(payload, { requireProfileImage: true })
    return prisma.staffMember.create({ data })
  }

  static async update(id, payload) {
    const existing = await prisma.staffMember.findUnique({ where: { id } })
    if (!existing) {
      throw new Error('Staff member not found')
    }

    const data = normalizeStaffPayload(
      { ...existing, ...payload },
      { requireProfileImage: false }
    )

    return prisma.staffMember.update({
      where: { id },
      data,
    })
  }

  static async remove(id) {
    const existing = await prisma.staffMember.findUnique({ where: { id } })
    if (!existing) {
      throw new Error('Staff member not found')
    }
    await prisma.staffMember.delete({ where: { id } })
    return existing
  }
}

module.exports = StaffMemberService

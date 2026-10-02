/**
 * Create an admin user (run after applying the AdminUser schema).
 *
 * Usage:
 *   ADMIN_EMAIL=admin@igsl.gov.ng ADMIN_PASSWORD='secret' ADMIN_NAME='IGSL Admin' node scripts/create-admin.js
 */
require('dotenv').config()
const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD
  const fullName = process.env.ADMIN_NAME || 'IGSL Administrator'

  if (!email || !password) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD environment variables.')
    process.exit(1)
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: {
      passwordHash,
      fullName,
      isActive: true,
      role: 'SUPER_ADMIN',
    },
    create: {
      email,
      passwordHash,
      fullName,
      role: 'SUPER_ADMIN',
    },
  })

  console.log(`Admin ready: ${admin.email} (${admin.id})`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

// Blog Post Types
export interface BlogPost {
  id: string
  title: string
  slug: string
  coverImage: string
  content: string
  category: string
  tags: string[]
  author: string
  date: Date
  status: 'published' | 'draft'
}

// Archive Types
export interface ArchiveItem {
  id: string
  title: string
  slug: string
  description: string
  category: string
  year: number
  image?: string
  content: string
}

// Gallery Types
export type GalleryCategory = 'events' | 'community' | 'leadership' | 'ceremonies' | 'programs'

export interface GalleryItem {
  id: string
  image: string
  title: string
  category: GalleryCategory
  date: Date
}

// Staff Types
export interface StaffMember {
  id: string
  name: string
  role: string
  department: string
  bio: string
  email?: string
  phone?: string
  profileImage: string
}

// Application Types
export type ApplicationType = 'identification' | 'birth-certificate'
export type PaymentStatus = 'pending' | 'successful' | 'failed'
export type VerificationStatus = 'pending' | 'verified' | 'rejected'

export interface Application {
  id: string
  type: ApplicationType
  applicantName: string
  applicantEmail: string
  applicantPhone: string
  submissionDate: Date
  paymentStatus: PaymentStatus
  verificationStatus: VerificationStatus
  formData: Record<string, any>
}

// Payment Types
export interface Payment {
  id: string
  applicationId: string
  amount: number
  currency: string
  status: PaymentStatus
  transactionRef: string
  date: Date
}

// Certificate Types
export type CertificateType = 'local-govt-id' | 'birth-certificate'

export interface Certificate {
  id: string
  type: CertificateType
  applicationId: string
  referenceNumber: string
  issueDate: Date
  data: Record<string, any>
}

// Form Data Types
export interface IdentificationFormData {
  // Personal Information
  fullName: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  phone: string
  email: string
  // Address
  residentialAddress: string
  ward: string
  // Kin/Family
  kinName: string
  kinRelationship: string
  kinPhone: string
  // Documents
  passportPhotoUrl?: string
  meansOfIdUrl?: string
}

export interface BirthCertificateFormData {
  // Child Information
  childFullName: string
  dateOfBirth: string
  placeOfBirth: string
  gender: 'male' | 'female' | 'other'
  // Parent Information
  fatherName: string
  fatherOccupation: string
  motherName: string
  motherOccupation: string
  // Address
  residentialAddress: string
  ward: string
  // Documents
  birthNotificationUrl?: string
  parentIdUrl?: string
}

// Dashboard Stats
export interface DashboardStats {
  totalApplications: number
  pendingPayments: number
  successfulPayments: number
  totalBlogPosts: number
  staffCount: number
  recentActivities: RecentActivity[]
}

export interface RecentActivity {
  id: string
  type: 'application' | 'payment' | 'blog'
  description: string
  timestamp: Date
}

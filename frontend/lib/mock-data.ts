import {
  BlogPost,
  ArchiveItem,
  GalleryItem,
  StaffMember,
  Application,
  Payment,
  DashboardStats,
} from './types'

// Mock Blog Posts
export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'New LG Identification, Birth certificates Program Launched',
    slug: 'new-identification-program',
    coverImage: '/blog-1.png',
    content:
      'We are pleased to announce the launch of our new streamlined Local Government Identification program. This initiative aims to make it easier for citizens to obtain their identification documents.',
    category: 'announcements',
    tags: ['identification', 'government', 'citizens'],
    author: 'IGSL Communications',
    date: new Date('2024-03-15'),
    status: 'published',
  },
  {
    id: '2',
    title: 'Preparing our Youths for the new Era...',
    slug: 'youth-development-update',
    coverImage: '/blog-2.jpg',
    content:
      'Over 3000 (three thousand youths, both within and outside the Local Government have massively been trained and empowered on the frontier technologies in this AI era',
    category: 'updates',
    tags: ['youth', 'development', 'empowerment'],
    author: 'IGSL Development Office',
    date: new Date('2026-02-10'),
    status: 'published',
  },
   {
    id: '3',
    title: 'Meet The New Couple',
    slug: 'new-wedding',
    coverImage: '/blog-4.jpg',
    content:
      'It happend on the 10th of April, 2026 - The epitomizing ceremony that marks  the begining of a union. The honourabe Personal Asssistant to the Performing Chairman of Igbo-Eze South, Isaac Onoyima, in a white wedding with his beutiful damsel. A memorable event it was',
    category: 'leadership',
    tags: ['wedding', 'marriage', 'family'],
    author: 'IGSL Public Affairs',
    date: new Date('2026-04-10'),
    status: 'published',
  },
  {
    id: '4',
    title: 'Ultra Modern Secretariat Building, One of A Kind ',
    slug: 'ultra-modern-building',
    coverImage: '/blog-3.jpg',
    content:
      'The massive project, an ultra modern building infraastructure that started as a dream, is now fully completed, and about to be commissioned for offical use',
    category: 'infrastructure',
    tags: ['infrastructure', 'building', 'services'],
    author: 'Hon. Isaac, PA to Chaairman on Media and Publicity',
    date: new Date('2026-04-05'),
    status: 'published',
  },
 
]

// Mock Archive Items
export const mockArchiveItems: ArchiveItem[] = [
  {
    id: '1',
    title: 'Annual Report 2023',
    slug: 'annual-report-2023',
    description: 'Comprehensive annual report detailing all government activities and achievements for 2023.',
    category: 'reports',
    year: 2023,
    image: '/images/archive-1.jpg',
    content:
      'This comprehensive annual report covers all government activities, budget allocations, and key achievements for the fiscal year 2023.',
  },
  {
    id: '2',
    title: 'Community Census Results 2022',
    slug: 'census-2022',
    description: 'Population and demographic data from our latest community census.',
    category: 'census',
    year: 2022,
    image: '/images/archive-2.jpg',
    content: 'Detailed census results showing population distribution, age groups, and demographic information.',
  },
  {
    id: '3',
    title: 'Infrastructure Development Plan',
    slug: 'infra-plan-2023',
    description: 'Five-year infrastructure development strategy and implementation roadmap.',
    category: 'planning',
    year: 2023,
    image: '/images/archive-3.jpg',
    content:
      'Strategic plan for infrastructure development including roads, water systems, electricity, and public facilities.',
  },
  {
    id: '4',
    title: 'Education Sector Review 2023',
    slug: 'education-review-2023',
    description: 'Review of educational institutions and programs within the local government.',
    category: 'education',
    year: 2023,
    image: '/images/archive-4.jpg',
    content:
      'Comprehensive review of all educational facilities, enrollment statistics, and development initiatives in the education sector.',
  },
]

// Mock Gallery Items
export const mockGalleryItems: GalleryItem[] = [
  {
    id: '1',
    image: '/images/gallery-1.jpg',
    title: 'Community Clean-up Drive',
    category: 'community',
    date: new Date('2024-03-10'),
  },
  {
    id: '2',
    image: '/images/gallery-2.jpg',
    title: 'Mayor Address to Citizens',
    category: 'leadership',
    date: new Date('2024-03-08'),
  },
  {
    id: '3',
    image: '/images/gallery-3.jpg',
    title: 'Independence Day Celebration',
    category: 'ceremonies',
    date: new Date('2024-02-28'),
  },
  {
    id: '4',
    image: '/images/gallery-4.jpg',
    title: 'New Market Complex Opening',
    category: 'events',
    date: new Date('2024-02-20'),
  },
  {
    id: '5',
    image: '/images/gallery-5.jpg',
    title: 'Healthcare Program Launch',
    category: 'programs',
    date: new Date('2024-02-15'),
  },
  {
    id: '6',
    image: '/images/gallery-6.jpg',
    title: 'Youth Sports Festival',
    category: 'events',
    date: new Date('2024-02-10'),
  },
]

// Mock Staff Members
export const mockStaffMembers: StaffMember[] = [
  {
    id: '1',
    name: 'Hon. Ade Johnson',
    role: 'Chairman, IGSL',
    department: 'Executive',
    bio: 'Dedicated administrator with over 20 years of public service experience.',
    email: 'chairman@igsl.gov',
    phone: '+234-800-123-4567',
    profileImage: '/images/staff-1.jpg',
  },
  {
    id: '2',
    name: 'Mrs. Folake Adeyemi',
    role: 'Head of Finance',
    department: 'Finance',
    bio: 'Experienced financial manager ensuring transparent resource management.',
    email: 'finance@igsl.gov',
    phone: '+234-800-234-5678',
    profileImage: '/images/staff-2.jpg',
  },
  {
    id: '3',
    name: 'Engr. Seun Oluwaseun',
    role: 'Director of Works',
    department: 'Infrastructure',
    bio: 'Civil engineer overseeing all infrastructure development projects.',
    email: 'works@igsl.gov',
    phone: '+234-800-345-6789',
    profileImage: '/images/staff-3.jpg',
  },
  {
    id: '4',
    name: 'Dr. Chioma Okafor',
    role: 'Head of Health Services',
    department: 'Health',
    bio: 'Medical professional leading healthcare initiatives and programs.',
    email: 'health@igsl.gov',
    phone: '+234-800-456-7890',
    profileImage: '/images/staff-4.jpg',
  },
  {
    id: '5',
    name: 'Mr. Tunde Babalola',
    role: 'Registrar of Vital Records',
    department: 'Vital Records',
    bio: 'Responsible for birth certificates, marriages, and vital statistics.',
    email: 'records@igsl.gov',
    phone: '+234-800-567-8901',
    profileImage: '/images/staff-5.jpg',
  },
]

// Mock Applications
export const mockApplications: Application[] = [
  {
    id: 'APP-001',
    type: 'identification',
    applicantName: 'John Doe',
    applicantEmail: 'john@example.com',
    applicantPhone: '+234-800-111-1111',
    submissionDate: new Date('2024-03-10'),
    paymentStatus: 'successful',
    verificationStatus: 'verified',
    formData: {
      fullName: 'John Doe',
      dateOfBirth: '1990-05-15',
      gender: 'male',
      phone: '+234-800-111-1111',
      email: 'john@example.com',
      residentialAddress: '123 Main Street, Ward A',
      ward: 'Ward A',
    },
  },
  {
    id: 'APP-002',
    type: 'birth-certificate',
    applicantName: 'Mary Smith',
    applicantEmail: 'mary@example.com',
    applicantPhone: '+234-800-222-2222',
    submissionDate: new Date('2024-03-08'),
    paymentStatus: 'pending',
    verificationStatus: 'pending',
    formData: {
      childFullName: 'Emma Smith',
      dateOfBirth: '2023-06-20',
      gender: 'female',
    },
  },
  {
    id: 'APP-003',
    type: 'identification',
    applicantName: 'James Wilson',
    applicantEmail: 'james@example.com',
    applicantPhone: '+234-800-333-3333',
    submissionDate: new Date('2024-03-05'),
    paymentStatus: 'successful',
    verificationStatus: 'verified',
    formData: {
      fullName: 'James Wilson',
      dateOfBirth: '1985-12-10',
      gender: 'male',
    },
  },
]

// Mock Payments
export const mockPayments: Payment[] = [
  {
    id: 'PAY-001',
    applicationId: 'APP-001',
    amount: 5000,
    currency: 'NGN',
    status: 'successful',
    transactionRef: 'TRX-2024-001',
    date: new Date('2024-03-10'),
    applicantName: 'John Doe',
    referenceNumber: 'REF-001',
  },
  {
    id: 'PAY-002',
    applicationId: 'APP-002',
    amount: 3500,
    currency: 'NGN',
    status: 'pending',
    transactionRef: 'TRX-2024-002',
    date: new Date('2024-03-08'),
    applicantName: 'Jane Smith',
    referenceNumber: 'REF-002',
  },
  {
    id: 'PAY-003',
    applicationId: 'APP-003',
    amount: 5000,
    currency: 'NGN',
    status: 'successful',
    transactionRef: 'TRX-2024-003',
    date: new Date('2024-03-05'),
    applicantName: 'Michael Johnson',
    referenceNumber: 'REF-003',
  },
]

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalApplications: 156,
  pendingPayments: 12,
  successfulPayments: 138,
  totalBlogPosts: 24,
  staffCount: 45,
  recentActivities: [
    {
      id: '1',
      type: 'application',
      description: 'New identification application received',
      timestamp: new Date('2024-03-15T10:30:00'),
    },
    {
      id: '2',
      type: 'payment',
      description: 'Payment processed successfully',
      timestamp: new Date('2024-03-15T09:15:00'),
    },
    {
      id: '3',
      type: 'blog',
      description: 'New blog post published',
      timestamp: new Date('2024-03-14T14:45:00'),
    },
  ],
}

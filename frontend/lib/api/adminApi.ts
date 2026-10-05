import axios from 'axios'
import { getBackendUrl } from '@/lib/api/backendUrl'

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` }
}

export const adminApi = {
  async login(email: string, password: string) {
    const response = await axios.post(`${getBackendUrl()}/api/admin/auth/login`, {
      email,
      password,
    })
    return response.data
  },

  async getMe(token: string) {
    const response = await axios.get(`${getBackendUrl()}/api/admin/auth/me`, {
      headers: authHeaders(token),
    })
    return response.data
  },

  async getDashboardStats(token: string) {
    const response = await axios.get(`${getBackendUrl()}/api/admin/dashboard/stats`, {
      headers: authHeaders(token),
    })
    return response.data
  },

  async getApplications(token: string) {
    const response = await axios.get(`${getBackendUrl()}/api/admin/applications`, {
      headers: authHeaders(token),
    })
    return response.data
  },

  async getPayments(token: string) {
    const response = await axios.get(`${getBackendUrl()}/api/admin/payments`, {
      headers: authHeaders(token),
    })
    return response.data
  },
}

export const ADMIN_TOKEN_KEY = 'adminAccessToken'
export const ADMIN_REFRESH_KEY = 'adminRefreshToken'
export const ADMIN_USER_KEY = 'adminUser'

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(ADMIN_TOKEN_KEY)
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_TOKEN_KEY)
  localStorage.removeItem(ADMIN_REFRESH_KEY)
  localStorage.removeItem(ADMIN_USER_KEY)
}

export function formatPaymentStatus(status: string): string {
  const map: Record<string, string> = {
    SUCCESS: 'successful',
    PENDING: 'pending',
    INITIATED: 'pending',
    PROCESSING: 'pending',
    FAILED: 'failed',
    REFUNDED: 'failed',
    CANCELLED: 'failed',
  }
  return map[status] || status.toLowerCase()
}

export function formatVerificationStatus(status: string): string {
  const map: Record<string, string> = {
    VERIFIED: 'verified',
    PENDING: 'pending',
    IN_REVIEW: 'pending',
    NOT_STARTED: 'pending',
    FAILED: 'rejected',
    REJECTED: 'rejected',
  }
  return map[status] || status.toLowerCase()
}

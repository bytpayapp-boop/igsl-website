import axios from 'axios'
import { getBackendUrl } from '@/lib/api/backendUrl'
import { StaffMember } from '@/lib/types'

export async function fetchStaffMembers(): Promise<StaffMember[]> {
  const response = await axios.get(`${getBackendUrl()}/api/staff`)
  return Array.isArray(response.data?.data) ? response.data.data : []
}

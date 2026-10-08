import axios from 'axios'
import { getBackendUrl } from '@/lib/api/backendUrl'
import type { ImageKitUploadResult } from '@/lib/imagekit/config'

function adminHeaders(token: string) {
  return { Authorization: `Bearer ${token}` }
}

export const uploadApi = {
  async saveNews(
    token: string,
    payload: {
      title: string
      category: string
      content: string
      author: string
      tags?: string
      coverImage: any
    }
  ) {
    const response = await axios.post(
      `${getBackendUrl()}/api/admin/uploads/news`,
      payload,
      { headers: adminHeaders(token) }
    )
    return response.data
  },

  async saveInfo(
    token: string,
    payload: {
      title: string
      category: string
      description: string
      content: string
      image: ImageKitUploadResult
    }
  ) {
    const response = await axios.post(
      `${getBackendUrl()}/api/admin/uploads/info`,
      payload,
      { headers: adminHeaders(token) }
    )
    return response.data
  },

  async saveGallery(
    token: string,
    payload: {
      title: string
      category: string
      images: ImageKitUploadResult[]
    }
  ) {
    const response = await axios.post(
      `${getBackendUrl()}/api/admin/uploads/gallery`,
      payload,
      { headers: adminHeaders(token) }
    )
    return response.data
  },
}

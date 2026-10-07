/** ImageKit public configuration (hardcoded) */
export const IMAGEKIT_CONFIG = {
  imagekitId: 'ezehmark5050',
  urlEndpoint: 'https://ik.imagekit.io/ezehmark5050',
  publicKey: 'public_bdjVPxTSjOTFeRTdrLJwacQN9JQ=',
  uploadEndpoint: 'https://upload.imagekit.io/api/v1/files/upload',
} as const

export type ImageKitUploadResult = {
  fileId: string
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  folder: string
}

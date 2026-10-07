import { IMAGEKIT_CONFIG, type ImageKitUploadResult } from '@/lib/imagekit/config'

/**
 * Upload a file directly to ImageKit using the public key.
 * Enable "Allow unsigned uploads" in ImageKit dashboard → Developer options.
 */
export async function uploadFileToImageKit(
  file: File,
  folder: string
): Promise<ImageKitUploadResult> {
  const body = new FormData()
  body.append('file', file)
  body.append('fileName', file.name)
  body.append('folder', folder)
  body.append('publicKey', IMAGEKIT_CONFIG.publicKey)
  body.append('useUniqueFileName', 'true')

  const response = await fetch(IMAGEKIT_CONFIG.uploadEndpoint, {
    method: 'POST',
    body,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message =
      typeof data?.message === 'string'
        ? data.message
        : 'ImageKit upload failed. Enable unsigned uploads in your ImageKit dashboard or contact support.'
    throw new Error(message)
  }

  return {
    fileId: data.fileId,
    fileName: data.name || file.name,
    fileUrl: data.url,
    fileSize: data.size ?? file.size,
    mimeType: data.mime || file.type,
    folder: data.folder || folder,
  }
}

export async function uploadFilesToImageKit(
  files: File[],
  folder: string
): Promise<ImageKitUploadResult[]> {
  const results: ImageKitUploadResult[] = []
  for (const file of files) {
    results.push(await uploadFileToImageKit(file, folder))
  }
  return results
}

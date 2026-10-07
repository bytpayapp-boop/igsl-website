export const UPLOAD_MEDIA_ACCEPT = 'image/*,video/*'

export const UPLOAD_MEDIA_HINT =
  'Images up to 5MB (PNG, JPG, GIF, etc.) · Videos up to 50MB (MP4, WebM, etc.)'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const MAX_VIDEO_BYTES = 50 * 1024 * 1024

export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/')
}

/** Returns an error message, or null if the file is allowed. */
export function validateUploadMediaFile(file: File): string | null {
  const isImage = file.type.startsWith('image/')
  const isVideo = isVideoFile(file)

  if (!isImage && !isVideo) {
    return `${file.name} is not a supported image or video file`
  }

  const maxSize = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES
  if (file.size > maxSize) {
    return isVideo
      ? `${file.name} is larger than 50MB`
      : `${file.name} is larger than 5MB`
  }

  return null
}

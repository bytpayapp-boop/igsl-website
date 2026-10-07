const prisma = require('../lib/prisma')

/**
 * Persist a file reference (e.g. after ImageKit upload) on an application or user profile.
 */
async function saveUploadedDocument({
  userId,
  applicationId,
  documentType,
  fileName,
  fileUrl,
  fileSize,
  mimeType,
  imageKitFileId,
  storageFolder,
}) {
  return prisma.uploadedDocument.create({
    data: {
      userId: userId || null,
      applicationId: applicationId || null,
      documentType,
      fileName,
      fileUrl,
      fileSize,
      mimeType,
      imageKitFileId: imageKitFileId || null,
      storageFolder: storageFolder || null,
    },
  })
}

module.exports = { saveUploadedDocument }

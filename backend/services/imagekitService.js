const axios = require('axios')
const { Blob } = require('buffer')
const imagekitConfig = require('../config/imagekit')

/**
 * Server-side upload to ImageKit (requires IMAGEKIT_PRIVATE_KEY in .env).
 */
async function uploadBufferToImageKit({ buffer, fileName, mimeType, folder = 'igsl' }) {
  const { privateKey, uploadEndpoint } = imagekitConfig

  if (!privateKey) {
    throw new Error(
      'Server-side ImageKit upload requires IMAGEKIT_PRIVATE_KEY. Use client-side upload or add the private key from your ImageKit dashboard.'
    )
  }

  const form = new FormData()
  form.append('file', new Blob([buffer], { type: mimeType }), fileName)
  form.append('fileName', fileName)
  form.append('folder', folder)
  form.append('useUniqueFileName', 'true')

  const auth = Buffer.from(`${privateKey}:`).toString('base64')

  const { data } = await axios.post(uploadEndpoint, form, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
  })

  return {
    fileId: data.fileId,
    fileName: data.name,
    fileUrl: data.url,
    fileSize: data.size,
    mimeType: data.mime || mimeType,
    folder: data.folder || folder,
  }
}

function getPublicImageKitConfig() {
  const { imagekitId, urlEndpoint, publicKey, uploadEndpoint } = imagekitConfig
  return { imagekitId, urlEndpoint, publicKey, uploadEndpoint }
}

module.exports = {
  uploadBufferToImageKit,
  getPublicImageKitConfig,
}

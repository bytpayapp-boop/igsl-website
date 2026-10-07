/** ImageKit configuration (public credentials hardcoded per project setup) */
module.exports = {
  imagekitId: 'ezehmark5050',
  urlEndpoint: 'https://ik.imagekit.io/ezehmark5050',
  publicKey: 'public_bdjVPxTSjOTFeRTdrLJwacQN9JQ=',
  /** Optional: set IMAGEKIT_PRIVATE_KEY in .env for server-side uploads */
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  uploadEndpoint: 'https://upload.imagekit.io/api/v1/files/upload',
}

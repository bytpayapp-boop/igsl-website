const prisma = require('../lib/prisma')

class SiteContentService {
  static async createNews({ adminUserId, title, category, content, author, tags, coverImage }) {
    
    const data = prisma.siteContentUpload.create({
      data: {
        type: 'NEWS',
        title,
        category,
        content,
        author,
        tags: tags || null,
        coverImageUrl: coverImage,
        adminUserId: adminUserId || null,
        galleryImages: [coverImage],
      },
    })
    // console.log('News created successfully',data)
    return data;
  }

  static async createInfo({ adminUserId, title, category, description, content, image }) {
    return prisma.siteContentUpload.create({
      data: {
        type: 'INFO',
        title,
        category,
        description,
        content,
        coverImageUrl: image.fileUrl,
        adminUserId: adminUserId || null,
        galleryImages: [image],
      },
    })
  }

  static async createGallery({ adminUserId, title, category, images }) {
    const cover = images[0]
    return prisma.siteContentUpload.create({
      data: {
        type: 'GALLERY',
        title,
        category,
        coverImageUrl: cover?.fileUrl || null,
        adminUserId: adminUserId || null,
        galleryImages: images,
      },
    })
  }

  static async createArchive({ adminUserId, title, category, description, year, document }) {
    const normalizedYear = year !== undefined && year !== null && year !== '' ? Number(year) : null
    const documentMeta = document && typeof document === 'object' ? document : null
    const documentUrl = documentMeta?.fileUrl || documentMeta?.url || document || null

    if (!title || !category || !documentUrl) {
      throw new Error('Archive title, category, and document URL are required')
    }

    const payload = {
      type: 'ARCHIVE',
      title,
      category,
      description: description || '',
      content: description || '',
      tags: normalizedYear ? String(normalizedYear) : null,
      coverImageUrl: documentMeta?.thumbnailUrl || documentMeta?.previewUrl || null,
      adminUserId: adminUserId || null,
      galleryImages: documentMeta ? [documentMeta] : [],
    }

    return prisma.siteContentUpload.create({ data: payload })
  }

  static async updateGallery({ id, title, category, coverImageUrl, galleryImages }) {
    const updateData = {}

    if (title !== undefined && title !== null) {
      updateData.title = String(title).trim()
    }
    if (category !== undefined && category !== null) {
      updateData.category = String(category).trim()
    }
    if (coverImageUrl !== undefined && coverImageUrl !== null) {
      updateData.coverImageUrl = coverImageUrl
    }
    if (galleryImages !== undefined && galleryImages !== null) {
      updateData.galleryImages = galleryImages
    }

    if (!Object.keys(updateData).length) {
      throw new Error('No valid gallery fields were provided for update')
    }

    return prisma.siteContentUpload.update({
      where: { id },
      data: updateData,
    })
  }

  static async deleteGallery({ id }) {
    return prisma.siteContentUpload.delete({
      where: { id },
    })
  }

  static async listByType(type) {
    return prisma.siteContentUpload.findMany({
      where: type ? { type } : undefined,
      orderBy: { createdAt: 'desc' },
    })
  }
}

module.exports = SiteContentService

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

  static async listByType(type) {
    return prisma.siteContentUpload.findMany({
      where: type ? { type } : undefined,
      orderBy: { createdAt: 'desc' },
    })
  }
}

module.exports = SiteContentService

const { verifyAccessToken } = require('../utils/jwt')
const AdminService = require('../services/adminService')

async function adminAuthMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      res.status(401).json({ success: false, message: 'Admin authorization token is required' })
      return
    }

    const payload = verifyAccessToken(token)

    if (!payload || payload.tokenType !== 'admin' || !payload.adminId) {
      res.status(401).json({ success: false, message: 'Invalid admin token' })
      return
    }

    const admin = await AdminService.getAdminById(payload.adminId)
    if (!admin || !admin.isActive) {
      res.status(401).json({ success: false, message: 'Admin account not found or inactive' })
      return
    }

    req.admin = admin
    next()
  } catch (err) {
    res.status(401).json({
      success: false,
      message: `Error authenticating admin token: ${err.message || 'Failed'}`,
    })
  }
}

module.exports = { adminAuthMiddleware }

import { Router } from 'express'
import {
  deleteAdminEnquiry,
  getAdminEnquiry,
  getAdminEnquiryStats,
  listAdminEnquiries,
  updateAdminEnquiryStatus,
} from '../controllers/adminEnquiryController.js'
import { adminLogin, adminLogout, adminMe } from '../controllers/adminAuthController.js'
import { requireAdmin } from '../middleware/requireAdmin.js'

const router = Router()

// Public auth endpoints
router.post('/login', adminLogin)
router.post('/logout', adminLogout)

// Authenticated
router.get('/me', requireAdmin, adminMe)

router.use(requireAdmin)

router.get('/enquiries/stats', getAdminEnquiryStats)
router.get('/enquiries', listAdminEnquiries)
router.get('/enquiries/:id', getAdminEnquiry)
router.patch('/enquiries/:id/status', updateAdminEnquiryStatus)
router.delete('/enquiries/:id', deleteAdminEnquiry)

export default router

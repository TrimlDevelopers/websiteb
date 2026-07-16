import { Router } from 'express'
import {
  deleteAdminEnquiry,
  getAdminEnquiry,
  getAdminEnquiryStats,
  listAdminEnquiries,
  updateAdminEnquiryStatus,
} from '../controllers/adminEnquiryController.js'
// import { requireAdmin } from '../middleware/requireAdmin.js'

const router = Router()

// Auth disabled for now — re-enable with: router.use(requireAdmin)
// import { verifyAdminAccess } from '../controllers/adminEnquiryController.js'
// router.get('/auth/verify', verifyAdminAccess)

router.get('/enquiries/stats', getAdminEnquiryStats)
router.get('/enquiries', listAdminEnquiries)
router.get('/enquiries/:id', getAdminEnquiry)
router.patch('/enquiries/:id/status', updateAdminEnquiryStatus)
router.delete('/enquiries/:id', deleteAdminEnquiry)

export default router

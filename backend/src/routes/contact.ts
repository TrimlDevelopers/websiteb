import { Router } from 'express'
import { createContactEnquiry } from '../controllers/contactController.js'

const router = Router()

router.post('/', createContactEnquiry)

export default router

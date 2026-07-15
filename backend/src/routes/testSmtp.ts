import { Router } from 'express'
import { testSmtp } from '../controllers/testSmtpController.js'

const router = Router()

router.get('/', testSmtp)

export default router

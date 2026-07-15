import { Router } from 'express'
import { socketTest } from '../controllers/socketTestController.js'

const router = Router()

router.get('/', socketTest)

export default router

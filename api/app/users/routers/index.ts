import express from 'express'
import { byId, list, create } from '../controllers'

const router = express.Router()

router.get('/', list)
router.get('/:id', byId)
router.post('/', create)

export default router

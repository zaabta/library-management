import express from 'express'
import {
  byId,
  list,
  create,
  borrowBook,
  returnBorrowedBook,
} from '../controllers'

const router = express.Router()

router.get('/', list)
router.get('/:id', byId)
router.post('/', create)
router.post('/:userId/borrow/:bookId', borrowBook)
router.post('/:userId/return/:bookId', returnBorrowedBook)

export default router

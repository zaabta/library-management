import express from 'express'
import userRouters from '../app/users/routers';
import booksRouters from '../app/books/routers';

const router = express.Router()


router.use("/users", userRouters);
router.use("/books", booksRouters);;

export default router
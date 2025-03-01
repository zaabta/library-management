import express from 'express'
import type { Application, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import createError from 'http-errors'
import logger from 'morgan'
import routes from './routers'

dotenv.config()
const app: Application = express()

// Middleware
app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (_, res: Response) => {
  res.send('library-management api')
})
app.use('/api/v1', routes)

// 404 Handler
app.use((_, __, next: NextFunction) => {
  next(createError(404))
})

// Error Handler
app.use((err: any, req: Request, res: Response) => {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500).json({ error: err.message })
})

export default app

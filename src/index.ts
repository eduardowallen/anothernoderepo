import express, { NextFunction, Request, Response } from 'express'
import taskRoutes from './routes/tasks'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json()) // Add this line to enable JSON parsing in the request body
app.use('/tasks', taskRoutes) // Add this line to mount the Task API routes

app.get('/', (req: Request, res: Response) => {
    res.send('This is an Express server!')
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack)
    res.status(500).json({message: err.stack})
})
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})

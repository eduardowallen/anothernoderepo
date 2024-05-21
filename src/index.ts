import express, { NextFunction, Request, Response } from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerDefinition from './swaggerDef'
import taskRoutes from './routes/tasks'
import { TaskController } from './controllers/TaskController'
import pool from './models/db'
import { CREATE_TASKS_TABLE } from './models/dbsetup'

const app = express()
const port = process.env.PORT || 3000

// Swagger setup
const options = {
    swaggerDefinition,
    apis: ['./routes/*.ts'],
}
const swaggerSpec = swaggerJsdoc(options)
app.use('api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use(express.json()) // Add this line to enable JSON parsing in the request body
app.use('/tasks', taskRoutes) // Add this line to mount the Task API routes

// Initialize controllers
const taskController = new TaskController(pool)

// Initialize db tables
pool.execute(CREATE_TASKS_TABLE)

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('This is an Express server!')
})
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack)
    res.status(500).json({ message: err.stack })
})
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})
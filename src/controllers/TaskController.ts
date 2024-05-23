import mysql from 'mysql2/promise'
import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { CreateTaskDTO, Task } from '../models/task'

export class TaskController {
    private readonly pool: mysql.Pool

    constructor(pool: mysql.Pool) {
        this.pool = pool
    }

    createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() })
            return
        }
        const task: CreateTaskDTO = req.body

        try {
            await this.pool.execute(
                'INSERT INTO tasks (title, description, dueDate, priority, status, completed) VALUES (?, ?, ?, ?, ?, ?)', 
                [task.title, task.description, task.dueDate, task.priority, task.status, task.completed]
            )
            res.status(201).json({ message: "Task created successfully" })
        } catch (error) {
            res.status(500).json({ error: "Could not create task. Internal Server Error", message: error })
        }
    }

    async getAllTasks(): Promise<Task[]> {
        const [rows] = await this.pool.query('SELECT * FROM tasks')
        return rows as Task[]
    }
    async getTaskById(id: number): Promise<Task | null> {
        const [rows] = await this.pool.query('SELECT * FROM tasks WHERE id = ? LIMIT 1', id)
        const tasks = rows as Task[]
        return tasks.length ? tasks[0] : null
    }
    async getTaskIdById(id: number): Promise<Task | null> {
        const [rows] = await this.pool.query('SELECT id FROM tasks WHERE id = ? LIMIT 1', id)
        const tasks = rows as Task[]
        return tasks.length ? tasks[0] : null
    }

    async updateTask(task: Task): Promise<void> {
        await this.pool.execute(
            'UPDATE tasks SET title = ?, description = ?, dueDate = ?, priority = ?, status = ?, completed = ? WHERE id = ?',
            [task.title, task.description, task.dueDate, task.priority, task.status, task.completed, task.id]
        )
    }
}
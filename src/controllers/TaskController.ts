import mysql from 'mysql2/promise'
import { Task } from '../models/task'

export class TaskController {
    private readonly pool: mysql.Pool

    constructor(pool: mysql.Pool) {
        this.pool = pool
    }

    async getAllTasks(): Promise<Task[]> {
        const [rows] = await this.pool.query('SELECT * FROM tasks')
        return rows as Task[]
    }
    async getTaskById(id: number): Promise<Task | null> {
        const [rows] = await this.pool.query('SELECT * FROM tasks WHERE id = ? LIMIT 1', id)
        const tasks = rows as Task[]
        if (tasks.length === 0) {
            return null
        }
        return tasks[0]
    }
    async getTaskIdById(id: number): Promise<Task | null> {
        const [rows] = await this.pool.query('SELECT id FROM tasks WHERE id = ? LIMIT 1', id)
        const tasks = rows as Task[]
        if (tasks.length === 0) {
            return null
        }
        return tasks[0]
    }
    async createTask(task: Task): Promise<void> {
        await this.pool.execute('INSERT INTO tasks (title, description, dueDate, priority, status, completed) VALUES (?, ?, ?, ?, ?, ?)', [task.title, task.description, task.dueDate, task.priority, task.status, task.completed])
    }

    async updateTask(task: Task): Promise<void> {
        await this.pool.execute(
            'UPDATE tasks SET title = ?, description = ?, dueDate = ?, priority = ?, status = ?, completed = ? WHERE id = ?',
            [task.title, task.description, task.dueDate, task.priority, task.status, task.completed, task.id]
        )
    }
}
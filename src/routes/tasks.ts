import { Router, Request, Response, NextFunction } from "express"
import { Task } from "../models/task"
import { validateTaskData } from "../validators/validateTask"
import { validationResult } from "express-validator"
import { TaskController } from "../controllers/TaskController"
import pool from "../models/db"
import { Next } from "mysql2/typings/mysql/lib/parsers/typeCast"

const router: Router = Router()
let tasks: Task[] = []
const taskController = new TaskController(pool)

router.post("/tasks", validateTaskData, taskController.createTask)
/*
router.post("/tasks", validateTaskData, (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}, taskController.createTask)

router.post("/", validateTaskData, async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const taskData: Omit<Task, 'id'> = {
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate,
    priority: req.body.priority,
    status: req.body.status,
    completed: req.body.completed ?? false,
  }
  try {
    await taskController.createTask(taskData)
    res.status(201).json({
      message: "Task created successfully",
      taskData
    })
  } catch (error) {
    console.error("Error creating task:", error)
    res.status(500).json({ error: "Internal Server Error", message: error })
  }
})
*/
router.put("/:id", async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  try {
    const task = await taskController.getTaskById(parseInt(req.params.id))
    if (!task) {
        res.status(404).json({ message: "Task not found" })
    } else {
        task.id = task.id
        task.title = req.body.title || task.title
        task.description = req.body.description || task.description
        task.dueDate = req.body.dueDate || task.dueDate
        task.priority = req.body.priority || task.priority
        task.status = req.body.status || task.status
        task.completed = req.body.completed || task.completed
        try {
            await taskController.updateTask(task)
            res.status(201).json({
            message: `Task with id ${task.id} updated successfully`
            })
        } catch (error) {
            console.error("Error updating task:", error)
            res.status(500).json({ error: "Internal Server Error", message: error })
        }
    }
  } catch {
    res.status(500).json({ error: "Internal Server Error", message: "Could not get task" })
  }
})

router.get("/", async (req: Request, res: Response) => {
  try {
    tasks = await taskController.getAllTasks()
    res.status(200).json(tasks)
  } catch {
    res.status(500).json({ error: "Internal Server Error", message: "Could not get tasks" })
  }
})

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const task = await taskController.getTaskById(parseInt(req.params.id))
    if (!task) {
        res.status(404).json({ message: "Task not found" })
    } else {
        return res.status(200).json(task)
    }
  } catch {
    res.status(500).json({ error: "Internal Server Error", message: "Could not get task" })
  }
})

router.delete("/:id", async (req: Request, res: Response) => {
  const index = tasks.findIndex((t) => t.id == parseInt(req.params.id))
  if (index === -1) {
    res.status(404).json({ message: "Task not found" })
  } else {
    tasks.splice(index, 1)
    res.status(204).json({ message: "Task deleted" })
  }
})

export default router

import { Router, Request, Response } from "express"
import { Task } from "../models/task"
import { body, validationResult } from "express-validator"
import { TaskController } from "../controllers/TaskController"
import pool from "../models/db"

const router = Router()
let tasks: Task[] = []
const taskController = new TaskController(pool)

const taskValidationRules = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("dueDate").notEmpty().withMessage("Due date is required"),
  body("priority").isNumeric().withMessage("Priority must be a number"),
  body("status").notEmpty().withMessage("Status is required"),
]

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - dueDate
 *               - priority
 *               - status
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *               priority:
 *                 type: number
 *               status:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 */
router.post("/", taskValidationRules, async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const taskData: Task = {
    id: tasks.length + 1,
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
      taskData: {
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate,
        priority: taskData.priority,
        status: taskData.status,
        completed: taskData.completed,
      },
    })
  } catch (error) {
    console.error("Error creating task:", error)
    res.status(500).json({ error: "Internal Server Error", message: error })
  }
})

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

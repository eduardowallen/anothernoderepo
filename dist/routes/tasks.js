"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const TaskController_1 = require("../controllers/TaskController");
const db_1 = __importDefault(require("../models/db"));
const router = (0, express_1.Router)();
let tasks = [];
const taskController = new TaskController_1.TaskController(db_1.default);
const taskValidationRules = [
    (0, express_validator_1.body)("title").notEmpty().withMessage("Title is required"),
    (0, express_validator_1.body)("description").notEmpty().withMessage("Description is required"),
    (0, express_validator_1.body)("dueDate").notEmpty().withMessage("Due date is required"),
    (0, express_validator_1.body)("priority").isNumeric().withMessage("Priority must be a number"),
    (0, express_validator_1.body)("status").notEmpty().withMessage("Status is required"),
];
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
router.post("/", taskValidationRules, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const taskData = {
        id: tasks.length + 1,
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        priority: req.body.priority,
        status: req.body.status,
        completed: (_a = req.body.completed) !== null && _a !== void 0 ? _a : false,
    };
    try {
        yield taskController.createTask(taskData);
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
        });
    }
    catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: "Internal Server Error", message: error });
    }
}));
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const task = yield taskController.getTaskById(parseInt(req.params.id));
        if (!task) {
            res.status(404).json({ message: "Task not found" });
        }
        else {
            task.id = task.id;
            task.title = req.body.title || task.title;
            task.description = req.body.description || task.description;
            task.dueDate = req.body.dueDate || task.dueDate;
            task.priority = req.body.priority || task.priority;
            task.status = req.body.status || task.status;
            task.completed = req.body.completed || task.completed;
            try {
                yield taskController.updateTask(task);
                res.status(201).json({
                    message: `Task with id ${task.id} updated successfully`
                });
            }
            catch (error) {
                console.error("Error updating task:", error);
                res.status(500).json({ error: "Internal Server Error", message: error });
            }
        }
    }
    catch (_b) {
        res.status(500).json({ error: "Internal Server Error", message: "Could not get task" });
    }
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        tasks = yield taskController.getAllTasks();
        res.status(200).json(tasks);
    }
    catch (_c) {
        res.status(500).json({ error: "Internal Server Error", message: "Could not get tasks" });
    }
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield taskController.getTaskById(parseInt(req.params.id));
        if (!task) {
            res.status(404).json({ message: "Task not found" });
        }
        else {
            return res.status(200).json(task);
        }
    }
    catch (_d) {
        res.status(500).json({ error: "Internal Server Error", message: "Could not get task" });
    }
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const index = tasks.findIndex((t) => t.id == parseInt(req.params.id));
    if (index === -1) {
        res.status(404).json({ message: "Task not found" });
    }
    else {
        tasks.splice(index, 1);
        res.status(204).json({ message: "Task deleted" });
    }
}));
exports.default = router;

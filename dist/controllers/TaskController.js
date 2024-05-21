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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
class TaskController {
    constructor(pool) {
        this.pool = pool;
    }
    getAllTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield this.pool.query('SELECT * FROM tasks');
            return rows;
        });
    }
    getTaskById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield this.pool.query('SELECT * FROM tasks WHERE id = ? LIMIT 1', id);
            const tasks = rows;
            if (tasks.length === 0) {
                return null;
            }
            return tasks[0];
        });
    }
    getTaskIdById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield this.pool.query('SELECT id FROM tasks WHERE id = ? LIMIT 1', id);
            const tasks = rows;
            if (tasks.length === 0) {
                return null;
            }
            return tasks[0];
        });
    }
    createTask(task) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.pool.execute('INSERT INTO tasks (title, description, dueDate, priority, status, completed) VALUES (?, ?, ?, ?, ?, ?)', [task.title, task.description, task.dueDate, task.priority, task.status, task.completed]);
        });
    }
    updateTask(task) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.pool.execute('UPDATE tasks SET title = ?, description = ?, dueDate = ?, priority = ?, status = ?, completed = ? WHERE id = ?', [task.title, task.description, task.dueDate, task.priority, task.status, task.completed, task.id]);
        });
    }
}
exports.TaskController = TaskController;

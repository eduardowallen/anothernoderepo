"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerDef_1 = __importDefault(require("./swaggerDef"));
const tasks_1 = __importDefault(require("./routes/tasks"));
const TaskController_1 = require("./controllers/TaskController");
const db_1 = __importDefault(require("./models/db"));
const dbsetup_1 = require("./models/dbsetup");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Swagger setup
const options = {
    swaggerDefinition: swaggerDef_1.default,
    apis: ['./routes/*.ts'],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
app.use('api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.use(express_1.default.json()); // Add this line to enable JSON parsing in the request body
app.use('/tasks', tasks_1.default); // Add this line to mount the Task API routes
// Initialize controllers
const taskController = new TaskController_1.TaskController(db_1.default);
// Initialize db tables
db_1.default.execute(dbsetup_1.CREATE_TASKS_TABLE);
// Routes
app.get('/', (req, res) => {
    res.send('This is an Express server!');
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.stack });
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

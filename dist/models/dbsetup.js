"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CREATE_TASKS_TABLE = void 0;
exports.CREATE_TASKS_TABLE = `CREATE TABLE IF NOT EXISTS tasks 
    (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(255),
        dueDate DATETIME,
        priority INT,
        status VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT FALSE
    )`;

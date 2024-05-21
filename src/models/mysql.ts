import mysql from 'mysql2/promise'
import { CREATE_TASKS_TABLE } from './dbsetup'

export default async function initMysql() {
    const dbconnection = await mysql.createConnection({
        host: "localhost",
        user: "eduardo",
        password: "9wpLRzVTfFix80OEvaJbGQ",
        database: "chartbooking",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    })

    try {
        console.log("Connected!")
        await dbconnection.query(CREATE_TASKS_TABLE)
        console.log("Table tasks created or already exists")
    } catch (err) {
        console.log("Error creating table:", err)
    } finally {
        await dbconnection.end()
    }
}


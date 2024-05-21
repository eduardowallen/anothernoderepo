import mysql from 'mysql2/promise'

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USERNAME || 'eduardo',
    password: process.env.DB_PASSWORD || '9wpLRzVTfFix80OEvaJbGQ',
    database: process.env.DB_DATABASE || 'chartbooking',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

export default pool
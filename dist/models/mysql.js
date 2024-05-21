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
const promise_1 = __importDefault(require("mysql2/promise"));
const dbsetup_1 = require("./dbsetup");
function initMysql() {
    return __awaiter(this, void 0, void 0, function* () {
        const dbconnection = yield promise_1.default.createConnection({
            host: "localhost",
            user: "eduardo",
            password: "9wpLRzVTfFix80OEvaJbGQ",
            database: "chartbooking",
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        try {
            console.log("Connected!");
            yield dbconnection.query(dbsetup_1.CREATE_TASKS_TABLE);
            console.log("Table tasks created or already exists");
        }
        catch (err) {
            console.log("Error creating table:", err);
        }
        finally {
            yield dbconnection.end();
        }
    });
}
exports.default = initMysql;

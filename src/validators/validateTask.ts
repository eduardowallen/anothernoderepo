import { body } from 'express-validator'

export const validateTaskData = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("dueDate").notEmpty().withMessage("Due date is required"),
  body("priority").isNumeric().withMessage("Priority must be a number"),
  body("status").notEmpty().withMessage("Status is required"),
]
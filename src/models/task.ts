export interface Task {
    id: number
    title: string
    description: string
    dueDate: Date
    priority: number
    status: string
    completed?: boolean
}

export type CreateTaskDTO = Omit<Task, 'id'>
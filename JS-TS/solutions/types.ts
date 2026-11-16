interface Todo {
   id: number
   title: string  
   status: TodoStatus
   createdAt: Date
   description?: string
}

interface normalizedTodo {
   id: number
   title: string  
   status: string
   createdAt: Date
   description?: string
}

enum TodoStatus {
    PENDING,
    IN_PROGRESS,
    COMPLETED
}

// TODO Task 1: NewTodo = Todo without id, createdAt and status
type NewTodo = Omit<Todo, 'id' | 'createdAt' | 'status'>;

export { Todo, TodoStatus, NewTodo, normalizedTodo };

// run single file test
// npx jest tests/js-ts-task-01.test.ts
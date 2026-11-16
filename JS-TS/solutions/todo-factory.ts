import { Todo, NewTodo, TodoStatus } from './types';

let nextId = 1;

export function createTodo(input: NewTodo): Todo {
    input.title ?? (()=>{throw new TypeError('Todo title expected')})();

    const result: Todo = {
        ...input,
        id: nextId++,
        createdAt: new Date(),
        status: TodoStatus.PENDING
    };
    return result;
}

// run single file test
// npx jest tests/js-ts-task-03.test.ts
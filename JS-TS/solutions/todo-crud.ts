import { Todo, NewTodo } from './types';
import { createTodo } from './todo-factory';

export function addTodo(state: Todo[], todo: Todo): Todo[] {
    const result = [...state, todo];
    return result;
}

export function updateTodo(state: Todo[], id: number, update: Partial<Omit<Todo, 'id' | 'createdAt'>>): Todo[] {
    const targetTodo = getTodo(state, id);
    nullCheck(targetTodo, id);
    const updatedTodo = {
        ...targetTodo,
        ...update
    } as Todo;
    const targetTodoIndex = state.indexOf(targetTodo!);
    const result = state.slice(0, targetTodoIndex).concat(updatedTodo, state.slice(targetTodoIndex + 1));
    return result;
}

export function removeTodo(state: Todo[], id: number): Todo[] {
    const targetTodo = getTodo(state, id);
    nullCheck(targetTodo, id);
    const targetTodoIndex = state.indexOf(targetTodo!);
    const result = state.slice(0, targetTodoIndex).concat(state.slice(targetTodoIndex + 1));
    return result;
}

export function getTodo(state: Todo[], id: number): Todo | undefined {
    const result = state.find((element) => element.id === id);
    return result;
}

function nullCheck(todoToCheck: Todo | undefined, id: number) {
    todoToCheck ?? (()=>{throw new Error(`Todo with ID ${id} is not found`)})();
}

// run single file test
// npx jest tests/js-ts-task-04.test.ts
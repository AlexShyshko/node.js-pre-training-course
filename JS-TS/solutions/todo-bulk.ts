import { Todo, TodoStatus } from './types';

export function toggleAll(state: Todo[], completed: boolean): Todo[] {
    const result = state.map((element) => {
        const toggledElement = {
            ...element,
            status: completed ? TodoStatus.COMPLETED : TodoStatus.PENDING
        };
        return toggledElement;
    });

    return result;
}

export function clearCompleted(state: Todo[]): Todo[] {
    const result = state.filter((element) => element.status !== TodoStatus.COMPLETED);
    return result;
}

export function countByStatus(state: Todo[], status: TodoStatus): number {
    const result = state.reduce((accumulator, element) => {return element.status === status ? accumulator + 1 : accumulator}, 0);
    return result;
}

// run single file test
// npx jest tests/js-ts-task-05.test.ts
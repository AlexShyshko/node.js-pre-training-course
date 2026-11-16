import { Todo, NewTodo } from './types';
import { createTodo } from './todo-factory';
/* ↓ Refactor for task 7 ↓ */
import { InMemoryRepository } from './repository';
/* ↑ Refactor for task 7 ↑ */

export class TodoApi {
    // Task 6 stores todos in a plain array; Task 7 replaces it with InMemoryRepository
    private todos: Todo[] = [];
    private minLatency: number = 300;
    private maxLatency: number = 600;
    
    /* ↓ Refactor for task 7 ↓ */
    constructor(private readonly repo = new InMemoryRepository<Todo>()) {}
    /* ↑ Refactor for task 7 ↑ */

    async getAll(): Promise<Todo[]> {
        await this.simulateNetworkLatency();

        /* ↓ Refactor for task 7 ↓ */
        // const result = this.todos;
        const result = this.repo.findAll();
        /* ↑ Refactor for task 7 ↑ */

        return result;
    }

    async add(newTodo: NewTodo): Promise<Todo> {
        await this.simulateNetworkLatency();

        const createdTodo = createTodo(newTodo);

        /* ↓ Refactor for task 7 ↓ */
        // this.todos = [...this.todos, createdTodo];
        // const result = createdTodo;
        const result = this.repo.add(createdTodo);
        /* ↑ Refactor for task 7 ↑ */

        return result;
    }

    async update(id: number, update: Partial<Omit<Todo, 'id' | 'createdAt'>>): Promise<Todo> {
        await this.simulateNetworkLatency();

        /* ↓ Refactor for task 7 ↓ */
        // const targetTodo = this.get(id);
        const targetTodo = this.repo.findById(id);
        this.nullCheck(targetTodo, id);
        // const result = {
        //     ...targetTodo,
        //     ...update
        // } as Todo;
        // const targetTodoIndex = this.todos.indexOf(targetTodo!);
        // this.todos = this.todos.slice(0, targetTodoIndex).concat(result, this.todos.slice(targetTodoIndex + 1));
        const result = this.repo.update(id, update);
        /* ↑ Refactor for task 7 ↑ */
        return result;
    }

    async remove(id: number): Promise<void> {
        await this.simulateNetworkLatency();

        /* ↓ Refactor for task 7 ↓ */
        // const targetTodo = this.get(id);
        const targetTodo = this.repo.findById(id);
        this.nullCheck(targetTodo, id);
        // const targetTodoIndex = this.todos.indexOf(targetTodo!);
        // this.todos = this.todos.slice(0, targetTodoIndex).concat(this.todos.slice(targetTodoIndex + 1));
        this.repo.remove(id);
        /* ↑ Refactor for task 7 ↑ */
    }

    /* ↓ Refactor for task 8 ↓ */
    // private get(id: number): Todo | undefined {
    get(id: number): Todo | undefined {
    /* ↑ Refactor for task 8 ↑ */

        /* ↓ Refactor for task 7 ↓ */
        // const result = this.todos.find((element) => element.id === id);
        const result = this.repo.findById(id);
        /* ↑ Refactor for task 7 ↑ */

        /* ↓ Refactor for task 8 ↓ */
        this.nullCheck(result, id);
        /* ↑ Refactor for task 8 ↑ */
        
        return result;
    }

    private nullCheck(todoToCheck: Todo | undefined, id: number) {
        todoToCheck ?? (()=>{throw new TodoNotFoundError(id)})();
    }

    private async simulateNetworkLatency(): Promise<void> {
        const latencyTime = this.getRandomInt();
        await new Promise<void>((resolve) => {
            setTimeout(() => resolve(), latencyTime);
        });
    }

    private getRandomInt(min: number = this.minLatency, max: number = this.maxLatency + 1): number {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
    }
}

export class TodoNotFoundError extends Error {
    public readonly id: number;

    constructor(id: number) {
        super(`Todo with ID ${id} is not found`);
        this.name = 'TodoNotFoundError';
        this.id = id;
    }
}

// run single file test
// npx jest tests/js-ts-task-06.test.ts
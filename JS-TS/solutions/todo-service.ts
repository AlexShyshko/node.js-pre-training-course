import { TodoApi } from './todo-api';
import { Todo, TodoStatus, NewTodo } from './types';

export class TodoService {
    constructor(private readonly api: TodoApi) { }

    async create(title: string, description?: string): Promise<Todo> {
        this.nullCheck(title);
        const newTodoTemplate = {
            title,
            description
        } as NewTodo;
        const result = this.api.add(newTodoTemplate);
        return result;
    }

    async toggleStatus(id: number): Promise<Todo> {
        const todo = this.api.get(id) as Todo;
        const result = this.setStatus(id, this.getNextStatus(todo.status));
        return result;
    }

    async setStatus(id: number, status: TodoStatus): Promise<Todo> {
        const updatedTodoTemplate = {
            status
        } as Todo;
        const result = this.api.update(id, updatedTodoTemplate);
        return result;
    }

    async search(keyword: string): Promise<Todo[]> {
        this.nullCheck(keyword);
        const result = (await this.api.getAll()).filter((element) => {
            const matchTitle = element.title.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
            const matchDescription = element.description && element.description.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
            return matchTitle || matchDescription;
        });
        return result;
    }

    private getNextStatus(status: TodoStatus): TodoStatus {
        const statuses = Object.values(TodoStatus) as TodoStatus[];
        const statusIndex = statuses.indexOf(status);
        const nextStatusIndex = (statusIndex + 1) % statuses.length;
        return statuses[nextStatusIndex];
    }

    private nullCheck(stringCheck: string) {
        stringCheck.trim() || (()=>{throw new Error('Empty input parameter')})();
    }
}

// run single file test
// npx jest tests/js-ts-task-08.test.ts
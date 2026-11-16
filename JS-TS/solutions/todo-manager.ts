import { TodoService } from "./todo-service";
import { TodoApi } from "./todo-api";
import { InMemoryRepository } from "./repository";
import { Todo, NewTodo, TodoStatus, normalizedTodo } from "./types";

export class ToDoManager {
    private repo = new InMemoryRepository<Todo>();
    private api = new TodoApi(this.repo);
    private service = new TodoService(this.api);

    async init(): Promise<void> {
        try {
            let demoRequests = this.getDemo().map((element) => {
                return this.service.create(element.title, element.description);
            });

            await Promise.allSettled(demoRequests).then((responses) => {
                const summary = responses.reduce((acc, result) => {
                    if (result.status === 'fulfilled') {
                        acc.fulfilled++;
                    } else {
                        acc.rejected++;
                    }
                    return acc;
                }, {fulfilled: 0, rejected: 0});

                console.log(this.colorize('Demo data was seed:', 'cyan'));
                console.log(this.colorize('Fulfilled: ' + summary.fulfilled, 'green'));
                console.log(this.colorize('Rejected: ' + summary.rejected, 'yellow'));
            }); 
        } catch (error) {
            console.log(this.colorize('Seeding DB failure.', 'red'));
            console.error(error);
        }

    }

    async add(title: string, description?: string): Promise<void> {
        try {
            const addedTodo = await this.service.create(title, description);
            console.log(this.colorize(`New Todo with ID ${addedTodo.id} has been created:`, 'cyan'));
            console.dir(this.normalizeTodo(addedTodo));
        } catch (error) {
            console.log(this.colorize('New Tode cration failure.', 'red'));
            console.error(error);
        }
    }

    async complete(id: number): Promise<void> {
        try {
            const completedTodo = await this.service.setStatus(id, TodoStatus.COMPLETED);
            console.log(this.colorize(`Todo with ID ${completedTodo.id} has been completed:`, 'cyan'));
            console.dir(this.normalizeTodo(completedTodo));
        } catch (error) {
            console.log(this.colorize('Todo completion failure.', 'red'));
            console.error(error);
        }
    }

    async list(): Promise<Todo[]> {
        try {
            const listTodo = await this.api.getAll();
            console.log(this.colorize(`Todo list in memory:`, 'cyan'));
            listTodo.forEach((element) => {console.dir(this.normalizeTodo(element))});
            return listTodo;
        } catch (error) {
            console.log(this.colorize('Todo fetching failure.', 'red'));
            console.error(error);
            return [];
        }
    }

    private normalizeTodo(todo: Todo): normalizedTodo | undefined {
        try {
            const normalizedTodo = {...todo, status: TodoStatus[todo.status]};
            return normalizedTodo;
        } catch (error) {
            console.log(this.colorize('Internal app error.', 'red'));
            console.error(error);
        }
    }

    /* attribute: black red green yellow blue magenta cyan white black_bgc red_bgc green_bgc yellow_bgc blue_bgc magenta_bgc cyan_bgc white_bgc*/
    /* console.log(this.colorize('Message', 'cyan')); */
    /* console.log(`${this.colorize('One color', 'cyan')} ${this.colorize('Other color', 'red')}`); */
    colorize(message: string, attribute: string): string | undefined {
        try {
            let colorCode;

            switch (attribute) {
                case "black":
                colorCode = "30";
                break;
                case "red":
                colorCode = "31";
                break;
                case "green":
                colorCode = "32";
                break;
                case "yellow":
                colorCode = "33";
                break;
                case "blue":
                colorCode = "34";
                break;
                case "magenta":
                colorCode = "35";
                break;
                case "cyan":
                colorCode = "36";
                break;
                case "white":
                colorCode = "37";
                break;
                case "black_bgc":
                colorCode = "40";
                break;
                case "red_bgc":
                colorCode = "41";
                break;
                case "green_bgc":
                colorCode = "42";
                break;
                case "yellow_bgc":
                colorCode = "43";
                break;
                case "blue_bgc":
                colorCode = "44";
                break;
                case "magenta_bgc":
                colorCode = "45";
                break;
                case "cyan_bgc":
                colorCode = "46";
                break;
                case "white_bgc":
                colorCode = "47";
                break;
                default:
                colorCode = "0";
            }
            const coloredString = `\x1b[${colorCode}m${message}\x1b[0m`;
            return coloredString;
        } catch (error) {
            console.log(this.colorize('Internal app error.', 'red'));
            console.error(error);
        }
    }

    private getDemo(): NewTodo[] {
        try {
            const demoData = [
                { title: "Finance", description: "To earn $1.000.000" },
                { title: "Sport", description: "To win Mr. Olympia" },
                { title: "Science", description: "To invent a bicycle" },
                { title: "Survive in 2027" },
                { title: "Do not think about pink elephants" },
                { title: "", description: "Empty title to get rejected" },
            ];
            return demoData;
        } catch (error) {
            console.log(this.colorize('Internal app error.', 'red'));
            console.error(error);
            return [];
        }

    }
}

// run single file test
// npx jest tests/js-ts-task-10.test.ts

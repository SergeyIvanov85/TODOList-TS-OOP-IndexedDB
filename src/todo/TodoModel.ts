import {TodoDB} from "./TodoDB";
import {TodoItem, TodoItemData, TodoItemId} from "./TodoItem";


export  class TodoModel extends EventTarget {
    readonly #db = new TodoDB();
    #tasks: TodoItem[] = [];

    constructor() {
        super();
        this.#db.getAllTasks().then(tasks => {
            this.#tasks = tasks;
            this.#triggerList();
        });
    }

    get tasks(): TodoItem[] {
        return this.#tasks;
    }

    add(data: TodoItemData): void {
        this.#db.addTask(data).then(task => {
            this.#tasks = [...this.#tasks, task];
            this.#triggerList();
        });
    }

    remove(taskID: TodoItemId): void {
        this.#db.removeTask(taskID).then(() => {
            this.#tasks = this.#tasks.filter(task => task.id !== taskID);
            this.#triggerList();
        })
    }

    toggle(taskID: TodoItemId): void {
        this.#db.toggleTask(taskID).then(updatedTask => {
            this.#tasks = this.#tasks.map(task => {
                return task.id === taskID ? updatedTask : task;
            });
            this.#triggerList();
        })
    }

    destroy(): void {
        this.#db.closeDB();
    }

    #triggerList(): void {
        this.dispatchEvent(new CustomEvent<TodoItem[]>('list', {detail: this.#tasks }))
    }

}
import {addIntoDB, getAllFromDB, Migrations, openDB, readFromDB, removeFromDB, updateInDB} from "../utils";
import {TodoItem, TodoItemData, TodoItemId} from "./TodoItem";

export class TodoDB {
    readonly #dbName = 'MY_CUSTOM_TODO.DB';
    readonly #storageName = 'tasks';
    readonly #migrations: Migrations = [
        vcTransaction => {
        vcTransaction.db.createObjectStore(this.#storageName, {
            autoIncrement: true,
            keyPath: 'id'
        });
        }
    ]
    readonly #dbPromise = openDB(this.#dbName, this.#migrations);

    getAllTasks(): Promise<TodoItem[]> {
        return this.#dbPromise
            .then(db => getAllFromDB<TodoItem>(db, this.#storageName));
    }

    addTask(task: TodoItemData): Promise<TodoItem> {
        return this.#dbPromise
            .then(db => addIntoDB<TodoItemData, TodoItemId>(db, this.#storageName, task))
            .then(id => ({
                ...task,
                id
            }));
    }

    removeTask (taskID: TodoItemId): Promise<void> {
        return this.#dbPromise
            .then(db => removeFromDB(db, this.#storageName, taskID));
    }

    toggleTask(taskID: TodoItemId): Promise<TodoItem> {
        return this.#dbPromise
            .then(async db => {
                const task = await readFromDB<TodoItem>(db, this.#storageName, taskID);
                const updatedTask: TodoItem = { ...task, completed: !task.completed};
                await updateInDB<TodoItem, TodoItemId>(db, this.#storageName, updatedTask);
                return updatedTask;
            })
    }

    closeDB(): void {
        this.#dbPromise.then(db => db.close());
    }
}
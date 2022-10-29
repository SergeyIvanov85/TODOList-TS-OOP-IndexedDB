import {DisposableView} from "../types";
import {TodoItem, TodoItemId} from "./TodoItem";
import {TodoModel} from "./TodoModel";
import {todoItemTemplate} from "./TodoItemTemplate";
import {todoGroupTemplate} from "./TodoGroupTemplate";
import {todoTemplate} from "./TodoTemplate";

export class TodoView implements DisposableView {
    readonly #eventListeners = {
        handleEvent: (event: Event) => {
            switch (event.currentTarget) {
                case this.#form:
                    return this.#onAddTask(event);
                case this.#model:
                    return  this.#onListUpdate(event as CustomEvent<TodoItem[]>);
                case this.#list:
                    const target = event.target as HTMLElement;
                    const  taskID = Number(target.closest<HTMLElement>('task')?.dataset.taskID);

                    if (target.closest('.task-toggle')) return this.#onToggleTask(taskID);
                    if (target.closest('.task-delete')) return this.#onDeleteTask(taskID);

                    return;
            }
        }
    };
    #form: HTMLFormElement | null = null;
    #list: HTMLUListElement | null = null;
    #model: TodoModel | null = null;

    render(parentElement: HTMLElement): () => void {
        this.#initModel();
        this.#initTemplate(parentElement);
        this.#bindListeners();

        return () => {
            this.#unbindListeners();
            this.#destroyModel();
            this.#destroyTemplate(parentElement);
        }
    }

    #initTemplate(parentElement: HTMLElement): void {
        const fullView = todoTemplate.content.cloneNode(true) as DocumentFragment;

        this.#form = fullView.querySelector('form')!;
        this.#list = fullView.querySelector('ul');

        parentElement.innerHTML = '';
        parentElement.appendChild(fullView);
    }

    #destroyTemplate(parentElement: HTMLElement): void {
        parentElement.innerHTML = '';
        this.#form = null;
        this.#list = null;
    }

    #initModel(): void {
        this.#model = new TodoModel();
    }

    #destroyModel(): void {
        this.#model?.destroy();
        this.#model = null;
    }

    #onAddTask(event: Event) {
        event.preventDefault();

        const data = new FormData(this.#form!);

        this.#model?.add({
            completed: false,
            description: data.get('taskDescription') as string,
            date: new Date(data.get('taskDate') as string),
        });

        this.#form?.reset();
    }

    #onToggleTask(taskID: TodoItemId): void {
        this.#model?.toggle(taskID);
    }

    #onDeleteTask (taskID: TodoItemId): void {
        this.#model?.remove(taskID);
    }

    #onListUpdate ({detail: list}: CustomEvent<TodoItem[]>): void {
        const groupedList = this.#listToGroups(list);
        const fragment = document.createDocumentFragment();

        for (const [timestamp, items] of groupedList.entries()) {
            const el = todoGroupTemplate.content.cloneNode(true) as DocumentFragment;
            const header = el.querySelector('header')!;
            const ul = el.querySelector('ul')!;
            const title = new Date(timestamp).toLocaleDateString('ru', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                weekday: 'short',
            });
            header.textContent = title;
            ul.appendChild(items.reduce((fragment, item) => {
                const el = todoItemTemplate.content.cloneNode(true) as DocumentFragment;
                const li = el.querySelector('li')!;
                const div = el.querySelector('div')!;

                div.textContent = item.description;
                li.dataset.taskID = item.id.toString();
                li.classList.toggle('completed', item.completed);
                fragment.appendChild(el);

                return fragment;
            }, document.createDocumentFragment()));

            fragment.appendChild(el);
        }

        this.#list!.innerHTML = '';
        this.#list!.appendChild(fragment);
    }

    #listToGroups(list: TodoItem[]): Map<number, TodoItem[]> {
        return list
            .sort((a,b) => {
                const  diff = a.date.getTime() - b.date.getTime();

                if (!diff) {
                    return a.id - b.id;
                }

                return diff;
            })
            .reduce((map, item) => {
                const timestamp = item.date.getTime();

                if (!map.has(timestamp)) {
                    map.set(timestamp, []);
                }

                map.get(timestamp).push(item);

                return map;
            }, new Map());
    }

    #bindListeners(): void {
        this.#form?.addEventListener('submit', this.#eventListeners);
        this.#model?.addEventListener('list', this.#eventListeners);
        this.#list?.addEventListener('click', this.#eventListeners);
    }

    #unbindListeners(): void {
        this.#form?.removeEventListener('submit', this.#eventListeners);
        this.#model?.removeEventListener('list', this.#eventListeners);
        this.#list?.removeEventListener('click', this.#eventListeners);
    }

}
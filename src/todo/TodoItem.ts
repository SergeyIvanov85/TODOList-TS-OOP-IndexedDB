export interface TodoItemData {
    description: string;
    date: Date;
    completed: boolean;
}

export type TodoItemId = number;

export interface TodoItem extends TodoItemData {
    id: TodoItemId;
}
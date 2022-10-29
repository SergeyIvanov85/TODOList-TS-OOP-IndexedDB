import './style.scss';
import {TodoView} from "./todo";

const todoView = new TodoView();

const disposeTodoView = todoView.render(document.body);


// @ts-ignore
globalThis['disposeTodoView'] = disposeTodoView;





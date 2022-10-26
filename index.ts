import './style.scss';
import { TodoView } from './todo';


// const todoView = new TodoView();
// //
// // const disposeTodoView = todoView.render(document.body);
// //
// //
// // // В консоли можно будет вызвать disposeTodoView() чтобы полностью удалить todoView со страницы
// // // @ts-ignore
// // globalThis['disposeTodoView'] = disposeTodoView;



const date = document.getElementById('date');
const options = {weekday: "long", month: "short", day: "numeric"}
const today = new Date();

if (date !== null) {
    // @ts-ignore
    date.innerHTML = today.toLocaleDateString("ru-RU", options);
}


let id = 0;
const list = document.querySelector('#list');

class UI{
    static displayToDo(){
        const todos = Store.getToDos();
        todos.forEach((todo: { text: any; id: any; completed: any; }) => UI.addToDoToList(todo.text, todo.id, todo.completed));
    }

    static addToDoToList(toDo: any, id: number, ifChecked: undefined){
        const completed = ifChecked ? 'checkedLine' : '';
        const statusIcon = ifChecked ? 'fa-check-circle' : 'fa-circle';
        const liItem = `<li>
        <p class="text ${completed}">${toDo}</p>
        <i class="far ${statusIcon} co" action="complete" id="${id}"></i>
        <i class="far fa-trash-alt" action="delete" id="${id}"></i>
        </li>`;
        const position = "beforeend";
        if (list !==null) {
            list.insertAdjacentHTML(position, liItem);
        }

    }


    static removeToDo(element: EventTarget | null){

        // @ts-ignore
        element.parentNode.parentNode.removeChild(element.parentNode);


        // @ts-ignore
        const curId = element.attributes.id.value;
        const todos = Store.getToDos();
        todos.forEach((todo: { id: string | number; }, index: any) => {
            if(+todo.id === +curId){
                todos.splice(index, 1);
            }
        });

        localStorage.setItem('toDo', JSON.stringify(todos));
    }


    static completeToDo(element: EventTarget | null){
        const CHECK = "fa-check-circle";
        const UNCHECK = "fa-circle";
        // @ts-ignore
        element.classList.toggle(CHECK);
        // @ts-ignore
        element.classList.toggle(UNCHECK);
        // @ts-ignore
        element.parentNode.querySelector(".text").classList.toggle("checkedLine");


        // @ts-ignore
        const curId = element.attributes.id.value;
        const todos = Store.getToDos();
        todos.forEach((todo: { id: string | number; }, index: string | number) => {
            if(+todo.id === +curId){
                todos[index].completed = todos[index].completed ? false : true;
            }
        });

        localStorage.setItem('toDo', JSON.stringify(todos));
    }

    static clearToDo(){
        if (list !== null) {
            list.innerHTML = '';
            localStorage.clear();
        }

    }
}


class Store{
    static getToDos(){
        let todos;
        if(localStorage.getItem('toDo') === null){
            todos = [];
        }else{
            // @ts-ignore
            todos = JSON.parse(localStorage.getItem('toDo'));
        }
        return todos;
    }

    static addToDoToList(toDo: any, id: number){

        const todos = Store.getToDos();

        todos.push({text: toDo, id: id, completed: false});

        localStorage.setItem('toDo', JSON.stringify(todos));
    }
}


document.addEventListener('DOMContentLoaded', UI.displayToDo);


document.addEventListener("keyup", function(){
    // @ts-ignore
    if(event.keyCode == 13){
        const toDoItem = input.value;
        if(toDoItem){
            // @ts-ignore
            UI.addToDoToList(toDoItem, Date.now());

            Store.addToDoToList(toDoItem, Date.now());

            id++;
        }
        input.value = "";
    }
});

if (list !== null) {
    list.addEventListener("click", (event) => {

        const element = event.target;
        // @ts-ignore
        if(element.attributes.action){
            // @ts-ignore
            const elementAction = element.attributes.action.value;
            if(elementAction == "complete"){
                UI.completeToDo(element);
            }else if(elementAction == "delete"){
                UI.removeToDo(element);
            }
        }

    });
}

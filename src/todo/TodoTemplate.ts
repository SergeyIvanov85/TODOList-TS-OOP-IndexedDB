export const todoTemplate = document.createElement('template');

todoTemplate.innerHTML = `
<section class="todo-view">
<form name="addTodoItem">
<div>
<label for="taskDescription">Task description</label>
<input type="text" id="taskDescription" name="taskDescription" required>
</div>
<footer>
<label for="taskDate">Date</label>
<input type="date" id="taskDate" name="taskDate" required>
<button type="submit">Add</button>
</footer>
</form>
<ul class="tasks">

</ul>
</section>
`;
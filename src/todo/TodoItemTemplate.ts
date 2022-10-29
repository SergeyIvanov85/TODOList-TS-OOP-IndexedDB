export const todoItemTemplate = document.createElement('template');

todoItemTemplate.innerHTML = `
<li class="task">
<button type="button" class="task-toggle"></button>
<div class="task-description"></div>
<button type="button" class="task-delete"></button>
</li>
`;
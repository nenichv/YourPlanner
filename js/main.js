//Поиск элементов на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');
let tasks = [];

if (localStorage.getItem('tasks'))
{
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach( (task) => renderTask(task));
}
checkEmptyList();

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);

function addTask(event)
{
    //Отменяем отправку формы
    event.preventDefault();

    //Запрет на пустую задачу (присутствует пробел) = запрет на первый символ пробела !!! РАБОТАЕТ НАПОЛОВИНУ !!!
    taskInput.oninput = () => 
    {
        if (taskInput.value.charAt(0) === ' ') 
        {
            taskInput.value = "";
            return;
        }
    }

    const taskText = taskInput.value;
    const newTask = 
    {
        id: Date.now(),
        text: taskText,
        done: false,
    };

    tasks.push(newTask);
    saveToLocalStorage();
    renderTask(newTask);
    taskInput.value = "";
    taskInput.focus();
    checkEmptyList();
}

function deleteTask(event)
{
    if (event.target.dataset.action !== 'delete') return;

    const parentNode = event.target.closest('.list-group-item');
    const id = Number(parentNode.id);

    //Стрелочная функция
    const index = tasks.findIndex ( (task) => task.id === id );

    //Удаляем задачу из массива
    tasks.splice(index, 1);
    parentNode.remove();
    saveToLocalStorage();
    checkEmptyList();
}

function doneTask(event)
{
    if (event.target.dataset.action !== "done") return;

    const parentNode = event.target.closest('.list-group-item');
    const id = Number(parentNode.id);
    const task = tasks.find((task) => task.id === id);
    task.done = !task.done;
    const taskTitle = parentNode.querySelector('.task-title');
    saveToLocalStorage();

    //Зачеркиваем задачу. add - только добавляет класс, зачеркнешь и все, обратного пути нет. toggle - добавляет или убирает, можно вернуть зачеркнувшую задачу.
    taskTitle.classList.toggle('task-title--done');
}

function checkEmptyList()
{
    if (tasks.length === 0) 
    {
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
        <img src="./img/button.png" alt="Empty" width="64" class="mt-3">
        <div class="empty-list__title">Список дел пуст</div>
        </li>`

        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }
    else
    {
        const emptyListElement = document.querySelector('#emptyList');
        emptyListElement ? emptyListElement.remove() : null;
    }
}

function saveToLocalStorage()
{
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task)
{
    const cssClass = task.done ? "task-title task-title--done" : "task-title"

    const taskHTML = 
        `
            <li id = "${task.id}" class ="list-group-item d-flex justify-content-between task-item">
                <span class="${cssClass}">${task.text}</span>
                    <div class="task-item__buttons">
                        <button type="button" data-action="done" class="btn-action">
                            <img src="./img/tick.svg" alt="Done" width="18" height="18">
                        </button>
                        <button type="button" data-action="delete" class="btn-action">
                            <img src="./img/cross.svg" alt="Done" width="18" height="18">
                        </button>
                    </div>
            </li>    
            
        `
    tasksList.insertAdjacentHTML('beforeend', taskHTML); 
}
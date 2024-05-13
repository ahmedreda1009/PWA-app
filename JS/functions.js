const handleDOMContentLoaded = () => {
    fillSelectBoxes();
    getAllTodosFromIDB();
}

const fillSelectBoxes = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    // const years = [2024, 2025, 2026, 2027, 2028, 2029, 2030];
    const daySelect = document.getElementById('setDay');
    const monthSelect = document.getElementById('setMonth');
    const yearSelect = document.getElementById('setYear');
    const minuteSelect = document.getElementById('setMinute');
    const hourSelect = document.getElementById('setHour');

    const today = new Date();
    let currentYear = today.getFullYear();
    let currentMonth = today.getMonth();
    let currentDay = today.getDate();
    let currentminute = today.getMinutes();
    let currenthour = today.getHours();

    minuteSelect.value = currentminute;
    hourSelect.value = currenthour;


    // making dynamic array of sequential numbers
    const years = Array.from({ length: 10 }, (_, index) => index + currentYear);

    for (let i = 1; i <= 31; i++) {
        daySelect.innerHTML += `<option value="${i}" ${currentDay === i ? 'selected' : ''}>${i}</option>`;
    }

    months.forEach((month, idx) => {
        monthSelect.innerHTML += `<option value="${month}" ${currentMonth === idx ? 'selected' : ''}>${month}`
    });

    years.forEach(year => {
        yearSelect.innerHTML += `<option value="${year}">${year}</option>`;
    });
}

const getAllTodosFromIDB = () => {
    const allTodosPromise = idbApp.getAllTodos();

    const todosBox = document.querySelector('.todos-box');
    allTodosPromise.then(todos => {
        if (todos.length) {
            todos.map(todo => displayTask(todo, todosBox));
        }
    });
}

const submitFormHandler = (event) => {
    event.preventDefault();

    const title = document.querySelector('#taskTitle');
    const hours = document.querySelector('#setHour');
    const minutes = document.querySelector('#setMinute');
    const day = document.querySelector('#setDay');
    const month = document.querySelector('#setMonth');
    const year = document.querySelector('#setYear');
    const todosBox = document.querySelector('.todos-box');

    const task = {
        title: title.value,
        hours: hours.value,
        minutes: minutes.value,
        day: day.value,
        month: month.value,
        year: year.value,
        id: Date.now(),
        notified: false
    };

    // create date object
    const dateObject = new Date(`${task.hours}:${task.minutes} ${task.day} ${task.month} ${task.year}`);
    task.fullDate = dateObject.getTime();
    console.log(task.fullDate);

    // add to IDB
    idbApp.addTodo(task);
    // add to UI
    displayTask(task, todosBox);
    // set notification
    setTimeout(() => {
        displayNotification(task);
    }, dateObject - Date.now());

    // reset title field
    title.value = '';
}

// const deleteTodoHandler = (self, id) => {
//     // remove from IDB
//     idbApp.deleteById(id);
//     console.log(self);
//     console.log(id);
//     // remove from UI
//     const todo = self.closest('.todo-card');
//     todo.remove();
// }

// alternative function for (deleteTodoHandler)
const deleteBtnHandler = (event) => {
    const clickTarget = event.target;
    if (!clickTarget.classList.contains('x-btn')) return;
    console.log(clickTarget);

    const todo = clickTarget.closest('.todo-card');
    const id = parseInt(todo.dataset.id);
    // remove from IDB
    idbApp.deleteById(id);
    // remove from UI
    todo.remove();
}

const displayTask = (task, target) => {
    const taskHtml =
        `<div class="todo-card ${task.notified ? 'checked' : ''}" data-id="${task.id}">
            <div class="content">
                <div class="text">${task.title}</div>
                <button class="x-btn">X</button>
            </div>
            <div class="date">[ ${task.hours}:${task.minutes} ] ${task.day} ${task.month} ${task.year}</div>
        </div>`;

    target.innerHTML += taskHtml;
}

const RequestNotiPermission = () => {
    Notification.requestPermission(status => {
        console.log('Notification Permission ', status)
        if (status === 'granted') {
            const notifyButton = document.querySelector('.noti-btn button');
            notifyButton.parentElement.style.display = 'none';
        }
    });
}

function displayNotification(task) {
    // TODO 2.3 - display a Notification
    if (Notification.permission == 'granted') {
        navigator.serviceWorker.getRegistration().then(reg => {
            console.log('service worker: ', reg);

            const options = {
                body: task.title,
                // icon: '../images/notification-flat.png',
                data: {
                    dateOfArrival: task.fullDate,
                    // primaryKey: task.id
                },
                timestamp: Date.now()
                // actions: [
                //     { action: 'explore', title: 'Go to the site', icon: '../images/checkmark.png' },
                //     { action: 'close', title: 'close the notification', icon: '../images/xmark.png' }
                // ]
            }

            reg.showNotification('New Task !!', options);
            checkTodo(task.id);
            idbApp.editById(task.id, { notified: true });
        });
    }
}

function checkTodo(todoId) {
    // let todos = document.querySelectorAll('.todo-card');
    // console.log(todos);
    // const todo = Array.from(todos).find(todo => Number(todo.dataset.id) === todoId);
    // console.log(todo);
    // todo.classList.add('checked');

    let todo = document.querySelector(`[data-id="${todoId}"]`);
    todo.classList.add('checked');
}

export {
    handleDOMContentLoaded,
    submitFormHandler,
    RequestNotiPermission,
    // deleteTodoHandler,
    deleteBtnHandler
};
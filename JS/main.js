import {
    handleDOMContentLoaded,
    submitFormHandler,
    RequestNotiPermission,
    // deleteTodoHandler,
    deleteBtnHandler
} from './functions.js';

// fill the select boxes
document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
//-----------------------------------------

// submit form event
const form = document.querySelector('form');
form.addEventListener('submit', submitFormHandler);


const notifyButton = document.querySelector('.noti-btn button');
notifyButton.addEventListener('click', () => {
    RequestNotiPermission();
});

// check if the user permitted notification before or not
if (Notification.permission === 'granted') {
    const notifyButton = document.querySelector('.noti-btn button');
    notifyButton.parentElement.style.display = 'none';
}

// add the delete handler to the window object in order to be visible for all todos.
// I did that because main.js is a module and its code is encapsulated inside.
// window.deleteTodoHandler = deleteTodoHandler;

// run service worker in order to enable the notifications
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // console.log('Service Worker and Push is supported');

        navigator.serviceWorker.register('sw.js')
            .then(swReg => {
                console.log('Service Worker is registered', swReg);

                // swRegistration = swReg;

                // TODO 3.3a - call the initializeUI() function
            })
            .catch(err => {
                console.error('Service Worker Error', err);
            });
    });
} else {
    console.warn('Push messaging is not supported');
}

// event listener on delete buttons
const todosBox = document.querySelector('.todos-box');
todosBox.addEventListener('click', deleteBtnHandler);
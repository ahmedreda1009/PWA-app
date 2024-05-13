var idbApp = (function () {
    'use strict';

    // TODO 2 - check for support

    var dbPromise = idb.open('todos', 1, function (upgradeDB) {
        // switch (upgradeDB.oldVersion) {
        // case 1:
        console.log(' creating todos table');
        upgradeDB.createObjectStore('todos', { keyPath: 'id' })
        // break;

        // case 2:
        //     var store = upgradeDB.transaction.objectStore('products')
        //     store.createIndex('name', 'name', { unique: true })
        //     break
        // }
    });

    function addTodo(todoObj) {
        return dbPromise.then(db => {
            const tx = db.transaction('todos', 'readwrite');
            const store = tx.objectStore('todos');

            return store.add(todoObj).then(function () {
                console.log('Todo added successfully!')
            }).catch(function (e) {
                tx.abort();
                console.log(e);
            });
        });
    }

    function getAllTodos() {
        return dbPromise.then(db => {
            const tx = db.transaction('todos', 'readwrite');
            const store = tx.objectStore('todos');

            return store.getAll().then(function (todos) {
                console.log('Todos retrieved successfully!');
                console.log(todos);
                return todos;
            }).catch(function (e) {
                tx.abort();
                console.log(e);
            });
        });
    }

    function deleteById(id) {
        return dbPromise.then(db => {
            const tx = db.transaction('todos', 'readwrite');
            const store = tx.objectStore('todos');

            return store.delete(id).then(function (todo) {
                console.log('todo deleted successfully!');
                // console.log(todo);
                // return todo;
            }).catch(function (e) {
                tx.abort();
                console.log(e);
            });
        });
    }

    function editById(id, newObj) {
        getTodoById(id).then(todo => {
            return dbPromise.then(async db => {
                const tx = db.transaction('todos', 'readwrite');
                const store = tx.objectStore('todos');

                todo = { ...todo, ...newObj };

                store.put(todo);

                console.log('todo ammended successfully!');
                return tx.complete;
            })
        })
    }

    function getTodoById(id) {
        return dbPromise.then(function (db) {
            var tx = db.transaction('todos', 'readonly');
            var store = tx.objectStore('todos');
            // var index = store.index('id');
            console.log(id);
            return store.get(id).then(todo => {
                console.log(todo);
                return todo;
            });
        });
    }

    return { addTodo, getAllTodos, deleteById, editById }
})(); 
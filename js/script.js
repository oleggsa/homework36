'use strict';

const todoController = {
    dbName: 'saved_data',
    idCounter: 0,
    getData() {
        if(!todoModel.getData()) return false;
        return JSON.parse(todoModel.getData());
    },
    setData(inputs){
        const todoItemObject = this.handleInputs(inputs);
        todoModel.saveData(todoItemObject);
        return todoItemObject;
    },
    handleInputs(inputs) {
        const obj = {};
        for(const input of inputs) {
            obj[input.name] = input.value;
        }
        obj.completed = false;
        obj.id = this.idCounter;
        console.log(this.idCounter++);
        return obj;
    },
    remove(elId){
        return this.getData().filter(obj => Number.parseInt(obj.id) !== Number.parseInt(elId));
    }
};

const todoModel = {
    dbName: 'saved_data',
    saveData(todoItem) {
        if(localStorage[this.dbName]) {
            const data = JSON.parse(localStorage[this.dbName]);
            data.push(todoItem);
            localStorage.setItem(this.dbName, JSON.stringify(data));
            return data;
        }

        const data = [todoItem];
        localStorage.setItem(this.dbName, JSON.stringify(data));
        return data;
    },
    getData() {
        if(!localStorage.getItem(this.dbName)) return false;
        return localStorage.getItem(this.dbName);
    },
    replaceData(newTodoArray) {
        localStorage.setItem(this.dbName, JSON.stringify(newTodoArray));
    },
    getId(counter){
        
    }
};

const todoView = {
    form: document.querySelector('#todoForm'),
    itemClick: document.querySelector('#todoItems'),
    clearBtn: document.querySelector('#clear'),
    setEvents() {
        window.addEventListener('load', this.onLoadFunc.bind(this))
        this.form.addEventListener('submit', this.formSubmit.bind(this));
        this.itemClick.addEventListener('click', this.doneTask);
        this.itemClick.addEventListener('click', this.removeTask);
        this.clearBtn.addEventListener('click', this.removeAll);
    },
    formSubmit(e) {
        e.preventDefault();
        const inputs = e.target.querySelectorAll('input, textarea');

        for(const input of inputs) {
            if(!input.value.length) return alert('No way you can add this shit');
        }

        const todoItemObject = todoController.setData(inputs);
        this.renderItem(todoItemObject);
        e.target.reset();
    },
    onLoadFunc() {
        if (todoController.getData()){
        todoController.getData().forEach(item => this.renderItem(item));
        }
    },
    createTemplate(titleText = '', descriptionText = '') {
        const mainWrp = document.createElement('div');
        mainWrp.className = 'col-4';

        const wrp = document.createElement('div');
        wrp.className = 'taskWrapper';
        wrp.setAttribute('completed', false);
        wrp.id = todoController.idCounter;
        console.log(wrp.id);
        mainWrp.append(wrp);

        const title = document.createElement('div');
        title.innerHTML = titleText;
        title.className = 'taskHeading';
        wrp.append(title);

        const description = document.createElement('div');
        description.innerHTML = descriptionText;
        description.className = 'taskDescription';
        wrp.append(description);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'taskCheckbox';
        wrp.append(checkbox);

        const remove = document.createElement('div');
        remove.className = 'taskRemove';
        remove.innerHTML = '&times';
        wrp.append(remove);

        return mainWrp;
    },
    renderItem({title, description, completed}) {
        const template = this.createTemplate(title, description);
        template.getElementsByClassName('taskCheckbox')[0].checked = completed || false;
        document.querySelector('#todoItems').prepend(template);
    },
    doneTask(e) {
        if (e.target.classList.contains("taskCheckbox")) {
            let elId = e.target.parentNode;
            console.log(elId);
            const currentItems = todoController.getData();
            let newItems = currentItems?.map(item => {
                if (item.id === elId){
                    item.completed = !item.completed;
                }
                return item;
            });
            todoModel.replaceData(newItems);
        }
    },
    removeTask(e) {
        if (e.target.classList.contains("taskRemove")) {
            let elId = e.target.parentNode.id;
            let rem = todoController.remove(elId);
            let elem = document.getElementById(elId);
            elem.parentNode.parentNode.removeChild(elem.parentNode);
            console.log(rem);
            todoModel.replaceData(rem || null);
        }
    },
    removeAll() {
        localStorage.clear(todoController.dbName);
        location.reload();
    }
};

todoView.setEvents();

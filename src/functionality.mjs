import { allTask } from "./index.mjs";

class todo {
    constructor(title, date, priority, description){
        this.title = title,
        this.date = date,
        this.priority = priority,
        this.description = description,
        this.complete = false
    }
}

class addProject{
    constructor(project){
        this.project = project;
        this.task = []
    }
}

function  getIndex (name) {
    return allTask.findIndex(task => task.project === name);
}

export {todo, addProject, getIndex}




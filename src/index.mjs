import "./styles.css";
import { addProjectName, projectDiv, svg } from "./dom.mjs";
import { todo, addProject , projectArray } from "./functionality.mjs";


const taskBtn = document.querySelector(".taskbtn");
const projectBtn = document.querySelector(".add-project-btn");
const modal = document.querySelector(".modal");
const smallFormSubmit = document.querySelector(".smallForm");
const smallFormCancel = document.querySelector(".exit")
const addTask = document.querySelector(".add-task");
const bigmodal = document.querySelector(".bigmodal");
const bigForm = document.querySelector(".big-form");

let allTask = JSON.parse(localStorage.getItem("Tasks")) || [];
localStorage.setItem("Tasks", JSON.stringify(allTask));

let selectedProject = null;

projectBtn.addEventListener("click", () =>{
    modal.showModal()
})

addTask.addEventListener("click", () =>{
    bigmodal.showModal()
})

smallFormSubmit.addEventListener("submit", (e)=>{
    // functionality for mini form to add project
    e.preventDefault();
    const projectName = document.querySelector("#project-name").value;

    if(!projectName) return;

    if (allTask.some((task) => task.project === projectName)) {
        alert("Project already exists!");
        return;
    }

    const project = new addProject(projectName);
    allTask.push(project)
    localStorage.setItem("Tasks", JSON.stringify(allTask));
    
    const smallFormElements = addProjectName(projectName);
    modal.close()
    smallFormSubmit.reset()

    //functionality to delete the project from the dom;
    smallFormElements.svg.addEventListener("click", ()=>{
        projectDiv.removeChild(smallFormElements.div);
        addTask.style.display = "none";
        allTask = allTask.filter((task)=>task.project !== projectName)
        localStorage.setItem("Tasks", JSON.stringify(allTask));
    })

    //functionality of the div in the small form elements
    smallFormElements.projectPara.addEventListener("click", ()=>{
        addTask.style.display = "block";
        selectedProject = projectName;
        console.log(selectedProject)
        
    })

})

smallFormCancel.addEventListener("click", ()=>{
    modal.close()
})

bigForm.addEventListener("submit", (e)=>{
    e.preventDefault()


    const title = document.querySelector("#title").value;
    const date = document.querySelector("#date").value;
    const priority = document.querySelector(`input[name="priority"]:checked`).value;
    const description = document.querySelector("#description").value;

    
    const projectIndex = allTask.findIndex(task => task.project === selectedProject)
    allTask[projectIndex].task.push(new todo(title, date, priority, description));

    localStorage.setItem("Tasks", JSON.stringify(allTask));


    console.log(allTask)

    bigmodal.close()
})


window.addEventListener("DOMContentLoaded", () => {
    allTask = JSON.parse(localStorage.getItem("Tasks")) || [];

    for (let task of allTask) {
        const smallFormElements = addProjectName(task.project);

        // Add event listeners for delete and click functionality
        smallFormElements.svg.addEventListener("click", () => {
            projectDiv.removeChild(smallFormElements.div);
            addTask.style.display = "none";
            allTask = allTask.filter((t) => t.project !== task.project);
            localStorage.setItem("Tasks", JSON.stringify(allTask));
        });

        smallFormElements.projectPara.addEventListener("click", () => {
            addTask.style.display = "block";
            selectedProject = task.project;
            console.log(selectedProject);
        });
    }
});

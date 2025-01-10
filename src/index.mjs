import "./styles.css";
import {
  addProjectName,
  projectDiv,
  createElements,
  todoWrapper,
  renderTodos,
  createProjectHeading,
} from "./dom.mjs";
import { todo, addProject, getIndex } from "./functionality.mjs";

export const taskBtn = document.querySelector(".taskbtn");
const projectBtn = document.querySelector(".add-project-btn");
const modal = document.querySelector(".modal");
const smallFormSubmit = document.querySelector(".smallForm");
const smallFormCancel = document.querySelector(".exit");
export const addTask = document.querySelector(".add-task");
const bigmodal = document.querySelector(".bigmodal");
const bigForm = document.querySelector(".big-form");
const heading = document.querySelector(".wrapper-heading");
export const completeBtn = document.querySelector(".completeBtn");
export const todayBtn = document.querySelector(".todayBtn");
export const plannedBtn = document.querySelector(".planned");
const cancel = document.querySelector(".cancel");

export let allTask = JSON.parse(localStorage.getItem("Tasks")) || [];
localStorage.setItem("Tasks", JSON.stringify(allTask));

let selectedProject = null;

projectBtn.addEventListener("click", () => {
  modal.showModal();
});

addTask.addEventListener("click", () => {
  bigmodal.showModal();
});

smallFormSubmit.addEventListener("submit", (e) => {
  e.preventDefault();
  const projectName = document.querySelector("#project-name").value;

  if (!projectName) return;

  if (allTask.some((task) => task.project === projectName)) {
    alert("Project already exists!");
    return;
  }

  const project = new addProject(projectName);
  allTask.push(project);
  localStorage.setItem("Tasks", JSON.stringify(allTask));

  const smallFormElements = addProjectName(projectName);
  modal.close();
  smallFormSubmit.reset();

  //functionality to delete the project from the dom;
  smallFormElements.svg.addEventListener("click", () => {
    projectDiv.removeChild(smallFormElements.div);
    addTask.style.display = "none";
    allTask = allTask.filter((task) => task.project !== projectName);
    localStorage.setItem("Tasks", JSON.stringify(allTask));
    todoWrapper.replaceChildren();
    heading.textContent = "";
    taskBtn.click();
  });

  //functionality of the div in the small form elements
  smallFormElements.projectPara.addEventListener("click", () => {
    todoWrapper.replaceChildren();
    addTask.style.display = "block";
    selectedProject = projectName;
    heading.textContent = selectedProject;
    const projectIndex = getIndex(selectedProject);
    allTask[projectIndex].task.forEach((task, taskIndex) => {
      renderTodos(projectIndex, task, taskIndex);
    });
  });
});

smallFormCancel.addEventListener("click", () => {
  modal.close();
});

bigForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.querySelector("#title").value;
  const date = document.querySelector("#date").value;
  const priority = document.querySelector(
    `input[name="priority"]:checked`,
  ).value;
  const description = document.querySelector("#description").value;

  const projectIndex = getIndex(selectedProject);

  allTask[projectIndex].task.push(new todo(title, date, priority, description));
  todoWrapper.replaceChildren();
  heading.textContent = selectedProject;
  allTask[projectIndex].task.forEach((task, taskIndex) => {
    renderTodos(projectIndex, task, taskIndex);
  });
  localStorage.setItem("Tasks", JSON.stringify(allTask));

  bigmodal.close();
});

cancel.addEventListener("click", () => {
  bigmodal.close();
});

window.addEventListener("DOMContentLoaded", () => {
  allTask = JSON.parse(localStorage.getItem("Tasks")) || [];

  for (let task of allTask) {
    const smallFormElements = addProjectName(task.project);

    smallFormElements.svg.addEventListener("click", () => {
      projectDiv.removeChild(smallFormElements.div);
      addTask.style.display = "none";
      allTask = allTask.filter((t) => t.project !== task.project);
      localStorage.setItem("Tasks", JSON.stringify(allTask));
      todoWrapper.replaceChildren();
      heading.textContent = "";
      taskBtn.click();
    });

    smallFormElements.projectPara.addEventListener("click", () => {
      addTask.style.display = "block";
      selectedProject = task.project;
      todoWrapper.replaceChildren();
      heading.textContent = selectedProject;
      const projectIndex = getIndex(selectedProject);
      allTask[projectIndex].task.forEach((task, taskIndex) => {
        renderTodos(projectIndex, task, taskIndex);
      });
    });
  }
});

taskBtn.addEventListener("click", () => {
  allTask = JSON.parse(localStorage.getItem("Tasks")) || [];
  todoWrapper.replaceChildren();
  addTask.style.display = "none";
  heading.textContent = "Tasks";
  allTask.forEach((project, projectIndex) => {
    if (project.task.length !== 0) {
      createProjectHeading(project.project);
    }
    project.task.forEach((task, taskIndex) => {
      renderTodos(projectIndex, task, taskIndex);
    });
  });
});

completeBtn.addEventListener("click", () => {
  allTask = JSON.parse(localStorage.getItem("Tasks")) || [];
  todoWrapper.replaceChildren();
  addTask.style.display = "none";
  heading.textContent = "Completed";
  allTask.forEach((project, projectIndex) => {
    if (project.task.some((p) => p.complete === true)) {
      createProjectHeading(project.project);
    }
    project.task.forEach((task, taskIndex) => {
      if (task.complete === true) {
        renderTodos(projectIndex, task, taskIndex);
        console.log(task.date);
      }
    });
  });
});

const dateToday = new Date().toISOString().slice(0, 10);

todayBtn.addEventListener("click", () => {
  allTask = JSON.parse(localStorage.getItem("Tasks")) || [];
  todoWrapper.replaceChildren();
  addTask.style.display = "none";
  heading.textContent = "Today";
  allTask.forEach((project, projectIndex) => {
    if (project.task.some((p) => p.date == dateToday)) {
      createProjectHeading(project.project);
    }
    project.task.forEach((task, taskIndex) => {
      if (task.date == dateToday) {
        renderTodos(projectIndex, task, taskIndex);
      }
    });
  });
});

plannedBtn.addEventListener("click", () => {
  allTask = JSON.parse(localStorage.getItem("Tasks")) || [];
  todoWrapper.replaceChildren();
  addTask.style.display = "none";
  heading.textContent = "Planned";
  allTask.forEach((project, projectIndex) => {
    if (project.task.some((p) => p.date >= dateToday && p.complete === false)) {
      createProjectHeading(project.project);
    }
    project.task.forEach((task, taskIndex) => {
      if (task.date >= dateToday && task.complete === false) {
        renderTodos(projectIndex, task, taskIndex);
      }
    });
  });
});

taskBtn.click();

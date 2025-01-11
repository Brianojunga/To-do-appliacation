import {
    allTask,
    completeBtn,
    taskBtn,
    todayBtn,
    plannedBtn,
  } from "./index.mjs";
  
  const projectDiv = document.querySelector(".projects");
  const svgWrapper = document.querySelector(".svg-wrapper");
  const todoWrapper = document.querySelector(".todos-wrapper");
  const heading = document.querySelector(".wrapper-heading");
  
  function deleteButtonSvg() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "24px");
    svg.setAttribute("height", "24px");
    svg.setAttribute("viewBox", "0 -960 960 960");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      "M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z",
    );
    svg.appendChild(path);
    return svg;
  }
  
  function addProjectName(project) {
    const div = document.createElement("div");
    const projectPara = document.createElement("p");
    projectPara.textContent = project;
  
    let svg = deleteButtonSvg();
  
    div.append(projectPara, svg);
    projectDiv.appendChild(div);
  
    return { projectPara, svg, div };
  }
  
  function createElements(element, clsname, innertext) {
    const el = document.createElement(element);
    if (clsname) el.classList.add(clsname);
    el.textContent = innertext || "";
    return el;
  }
  
  function todos(array, projectIndex, index) {
    const mainDiv = createElements("div", "todo");
  
    let titleSvgDiv = createElements("div");
    let datePriorityDiv = createElements("div");
  
    let svg = deleteButtonSvg();
  
    let checkBox = createElements("input", "check-box");
    if (allTask[projectIndex].task[index].complete === true) {
      checkBox.setAttribute("checked", "checked");
      mainDiv.style.textDecoration = "line-through";
    }
  
    checkBox.setAttribute("type", "checkbox");
    const span = createElements("span", "priority-para", "priority : ");
    span.appendChild(createElements("span", array.priority, array.priority));
  
    titleSvgDiv.append(
      checkBox,
      createElements("p", "title", `Title : ${array.title}`),
      svg,
    ),
      datePriorityDiv.append(
        createElements("span", "date", `Date : ${array.date}`),
        span,
      );
  
    mainDiv.append(titleSvgDiv, datePriorityDiv);
  
    return { mainDiv, svg, datePriorityDiv, checkBox, titleSvgDiv };
  }
  
  function deleteTodo(projectIndex, btn, index) {
    btn.addEventListener("click", () => {
      allTask[projectIndex].task.splice(index, 1);
      localStorage.setItem("Tasks", JSON.stringify(allTask));
  
      if (heading.textContent === "Tasks") {
        taskBtn.click();
      } else if (heading.textContent === "Completed") {
        completeBtn.click();
      } else if (heading.textContent === "Today") {
        todayBtn.click();
      } else if (heading.textContent === "Planned") {
        plannedBtn.click();
      } else {
        const projectContainer = document.querySelector(
          `.project-${projectIndex}`,
        );
        projectContainer.replaceChildren();
  
        allTask[projectIndex].task.forEach((task, tIndex) => {
          renderTodos(projectIndex, task, tIndex);
        });
      }
    });
  }
  
  function toggleComplete(btn, array, projectIndex, index, div) {
    btn.addEventListener("change", () => {
      const complete = array.complete === false ? true : false;
      allTask[projectIndex].task[index].complete = complete;
      localStorage.setItem("Tasks", JSON.stringify(allTask));
      if (complete) {
        div.style.textDecoration = "line-through";
        if (heading.textContent === "Planned") {
          plannedBtn.click();
        }
      } else {
        div.style.textDecoration = "";
        if (heading.textContent === "Completed") {
          completeBtn.click();
        }
      }
    });
  }
  
  function displayDescription(btn, array, div) {
    if (!array.description) return;
  
    let description;
    btn.addEventListener("click", () => {
      if (!description) {
        description = createElements("div", "notes-div");
        const notesHeading = createElements("h3", "notes-heading", "Notes");
        const projectDescription = createElements(
          "p",
          "description-para",
          array.description,
        );
        description.append(notesHeading, projectDescription);
        div.appendChild(description);
        div.classList.toggle("expand");
      } else {
        if (description) {
          div.removeChild(description);
          description = null;
          div.classList.toggle("expand");
        }
      }
    });
  }
  
  function renderTodos(projectIndex, array, arrayIndex) {
    let projectContainer = document.querySelector(`.project-${projectIndex}`);
  
    if (!projectContainer) {
      projectContainer = createElements("div", `project-${projectIndex}`);
      projectContainer.classList.add("project");
      todoWrapper.appendChild(projectContainer);
    }
  
    const { mainDiv, svg, datePriorityDiv, checkBox, titleSvgDiv } = todos(
      array,
      projectIndex,
      arrayIndex,
    );
    projectContainer.appendChild(mainDiv);
    deleteTodo(projectIndex, svg, arrayIndex);
    displayDescription(mainDiv, array, mainDiv);
    toggleComplete(checkBox, array, projectIndex, arrayIndex, mainDiv);
  }
  
  function createProjectHeading(name) {
    const h1 = createElements("h2", "project-name", name);
    todoWrapper.appendChild(h1);
  
    const hr = createElements("hr");
    todoWrapper.appendChild(hr);
  }
  
  export {
    addProjectName,
    projectDiv,
    svgWrapper,
    createElements,
    renderTodos,
    todoWrapper,
    createProjectHeading,
  };
  
  // for querySelector buttons UserActivationif (heading.textContent === "Completed") {
  //     completeBtn.forEach((btn) => {
  //         if (btn.offsetParent !== null) {
  //             btn.click();
  //         }
  //     });
  // }
  
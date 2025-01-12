const todoInput = document.getElementById("todo-text");
const listItems = document.getElementById("list-items");
const addUpdateImage = document.getElementById("add-update-image");
const todoAlertMsg = document.getElementById("alert-msg");

todoInput.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        addUpdateImage.click();
    }
});

let todo = JSON.parse(localStorage.getItem("todo-list"));
if (!todo) {
  todo = [];
}

function setLocalStorage() {
    localStorage.setItem("todo-list", JSON.stringify(todo));
}

function setAlertMessage(message) {
  todoAlertMsg.removeAttribute("class");
  todoAlertMsg.innerText = message;
  setTimeout(() => {
    todoAlertMsg.classList.add("toggleMe");
  }, 1000);
}  

function createToDoData(){
    if(todoInput.value === ""){
        alert("Please enter a text for your task");
    } else if (isPresent(todoInput.value)) {
        alert("This task is already present in the todo list!");
    } else {

        let li = document.createElement("li");

        li.innerHTML = `
        <div id="task-text" 
            title="Hit Double Click to Complete"
            ondblclick="completeToDoTask(this)">${todoInput.value}</div>
        <div>
            <img src="images/pencil.png" class="edit todo-controls" onclick="editToDoTask(this)" alt="Edit task" />
            <img src="images/trash.png" class="delete todo-controls" onclick="deleteToDoTask(this)" alt="Delete task" />
        </div>`;    

        listItems.appendChild(li);

        if (!todo) {
            todo = [];
        }
        let itemList = { item: todoInput.value, status: false };
        todo.push(itemList);
        setLocalStorage();
        setAlertMessage("Task added Successfully!");
    }

    todoInput.value = "";
    todoInput.focus();
}

function ReadToDoItems() {
    todo.forEach((element) => {
      let li = document.createElement("li");
      let style = "";
      if (element.status) {
/*        style = "style='text-decoration: line-through'";*/
        style = "style='text-decoration: line-through; color: blue;'";
      }
      const todoItems = `
        <div ${style} id="task-text"
                      title="Hit Double Click to Complete" 
                      ondblclick="completeToDoTask(this)">
            ${element.item}
            ${
                style === ""
                ? ""
                : '<img class="todo-controls" src="/images/check-mark.png" />'
            }
        </div>
        <div>
            ${
                style === ""
                ? '<img class="edit todo-controls" onclick="editToDoTask(this)" src="/images/pencil.png" />'
                : ""
            }
            <img class="delete todo-controls" onclick="deleteToDoTask(this)" src="/images/trash.png" />
        </div>`;
      li.innerHTML = todoItems;
      listItems.appendChild(li);
    });
}
ReadToDoItems();
  
function completeToDoTask(taskItem){
    if(taskItem.style.textDecoration === ""){
        taskItem.style.textDecoration = "line-through";
        taskItem.style.color = "blue";

        const img = document.createElement("img");
        img.src = "/images/check-mark.png";
        img.className = "todo-controls";
        taskItem.parentElement.querySelector("div").style.textDecoration = "line-through";
        taskItem.parentElement.querySelector("div").appendChild(img);
        taskItem.parentElement.querySelector("img.edit").remove();

        todo.forEach((element) => {
            if (
              taskItem.parentElement.querySelector("div").innerText.trim() == element.item
            ) {
              element.status = true;
            }
          });
          setLocalStorage();
          setAlertMessage("Task Completed Successfully!");

    } else if(taskItem.style.textDecoration === "line-through"){
        //taskItem.style.textDecoration = "";
        //taskItem.style.color = "black";
    }
}

function editToDoTask(pencilImage){
    taskItem = pencilImage.parentElement.parentElement.querySelector("#task-text");
    todoInput.focus();

    //Se o item ainda não foi concluído, permite edição
    if(taskItem.style.textDecoration === ""){
        todoInput.value = taskItem.innerText;
//        todoInput.value = document.querySelector("#task-text").innerText;
        addUpdateImage.setAttribute("onclick", "updateToDoTask(taskItem)");
        addUpdateImage.setAttribute("src", "images/refresh.png");
    } else {
        alert("You cannot edit a completed task.");
    }
}

function updateToDoTask(taskItem){
    if (isPresent(todoInput.value)) {
        alert("This task is already present in the todo list!");
    } else {        
        todo.forEach((element) => {
            if (element.item === taskItem.innerText.trim()) {
            element.item = todoInput.value;
            }
        });
        setLocalStorage();
        taskItem.innerText = todoInput.value;
        setAlertMessage("Task Updated Successfully!");    
    }
    todoInput.value = "";
    addUpdateImage.setAttribute("onclick", "createToDoData()");
    addUpdateImage.setAttribute("src", "images/plus.png");
}

function deleteToDoTask(trashImage){
    taskItem = trashImage.parentElement.parentElement.querySelector("#task-text");
    let deleteValue = taskItem.innerText;

    // Encontra o <li> mais próximo contendo o trashImage
    taskItemToDelete = trashImage.closest("li");  
    //taskItemToDelete = trashImage.parentElement.parentElement;

    if(confirm(`Are you sure you want to delete this task [${taskItem.innerText}]?`)){
        taskItemToDelete.setAttribute("class", "deleted-item");
        todoInput.focus();
        todo.forEach((element) => {
            if (element.item == deleteValue.trim()) {
                todo.splice(element, 1);
            }
        });
    
        setTimeout(() => {
            taskItemToDelete.remove();
        }, 1000);
    
        setLocalStorage();
    }
}

function isPresent(taskName){
    return todo.some((element) => element.item === taskName.trim());    
}

const addForm = document.querySelector(".add");
const list = document.querySelector(".todos");
const checkbox = document.querySelectorAll(".completed");
const remove = document.querySelectorAll(".delete");
const search = document.querySelector(".search input");
const outstandingTasks = document.querySelector(".notDone");
const completedTasks = document.querySelector(".done");
let taskToDelete = null;
const modal = new bootstrap.Modal(document.getElementById("confirmDelete"), { keyboard: true });

// Get Tasks from database

db.collection("To-Dos")
  .orderBy("createdDate", "asc")
  .onSnapshot((snapshot) => {
    // Everytime there is a change to the database, firestore takes a snapshot of the updated collection
    // onSnapshot() will fire everytime the database is updated
    snapshot.docChanges().forEach((change) => {
      const doc = change.doc;

      if (change.type === "added") {
        if (doc.data().completed) {
          addTaskToHTML(doc.data(), doc.id, true);
        } else {
          addTaskToHTML(doc.data(), doc.id, false);
        }
      } else if (change.type === "removed") {
        deleteTaskFromHTML(doc.id);
      } else if (change.type === "modified") {
        completeTaskInHTML(doc.id);
      }
    });
  });

// Format Date & Time

function formatCreatedTime(data) {
  const createdDate = data.createdDate.toDate();
  const year = createdDate.getFullYear();
  const month = createdDate.getMonth() + 1;
  const day = createdDate.getDate();
  const hour = createdDate.getHours();
  const minutes = createdDate.getMinutes();
  const padded = (number) => {
    if (number < 10) {
      return `0${number}`;
    } else {
      return number;
    }
  };
  const formattedDate = `${padded(hour)}:${padded(minutes)} - ${padded(day)}/${padded(month)}/${year}`;
  return formattedDate;
}

// Adding Tasks

function addTaskToHTML(data, id, done) {
  let completed = data.completed ? "checked" : "";
  const createdTime = formatCreatedTime(data);
  const html = `          
<div class="task" id="${id}">
<li class="list-group-item ${completed}">
  <div class="checkbox">
    <i class="completed fa-sharp fa-solid fa-square-check hover-icon"></i>
    <i class="completed fa-sharp fa-regular fa-square-check active-icon"></i>
    <i class="completed fa-sharp fa-regular fa-square default-icon"></i>
  </div>
  <span>${data.task}</span>
  <div class="icons">
    <i class="info fa-sharp fa-solid fa-circle-info"></i>
    <i class="delete fa-solid fa-trash-can" data-bs-toggle="modal" data-bs-target="#confirmDelete"></i>
  </div>
</li>
<li class="details list-group-item d-flex justify-content-between align-items-center d-none">
  <span><b>Created:</b> ${createdTime}</span>
  <span><b>ID:</b> ${id}</span>
</li>
</div>`;

  done ? (completedTasks.innerHTML = html + completedTasks.innerHTML) : (outstandingTasks.innerHTML = html + outstandingTasks.innerHTML);
}

function addTaskToDatabase(task) {
  const now = new Date();

  if (task.length) {
    // true if input length > 0
    const taskObj = {
      completed: false,
      createdDate: firebase.firestore.Timestamp.fromDate(now),
      task: task,
    };
    db.collection("To-Dos").add(taskObj);
    addForm.reset();
  }
}

addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const task = addForm.add.value.trim();
  addTaskToDatabase(task);
});

// Completing Tasks

function completeTaskInHTML(id) {
  let tasks = [...outstandingTasks.children];
  tasks.push(...completedTasks.children);
  tasks.forEach((task) => {
    if (task.id === id) {
      task.children[0].classList.toggle("checked");

      if (task.children[0].classList.contains("checked")) {
        completedTasks.prepend(task);
      } else {
        outstandingTasks.prepend(task);
      }
    }
  });
}

// Deleting Tasks

function deleteTaskFromHTML(id) {
  let tasks = [...outstandingTasks.children];
  tasks.push(...completedTasks.children);
  tasks.forEach((task) => {
    if (task.id === id) {
      task.remove();
    }
  });
}

function confirmDelete(id) {
  db.collection("To-Dos").doc(id).delete();
  modal.hide();
}

// modal confirm delete button
document.querySelector(".btn-danger").addEventListener("click", () => {
  if (taskToDelete !== null) {
    confirmDelete(taskToDelete);
    taskToDelete = null;
  }
});

// Search Tasks

function filterList(query) {
  let tasks = [...outstandingTasks.children];
  tasks.push(...completedTasks.children);
  tasks
    .filter((item) => {
      return !item.textContent.toLowerCase().includes(query); // returns an array containing any items that don't include the search query
    })
    .forEach((item) => {
      item.classList.add("filtered"); // adds the class 'filtered' to any items that don't match the search query
    });

  tasks
    .filter((item) => {
      return item.textContent.toLowerCase().includes(query); // returns an array containing any items that include the search query
    })
    .forEach((item) => {
      item.classList.remove("filtered"); // removes the class 'filtered' to any items that match the search query
    });
}

search.addEventListener("keyup", () => {
  const query = search.value.trim().toLowerCase();
  filterList(query);
});

// Event Listeners for Icon Buttons

list.addEventListener("click", (e) => {
  // Delete Icon

  if (e.target.classList.contains("delete")) {
    taskToDelete = e.target.parentElement.parentElement.parentElement.id;
    modal.show();

    // Checkbox Icon
  } else if (e.target.classList.contains("completed")) {
    let id = e.target.parentElement.parentElement.parentElement.id;
    if (e.target.parentElement.parentElement.classList.contains("checked")) {
      db.collection("To-Dos").doc(id).update({
        completed: false,
      });
    } else {
      db.collection("To-Dos").doc(id).update({
        completed: true,
      });
    }

    // Info Icon
  } else if (e.target.classList.contains("info")) {
    const button = e.target;
    const isActive = button.classList.contains("information");
    const infoButtons = document.querySelectorAll(".info");
    infoButtons.forEach((btn) => {
      if (btn.classList.contains("information")) {
        btn.parentElement.parentElement.nextElementSibling.classList.add("d-none");
        btn.classList.remove("information");
      }
    });

    if (!isActive) {
      button.parentElement.parentElement.nextElementSibling.classList.toggle("d-none");
      button.classList.toggle("information");
    }
  }
  //
});

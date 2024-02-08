const addForm = document.querySelector(".add");
const list = document.querySelector(".todos");
const checkbox = document.querySelectorAll(".completed");
const remove = document.querySelectorAll(".delete");

// Get Tasks

db.collection("To-Dos").onSnapshot((snapshot) => {
  console.log(snapshot.docChanges());
  // Everytime there is a change to the database, firestore takes a snapshot of the updated collection
  // onSnapshot() will fire everytime the database is updated
  snapshot.docChanges().forEach((change) => {
    const doc = change.doc;

    if (change.type === "added") {
      addTask(doc.data(), doc.id);
    } else if (change.type === "removed") {
      deleteTask(doc.id);
    } else if (change.type === "modified") {
      completeTask(doc.id);
    }
  });
});

function addTask(data, id) {
  let completed = data.completed ? "checked" : "";
  const html = `


  <div class="task" id="${id}">
  <li class="list-group-item d-flex justify-content-between align-items-center ${completed}" >
    <span>${data.task}</span>
    <div class="icons">
      <i class="completed fa-sharp fa-solid fa-square-check"></i>
      <i class="info fa-sharp fa-solid fa-circle-info"></i>
      <i class="delete fa-solid fa-trash-can"></i>
    </div>
  </li>
  <li class="details list-group-item d-flex justify-content-between align-items-center d-none">
    <span>Created: ${data.createdDate.toDate()}</span>
    <span>ID: ${id}</span>
  </li>
</div>
`;

  list.innerHTML += html;
}

function completeTask(id) {
  const tasks = [...list.children];
  tasks.forEach((task) => {
    if (task.id === id) {
      task.children[0].classList.toggle("checked");
    }
  });
}

function deleteTask(id) {
  const tasks = [...list.children];
  tasks.forEach((task) => {
    if (task.id === id) {
      task.remove();
    }
  });
}

// add Task

addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const task = addForm.add.value.trim();
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
});

// Event Listener for task buttons

list.addEventListener("click", (e) => {
  // Delete Button
  if (e.target.classList.contains("delete")) {
    const id = e.target.parentElement.parentElement.parentElement.id;

    db.collection("To-Dos").doc(id).delete();
    //
  } else if (e.target.classList.contains("completed")) {
    // Checkboxes
    // e.target.parentElement.parentElement.classList.toggle("checked");

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

    //
  } else if (e.target.classList.contains("info")) {
    // Info Button
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

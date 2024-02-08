const addForm = document.querySelector(".add");
const list = document.querySelector(".todos");
const checkbox = document.querySelectorAll(".completed");
const remove = document.querySelectorAll(".delete");
const search = document.querySelector(".search input");

// Get Tasks

db.collection("To-Dos")
  .orderBy("createdDate", "asc")
  .onSnapshot((snapshot) => {
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

function addTask(data, id) {
  let completed = data.completed ? "checked" : "";
  const createdTime = formatCreatedTime(data);
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
    <span><b>Created:</b> ${createdTime}</span>
    <span><b>ID:</b> ${id}</span>
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

// Search

const filterList = (query) => {
  Array.from(list.children)
    .filter((item) => {
      return !item.textContent.toLowerCase().includes(query); // returns an array containing any items that don't include the search query
    })
    .forEach((item) => {
      item.classList.add("filtered"); // adds the class 'filtered' to any items that don't match the search query
    });

  Array.from(list.children)
    .filter((item) => {
      return item.textContent.toLowerCase().includes(query); // returns an array containing any items that include the search query
    })
    .forEach((item) => {
      item.classList.remove("filtered"); // removes the class 'filtered' to any items that match the search query
    });
};

search.addEventListener("keyup", () => {
  const query = search.value.trim().toLowerCase();
  filterList(query);
});

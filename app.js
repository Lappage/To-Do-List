const addForm = document.querySelector(".add");
const list = document.querySelector(".todos");
const checkbox = document.querySelectorAll(".completed");
const infoButton = document.querySelectorAll(".info");
const remove = document.querySelectorAll(".delete");

const completeTask = () => {};

const addTask = (task) => {
  const html = `
  <div class="task">
  <li class="list-group-item d-flex justify-content-between align-items-center ${completed}">
    <span>${task}</span>
    <div class="icons">
      <i class="completed fa-sharp fa-solid fa-square-check"></i>
      <i class="info fa-sharp fa-solid fa-circle-info"></i>
      <i class="delete fa-solid fa-trash-can"></i>
    </div>
  </li>
  <li class="details list-group-item d-flex justify-content-between align-items-center d-none">
    <span>Created: ${created}</span>
    <span>Completed: ${completedDate}</span>
  </li>
</div>
`;

  list.innerHTML += html;
};

db.collection("To-Dos")
  .get()
  .then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      console.log(doc.data());
    });
  })
  .catch((error) => {
    console.log(error);
  });

checkbox.forEach((box) => {
  box.addEventListener("click", () => {
    box.parentElement.parentElement.classList.toggle("checked");
  });
});

infoButton.forEach((button) => {
  button.addEventListener("click", () => {
    button.parentElement.parentElement.nextElementSibling.classList.toggle("d-none");
    button.classList.toggle("information");
  });
});

// info.addEventListener("click", () => {
//   info.parentElement.parentElement.nextElementSibling.classList.toggle("d-none");
//   info.classList.toggle("information");
// });

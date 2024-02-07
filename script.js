const addForm = document.querySelector(".add");
const list = document.querySelector(".todos");
const search = document.querySelector(".search input");
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

const generateTemplate = (todo) => {
  const html = `
<li class="list-group-item d-flex justify-content-between align-items-center">
    <span>${todo}</span>
    <i class="fa-regular fa-trash-can delete"></i>
</li>
`;

  list.innerHTML += html;
};

addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const todo = addForm.add.value.trim();

  if (todo.length) {
    // true if input length > 0
    generateTemplate(todo);
    addForm.reset();
  }
});

// delete to dos
list.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    e.target.parentElement.remove();
  }
});

list.addEventListener("mouseover", (e) => {
  if (e.target.classList.contains("delete")) {
    e.target.classList.add("fa-solid");
  }
});

list.addEventListener("mouseout", (e) => {
  if (e.target.classList.contains("delete")) {
    e.target.classList.remove("fa-solid");
  }
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

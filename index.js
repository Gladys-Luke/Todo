function uuid() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}

// TODO: CRUD FUNCTIONS
const DB_NAME = "todo_db";

const createTodo = () => {
  const todoInput = document.getElementById("todo-input");
  const descriptionInput = document.getElementById("todo-description-input"); // Get the description input field

  if (!todoInput.value) {
    const formMessageSpan = document.querySelector("#form-message");
    formMessageSpan.innerHTML = "Please provide content";
    formMessageSpan.classList.remove("hidden");
    formMessageSpan.classList.add("text-red-400");
    setTimeout(() => {
      formMessageSpan.classList.add("hidden");
    }, 5000);

    return;
  }

  const newTodo = {
    id: uuid(),
    title: todoInput.value,
    description: descriptionInput.value, // Use the value from the description input
    created_at: Date.now(),
  };
  const todo_db = JSON.parse(localStorage.getItem(DB_NAME)) || [];
  const new_todo_db = [...todo_db, newTodo];
  localStorage.setItem(DB_NAME, JSON.stringify(new_todo_db));
  fetchTodos();
  todoInput.value = "";
};

const fetchTodos = () => {
  const todo_db = JSON.parse(localStorage.getItem(DB_NAME)) || [];
  const todoListContainer = document.querySelector("#todo-list-container");
  const todoPreview = document.querySelector("#todo-preview");
  console.log (todo_db);

  const todos = todo_db
    ?.sort((a, b) =>
      a.created_at < b.created_at ? 1 : a.created_at > b.created_at ? -1 : 0
    )
    ?.map((todo) => {
      const createdTime = new Date(todo.created_at).toLocaleString();
      const todoPreviewText =
        todo.title.length > 30
          ? todo.title.substring(0, 30) + "..."
          : todo.title;

      return `
        <div class="flex justify-between py-2 px-1 mx-24 my-5 hover:bg-slate-300 todo-item">
          <a href="#" onclick="navigateToPreview('${todo.id}')">${todoPreviewText}</a>
          <div class="flex gap-5 mx-12 todo-buttons">
            <button onclick="handleEdit('${todo.id}')">
              Edit
            </button>
            <button onclick="deleteTodo('${todo.id}')">
              Delete
            </button>
          </div>
        </div>
        <p class="hidden" id="todo-description-${todo.id}">${todo.description}</p>
      `;
    });


  todoListContainer.innerHTML = todos?.join("");
};

const navigateToPreview = (id) => {
  // Implement navigation to the preview page here, e.g., change the page content or load a new page.
  // You can use JavaScript, HTML, or any framework you prefer for navigation.
  // For demonstration, you can update the content on the same page.
  const todo_db = JSON.parse(localStorage.getItem(DB_NAME)) || [];
  const todo = todo_db.find((item) => item.id === id);

  if (todo) {
    const todoTitle = document.querySelector("#todo-title");
    const todoDescription = document.querySelector("#todo-description");
    const todoCreatedTime = document.querySelector("#todo-created-time");

    todoTitle.textContent = todo.title;
    todoDescription.textContent = todo.description;
    todoCreatedTime.textContent = new Date(todo.created_at).toLocaleString();

    const todoListContainer = document.querySelector("#todo-list-container");
    todoListContainer.classList.add("hidden");
    const todoPreview = document.querySelector("#todo-preview");
    todoPreview.classList.remove("hidden");
    
  }
  const backButton = document.querySelector("#back-button");
  backButton.classList.remove("hidden");
};

const navigateToMainPage = () => {
  // Implement navigation back to the main page.
  // You can update the content or load a new page as needed.
  const todoListContainer = document.querySelector("#todo-list-container");
  const todoPreview = document.querySelector("#todo-preview");
  todoListContainer.classList.remove("hidden");
  todoPreview.classList.add("hidden");
  
  // Hide the back button when returning to the main page
  const backButton = document.querySelector("#back-button");
  backButton.classList.add("hidden");
};



const handleEdit = (id) => {
  // Handle edit action without navigating to a preview page
  const todo_db = JSON.parse(localStorage.getItem(DB_NAME)) || [];
  const todo_to_edit = todo_db.find((todo) => todo.id === id);
  if (!todo_to_edit) {
    return;
  }
  const todoInput = document.querySelector("#todo-input");
  const descriptionInput = document.getElementById("todo-description-input");

  todoInput.value = todo_to_edit.title;
  descriptionInput.value = todo_to_edit.description; // Populate the description input

  const updateBtn = document.querySelector("#update_todo_btn");
  updateBtn.classList.remove("hidden");
  updateBtn.setAttribute("todo_id_to_update", id);

  const addBtn = document.querySelector("#add_todo_btn");
  addBtn.classList.add("hidden");

  // Add an event listener to the update button to call the updateTodo function
  updateBtn.addEventListener("click", updateTodo);
};



const updateTodo = () => {
  const todoInput = document.getElementById("todo-input");
  const descriptionInput = document.getElementById("todo-description-input");

  if (!todoInput.value) {
    const formMessageSpan = document.querySelector('#form-message');
    formMessageSpan.innerHTML = 'Please provide content';
    formMessageSpan.classList.remove('hidden');
    formMessageSpan.classList.add('text-red-400');
    setTimeout(() => {
        formMessageSpan.classList.add('hidden');
    }, 5000);

    return;
  }

  const updateBtn = document.querySelector("#update_todo_btn");
  const todoId = updateBtn.getAttribute("todo_id_to_update");
  const todo_db = JSON.parse(localStorage.getItem(DB_NAME)) || [];
  const updated_todo_db = todo_db.map((todo) => {
    if (todo.id === todoId) {
      return {
        ...todo,
        title: todoInput.value,
        description: descriptionInput.value, // Update the description as well
      };
    } else {
      return todo;
    }
  });

  localStorage.setItem(DB_NAME, JSON.stringify(updated_todo_db));
  fetchTodos();

  // Clear input fields
  todoInput.value = "";
  descriptionInput.value = "";

  // Change button back to "Add todo"
  updateBtn.classList.add("hidden");
  const addBtn = document.querySelector("#add_todo_btn");
  addBtn.classList.remove("hidden");
};



const deleteTodo = (id) => {
  Swal.fire({
    title: "Delete Todo",
    // text: "You won't be able  revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      setTimeout(Swal.fire("Deleted!", "Your file has been deleted."), 1000);

      const todo_db = JSON.parse(localStorage.getItem(DB_NAME)) || [];
      const new_todo_db = todo_db.filter((todo) => todo.id !== id);
      localStorage.setItem(DB_NAME, JSON.stringify(new_todo_db));
      fetchTodos();
    } else {
      return;
    }
  });
};

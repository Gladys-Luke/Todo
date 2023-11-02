function uuid(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}
console.log(uuid())



// TODO: CRUD FUNCTIOn
/*
get todo from user-input
add todo to local storage
*/
const DB_NAME = "todo_db";
const createTodo = () => {
    const todoInput = document.getElementById('todo-input');
    
    
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

    const newTodo =  {
        id: uuid(),
        title: todoInput.value,
        created_at: Date.now()
    }
    // console.log(DB_NAME)

    const todo_db = JSON.parse(localStorage.getItem(DB_NAME)) || [];
    // console.log(todo_db)
    // add new n toto to array
    const new_todo_db = [...todo_db, newTodo];
    // set new input value in local storage
    localStorage.setItem(DB_NAME, JSON.stringify(new_todo_db));
    fetchTodos()
    todoInput.value = ''
    // localStorage.clear()
}
// READ: CRUD FUNCTION
    const fetchTodos = () =>{
        const  todo_db = JSON.parse(localStorage.getItem(DB_NAME)) || [];
        const todoListContainer = document.querySelector("#todo-list-container");
        const noTodo = todo_db.length === 0;
        if (noTodo) {
            todoListContainer.innerHTML = `<p>Your Todos will appear here.</p>`;
            return;
        }
        const todos = todo_db
        ?.sort((a, b) =>  a.created_at < b.created_at ? 1 : a.created_at > b.created_at ? -1 : 0)
        ?.map((todo) =>{ 
    
            return `
            <div class="group flex  justify-between py-2 px-1 mx-24 my-5 hover:bg-slate-300">
                <a href="">${todo.title}</a>
                <div class="hidden group-hover:flex gap-5 mx-12">
                    <button onClick="handleEditMode('${todo.id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                    </button>

                    <button onclick="deleteTodo('${todo.id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                                            
                    </button>

                </div>
          
            </div>
            
          `
        })
        // console.log(todo_db)
        todoListContainer.innerHTML = todos?.join('')
    };
    

// UPDATE/ EDIT : CRUD FUNCTION
const handleEditMode = (id) => {
    // console.log(todo)
    const todo_db = JSON.parse(localStorage.getItem(DB_NAME)) || [];
    const todo_to_update = todo_db.find((todo) => todo.id === id );
    if(!todo_to_update) {
      return;
    }
        const todoInput = document.querySelector('#todo-input');
        todoInput.value = todo_to_update.title

        const updateBtn = document.querySelector("#update_todo_btn");
        updateBtn.classList.remove("hidden")
        updateBtn.setAttribute("todo_id_to_update", id);

        const addBtn = document.querySelector("#add_todo_btn");
        addBtn.classList.add("hidden")
    };


const updateTodo = () => {
    const todoInput = document.getElementById('todo-input');
    
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
    const updated_todo_db =todo_db.map((todo)=>{
        if (todo.id === todoId) {
            return {...todo,title:todoInput.value}
        }
        else{
            return todo;
        }
        
       });
    
      
      localStorage.setItem(DB_NAME, JSON.stringify(updated_todo_db));
       fetchTodos();
    }
    



// DELETE : CRUD FUNCTION
const deleteTodo = (id)=> {
         
Swal.fire({
    title: 'Delete Todo',
    // text: "You won't be able  revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      setTimeout((
        Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            // 'success'
          )
      ), 1000)

      
     // get todo from l
     const todo_db = JSON.parse(localStorage.getItem(DB_NAME)) || [];
     // filter out todos that doesnt match the id parsed 
     const new_todo_db = todo_db.filter((todo) => todo.id !== id);
     // set the new todos without the todos that doesnt matches the id  to the ls
     localStorage.setItem(DB_NAME, JSON.stringify(new_todo_db));
     console.log(new_todo_db)
     // call the read function to update the UI
     fetchTodos()
    }
    else {
        return
    }

  })







   
}


// fetchTodos()



/*
THINGS TO READ 

sort function
*/ 
const daily_task_section = document.getElementById("daily_task");
const tasks_summary = document.getElementById("tasks_summary");
const tasks_summary_list = document.getElementById("tasks_summary_list");
const inner_content = document.getElementById("inner_content");
const tasks_container = document.getElementById("tasks");
const task_input_form = document.getElementById("task_input_form");

//UI VISIBILITY LOGIC --------------------
daily_task_section.addEventListener("mouseenter", ()=>{
    tasks_summary.style.display = "none";
    inner_content.style.display = "flex";
})

daily_task_section.addEventListener("mouseleave", ()=>{
    tasks_summary.style.display = "flex";
    inner_content.style.display = "none";
})


//TASK MANAGEMENT LOGIC -------------------
//RESETING TASK PER DAY DAY CHANGE
function resetTasks(){
    localStorage.removeItem("all_tasks"); //delete the stored data
}

function updateTasksDate(){
    localStorage.setItem("tasks_date", `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`)
}

let storedDate_str = localStorage.getItem("tasks_date");
const today = new Date();
if(storedDate_str != undefined){ //if this not a first time user
    today_str = `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`;

    if(today_str != storedDate_str){ //if its a new day, reset the tasks
        resetTasks();
        updateTasksDate();
    }
}
else{ //store today's date for the new user
    updateTasksDate();
}

//FOR MOUNTING TASK TO DOM
function mountTask(id, task){
    const task_item = document.createElement("li"); //create task item
    const summary_task_item = document.createElement("li"); //create task item too for the summary view
    task_item.classList.add("task_item");
    if(task.done){//if the task's status is already showing done as at this time of mounting, then mark it as done
        task_item.classList.add("done");
        summary_task_item.classList.add("done");
    }
    
    summary_task_item.innerText = number_2_text(id + 1);

    //if the user clicks then the task is completed
    task_item.addEventListener("click", (event)=>{
        handleTaskCompleted(id)
        task_item.classList.add("done");
        summary_task_item.classList.add("done");
    }); 

    const task_num = document.createElement("h4");
    task_num.innerText = number_2_text(id + 1);
    const task_description = document.createElement("p");
    task_description.innerText = task.details;
    task_description.title = "Click to mark as done"

    task_item.appendChild(task_num); //mount data into the task item
    task_item.appendChild(task_description); //mount data into the task item

    tasks_container.appendChild(task_item) //mount the task item
    tasks_summary_list.appendChild(summary_task_item) //mount the task summary label too item
    tasks_container.scrollTo(0,tasks_container.scrollHeight); //scroll the element to the end to show the new task added
}

//FETCHING TASKS
let all_tasks = JSON.parse(localStorage.getItem("all_tasks")) || [];

for (let i = 0; i < all_tasks.length; i++){
    //create task item to instantiate
    mountTask(i, all_tasks[i])
}

//ADDING NEW TASKS
task_input_form.addEventListener("submit", (event)=>{
    event.preventDefault();

    const form_data = new FormData(event.target);
    const task = form_data.get("task");

    if(task != "" && task != undefined){
        new_task_item = {
            "done": false,
            "details": task
        }
        all_tasks.push(new_task_item) //add the new task to the list of tasks
        localStorage.setItem("all_tasks", JSON.stringify(all_tasks)) //store the tasks locally
        mountTask(all_tasks.length - 1, new_task_item) //the the new task to the dom tree
        task_input_form.reset()//clear the input element
    }
})

//MARKING TASK COMPLETED
function handleTaskCompleted(id){
    all_tasks[id].done = true; //mark the tak as completed
    localStorage.setItem("all_tasks", JSON.stringify(all_tasks)) //store the new state of the tasks locally
}
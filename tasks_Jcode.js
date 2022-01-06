let tasks=[];
var numberOfTasks=0;
var pressed_task=-1;

$(document).ready(function(){
    var local_storage_data=JSON.parse(localStorage.getItem("tasks"));
    if(local_storage_data!=null){
        local_storage_data.forEach(function(task,index){
            console.log("task is: " + task);
            if(task!=undefined){           
                tasks.push(new Task(task.date,task.description,task.status));
            }
        });
        numberOfTasks=tasks.length;
        tasks.forEach(function(task,index){
            console.log("index is: " + index)
            if(task!=undefined){
                DisplayTask(task,index+1);
            }
        });
    }
    $("#new_task_btn").bind("click",addNewTask);
    $("#new_day_btn").bind("click",clearTasks);
    $("#popupBasic button:nth-child(2)").bind("click", taskCompletion);
    $("#popupBasic button:nth-child(3)").bind("click", closePopUp);
    $("#new_assingment").keyup(function(event){
        if(event.which==13){
            console.log("key is up"+ event.keyCode);
            event.preventDefault();
            addNewTask();
        }
    });
    $("li").hover(function(){
        console.log("");
    });
});

function addNewTask(){
    var new_task_text=$("#new_assingment").val();
    var new_task=new Task(Date.now(), new_task_text, "incomplete");
    tasks.push(new_task);
    numberOfTasks++;
    localStorage.setItem("tasks",JSON.stringify(tasks));
    $("#new_assingment").val("");
    DisplayTask(new_task,numberOfTasks);
}

function clearTasks(){
    $("#tasks_ul li").each(function(){
        if($(this).attr('id')<=tasks.length){
            $(this).remove();
        }
    });
    tasks=[];
    localStorage.setItem("tasks", JSON.stringify(tasks));
    numberOfTasks=0;

}

function closePopUp(){
    $("#popupBasic").popup("close");
    pressed_task=-1;
}

function taskCompletion(){
    tasks[pressed_task-1].status="completed";
    localStorage.setItem("tasks",JSON.stringify(tasks));
    $("#"+pressed_task).remove();
    var completed_task=tasks[pressed_task-1]; //is it a cope or by reference?
    DisplayTask(completed_task,pressed_task);
    $("#popupBasic").popup("close");
    $('ul').prepend("<img id='heyyy' style='width: 20%; position:fixed; z-index: 1; min-width: 12em' src='\pokemon.png'>");
    $("#heyyy").fadeIn(5500).animate({top: '10em',left: '10em', transform: 'rotate(20deg)'},400).fadeOut(500);
    pressed_task=-1;
}

function DisplayTask(new_task, index){
    var task_html=`<li class='incomplete_task_item' id=\"${index}\"style=\"text-align:right\"><div class='item_data'><p class='task_date' onclick=\"triggerPopup(${index})\">${parseTaskDate(new_task.date)}</p><p class='task_description' onclick=\"triggerPopup(${index})\"><b>${new_task.description}</b></p></div></li>`;
    var wo_click_task_html=`<li id=\"${index}\"\"style=\"text-align:right\"><p class='task_date'>${parseTaskDate(new_task.date)}</p><p class='task_description'><strike>${new_task.description}</strike></p></li>`;
    var msg_icons="<div class='msg_icons' style='decoration: none; border: none'><img id='delete_icon' onclick=deleteMsg("+index+") style='width:3%; opacity:60%; left:0px' src='\delete_icon.png'><img id='edit_icon' onclick=\"editMsg("+index+")\" style='width:3%; opacity:60%' src='\edit_icon.png'></div>";
    if(new_task.status=="incomplete"){
        $("#completed_tasks").before(task_html);
        $("#"+index).append(msg_icons);
    }
    if(new_task.status=="completed"){
        $("#tasks_ul").append(wo_click_task_html);
    }
}

function parseTaskDate(date){
    let taskDate=new Date(date);
    let day=taskDate.getDate();
    let month=taskDate.getMonth();
    let year=taskDate.getFullYear()
    let hour=taskDate.getHours()
    let minutes=taskDate.getMinutes();

    return day +"/"+month+"/" + year + "  " + hour + ":" + minutes;
}

function triggerPopup(index){
    pressed_task=index;
    $("#popupBasic").popup("open");
}

function editMsg(index){
    console.log("editing...");
    let description=$("#"+index + ` .task_description`).val();
    $("#edditingPopup textarea").text(description);
    pressed_task=index;
    $("#edditingPopup button").on("click", finishEditting);
    //$(`#${index} .task_description`).html(`<textarea class='editting_box'>${description}</textarea> <button onclick='finishEditting(${index})'> ✔ </button>`);
    $("#edditingPopup").popup("open");
    //$('.msg_icons').addClass('hidden');
}

function deleteMsg(index){
    console.log("deleting..."+ index);
    delete tasks[index-1];
    localStorage.setItem("tasks",JSON.stringify(tasks));
    $("#"+index).remove();
}

function finishEditting(){
    let editted_task=$(`#edditingPopup textarea`).val();
    $(`#${pressed_task} .task_description`).html(`<b>${editted_task}</b>`);
    tasks[pressed_task-1].description=editted_task;
    localStorage.setItem("tasks",JSON.stringify(tasks));
    pressed_task=-1;
    $("#edditingPopup").popup("close");
    //$('.msg_icons').removeClass('hidden');
}
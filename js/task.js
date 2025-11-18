let tasks = [];
let current = 0;
let handle = "";

const BASE_API = "http://localhost:3000"

function clickAdd() {
    handle = "add";
    renderTasksDom();
}

function clickSave() {
    let name = document.querySelector("#input-task-name").value;
    let num = document.querySelector("#input-task-num").value;
    addTask(name, num);
}

function clickCancel() {
    handle = "";
    renderTasksDom();
}

function clickNum1() {
    let num = parseInt(document.querySelector("#input-task-num").value);
    document.querySelector("#input-task-num").value = num + 1;
}

function clickNum0() {
    let num = parseInt(document.querySelector("#input-task-num").value);
    if (num > 1) {
        document.querySelector("#input-task-num").value = num - 1;
    }
}

function existTask() {
    let exist = false;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].finish < tasks[i].num) {
            exist = true;
            break;
        }
    }
    return exist;
}

function getTasks() {
    fetch(BASE_API + "/getTasks")
        .then(response => response.json())
        .then(res => {
            tasks = res.data;
            handle = "";
            renderTasksDom();
        })
}

function addTask(name, num) {
    fetch(BASE_API + "/addTask?name=" + name + "&num=" + num)
        .then(response => response.json())
        .then(res => {
            tasks = res.data;
            handle = "";
            renderTasksDom();
        })
}

function updateTask() {
    let id = "";
    let finish = "";
    let isDelete = false;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].finish < tasks[i].num) {
            id = tasks[i]._id;
            finish = tasks[i].finish + 1;
            if (finish == tasks[i].num) {
                isDelete = true;
            }
            break;
        }
    }
    if (isDelete) {
        deleteTask(id)
    }
    else {
        fetch(BASE_API + "/updateTask?id=" + id + "&finish=" + finish)
            .then(response => response.json())
            .then(res => {
                tasks = res.data;
                handle = "";
                renderTasksDom();
            })
    }
}

function deleteTask(id) {
    fetch(BASE_API + "/deleteTask?id=" + id)
        .then(response => response.json())
        .then(res => {
            tasks = res.data;
            handle = "";
            renderTasksDom();
        })
}

function renderTasksDom() {
    let outputHtml = "";
    if (handle == "add") {
        outputHtml += `
            <div>
                <div>ADD A NEW TASK!</div>
                <input id="input-task-name" type="text" placeholder="Enter here what you will be working on.">
                <div style="display: flex;">
                    <div>SET PROMOS</div>
                    <input id="input-task-num" value="1" style="border: 1px solid #FFFFFF; background: transparent; color: #FFFFFF;" type="text">
                    <img src="./images/up.png" alt="" onclick="clickNum1()">
                    <img src="./images/down.png" alt="" onclick="clickNum0()">
                </div>
                <div style="display: flex;">
                    <div style="border: 1px solid #FFFFFF;" onclick="clickCancel()">CANCEL</div>
                    <div style="border: 1px solid #FFFFFF;" onclick="clickSave()">SAVE</div>
                </div>
            </div>
        `;
    }
    else {
        if (tasks && tasks.length > 0) {
            for (let i = 0; i < tasks.length; i++) {
                outputHtml += `
                    <div style="width: 100%; display: flex; border: 1px solid #FFFFFF; width: 100%;">
                        <div style="flex-grow: 1; text-align: left;">${tasks[i].name}</div>
                        <div>${tasks[i].finish}/${tasks[i].num}</div>
                        <img src="./images/remove.png" onclick="deleteTask('${tasks[i]._id}')">
                    </div>
                `;
            }
        }
        else {
            outputHtml += `
            <div>
                CLICK <img src="./images/add.png" alt="" onclick="clickAdd()"> to create new tasks!
            </div>
        `;
        }
    }
    document.querySelector("#task-list").innerHTML = outputHtml;
}
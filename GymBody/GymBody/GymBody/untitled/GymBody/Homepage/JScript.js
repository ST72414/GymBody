
function myFunction() {
    var x = document.getElementById("myNavbar");
    if (x.className === "navbar") {
        x.className += " responsive";
    } else {
        x.className = "navbar";
    }
}

let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
}

const inputBox = document.getElementById("input-box")
const listContainer = document.getElementById("list-container")
    function AddTaskBtn(){
        if(inputBox.value === ''){
            alert("Musíte něco napsat!")
        }
        else {
            let li = document.createElement("li")
            li.innerHTML = inputBox.value;
            listContainer.appendChild(li);
            let span = document.createElement("span")
            span.innerHTML = "\u00d7";
            li.appendChild(span);
        }
        inputBox.value = "";
        saveData();
    }
    listContainer.addEventListener("click", function (e){
        if (e.target.tagName === "LI"){
            e.target.classList.toggle("checked");
            saveData();
        }
        else if (e.target.tagName === "SPAN"){
            e.target.parentElement.remove();
            saveData();
        }
    }, false);
    function saveData(){
        localStorage.setItem("data", listContainer.innerHTML);
    }
    function showTask(){
        listContainer.innerHTML = localStorage.getItem("data");
    }
    showTask();










window.onload = function () {
    generateCalendar();
    loadEvents(); // Načtení existujících událostí
};

function loadEvents() {
    fetch('load_events.php')
        .then(response => response.json())
        .then(events => {
            events.forEach(event => {
                const eventDate = new Date(event.event_date);
                const daySquare = document.getElementById(`day-${eventDate.getDate()}`);
                if (daySquare) {
                    const taskElement = document.createElement("div");
                    taskElement.className = "task";
                    taskElement.textContent = event.event_description;

                    taskElement.addEventListener("contextmenu", function(event) {
                        event.preventDefault();
                        deleteTask(taskElement);
                    });

                    taskElement.addEventListener('click', function() {
                        editTask(taskElement);
                    });

                    daySquare.appendChild(taskElement);
                }
            });
        })
        .catch(error => console.error('Chyba při načítání událostí:', error));
}
function generateCalendar() {
    const calendar = document.getElementById('calendar');
    const currentDate = new Date();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const firstDayOfWeek = firstDayOfMonth.getDay();
    const totalDays = lastDayOfMonth.getDate();

    for (let i = 0; i < firstDayOfWeek; i++){
        let blankDay = document.createElement("div");
        calendar.appendChild(blankDay);
    }

    for (let day = 1; day <= totalDays; day++){
        let daySquare= document.createElement("div");
        daySquare.className = "calendar-day";
        daySquare.textContent = day;
        daySquare.id = `day-${day}`;
        calendar .appendChild(daySquare);
    }
}

function showAddTaskModal(){
    document.getElementById('addTaskModal').style.display='block';
}

function closeAddTaskModal(){
    document.getElementById('addTaskModal').style.display='none';
}

function deleteTask(taskElement){
    if (confirm("Opravdu chcete tento záznam smazat?")){
        taskElement.parentNode.removeChild(taskElement);
    }
}

function editTask(taskElement){
    const newTaskDesc = prompt("Upravit:", taskElement.textContent);
    if(newTaskDesc !== null & newTaskDesc.trim() !== ""){
        taskElement.textContent = newTaskDesc;
    }
}

function addTask(){
    const taskDate = new Date(document.getElementById('task-date').value);
    const taskDesc = document.getElementById('task-desc').value.trim();
    if (taskDesc && ! isNaN(taskDate.getDate())){
        fetch('file:///D:/PHP/GymBody/GymBody/homepage/.idea/php.xml', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event_date: taskDate.toISOString().split('T')[0],
                event_desc: taskDesc,
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Úkol úspěšně vložen do databáze
                    console.log(data.message);
                    // Přidání události do kalendáře na frontendu
                    const daySquare = document.getElementById(`day-${taskDate.getDate()}`);
                    if (daySquare) {
                        const taskElement = document.createElement("div");
                        taskElement.className = "task";
                        taskElement.textContent = taskDesc;

                        taskElement.addEventListener("contextmenu", function(event) {
                            event.preventDefault();
                            deleteTask(taskElement);
                        });

                        taskElement.addEventListener('click', function() {
                            editTask(taskElement);
                        });

                        daySquare.appendChild(taskElement);
                    }
                } else {
                    // Chyba při vkládání úkolu
                    console.error('Chyba při vkládání úkolu:', data.message);
                }
            })

        const calendarDays = document.getElementById('calendar').children;
        for (let i = 0; i < calendarDays.length; i++){
            const day = calendarDays[i];
            if (parseInt(day.textContent) === taskDate.getDate()){
                const taskElement = document.createElement("div");
                taskElement.className = "task";
                taskElement.textContent = taskDesc;

                taskElement.addEventListener("contextmenu", function (event){
                    event.preventDefault();
                    deleteTask(taskElement);
                });

                taskElement.addEventListener('click', function (){
                    editTask(taskElement);
                });

                day.appendChild(taskElement);
                break;
            }
        }
        closeAddTaskModal();
    }else{
        alert("Zadejte platné datum a popis úkolu!");
    }

    if (taskDesc && !isNaN(taskDate.getDate())) {
        // Fetch API pro vložení úkolu do databáze
        fetch('insert_event.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event_date: taskDate.toISOString().split('T')[0],
                event_desc: taskDesc,
            }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Úkol úspěšně vložen do databáze', data);
                // Zde můžete aktualizovat kalendář nebo provést další akce
            })
            .catch(error => console.error('Chyba při vkládání úkolu:', error));
    } else {
        alert("Zadejte platné datum a popis úkolu!");
    }
}



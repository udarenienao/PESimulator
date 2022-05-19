let subMaker = document.getElementById("makeSub");
let subjects = [];
for(let i = 1; i < 7; i++){
    let form = document.getElementById("f" + i);
    form.addEventListener("click", function (){
        subMaker.style.visibility = "visible";
        subMaker.addEventListener("submit", function handler(event) {
            event.preventDefault();
            let name = subMaker.querySelector('[name="name"]').value;
            let teacher = subMaker.querySelector('[name="select"] option:checked').textContent;
            let diff = subMaker.querySelector('[name="difficulty"]').value;
            let hours = subMaker.querySelector('[name="hours"]').value;
            subjects[i] = new Subject(name, teacher, diff, hours);
            let newForm = document.getElementById("f" + i + i);
            form.style.visibility = "hidden";
            newForm.style.visibility = "visible";
            newForm.appendChild(document.createTextNode(name))
            subMaker.style.visibility = "hidden";
            subMaker.removeEventListener("submit", handler)
        });
    });
}

class Subject{
    constructor(name, teacher, diff, hours) {
        this.name = name;
        this.teacher = teacher;
        this.diff = diff;
        this.hours = hours;
    }
}
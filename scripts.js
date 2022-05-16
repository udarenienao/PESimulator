let subMaker = document.getElementById("makeSub");
let subjects = [];
for(let i = 1; i < 7; i++){
    let form = document.getElementById("f" + i);
    form.addEventListener("click", function (){
        subMaker.style.visibility = "visible";
        subMaker.addEventListener("submit", function (event) {
            event.preventDefault();
            retrieveFromValue(form, i);
        });
    });
}

function retrieveFromValue(form, from){

    let name = subMaker.querySelector('[name="name"]').value;
    let teacher = subMaker.querySelector('[name="select"] option:checked');
    let diff = subMaker.querySelector('[name="difficulty"]');
    let hours = subMaker.querySelector('[name="hours"]');
    subjects[from] = new Subject(name, teacher, diff, hours);
    let newForm = document.getElementById("f" + from + from);
    form.style.visibility = "hidden";
    newForm.style.visibility = "visible";
    newForm.appendChild(document.createTextNode(name))
    newForm.appendChild(document.createElement("br"));
    newForm.appendChild(document.createTextNode(`Rating: ${subjects[from].rating}`));
    subMaker.style.visibility = "hidden";
}

class Subject{
    constructor(name, teacher, diff, hours) {
        this.name = name;
        this.teacherName = teacher.textContent;
        this.teacherRating = teacher.getAttribute('rating');
        this.diff = diff;
        this.hours = hours;
        this._rating = this.#calculateRating();
    }

    #calculateRating() {
        let worstDiffCond = Math.abs(this.diff.getAttribute('max') * 0.7 - this.diff.getAttribute('min'));
        let worstHoursCond = Math.max(4 - this.hours.getAttribute('min'),
            Math.abs(4 - this.hours.getAttribute('max')));

        let worstCondition = worstHoursCond + worstDiffCond + 5;
        let currDiffCond = Math.abs(this.diff.getAttribute('max') * 0.7 - this.diff.value);
        let currHoursCond = Math.abs(4 - this.hours.value);
        return Math.round(100 - (currDiffCond + currHoursCond + 5 - this.teacherRating) / (worstCondition * 0.01));
    }

    get rating() {
        return this._rating;
    }
}

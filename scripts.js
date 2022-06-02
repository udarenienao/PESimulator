let subMaker = document.getElementById("makeSub");
let subjects = [];
let moneyDisplay = document.getElementById("money");
let buyer = document.getElementById("buySub");

setInterval(function() {
    // console.log(subjects);
    let profit = subjects.map(function(subject){
        return subject.profit;
    }).reduce((partialSum, a) => partialSum + a, 0);

    // console.log(profit);
    // profit = profit.reduce((partialSum, a) => partialSum + a, 0);
    // console.log(profit);

    if (Number(moneyDisplay.innerText) + profit >= 0) {
        moneyDisplay.innerText = `${profit + Number(moneyDisplay.innerText)}`;
    } else {
        moneyDisplay.innerText = `${0}`;
    }
}, 2000);

for(let i = 1; i < 7; i++){
    let form = document.getElementById("f" + i);
    form.addEventListener("click", function (){
        subMaker.style.visibility = "visible";
        subMaker.addEventListener("submit", function handler(event) {
            event.preventDefault();
            let name = subMaker.querySelector('[name="name"]').value;
            let teacher = subMaker.querySelector('[name="select"] option:checked');
            let diff = subMaker.querySelector('[name="difficulty"]');
            let hours = subMaker.querySelector('[name="hours"]');
            subjects[i] = new Subject(name, teacher, diff, hours);
            let newForm = document.getElementById("f" + i + i);
            form.style.visibility = "hidden";
            newForm.style.visibility = "visible";
            newForm.appendChild(document.createTextNode(name))
            newForm.appendChild(document.createElement("br"));
            newForm.appendChild(document.createTextNode(`Rating: ${subjects[i].rating}`));
            subMaker.style.visibility = "hidden";
            subMaker.removeEventListener("submit", handler)
        });
    });

    if (i >= 2) {
        let form = document.getElementById("block" + i);
        form.addEventListener("click", function (){
            let fade = document.getElementById("page-mask");
            fade.style.visibility = "visible";
            buyer.style.visibility = "visible";
            buyer.addEventListener("submit", function handler(event) {
                event.preventDefault();
                if (document.activeElement.value === "Да!") {
                    if (Number(moneyDisplay.innerText) - Number(form.innerText) >= 0) {
                        moneyDisplay.innerText = `${Number(moneyDisplay.innerText) - Number(form.innerText)}`;
                        form.style.visibility = "hidden";
                        buyer.style.visibility = "hidden";
                        fade.style.visibility = "hidden";
                    } else {
                        buyer.style.visibility = "hidden";
                        let message = document.getElementById("sadMessage");
                        message.style.visibility = "visible";
                        message.addEventListener("submit", function handler(event) {
                            event.preventDefault();
                            fade.style.visibility = "hidden";
                            message.style.visibility = "hidden";
                            message.removeEventListener("submit", handler)
                        })
                    }
                } else {
                    buyer.style.visibility = "hidden";
                    fade.style.visibility = "hidden";
                }

                buyer.removeEventListener("submit", handler);
            });
        });
    }
}


class Subject{
    constructor(name, teacher, diff, hours) {
        this.name = name;
        this.teacherName = teacher.textContent;
        this.teacherRating = teacher.getAttribute('rating');
        this.diff = diff;
        this.hours = hours;
        this._rating = this.#calculateRating();
        this._profit = Math.round((this._rating - 50) * 0.1);
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

    get profit() {
        return this._profit;
    }
}

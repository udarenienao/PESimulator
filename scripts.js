let subMaker = document.getElementById("makeSub");
let subUpdater = document.getElementById("updateSub");
let subjects = [];
let moneyDisplay = document.getElementById("money");
let canvas = document.getElementById('c1');
let ctx = canvas.getContext('2d');
let mas = [];
let count = 0;
let timer;
let fieldWidth = 15;
let fieldHeight = 15;
let cellWidth = 450 / fieldWidth; // 450 - размер канваса
let cellHeight = 450 / fieldHeight;
let moneyCount = 5;
let livesCount = 5;
let gameStart = false;

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

function makeNewForm(newForm, i) {
    newForm.style.visibility = "visible";
    newForm.textContent = "";
    newForm.appendChild(document.createTextNode(subjects[i].name));
    newForm.appendChild(document.createElement("br"));
    newForm.appendChild(document.createTextNode(`Rating: ${subjects[i].rating}`));
    newForm.addEventListener("click", function() {
        subUpdater.style.visibility = "visible";
        subUpdater.addEventListener("submit", function handler(event) {
            if (event.submitter.id === "delete") {
                
            }
            event.preventDefault();
            let name = subUpdater.querySelector('[name="name"]').value;
            let teacher = subUpdater.querySelector('[name="select"] option:checked');
            let diff = subUpdater.querySelector('[name="difficulty"]');
            let hours = subUpdater.querySelector('[name="hours"]');
            subjects[i].updateCourse(name, teacher, diff, hours);
            makeNewForm(document.getElementById("f" + i + i), i);
            subUpdater.style.visibility = "hidden";
        })
    })
}

for(let i = 1; i < 7; i++){
    let form = document.getElementById("f" + i);
    form.addEventListener("click", function () {
        subMaker.style.visibility = "visible";
        subMaker.addEventListener("submit", function handler(event) {
            event.preventDefault();
            let name = subMaker.querySelector('[name="name"]').value;
            let teacher = subMaker.querySelector('[name="select"] option:checked');
            let diff = subMaker.querySelector('[name="difficulty"]');
            let hours = subMaker.querySelector('[name="hours"]');
            subjects[i] = new Subject(name, teacher, diff, hours);
            makeNewForm(document.getElementById("f" + i + i), i);
            form.style.visibility = "hidden";
            subMaker.style.visibility = "hidden";
            subMaker.removeEventListener("submit", handler)
        });
    });
}

document.getElementById("earnMoney").addEventListener("click", function (){
    let life = document.getElementById("life");
    life.style.visibility = "visible";
    goLife();
});

canvas.addEventListener("click", function(event){
    if (gameStart && livesCount !== 0) {
        let x = Math.floor(event.offsetY / cellHeight);
        let y = Math.floor(event.offsetX / cellWidth);
        if (mas[x][y] === 0) {
            mas[x][y] = 1;
            livesCount--;
            drawField();
        }
    }
});

document.getElementById('startLife').addEventListener("click", function(evt) {
    evt.preventDefault();
    startLife();

});
document.getElementById('getCoins').addEventListener("click", function(evt) {
    evt.preventDefault();
    gameStart = true;
});

function goLife() {
    for (let i = 0; i < fieldHeight; i++) {
        mas[i] = [];
        for (let j = 0; j < fieldWidth; j++) {
            mas[i][j] = 0;
        }
    }
    for (let i = 0; i < moneyCount; i++) {
        let x = Math.floor(Math.random() * fieldWidth);
        let y = Math.floor(Math.random() * fieldHeight);
        while (mas[x][y] === 2) {
            x = Math.floor(Math.random() * fieldWidth);
            y = Math.floor(Math.random() * fieldHeight);
        }
        mas[x][y] = 2;
    }
    drawField();
}

function drawField(){
    ctx.clearRect(0, 0, cellWidth * fieldWidth, cellHeight * fieldHeight);
    for (let i = 0; i < fieldHeight; i++) {
        for (let j = 0; j < fieldWidth; j++) {
            ctx.fillRect(i, j * cellHeight, cellWidth * fieldWidth, 1);
            ctx.fillRect(i * cellWidth, j, 1, cellHeight * fieldHeight);
        }
    }
    for (let i = 0; i < fieldHeight; i++) {
        for (let j = 0; j < fieldWidth; j++) {
            if (mas[i][j] === 2) {
                ctx.drawImage(document.getElementById('c'), j * cellWidth + 1,
                    i * cellHeight + 1, cellWidth - 1, cellHeight - 1);
            } else if (mas[i][j] === 1) {
                ctx.fillRect(j * cellHeight, i * cellWidth, cellWidth, cellHeight);
            }
        }
    }
}

function startLife(){
    let mas2 = [];
    for (let i = 0; i < fieldHeight; i++){
        mas2[i] = [];
        for (let j = 0; j < fieldWidth; j++){
            console.log(mas);
            let neighbors = mas[fpm(i) - 1][j] % 2 + mas[i][fpp(j) + 1] % 2 + mas[fpp(i) + 1][j] % 2 +
                mas[i][fpm(j) - 1] % 2 + mas[fpm(i) - 1][fpp(j) + 1] % 2 + mas[fpp(i) + 1][fpp(j) + 1] % 2 +
                mas[fpp(i) + 1][fpm(j) - 1] % 2 + mas[fpm(i) - 1][fpm(j) - 1] % 2;
            if (mas[i][j] === 1) {
                mas2[i][j] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
            } else {
                mas2[i][j] = neighbors === 3 ? 1 : 0;
                if (mas2[i][j] === 1) {
                    if (mas[i][j] === 2) {
                        //тут должно быть прибавление монетки в игре
                    }
                } else if (mas[i][j] === 2) {
                    mas2[i][j] = 2;
                }
            }
        }
    }
    mas = mas2;
    drawField();
    count++;
    document.getElementById('count').textContent = count;
    timer = setTimeout(startLife, 300);
}

function fpm(i){
    if (i === 0)
        return fieldHeight;
    return i;
}
function fpp(i){
    if (i === fieldHeight - 1)
        return -1;
    return i;
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

    updateCourse(name, teacher, diff, hours) {
        this.name = name;
        this.teacherName = teacher.textContent;
        this.teacherRating = teacher.getAttribute('rating');
        this.diff = diff;
        this.hours = hours;
        this._rating = this.#calculateRating();
        this._profit = Math.round((this._rating - 50) * 0.1);
    }

    get rating() {
        return this._rating;
    }

    get profit() {
        return this._profit;
    }
}

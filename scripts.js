let subMaker = document.getElementById("makeSub");
let subUpdater = document.getElementById("updateSub");
let subChoose = document.getElementById("chooseSub");
let subjects = [];
let moneyDisplay = document.getElementById("money");
let canvas = document.getElementById('c1');
let coin = new Image();
coin.src = 'pictures/coin_picture.png';
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
let endGame = false;
let lifeStart = false;
let pushButtonLife = false;
let buyer = document.getElementById("buySub");
let teachers = {"soft": {"Алексей Кулаков": 2, "Евгения Панасова": 3, "Константин Гейн": 5},
    "math": {"Дмитрий Хлопин": 3, "Александр Гейн": 5, "Семён Трифочкин": 1},
    "prog": {"Андрей Гейн": 5, "Семён Трифочкин": 1, "Семён Стихин": 5, "Вячеслав Копейцев": 1}};


setInterval(function() {
    // console.log(subjects);
    if (pushButtonLife) {
        return;
    }
    for (let i = 0; i < subjects.length; i++) {
        if (Math.random() < 0.33) {
            subjects[i].updateRating(-1);
            updateForm(i);
        }
    }
    let profit = subjects.map(function(subject) {
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

    if (Subject.amount >= 6){
        setTimeout(function() {
            if (Math.round(Subject.average/6) >=75){
                window.location.href='Final.html';
            }else{
                window.location.href='BadFinal.html';
            }
        }, 2000);
    }
}, 500);

function updateCurseRating(subjectNumber, money, plusRating, handler) {
    if (Number(moneyDisplay.innerText) - money >= 0) {
        moneyDisplay.innerText = `${Number(moneyDisplay.innerText) - money}`;
        subjects[subjectNumber].updateRating(plusRating);

    } else {
        let message = document.getElementById("sadMessage");
        message.style.visibility = "visible";
        message.addEventListener("submit", function handler2(event) {
            event.preventDefault();
            message.style.visibility = "hidden";
            message.removeEventListener("submit", handler2);
            handler();
        });
    }
}


function updateForm(i) {
    let form = document.getElementById("f" + i + i);
    form.textContent = "";
    form.appendChild(document.createTextNode(subjects[i].name));
    form.appendChild(document.createElement("br"));
    form.appendChild(document.createTextNode(`Rating: ${subjects[i].rating}`));
}

function makeNewForm(newForm, i) {
    newForm.style.visibility = "visible";
    updateForm(i);
    newForm.addEventListener("click", function handler(event) {
        event.preventDefault();
        subUpdater.style.visibility = "visible";
        subUpdater.addEventListener("submit", function handler1(event) {
            if (event.submitter.id === "delete") {
                //idk
            } else if (event.submitter.id === "update1") {
                updateCurseRating(i, 50, 10, handler);
            } else if (event.submitter.id === "update2") {
                updateCurseRating(i, 100, 25, handler);
            } else if (event.submitter.id === "update3") {
                updateCurseRating(i, 150, 40, handler);
            } else if (event.submitter.id === "no") {

            }
            event.preventDefault();

            makeNewForm(document.getElementById("f" + i + i), i);
            subUpdater.style.visibility = "hidden";
            subUpdater.removeEventListener("submit", handler1);
        });
        newForm.removeEventListener("click", handler);
    })
}


function makeNewSubject(subjectNumber) {
    let form = document.getElementById("f" + subjectNumber);
    form.addEventListener("click", function () {
        subChoose.style.visibility = "visible";
        subChoose.addEventListener("submit", function handler(event) {
            event.preventDefault();
            subChoose.removeEventListener("submit", handler);
            subChoose.style.visibility = "hidden";
            subMaker.style.visibility = "visible";
            let child = document.createElement("select");
            let subTeachers = teachers[event.submitter.id];
            Object.keys(subTeachers).forEach(function(element) {
                let childChild = document.createElement("option");
                childChild.textContent = element;
                child.appendChild(childChild);
            });
            subMaker.getElementsByClassName("teach")[0].appendChild(child);
            subMaker.addEventListener("submit", function handler1(event1) {
                event1.preventDefault();
                let name = subMaker.querySelector('[name="name"]').value;
                let teacherName = subMaker.querySelector('[class="teach"] option:checked').value;
                let teacherRating = subTeachers[teacherName];
                let diff = subMaker.querySelector('[name="difficulty"]');
                let hours = subMaker.querySelector('[name="hours"]');
                subjects[subjectNumber] = new Subject(name, teacherName, teacherRating, diff, hours);
                makeNewForm(document.getElementById("f" + subjectNumber + subjectNumber), subjectNumber);
                form.style.visibility = "hidden";
                subMaker.style.visibility = "hidden";
                subMaker.getElementsByClassName("teach")[0].removeChild(child);
                subMaker.removeEventListener("submit", handler1);
            });
        });
    });
}

for(let i = 1; i < 7; i++){
    makeNewSubject(i);
    if (i >= 2) {
        let form = document.getElementById("block" + i);
        form.addEventListener("click", function () {
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
                        });
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
let life = document.getElementById("life");

document.getElementById("earnMoney").addEventListener("click", function (){
    life.style.visibility = "visible";
    pushButtonLife = true;
    goLife();
});

canvas.addEventListener("click", function(event){
    if (gameStart && livesCount !== 0 && !lifeStart) {
        let x = Math.floor(event.offsetY / cellHeight);
        let y = Math.floor(event.offsetX / cellWidth);
        if (mas[x][y] === 0) {
            mas[x][y] = 1;
            livesCount--;
            document.getElementById("livesCount").textContent = livesCount;
            drawField();
        }
    }
});

document.getElementById('close').addEventListener("click", function (evt) {
    evt.preventDefault();
    life.style.visibility = "hidden";
    pushButtonLife = false;
    endLife();
});
let startLifeButton = document.getElementById('startLife');
let endGameButton = document.getElementById("end");
let getCoinsButton = document.getElementById('getCoins');
startLifeButton.addEventListener("click", function(evt) {
    evt.preventDefault();
    endGameButton.style.display = "inline";
    startLifeButton.style.display = "none";
    lifeStart = true;
    startLife();
});
getCoinsButton.addEventListener("click", function(evt) {
    evt.preventDefault();
    startLifeButton.style.display = "inline";
    getCoinsButton.style.display = "none";
    drawField();
    document.getElementById("livesCount").textContent = livesCount;
    gameStart = true;
});
endGameButton.addEventListener("click", function (evt) {
    evt.preventDefault();
    endLife();
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
    drawGrid();
}

function drawGrid() {
    ctx.fillRect(1, 1, cellWidth * fieldWidth, 1);
    ctx.fillRect(1, 1, 1, cellHeight * fieldHeight);
    for (let i = 1; i <= fieldHeight; i++) {
        for (let j = 1; j <= fieldWidth; j++) {
            ctx.fillRect(i, j * cellHeight, cellWidth * fieldWidth, 1);
            ctx.fillRect(i * cellWidth, j, 1, cellHeight * fieldHeight);
        }
    }
    ctx.fillRect(1, fieldWidth * cellWidth - 1, cellWidth * fieldWidth, 1);
    ctx.fillRect(fieldHeight * cellHeight - 1, 1, 1, cellHeight * fieldHeight);
}

function drawField(){
    ctx.clearRect(0, 0, cellWidth * fieldWidth, cellHeight * fieldHeight);
    drawGrid();
    for (let i = 0; i < fieldHeight; i++) {
        for (let j = 0; j < fieldWidth; j++) {
            if (mas[i][j] === 2) {
                ctx.drawImage(coin, j * cellWidth + 1,
                    i * cellHeight + 1, cellWidth - 1, cellHeight - 1);
            } else if (mas[i][j] === 1) {
                ctx.fillRect(j * cellHeight, i * cellWidth, cellWidth, cellHeight);
            }
        }
    }
}

function endLife() {
    getCoinsButton.style.display = "inline";
    endGameButton.style.display = "none";
    startLifeButton.style.display = "none";
    ctx.clearRect(0, 0, cellWidth * fieldWidth, cellHeight * fieldHeight);
    drawGrid();
    document.getElementById('cyclesCount').textContent = count = 0;
    gameStart = false;
    lifeStart = false;
    endGame = false;
    mas = [];
    moneyCount = 5;
    livesCount = 5;
    goLife();
}

function startLife(){
    let mas2 = [];
    for (let i = 0; i < fieldHeight; i++){
        mas2[i] = [];
        for (let j = 0; j < fieldWidth; j++){
            let neighbors = mas[fpm(i) - 1][j] % 2 + mas[i][fpp(j) + 1] % 2 + mas[fpp(i) + 1][j] % 2 +
                mas[i][fpm(j) - 1] % 2 + mas[fpm(i) - 1][fpp(j) + 1] % 2 + mas[fpp(i) + 1][fpp(j) + 1] % 2 +
                mas[fpp(i) + 1][fpm(j) - 1] % 2 + mas[fpm(i) - 1][fpm(j) - 1] % 2;
            if (mas[i][j] === 1) {
                mas2[i][j] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
            } else {
                mas2[i][j] = neighbors === 3 ? 1 : 0;
                if (mas2[i][j] === 1) {
                    if (mas[i][j] === 2) {
                        moneyCount--;
                        moneyDisplay.innerText = `${1 + Number(moneyDisplay.innerText)}`;
                    }
                } else if (mas[i][j] === 2) {
                    mas2[i][j] = 2;
                }
            }
        }
    }
    if (JSON.stringify(mas) === JSON.stringify(mas2) || endGame || moneyCount === 0) {
        return;
    }
    mas = mas2;
    drawField();
    count++;
    document.getElementById('cyclesCount').textContent = count;
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
    static amount = 0;
    static average = 0;
    constructor(name, teacherName, teacherRating, diff, hours) {
        this.name = name;
        this.teacherName = teacherName;
        this.teacherRating = teacherRating;
        this.diff = diff;
        this.hours = hours;
        this._rating = this.#calculateRating.bind(this)();
        this._profit = Math.round((this._rating - 50) * 0.1);
        Subject.amount += 1;
        Subject.average += this._rating;
    }

    #calculateRating() {
        let worstDiffCond = Math.abs(this.diff.getAttribute('max') * 0.7 -
            this.diff.getAttribute('min'));
        let worstHoursCond = Math.max(4 - this.hours.getAttribute('min'),
            Math.abs(4 - this.hours.getAttribute('max')));
        let worstCondition = worstHoursCond + worstDiffCond + 5;
        let currDiffCond = Math.abs(this.diff.getAttribute('max') * 0.7 - this.diff.value);
        let currHoursCond = Math.abs(4 - this.hours.value);
        return Math.round(100 - (currDiffCond + currHoursCond + 5 - this.teacherRating) / (worstCondition * 0.01));
    }

    updateRating(plusRating) {
        Subject.average -= this._rating;
        this._rating = Math.max(Math.min(this._rating + plusRating, 100), 0);
        Subject.average += this._rating;
        this._profit = Math.round((this._rating - 50) * 0.1);
    }

    get rating() {
        return this._rating;
    }

    get profit() {
        return this._profit;
    }
}


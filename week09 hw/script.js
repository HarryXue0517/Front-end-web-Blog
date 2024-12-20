const assets = ['snorlax.png', 'electrabuzz.png', 'chansey.png', 'oddish.png',
    'pikachu.png', 'paras.png', 'arcanine.png', 'ponita.png',
    'venonat.png', 'eggsecute.png', 'machop.png', 'pidgey.png',
    'psyduck.png', 'tauros.png', 'vulpix.png', 'gloom.png',
    'krabby.png', 'butterfree.png', 'bulbasaur.png', 'clefairy.png',
    'koffing.png', 'goldeen.png', 'magikarp.png', 'beedrill.png',
    'lapras.png', 'meowth.png', 'ekans.png', 'jigglypuff.png',
    'horsea.png', 'polywog.png', 'sandshrew.png', 'rattata.png',
    'gengar.png', 'eevee.png', 'bellsprout.png', 'squirtle.png',
    'seel.png', 'caterpie.png'];

let selectedImages = [];
let imagePool = [];
let firstCard = null;
let secondCard = null;
let isChecking = false;
let incorrectCards = [];
let timerInterval;
let timer = 0;
const correctAudio = new Audio('correct.wav');
const incorrectAudio = new Audio('wrong.wav');

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start_button');
    const startScreen = document.getElementById('start_screen');
    const playArea = document.getElementById('play_area');
    const timerDisplay = document.getElementById('timer');

    startButton.addEventListener('click', () => {
        startScreen.style.display = 'none';
        playArea.style.display = 'flex';

        // 初始化并开始计时器
        timer = 0;
        timerDisplay.textContent = `Time: ${timer}`;
        timerInterval = setInterval(() => {
            timer++;
            timerDisplay.textContent = `Time: ${timer}`;
        }, 1000);

        // 开始游戏
        randomImage();
    });
});


// 初始化随机图片并分配给格子
function randomImage() {
    selectedImages = [];
    while (selectedImages.length < 6) {
        let randomIndex = Math.floor(Math.random() * assets.length);
        let selectedImage = assets[randomIndex];
        if (!selectedImages.includes(selectedImage)) {
            selectedImages.push(selectedImage);
        }
    }

    imagePool = [...selectedImages, ...selectedImages];

    // 洗牌算法打乱数组
    for (let i = imagePool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [imagePool[i], imagePool[j]] = [imagePool[j], imagePool[i]];
    }

    // 初始化为pokeball的图片
    pokeBall();
}

// 显示pokeball图案
function pokeBall() {
    for (let i = 0; i < 12; i++) {
        const div = document.getElementById(`game`).children[i];
        div.style.backgroundImage = `url('pokeball.png')`;
        div.style.backgroundSize = 'cover';
        div.onclick = () => handleCardClick(div, i);
    }
}

function handleCardClick(div, index) {
    if (isChecking || div === firstCard || div.style.backgroundImage.includes(imagePool[index])) {
        return;
    }

    div.style.backgroundImage = `url('${imagePool[index]}')`;
    div.style.backgroundSize = 'cover';

    if (!firstCard) {
        firstCard = div;
    } else {
        secondCard = div;
        isChecking = true;

        if (firstCard.style.backgroundImage === secondCard.style.backgroundImage) {
            correctAudio.play();
            firstCard = null;
            secondCard = null;
            isChecking = false;

            // 检查是否所有卡片都已匹配
            if (Array.from(document.querySelectorAll('#game div'))
                .every(div => !div.style.backgroundImage.includes('pokeball.png'))) {
                clearInterval(timerInterval); // 停止计时器
                showGameOverScreen(); // 显示游戏结束页面
            }
        } else {
            incorrectAudio.play();
            incorrectCards = [firstCard, secondCard];
            document.getElementById('game').addEventListener('click', gameClickHandler);
        }
    }
}

function gameClickHandler(event) {
    if (!incorrectCards.includes(event.target)) {
        resetIncorrectCards();
        document.getElementById('game').removeEventListener('click', gameClickHandler); // 移除监听器
    }
}


function resetIncorrectCards() {
    if (incorrectCards.length > 0) {
        incorrectCards.forEach(card => {
            card.style.backgroundImage = `url('pokeball.png')`;
        });
        incorrectCards = [];
        firstCard = null;
        secondCard = null;
        isChecking = false;
    }
}

function showGameOverScreen() {
    const playArea = document.getElementById('play_area');
    playArea.innerHTML = `<h2>Game over！</h2><p> Your time：${timer}</p>`;

    // Check and update the best time in local storage
    let bestTime = localStorage.getItem('bestTime');
    let isNewBest = false;

    if (!bestTime || timer < bestTime) {
        bestTime = timer;
        localStorage.setItem('bestTime', bestTime);
        isNewBest = true;
    }

    // Display the best time with a special message if it's a new best
    if (isNewBest) {
        playArea.innerHTML += `<p>Best score:  ${bestTime}  -  New High Score!</p>`;
    } else {
        playArea.innerHTML += `<p>Best score：${bestTime}</p>`;
    }

    // Create a restart button
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Play Again';
    restartButton.style.padding = '10px 20px';
    restartButton.style.fontSize = '18px';
    restartButton.style.marginTop = '20px';
    restartButton.style.cursor = 'pointer';
    restartButton.onclick = restartGame;

    playArea.appendChild(restartButton);
}

function restartGame() {
    // 清空游戏区内容
    const playArea = document.getElementById('play_area');
    playArea.innerHTML = `
        <div id="title"><p>Ready, Set, Match!</p></div>
        <div id="timer_score"><p id="timer">Time: 0</p></div>
        <div id="game">
            <div id="one"></div>
            <div id="two"></div>
            <div id="three"></div>
            <div id="four"></div>
            <div id="five"></div>
            <div id="six"></div>
            <div id="seven"></div>
            <div id="eight"></div>
            <div id="nine"></div>
            <div id="ten"></div>
            <div id="eleven"></div>
            <div id="twelve"></div>
        </div>
    `;

    // 重置计时器和相关变量
    timer = 0;
    document.getElementById('timer').textContent = `Time: ${timer}`;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timer++;
        document.getElementById('timer').textContent = `Time: ${timer}`;
    }, 1000);

    // 重新初始化游戏
    firstCard = null;
    secondCard = null;
    isChecking = false;
    incorrectCards = [];
    randomImage();
}

function clearBestTime() {
    localStorage.removeItem('bestTime');
    alert('Best time record has been cleared!');
}

const clearButton = document.createElement('button');
clearButton.textContent = 'Clear Best Time';
clearButton.style.padding = '10px 20px';
clearButton.style.fontSize = '18px';
clearButton.style.marginTop = '20px';
clearButton.style.cursor = 'pointer';
clearButton.onclick = clearBestTime;

// 将按钮添加到游戏区域或页面中合适的位置
document.getElementById('play_area').appendChild(clearButton);

// 初始化游戏
randomImage();
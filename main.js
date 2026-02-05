let timerElement = document.querySelector(".info-container .timer");
let triesElement = document.querySelector(".tries span");
let gameTime = localStorage.getItem("game-time");
let currentTime = gameTime;
let timerIntervalId = null;

let competitor = {
  name: '',
  finishedAt: '',
  triesCount: 0,
};
let competitors = JSON.parse(localStorage.getItem('competitors')) || [];
showCompetitors();

if (!gameTime) {
  gameTime = "02:00";
  localStorage.setItem("game-time", gameTime);
}
timerElement.innerHTML = gameTime;

function playTimer() {
  currentTime = "00:00";
  timerElement.innerHTML = currentTime;

  let [minute, second] = gameTime.split(':').map(Number);

  if (isNaN(minute) || isNaN(second) || minute < 0 || second < 0 || second > 59) {
    alert("Invalid time format. Use MM:SS (e.g. '05:30')");
    return;
  }

  if (timerIntervalId) {
    clearInterval(timerIntervalId);
  }

  timerIntervalId = setInterval(() => {
    let displayMin = String(minute).padStart(2, '0');
    let displaySec = String(second).padStart(2, '0');

    currentTime = `${displayMin}:${displaySec}`;
    timerElement.innerHTML = currentTime;

    // Decrease time
    if (second === 0) {
      if (minute === 0) {
        document.getElementById("time-out").play();
        document.querySelector(".game-end").classList.add('show');
        resetTimer();
        resetGame();
        return;
      }
      minute--;
      second = 59;
    } else {
      second--;
    }
  }, 1000);
}

document.querySelector(".control-buttons span").onclick = function () {
  competitor.name = prompt("What's your name?");

  if (competitor.name) {
    document.querySelector(".name span").innerHTML = competitor.name;
    document.querySelector(".control-buttons").remove();
    document.getElementById("start").play();
    playTimer();
  } else {
    alert("Please, enter your name");
  }
};

document.querySelector(".game-end .try").onclick = function () {
  setVariablesToDefault();
  document.querySelector(".game-end").classList.remove('show');
  document.getElementById("start").play();
  playTimer();
};

document.querySelector(".game-win .play-again").onclick = function () {
  setVariablesToDefault();
  document.querySelector(".game-win").classList.remove('show');
  document.getElementById("start").play();
  playTimer();
};

// ========================================================

let duration = 1000;

let blocksContainer = document.querySelector(".memory-game-blocks");

let blocks = Array.from(blocksContainer.children);

let orderRange = [...Array(blocks.length).keys()];

shuffle(orderRange);

// Add order css property to blocks
blocks.forEach((block, index) => {
  block.style.order = orderRange[index];

  // Add click event
  block.addEventListener("click", function () {
    // Trigger The Flip Block Function
    flipBlock(block);
  });
});

// Flip Block Function
function flipBlock(selectedBlock) {
  // Add class is-flipped
  selectedBlock.classList.add("is-flipped");

  // Collect all flipped cards
  let allFlippedBlocks = blocks.filter((flippedBlock) =>
    flippedBlock.classList.contains("is-flipped")
  );

  // If there are 2 selected blocks
  if (allFlippedBlocks.length === 2) {
    // Stop clicking function
    stopClicking();

    // Check If The Two Cards Are The Same
    checkMatchedBlocks(allFlippedBlocks[0], allFlippedBlocks[1]);
  }
}

// Stop Clicking Function
function stopClicking() {
  // Add class no-clicking on main container
  blocksContainer.classList.add("no-clicking");

  setTimeout(() => {
    blocksContainer.classList.remove("no-clicking");
  }, duration);
}

// Check Matched Blocks
function checkMatchedBlocks(firstBlock, secondBlock) {
  if (firstBlock.dataset.technology === secondBlock.dataset.technology) {
    firstBlock.classList.remove("is-flipped");
    secondBlock.classList.remove("is-flipped");

    firstBlock.classList.add("has-match");
    secondBlock.classList.add("has-match");

    if (blocks.every(block => block.classList.contains("has-match"))) {
      resetTimer();
      updateCompetitors();
      setTimeout(() => {
        resetGame();
        document.getElementById("win-game").play();
        document.querySelector(".game-win").classList.add('show');
      }, duration);
    } else {
      document.getElementById("success").play();
    }
  } else {
    competitor.triesCount++;
    triesElement.innerHTML = competitor.triesCount;

    setTimeout(() => {
      firstBlock.classList.remove("is-flipped");
      secondBlock.classList.remove("is-flipped");
    }, duration);
    document.getElementById("fail").play();
  }
}

// Shuffle function
function shuffle(array) {
  // Setting vars
  let current = array.length,
    temp,
    random;

  while (current > 0) {
    // Get Random Number
    random = Math.floor(Math.random() * current);

    // Decrease Length By One
    current--;

    // [1] Save Current Element In Stash
    temp = array[current];

    // [1] Current Element = Random Element
    array[current] = array[random];

    // [1] Random Element = Get Current Element From Stash
    array[random] = temp;
  }
  return array;
}

// Reset game
function resetGame() {
  blocks = Array.from(blocksContainer.children);
  shuffle(orderRange);

  blocks.forEach((block, index) => {
    block.classList.remove('has-match', 'is-flipped');
    block.style.order = orderRange[index];
  });
  orderRange = [...Array(blocks.length).keys()];
  shuffle(orderRange);
}

// Reset timer
function resetTimer() {
  clearInterval(timerIntervalId);
  timerIntervalId = null;
}

function setVariablesToDefault() {
  currentTime = gameTime;
  competitor = {
    ...competitor,
    finishedAt: '',
    triesCount: 0,
  }
  triesElement.innerHTML = competitor.triesCount;
}

// Add or update existing competitors
function updateCompetitors() {
  competitor.finishedAt = currentTime;
  let oldCompetitor = competitors.find(c => c.name === competitor.name);
  if (oldCompetitor) {
    competitors.splice(competitors.indexOf(oldCompetitor), 1, competitor);
  } else {
    competitors.push(competitor);
  }
  localStorage.setItem('competitors', JSON.stringify(competitors));
  showCompetitors();
}

// Fill competitors part if exist
function showCompetitors() {
  if (competitors.length) {
    document.querySelectorAll(".competitors-board .competitor").forEach((ele) => {
      ele.remove();
    });
    document.querySelectorAll(".competitors-board").forEach(ele => {
      ele.classList.add('show');
    });

    competitors.forEach(c => {
      document.querySelectorAll(".competitors-board").forEach(ele => {
        ele.innerHTML += `
          <div class="competitor ${c.name === competitor.name ? 'active' : ''}">
            <span class="name">${c.name}</span>
            <div> In <span class="time">${c.finishedAt}</span></div>
            <div> With <span class="tries">${c.triesCount}</span> tries</div>
          </div>
        `
      });
    })
  }
}

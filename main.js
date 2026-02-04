document.querySelector(".control-buttons span").onclick = function () {
  let yourName = prompt("What's your name?") || "Unknown";

  document.querySelector(".name span").innerHTML = yourName;
  document.querySelector(".control-buttons").remove();
};

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
    console.log("2 Flipped Blocks Selected");

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
  let triesElement = document.querySelector(".tries span");

  if (firstBlock.dataset.technology === secondBlock.dataset.technology) {
    firstBlock.classList.remove("is-flipped");
    secondBlock.classList.remove("is-flipped");

    firstBlock.classList.add("has-match");
    secondBlock.classList.add("has-match");

    document.getElementById("success").play();
  } else {
    triesElement.innerHTML = parseInt(triesElement.innerHTML) + 1;

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

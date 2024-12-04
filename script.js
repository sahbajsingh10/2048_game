document.addEventListener("DOMContentLoaded", () => {
  const tiles = document.querySelectorAll(".tile");
  const scoreElement = document.getElementById("score");
  const bestElement = document.getElementById("best");
  const newGameButton = document.getElementById("new-game");

  let score = 0;

  function startGame() {
    score = 0;
    scoreElement.textContent = score;
    tiles.forEach(tile => (tile.textContent = ""));
    addTile();
    addTile();
  }

  function addTile() {
    const emptyTiles = Array.from(tiles).filter(tile => tile.textContent === "");
    if (emptyTiles.length === 0) return;
    const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    randomTile.textContent = Math.random() > 0.5 ? "2" : "4";
  }

  newGameButton.addEventListener("click", startGame);

  startGame();
});

document.addEventListener("keydown", handleKeyPress);

function handleKeyPress(event) {
  switch (event.key) {
    case "ArrowUp":
      moveUp();
      break;
    case "ArrowDown":
      moveDown();
      break;
    case "ArrowLeft":
      moveLeft();
      break;
    case "ArrowRight":
      moveRight();
      break;
    default:
      return;
  }
  addTile(); // Add a new tile after each move
  updateScore();
  checkGameOver();
}

function moveLeft() {
  for (let i = 0; i < 4; i++) {
    const row = [
      tiles[i * 4].textContent,
      tiles[i * 4 + 1].textContent,
      tiles[i * 4 + 2].textContent,
      tiles[i * 4 + 3].textContent,
    ];

    const filteredRow = row.filter(num => num !== ""); // Remove empty tiles
    const mergedRow = mergeTiles(filteredRow); // Merge the tiles
    while (mergedRow.length < 4) mergedRow.push(""); // Add empty tiles back

    // Update the DOM
    tiles[i * 4].textContent = mergedRow[0];
    tiles[i * 4 + 1].textContent = mergedRow[1];
    tiles[i * 4 + 2].textContent = mergedRow[2];
    tiles[i * 4 + 3].textContent = mergedRow[3];
  }
}

function mergeTiles(row) {
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1] && row[i] !== "") {
      row[i] = (parseInt(row[i]) * 2).toString();
      row[i + 1] = "";
      score += parseInt(row[i]); // Update score
    }
  }
  return row.filter(num => num !== ""); // Remove empty spaces after merging
}

function moveDown() {
  for (let i = 0; i < 4; i++) {
    const column = [
      tiles[i].textContent,
      tiles[i + 4].textContent,
      tiles[i + 8].textContent,
      tiles[i + 12].textContent,
    ];

    const filteredColumn = column.filter(num => num !== ""); // Remove empty tiles
    const mergedColumn = mergeTiles(filteredColumn); // Merge tiles
    while (mergedColumn.length < 4) mergedColumn.unshift(""); // Add empty tiles back

    // Update the DOM
    tiles[i].textContent = mergedColumn[0];
    tiles[i + 4].textContent = mergedColumn[1];
    tiles[i + 8].textContent = mergedColumn[2];
    tiles[i + 12].textContent = mergedColumn[3];
  }
}

function updateScore() {
  scoreElement.textContent = score;

  // Update the best score
  const best = parseInt(localStorage.getItem("best")) || 0;
  if (score > best) {
    localStorage.setItem("best", score);
    bestElement.textContent = score;
  } else {
    bestElement.textContent = best;
  }
}

function checkGameOver() {
  const hasEmptyTiles = Array.from(tiles).some(tile => tile.textContent === "");
  if (hasEmptyTiles) return;

  for (let i = 0; i < tiles.length; i++) {
    const current = tiles[i].textContent;
    const right = tiles[i + 1]?.textContent || null;
    const below = tiles[i + 4]?.textContent || null;

    if (current === right || current === below) {
      return; // Valid move still possible
    }
  }

  alert("Game Over!");
}

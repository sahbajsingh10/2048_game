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

  function handleKeyPress(event) {
    console.log("Key pressed:", event.key); // Debug
    let moved = false;
    switch (event.key) {
      case "ArrowUp":
        moved = moveUp();
        break;
      case "ArrowDown":
        moved = moveDown();
        break;
      case "ArrowLeft":
        moved = moveLeft();
        break;
      case "ArrowRight":
        moved = moveRight();
        break;
      default:
        return;
    }

    if (moved) {
      addTile(); // Add a new tile only if movement happened
      updateScore();
      checkGameOver();
    }
  }

  function moveLeft() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
      const row = [
        tiles[i * 4].textContent,
        tiles[i * 4 + 1].textContent,
        tiles[i * 4 + 2].textContent,
        tiles[i * 4 + 3].textContent,
      ];
      console.log("Original row:", row);

      const filteredRow = row.filter(num => num !== ""); // Remove empty tiles
      console.log("Filtered row:", filteredRow);

      const mergedRow = mergeTiles(filteredRow); // Merge the tiles
      console.log("Merged row:", mergedRow);

      while (mergedRow.length < 4) mergedRow.push(""); // Add empty tiles back
      console.log("Final row:", mergedRow);

      // Check if movement happened
      if (row.join("") !== mergedRow.join("")) moved = true;

      // Update the DOM
      tiles[i * 4].textContent = mergedRow[0] || "";
      tiles[i * 4 + 1].textContent = mergedRow[1] || "";
      tiles[i * 4 + 2].textContent = mergedRow[2] || "";
      tiles[i * 4 + 3].textContent = mergedRow[3] || "";
    }
    return moved;
  }

  function moveRight() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
      const row = [
        tiles[i * 4].textContent,
        tiles[i * 4 + 1].textContent,
        tiles[i * 4 + 2].textContent,
        tiles[i * 4 + 3].textContent,
      ];
      console.log("Original row:", row);

      const filteredRow = row.filter(num => num !== ""); // Remove empty tiles
      const mergedRow = mergeTiles(filteredRow.reverse()).reverse(); // Merge tiles and reverse back
      while (mergedRow.length < 4) mergedRow.unshift(""); // Add empty tiles at the beginning

      // Check if movement happened
      if (row.join("") !== mergedRow.join("")) moved = true;

      // Update the DOM
      tiles[i * 4].textContent = mergedRow[0] || "";
      tiles[i * 4 + 1].textContent = mergedRow[1] || "";
      tiles[i * 4 + 2].textContent = mergedRow[2] || "";
      tiles[i * 4 + 3].textContent = mergedRow[3] || "";
    }
    return moved;
  }

  function moveUp() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
      const column = [
        tiles[i].textContent,
        tiles[i + 4].textContent,
        tiles[i + 8].textContent,
        tiles[i + 12].textContent,
      ];
      console.log("Original column:", column);

      const filteredColumn = column.filter(num => num !== ""); // Remove empty tiles
      const mergedColumn = mergeTiles(filteredColumn); // Merge the tiles
      while (mergedColumn.length < 4) mergedColumn.push(""); // Add empty tiles back

      // Check if movement happened
      if (column.join("") !== mergedColumn.join("")) moved = true;

      // Update the DOM
      tiles[i].textContent = mergedColumn[0] || "";
      tiles[i + 4].textContent = mergedColumn[1] || "";
      tiles[i + 8].textContent = mergedColumn[2] || "";
      tiles[i + 12].textContent = mergedColumn[3] || "";
    }
    return moved;
  }

  function moveDown() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
      const column = [
        tiles[i].textContent,
        tiles[i + 4].textContent,
        tiles[i + 8].textContent,
        tiles[i + 12].textContent,
      ];
      console.log("Original column:", column);

      const filteredColumn = column.filter(num => num !== ""); // Remove empty tiles
      const mergedColumn = mergeTiles(filteredColumn.reverse()).reverse(); // Merge tiles and reverse back
      while (mergedColumn.length < 4) mergedColumn.unshift(""); // Add empty tiles at the beginning

      // Check if movement happened
      if (column.join("") !== mergedColumn.join("")) moved = true;

      // Update the DOM
      tiles[i].textContent = mergedColumn[0] || "";
      tiles[i + 4].textContent = mergedColumn[1] || "";
      tiles[i + 8].textContent = mergedColumn[2] || "";
      tiles[i + 12].textContent = mergedColumn[3] || "";
    }
    return moved;
  }

  function mergeTiles(row) {
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1] && row[i] !== "") {
        console.log(`Merging tiles: ${row[i]} + ${row[i + 1]}`);
        row[i] = (parseInt(row[i]) * 2).toString();
        row[i + 1] = "";
        score += parseInt(row[i]); // Update score
      }
    }
    return row.filter(num => num !== ""); // Remove empty spaces after merging
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

  newGameButton.addEventListener("click", startGame);
  document.addEventListener("keydown", handleKeyPress);

  startGame();
});

const boardEl = document.getElementById("board");
    const statusText = document.getElementById("status");
    const scoreboard = document.getElementById("scoreboard");
    const menu = document.getElementById("menu");
    const options = document.getElementById("options");
    const game = document.getElementById("game");
    const difficultySelect = document.getElementById("difficulty");
    const roundsSelect = document.getElementById("rounds");

    let mode = "multi";
    let difficulty = "easy";
    let totalRounds = 1;
    let currentRound = 1;
    let playerXScore = 0;
    let playerOScore = 0;
    let currentPlayer = "X";
    let gameActive = true;
    let cells = [];

    const winningConditions = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];

    function startGame(selectedMode) {
      mode = selectedMode;
      options.classList.remove("hidden");
    }

    function initGame() {
      difficulty = difficultySelect.value;
      totalRounds = parseInt(roundsSelect.value);
      currentRound = 1;
      playerXScore = 0;
      playerOScore = 0;
      currentPlayer = "X";
      menu.classList.add("hidden");
      game.classList.remove("hidden");
      createBoard();
      updateStatus();
      updateScoreboard();
    }

    function createBoard() {
      boardEl.innerHTML = "";
      cells = [];
      for (let i=0; i<9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.addEventListener("click", () => handleClick(i));
        boardEl.appendChild(cell);
        cells.push(cell);
      }
    }

    function handleClick(i) {
      if (!gameActive || cells[i].textContent) return;
      cells[i].textContent = currentPlayer;
      cells[i].classList.add("taken");

      if (checkWinner()) return;

      if (mode === "multi") {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        updateStatus();
      } else {
        if (currentPlayer === "X") {
          currentPlayer = "O";
          updateStatus("Computer's turn...");
          setTimeout(computerMove, 500);
        }
      }
    }

    function computerMove() {
      if (!gameActive) return;
      let move;

      if (difficulty === "easy") {
        move = getRandomMove();
      } else if (difficulty === "normal") {
        move = Math.random() < 0.5 ? getRandomMove() : getSmartMove();
      } else {
        move = getSmartMove(); 
      }

      if (move !== null) {
        cells[move].textContent = "O";
        cells[move].classList.add("taken");
      }

      checkWinner();
      if (gameActive) {
        currentPlayer = "X";
        updateStatus("Your turn");
      }
    }

    function getRandomMove() {
      const empty = cells.map((c,i)=>!c.textContent?i:null).filter(v=>v!==null);
      if (empty.length === 0) return null;
      return empty[Math.floor(Math.random()*empty.length)];
    }

    function getSmartMove() {
      for (let cond of winningConditions) {
        const [a,b,c] = cond;
        if (cells[a].textContent==="O" && cells[b].textContent==="O" && !cells[c].textContent) return c;
        if (cells[a].textContent==="O" && cells[c].textContent==="O" && !cells[b].textContent) return b;
        if (cells[b].textContent==="O" && cells[c].textContent==="O" && !cells[a].textContent) return a;
      }
      for (let cond of winningConditions) {
        const [a,b,c] = cond;
        if (cells[a].textContent==="X" && cells[b].textContent==="X" && !cells[c].textContent) return c;
        if (cells[a].textContent==="X" && cells[c].textContent==="X" && !cells[b].textContent) return b;
        if (cells[b].textContent==="X" && cells[c].textContent==="X" && !cells[a].textContent) return a;
      }
      return getRandomMove();
    }

    function checkWinner() {
      for (let cond of winningConditions) {
        const [a,b,c] = cond;
        if (cells[a].textContent &&
            cells[a].textContent === cells[b].textContent &&
            cells[a].textContent === cells[c].textContent) {
          gameActive = false;
          if (cells[a].textContent === "X") playerXScore++;
          else playerOScore++;
          updateStatus(`Player ${cells[a].textContent} wins this round! 🎉`);
          updateScoreboard();
          return true;
        }
      }
      if (cells.every(c=>c.textContent)) {
        gameActive = false;
        updateStatus("It's a draw! 🤝");
        return true;
      }
      return false;
    }

    function resetBoard() {
      if (currentRound >= totalRounds) {
        let winnerMsg = playerXScore>playerOScore ? "Player X wins the match!" :
                        playerOScore>playerXScore ? "Player O wins the match!" :
                        "The match is a draw!";
        alert(winnerMsg);
        goToMenu();
        return;
      }
      currentRound++;
      createBoard();
      gameActive = true;
      currentPlayer = "X";
      updateStatus();
    }

    function updateStatus(msg=null) {
      statusText.textContent = msg || `Player ${currentPlayer}'s turn`;
    }

    function updateScoreboard() {
      scoreboard.textContent = `Round ${currentRound}/${totalRounds} | X: ${playerXScore} - O: ${playerOScore}`;
    }

    function goToMenu() {
      game.classList.add("hidden");
      menu.classList.remove("hidden");
      options.classList.add("hidden");
    }
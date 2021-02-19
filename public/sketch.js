let playerSize = 50;
let button;
let playMode;

let counterDelay = 30;
let counter = counterDelay;

let gameInterval;

let sound;

//let showWinner = false;
let winner = null;

// Le jeu change de mode
socket.on("update game", data => {
  playMode = data[0];
  counter = data[1];
  winner = data[2];

  if (playMode) {
    button.hide();
  } else {
    button.show();
  }
});

function setup() {
  cv = createCanvas(800, 800);
  cv.mousePressed(canvasMousePressed);

  sound = loadSound("yeet.wav");

  centerCanvas();
  noStroke();
  textSize(playerSize);
  textAlign(CENTER, CENTER);

  button = createButton("Start the game!");
  button.position(
    windowWidth / 2 - button.width / 2,
    windowHeight / 2 - button.height / 2
  );
  button.mousePressed(startTheGame);
}

function draw() {
  background(20);

  players.forEach(player => {
    if (currentPlayer.id == player.id) player.move();
    player.collide();
    player.draw();
  });

  // Dire à tout le monde ma nouvelle position
  socket.emit("update player", currentPlayer);

  // Est-ce que tout le monde est infecté ?
  // Si oui, je repasse en mode attente, Sinon le jeu continue
  if (playMode) {
    fill(255);
    text(counter, 50, 50);
    checkWinner();
  } else if (winner) {
    text("Congrats " + winner, width / 2, 50);
  }
}

function resetGame() {
  clearInterval(gameInterval);
  counter = counterDelay;
  playMode = false;
  //winner = null;
  button.show();
  socket.emit("update game", [playMode, counter, winner]);
}

function checkWinner() {
  let allInfected = players.every(player => {
    return player.infected == true;
  });

  if (allInfected) {
    winner = "Zombies";
    resetGame();
    //showWinner = true;
  } else if (counter == 0) {
    winner = "Humans";
    resetGame();
    //showWinner = true;
  }
}

function startTheGame() {
  console.log("ready!!!");
  playMode = true;
  button.hide();
  socket.emit("update game", [playMode, counter, winner]);

  players.forEach(player => {
    player.infected = false;
    socket.emit("update player", player);
  });

  let randomPlayer = random(players);
  randomPlayer.infected = true;
  socket.emit("update player", randomPlayer);

  gameInterval = setInterval(updateInterval, 1000);
}

function updateInterval() {
  counter--;

  if (counter == 0) {
    checkWinner();
  }

  socket.emit("update game", [playMode, counter, winner]);
}

function canvasMousePressed() {
  console.log(players);
  console.log("You are : " + currentPlayer.id);

  //currentPlayer.infected = true;
}

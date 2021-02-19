let avatars = [
  "😈",
  "😎",
  "🙂",
  "🤠",
  "👻",
  "😙",
  "🤢",
  "🤖",
  "🤡",
  "👽",
  "👾",
  "😼"
];

class Player {
  constructor(player) {
    this.id = player.id;

    this.x = random(width);
    this.y = random(height);

    this.infected = false;
    this.avatar = random(avatars);
  }

  collide() {
    players.forEach(player => {
      if (this.id != player.id) {
        // Merci pythagore
        let dx = player.x - this.x;
        let dy = player.y - this.y;
        let distance = sqrt(dx * dx + dy * dy);
        let minDistance = playerSize;

        if (distance < minDistance && this.infected && !player.infected) {
          console.log("player :" + this.id + " touched :" + player.id);

          // Si je suis infecté -> j'infecte l'autre que je touche
          player.infected = true;

          sound.play();

          // Dire à tout le monde l'autre est infecté
          socket.emit("update player", player);
        }
      }
    });
  }

  move() {
    this.x = lerp(this.x, mouseX, 0.005);
    this.y = lerp(this.y, mouseY, 0.005);

    this.x = constrain(this.x, playerSize / 2, width - playerSize / 2);
    this.y = constrain(this.y, playerSize / 2, height - playerSize / 2);
  }

  draw() {
    push();
    translate(this.x, this.y);
    let avatar = this.avatar;

    // Je masque mon identité et je me révèle si j'infecte l'autre
    if (!playMode) {
      avatar = "😴";
    } else if (this.infected && this.id == currentPlayer.id) avatar = "🦠";

    text(avatar, 0, 0);
    pop();
  }
}

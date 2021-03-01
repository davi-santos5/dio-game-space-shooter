const playerShip = document.querySelector(".player-shooter");
const playArea = document.querySelector("#main-play-area");
const aliensImg = [
  "img/monster-1.png",
  "img/monster-2.png",
  "img/monster-3.png",
];
const instructionsText = document.querySelector(".game-instructions");
const startButton = document.querySelector(".start-button");
let alienInterval;

function flyShip(event) {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    moveLeft();
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    moveRight();
  }
  if (event.key === " ") {
    event.preventDefault();
    let laser = document.querySelectorAll(".laser");
    if (laser.length >= 1) return;
    fireLaser();
  }
}

function moveLeft() {
  let leftPosition = getComputedStyle(playerShip).getPropertyValue("left");

  if (leftPosition === "5px") return;

  let position = parseInt(leftPosition);
  position -= 10;
  playerShip.style.left = `${position}px`;
}

function moveRight() {
  let leftPosition = getComputedStyle(playerShip).getPropertyValue("left");

  if (leftPosition === "515px") return;

  let position = parseInt(leftPosition);
  position += 10;
  playerShip.style.left = `${position}px`;
}

function fireLaser() {
  let laser = createLaserElement();
  playArea.appendChild(laser);
  moveLaser(laser);
  console.log(laser.style.left);
}

function createLaserElement() {
  let xShipPosition = parseInt(
    window.getComputedStyle(playerShip).getPropertyValue("left")
  );
  let yShipPosition = parseInt(
    window.getComputedStyle(playerShip).getPropertyValue("top")
  );
  let newLaser = document.createElement("img");
  newLaser.src = "img/shoot.png";
  newLaser.classList.add("laser");
  newLaser.style.left = `${xShipPosition + 15}px`;
  newLaser.style.top = `${yShipPosition - 40}px`;
  return newLaser;
}

function moveLaser(laser) {
  let laserInterval = setInterval(() => {
    let yPosition = parseInt(laser.style.top);
    let aliens = document.querySelectorAll(".alien");

    aliens.forEach((alien) => {
      if (checkLaserCollision(laser, alien)) {
        alien.src = "img/explosion.png";
        alien.classList.remove("alien");
        alien.classList.add("dead-alien");
      }
    });

    if (yPosition <= -20) {
      laser.remove();
    } else {
      laser.style.top = `${yPosition - 8}px`;
    }
  }, 7);
}

function createAliens() {
  let newAlien = document.createElement("img");
  let alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)];
  newAlien.src = alienSprite;
  newAlien.classList.add("alien");
  newAlien.classList.add("alien-transition");
  newAlien.style.left = `${Math.floor(Math.random() * 480)}px`;
  console.log(newAlien.style.left);
  newAlien.style.top = "-30px";
  playArea.appendChild(newAlien);
  moveAlien(newAlien);
}

function moveAlien(alien) {
  let moveAlienInterval = setInterval(() => {
    let yPosition = parseInt(
      window.getComputedStyle(alien).getPropertyValue("top")
    );
    if (yPosition >= 550) {
      if (Array.from(alien.classList).includes("dead-alien")) {
        alien.remove();
      } else {
        gameOver();
      }
    } else {
      alien.style.top = `${yPosition + 2}px`;
    }
  }, 30);
}

function checkLaserCollision(laser, alien) {
  let laserTop = parseInt(laser.style.top);
  let laserLeft = parseInt(laser.style.left);
  let laserRight = laserLeft - 40;
  let alienTop = parseInt(alien.style.top);
  let alienBottom = alienTop - 60;
  let alienLeft = parseInt(alien.style.left);
  let alienRight = alienLeft + 70;

  return (
    laserLeft >= alienLeft &&
    laserRight <= alienRight &&
    laserTop >= 0 &&
    laserTop <= alienBottom
  );
}

startButton.addEventListener("click", playGame);

function playGame() {
  startButton.style.display = "none";
  instructionsText.style.display = "none";
  window.addEventListener("keydown", flyShip);
  alienInterval = setInterval(() => {
    createAliens();
  }, 3000);
}

function gameOver() {
  window.removeEventListener("keydown", flyShip);

  clearInterval(alienInterval);
  let aliens = document.querySelectorAll(".alien");
  aliens.forEach((alien) => alien.remove());

  let lasers = document.querySelectorAll(".laser");
  lasers.forEach((laser) => laser.remove());

  alert("game over!");
  playerShip.style.left = "265px";
  startButton.style.display = "block";
  instructionsText.style.display = "block";
}

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
  if (event.key === "ArrowUp") {
    event.preventDefault();
    moveUp();
  }
  if (event.key === "ArrowDown") {
    event.preventDefault();
    moveDown();
  }
  if (event.key === " ") {
    event.preventDefault();
    let laser = document.querySelectorAll(".laser");
    if (laser.length >= 2) return;
    fireLaser();
  }
}

function moveUp() {
  let topPosition = getComputedStyle(playerShip).getPropertyValue("top");

  if (topPosition === "0px") return;

  let position = parseInt(topPosition);
  position -= 10;
  playerShip.style.top = `${position}px`;
}

function moveDown() {
  let topPosition = getComputedStyle(playerShip).getPropertyValue("top");

  if (topPosition === "510px") return;

  let position = parseInt(topPosition);
  position += 10;
  playerShip.style.top = `${position}px`;
}

function fireLaser() {
  let laser = createLaserElement();
  playArea.appendChild(laser);
  moveLaser(laser);
}

function createLaserElement() {
  let xPosition = parseInt(
    window.getComputedStyle(playerShip).getPropertyValue("left")
  );
  let yPosition = parseInt(
    window.getComputedStyle(playerShip).getPropertyValue("top")
  );
  let newLaser = document.createElement("img");
  newLaser.src = "img/shoot.png";
  newLaser.classList.add("laser");
  newLaser.style.left = `${xPosition}px`;
  newLaser.style.top = `${yPosition - 10}px`;
  return newLaser;
}

function moveLaser(laser) {
  let laserInterval = setInterval(() => {
    let xPosition = parseInt(laser.style.left);
    let aliens = document.querySelectorAll(".alien");

    aliens.forEach((alien) => {
      if (checkLaserCollision(laser, alien)) {
        alien.src = "img/explosion.png";
        alien.classList.remove("alien");
        alien.classList.add("dead-alien");
      }
    });

    if (xPosition === 340) {
      laser.remove();
    } else {
      laser.style.left = `${xPosition + 8}px`;
    }
  }, 10);
}

function createAliens() {
  let newAlien = document.createElement("img");
  let alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)];
  newAlien.src = alienSprite;
  newAlien.classList.add("alien");
  newAlien.classList.add("alien-transition");
  newAlien.style.left = "470px";
  newAlien.style.top = `${Math.floor(Math.random() * 330) + 30}px`;
  playArea.appendChild(newAlien);
  moveAlien(newAlien);
}

function moveAlien(alien) {
  let moveAlienInterval = setInterval(() => {
    let xPosition = parseInt(
      window.getComputedStyle(alien).getPropertyValue("left")
    );
    if (xPosition <= 50) {
      if (Array.from(alien.classList).includes("dead-alien")) {
        alien.remove();
      } else {
        gameOver();
      }
    } else {
      alien.style.left = `${xPosition - 2}px`;
    }
  }, 30);
}

function checkLaserCollision(laser, alien) {
  let laserTop = parseInt(laser.style.top);
  let laserLeft = parseInt(laser.style.left);
  let laserBottom = laserTop - 20;
  let alienTop = parseInt(alien.style.top);
  let alienLeft = parseInt(alien.style.left);
  let alienBottom = alienTop - 30;

  return (
    laserLeft != 340 &&
    laserLeft + 40 >= alienLeft &&
    laserTop <= alienTop &&
    laserTop >= alienBottom
  );
}

startButton.addEventListener("click", (event) => {
  playGame();
});

function playGame() {
  startButton.style.display = "none";
  instructionsText.style.display = "none";
  window.addEventListener("keydown", flyShip);
  alienInterval = setInterval(() => {
    createAliens();
  }, 4000);
}

function gameOver() {
  window.removeEventListener("keydown", flyShip);
  clearInterval(alienInterval);
  let aliens = document.querySelectorAll(".alien");
  aliens.forEach((alien) => alien.remove());
  let lasers = document.querySelectorAll(".laser");
  lasers.forEach((laser) => laser.remove());
  setTimeout(() => {
    alert("game over!");
    playerShip.style.top = "250px";
    startButton.style.display = "block";
    instructionsText.style.display = "block";
  });
}

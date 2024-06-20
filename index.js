const canvas = document.querySelector("canvas");
const count = document.getElementById("count");
const levelCountDiv = document.getElementById("levelCount");
const scoreCard = document.getElementById("scoreCard");
const finalScore = document.getElementById("finalScore");
const c = canvas.getContext("2d");
canvas.width = document.body.offsetWidth;
canvas.height = document.body.offsetHeight;
const superSize = 400;
let animateFrame;
let stopAnimation = true;
let score = 0;
let IntervalFunction ;
const levelScore = 5000;
class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
}
class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
  update() {
    this.draw();
    if (stopAnimation) {
      return;
    }
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }
  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  }
  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha = this.alpha - 0.01;
  }
}
class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
  update() {
    this.draw();
    if (stopAnimation) {
      return;
    }

    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}
const x = canvas.width / 2,
  y = canvas.height / 2;

//Player ...>>>>>>

let PlayerRadius = 30;
let player = new Player(x, y, 30, "white");

if (canvas.width < 400 || canvas.height < 400) {
  const percentage = (PlayerRadius * 100) / superSize;
  PlayerRadius = superSize * (percentage / 100);
  player = new Player(x, canvas.height - 30, PlayerRadius, "white");
}

let projectiles = [];
const particles = [];
function animateProjectile() {
  projectiles.forEach((element) => {
    element.update();
  });
}

//enemy
let enemies = [];

function spawnEnemies() {
  if(stopAnimation) return ;

  let IntervalFunction = setInterval(() => {
    console.log("inteval")
    if (stopAnimation) {
      window.clearInterval(IntervalFunction );
      return;
    }
    let level = Math.floor((score + levelScore) / levelScore);
    if (level > 25) {
      level = 25;
    }
    const RI = Math.floor(1 + Math.random() * (4 + 1 - 1));
    let x, y;
    if (canvas.width < 400 || canvas.height < 400) {
      switch (RI) {
        case 1:
          x = canvas.width + 20;
          y = Math.random() * (canvas.height / 2);
          break;
        case 2:
          x = 0 - 20;
          y = Math.random() * (canvas.height / 2);
          break;
        case 3:
          x = Math.random() * canvas.width;
          y = 0 - 20;
          break;
        case 4:
          x = Math.random() * canvas.width;
          y = 0 - 20;
          break;
      }
    } else {
      switch (RI) {
        case 1:
          x = canvas.width + 20;
          y = Math.random() * canvas.height;
          break;
        case 2:
          x = Math.random() * canvas.width;
          y = 0 - 20;
          break;
        case 3:
          x = 0 - 20;
          y = Math.random() * canvas.height;
          break;
        case 4:
          x = Math.random() * canvas.width;
          y = canvas.height + 20;
          break;
      }
    }
    const angel = Math.atan2(player.y - y, player.x - x);
    
    const velocity = {
      x: Math.cos(angel) * (1 + level / 6),
      y: Math.sin(angel) * (1 + level / 6),
    };
    console.log(level);
    let radMax = 35;
    const percentageRadMax = (radMax * 100) / superSize;
    let radMin = 20;
    const percentageRadMin = (radMin * 100) / superSize;

    if (canvas.width < superSize || canvas.height < superSize) {
      const min = Math.min(canvas.height, canvas.width);
      radMax = (percentageRadMax / 100) * min;
      radMin = (percentageRadMin / 100) * min;
    }
    const rad = Math.floor(radMin + Math.random() * (radMax - radMin + 1));
    // const rad = 30;
    // if (enemies.length > 4) return;
    const color = `hsl(${Math.random() * 360},50%,50%)`;
    enemies.push(new Enemy(x, y, rad, color, velocity));
  }, 1000);
}

function animateEnemy() {
  enemies.forEach((element) => {
    element.update();
  });
}

// animate function

function animate() {
  //define size

  //....
  if(stopAnimation) return;
  count.innerHTML = score;
  levelCountDiv.innerHTML = Math.floor((score + levelScore) / levelScore);
  c.fillStyle = "rgba(0,0,0,0.2)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();
  animateProjectile();
  animateEnemy();

  particles.forEach((particle, index) => {
    particle.update();
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    }
  });
  enemies.forEach((el, i) => {
    // detect enemy collision with player
    const distP = Math.hypot(player.x - el.x, player.y - el.y);
    if (distP - el.radius - player.radius < 0) {
      stopAnimation = true;
      scoreCard.style.display = "flex";
      finalScore.innerHTML = score;
      c.clearRect(0 , 0 , canvas.width , canvas.height)
      
    }

    // detect enemy collision with projectile

    projectiles.forEach((pr, j) => {
      const dist = Math.hypot(pr.x - el.x, pr.y - el.y);
      if (dist - el.radius - pr.radius < 0) {
        projectiles.splice(j, 1);
        //update score
        score = score + 100;

        // create particle Effect
        for (let index = 0; index < el.radius * 3; index++) {
          const angelEP = Math.atan2(pr.y - el.y, pr.x - el.x);
          const px = Math.cos(angelEP) * el.radius + el.x;
          const py = Math.sin(angelEP) * el.radius + el.y;
          const velocityX = (Math.random() - 0.5) * 10;
          const velocityY = (Math.random() - 0.5) * 10;
          particles.push(
            new Particle(px, py, 2, el.color, { x: velocityX, y: velocityY })
          );
        }
        //shrink enemy
        let shrinkAmount = 5;
        const percentage = (shrinkAmount * 100) / superSize;

        if (canvas.width < superSize || canvas.height < superSize) {
          const min = Math.min(canvas.height, canvas.width);
          shrinkAmount = (percentage / 100) * min;
        }

        let minHeight = 20;
        const percentageH = (minHeight * 100) / superSize;

        if (canvas.width < superSize || canvas.height < superSize) {
          const min = Math.min(canvas.height, canvas.width);
          minHeight = (percentageH / 100) * min;
        }

        if (el.radius - minHeight > shrinkAmount) {
          // el.radius =  10;
          gsap.to(el, {
            radius: el.radius - shrinkAmount,
          });
          return;
        }
        enemies.splice(i, 1);
      }
    });
  });

  // remove off screen projectiles

  projectiles.forEach((el, i) => {
    // remove horizontal projectile

    if (canvas.width / 2 - el.x - el.radius > 0) {
      if (canvas.width / 2 - el.x - el.radius > canvas.width / 2 - 0) {
        projectiles.splice(i, 1);
      }
    } else {
      if (el.x - canvas.width / 2 - el.radius > canvas.width / 2 - 0) {
        projectiles.splice(i, 1);
      }
    }
    // remove vertical projectile
    if (canvas.height / 2 - el.y - el.radius > 0) {
      if (canvas.height / 2 - el.y - el.radius > canvas.height / 2 - 0) {
        projectiles.splice(i, 1);
      }
    } else {
      if (el.y - canvas.height / 2 - el.radius > canvas.height / 2 - 0) {
        projectiles.splice(i, 1);
      }
    }
  });

  // end
  animateFrame = window.requestAnimationFrame(animate);
}

function startGame(e) {
  e.stopPropagation();
  // window.cancelAnimationFrame(animateFrame)
  stopAnimation = false;
  enemies = [];
  projectiles = [];
  animateFrame;
  score = 0;
  scoreCard.style.display = "none";
  animate();
  spawnEnemies();
}

//click function
function clickForProjectile(x, y) {
  let level = Math.floor((score + levelScore) / levelScore);
  if (level > 25) {
    level = 25;
  }
  const angel = Math.atan2(y - player.y, x - player.x);
  const velocity = {
    x: Math.cos(angel) * 10,
    y: Math.sin(angel) * 10,
  };
  let radius = 10;
  const percentage = (radius * 100) / superSize;
  if (canvas.height < superSize || canvas.width < superSize) {
    const min = Math.min(canvas.height, canvas.width);
    radius = (percentage / 100) * min;
  }

  projectiles.push(
    new Projectile(player.x, player.y, radius, "#fff", velocity)
  );
  // }
  const timeOut = (1000 / 60) * 10;
  for (let n = 0; n < level / 10 - 1; n++) {
    setTimeout(() => {
      projectiles.push(
        new Projectile(player.x, player.y, radius, "#fff", velocity)
      );
    }, timeOut * (n + 1));
  }
}
function clickFunction(x, y) {
  if (stopAnimation) return;
  clickForProjectile(x, y);
}
let touch = false;
window.addEventListener("touchstart", (e) => {

  clickFunction(e.touches[0].clientX, e.touches[0].clientY);
  touch = true;
});
window.addEventListener("mousedown", (e) => {
  if (touch) {
    return;
  }
  clickFunction(e.clientX, e.clientY);
  return false;
});
window.addEventListener("dblclick", (e) => {
  e.preventDefault();
});
window.addEventListener("resize", (e) => {
  canvas.width = document.body.offsetWidth;
  canvas.height = document.body.offsetHeight;
  let PlayerRadius = 30;
  const percentage = (PlayerRadius * 100) / superSize;
  player = new Player(
    canvas.width / 2,
    canvas.height / 2,
    PlayerRadius,
    "white"
  );

  if (canvas.width < superSize || canvas.height < superSize) {
    const min = Math.min(canvas.height, canvas.width);
    PlayerRadius = (percentage / 100) * min;
    player = new Player(
      canvas.width / 2,
      canvas.height - 30,
      PlayerRadius,
      "white"
    );
  }
});


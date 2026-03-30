// Cosmic Defenders - Creative Shooting Game

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let gameState = 'menu';
let score = 0;
let wave = 1;
let playerHealth = 100;
let keys = {};
let combo = 0;

const player = {
  x: canvas.width / 2,
  y: canvas.height - 60,
  width: 30,
  height: 40,
  speed: 5,
  color: '#00d4ff'
};

let bullets = [];
let enemies = [];
let powerups = [];
let particles = [];
let activePowerup = null;
let powerupTime = 0;

const powerupTypes = [
  { name: 'shield', color: '#00ff00', duration: 10000 },
  { name: 'rapidFire', color: '#ff9900', duration: 15000 },
  { name: 'spreadShot', color: '#ff00ff', duration: 12000 },
  { name: 'timeSlow', color: '#00ffff', duration: 10000 },
  { name: 'health', color: '#ff0000', instant: true }
];

// Menu and UI handlers
document.getElementById('startBtn').addEventListener('click', () => startGame('endless'));
document.getElementById('challengeBtn').addEventListener('click', () => startGame('challenge'));
document.getElementById('bossRushBtn').addEventListener('click', () => startGame('bossRush'));
document.getElementById('retryBtn').addEventListener('click', () => startGame('endless'));

function startGame(mode) {
  gameState = 'playing';
  score = 0;
  wave = 1;
  playerHealth = 100;
  player.x = canvas.width / 2;
  player.y = canvas.height - 60;
  bullets = [];
  enemies = [];
  powerups = [];
  particles = [];
  activePowerup = null;
  combo = 0;
  document.getElementById('menu').style.display = 'none';
  document.getElementById('hud').style.display = 'flex';
  document.getElementById('gameOver').classList.add('hidden');
  spawnWave();
}

window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
  if (e.key === ' ' && gameState === 'playing') {
    shoot();
    e.preventDefault();
  }
  if (e.key === 'p' && gameState === 'playing') {
    gameState = 'paused';
  } else if (e.key === 'p' && gameState === 'paused') {
    gameState = 'playing';
  }
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

canvas.addEventListener('click', () => {
  if (gameState === 'playing') shoot();
});

function shoot() {
  if (activePowerup === 'spreadShot') {
    for (let angle = -30; angle <= 30; angle += 15) {
      const rad = (angle * Math.PI) / 180;
      bullets.push({
        x: player.x + player.width / 2,
        y: player.y,
        vx: Math.sin(rad) * 5,
        vy: -7,
        width: 4,
        height: 12,
        color: '#ff00ff'
      });
    }
  } else {
    bullets.push({
      x: player.x + player.width / 2,
      y: player.y,
      vx: 0,
      vy: -8,
      width: 4,
      height: 12,
      color: activePowerup === 'rapidFire' ? '#ff9900' : '#00ff00'
    });
  }
}

function spawnWave() {
  const enemyCount = 5 + wave * 2;
  for (let i = 0; i < enemyCount; i++) {
    setTimeout(() => {
      enemies.push({
        x: Math.random() * (canvas.width - 30),
        y: -30,
        width: 30,
        height: 30,
        speed: 1 + wave * 0.2,
        health: wave % 5 === 0 ? 10 : 1,
        color: wave % 5 === 0 ? '#ff4444' : '#ff9900',
        type: wave % 5 === 0 ? 'boss' : 'normal'
      });
    }, i * 500);
  }
}

function createParticles(x, y, color) {
  for (let i = 0; i < 10; i++) {
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 5,
      vy: (Math.random() - 0.5) * 5,
      life: 1,
      color
    });
  }
}

function update() {
  if (gameState !== 'playing') return;

  // Player movement
  if (keys['a'] || keys['ArrowLeft']) player.x -= player.speed;
  if (keys['d'] || keys['ArrowRight']) player.x += player.speed;
  if (keys['w'] || keys['ArrowUp']) player.y -= player.speed;
  if (keys['s'] || keys['ArrowDown']) player.y += player.speed;

  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

  // Update bullets
  bullets = bullets.filter(b => b.y > -b.height);
  bullets.forEach(b => {
    b.x += b.vx;
    b.y += b.vy;
  });

  // Update enemies
  const speedMult = activePowerup === 'timeSlow' ? 0.5 : 1;
  enemies.forEach(e => {
    e.y += e.speed * speedMult;
  });

  // Check bullet-enemy collisions
  bullets.forEach((b, bi) => {
    enemies.forEach((e, ei) => {
      if (b.x < e.x + e.width && b.x + b.width > e.x &&
          b.y < e.y + e.height && b.y + b.height > e.y) {
        e.health--;
        bullets.splice(bi, 1);
        createParticles(e.x + e.width / 2, e.y + e.height / 2, e.color);
        
        if (e.health <= 0) {
          score += e.type === 'boss' ? 1000 : 100;
          combo++;
          enemies.splice(ei, 1);
          
          if (Math.random() < 0.1) {
            const type = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
            powerups.push({
              x: e.x,
              y: e.y,
              width: 25,
              height: 25,
              color: type.color,
              type
            });
          }
        }
      }
    });
  });

  // Check player-enemy collisions
  if (activePowerup !== 'shield') {
    enemies.forEach((e, ei) => {
      if (player.x < e.x + e.width && player.x + player.width > e.x &&
          player.y < e.y + e.height && player.y + player.height > e.y) {
        playerHealth -= 20;
        enemies.splice(ei, 1);
        combo = 0;
        createParticles(player.x + player.width / 2, player.y + player.height / 2, '#ff0000');
        if (playerHealth <= 0) gameOver();
      }
    });
  }

  // Update powerups
  powerups.forEach(p => p.y += 2);
  powerups = powerups.filter(p => p.y < canvas.height);

  // Check powerup collection
  powerups.forEach((p, pi) => {
    if (player.x < p.x + p.width && player.x + player.width > p.x &&
        player.y < p.y + p.height && player.y + player.height > p.y) {
      if (p.type.instant && p.type.name === 'health') {
        playerHealth = Math.min(100, playerHealth + 25);
      } else {
        activePowerup = p.type.name;
        powerupTime = p.type.duration;
      }
      powerups.splice(pi, 1);
    }
  });

  // Powerup timer
  if (powerupTime > 0) {
    powerupTime -= 16;
    if (powerupTime <= 0) activePowerup = null;
  }

  // Update particles
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 0.02;
  });
  particles = particles.filter(p => p.life > 0);

  // Check wave complete
  if (enemies.length === 0) {
    wave++;
    score += 500 * wave;
    spawnWave();
  }

  // Update HUD
  document.getElementById('score').textContent = `SCORE: ${score}`;
  document.getElementById('wave').textContent = `WAVE: ${wave}`;
  document.getElementById('health').textContent = `HEALTH: ${playerHealth}`;
  document.getElementById('ammo').textContent = activePowerup ? activePowerup.toUpperCase() : 'INF';
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.fillStyle = activePowerup === 'shield' ? '#00ff00' : player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(player.x + player.width / 2, player.y - 5);
  ctx.lineTo(player.x, player.y + 15);
  ctx.lineTo(player.x + player.width, player.y + 15);
  ctx.closePath();
  ctx.fill();

  // Draw bullets
  bullets.forEach(b => {
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x, b.y, b.width, b.height);
  });

  // Draw enemies
  enemies.forEach(e => {
    ctx.fillStyle = e.color;
    ctx.fillRect(e.x, e.y, e.width, e.height);
    if (e.type === 'boss') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(e.x, e.y, e.width, e.height);
    }
  });

  // Draw powerups
  powerups.forEach(p => {
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x + p.width / 2, p.y + p.height / 2, p.width / 2, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw particles
  particles.forEach(p => {
    ctx.fillStyle = p.color + Math.floor(p.life * 255).toString(16).padStart(2, '0');
    ctx.fillRect(p.x, p.y, 3, 3);
  });

  if (gameState === 'paused') {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00d4ff';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
  }
}

function gameOver() {
  gameState = 'gameOver';
  document.getElementById('hud').style.display = 'none';
  document.getElementById('gameOver').classList.remove('hidden');
  document.getElementById('gameOver').style.display = 'block';
  document.getElementById('finalScore').textContent = `Final Score: ${score}`;
  document.getElementById('waveReached').textContent = `Wave Reached: ${wave}`;
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();

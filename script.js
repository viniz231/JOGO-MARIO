const mario = document.getElementById('mario');
const world = document.getElementById('world');
const heartDisplay = document.getElementById('heart-count');
const message = document.getElementById('message');

let hearts = 0;
let isGameOver = false;

let player = {
    x: 100, y: 40, velX: 0, velY: 0,
    speed: 0.8, friction: 0.88, gravity: 0.6,
    jumpForce: -16, grounded: true, width: 50, height: 60
};

let keys = {};

// Teclado
document.addEventListener('keydown', (e) => keys[e.code] = true);
document.addEventListener('keyup', (e) => keys[e.code] = false);

// Eventos Mobile
const setupMobile = (id, key) => {
    const btn = document.getElementById(id);
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); keys[key] = true; });
    btn.addEventListener('touchend', (e) => { e.preventDefault(); keys[key] = false; });
};

setupMobile('btnLeft', 'ArrowLeft');
setupMobile('btnRight', 'ArrowRight');
setupMobile('btnJump', 'Space');

function spawnHeart(x, y) {
    const heart = document.createElement('div');
    heart.innerText = '❤️';
    heart.className = 'floating-heart';
    heart.style.left = x + 10 + 'px';
    heart.style.bottom = y + 40 + 'px';
    world.appendChild(heart);
    setTimeout(() => heart.remove(), 600);
}

function checkCollisions() {
    const pipes = document.querySelectorAll('.obstacle');
    const blocks = document.querySelectorAll('.item-block');

    pipes.forEach(pipe => {
        let pX = pipe.offsetLeft;
        if (player.x + player.width > pX && player.x < pX + 80 && player.y < 120) {
            resetPlayer();
        }
    });

    blocks.forEach(block => {
        let bX = block.offsetLeft;
        let bY = parseInt(block.style.bottom);
        if (player.x + player.width > bX && player.x < bX + 45 && 
            player.y + player.height > bY && player.y + player.height < bY + 25 && 
            player.velY < 0) {
            
            if (!block.classList.contains('used')) {
                block.classList.add('bump', 'used');
                block.style.background = '#888';
                block.innerText = ''; 
                hearts++;
                heartDisplay.innerText = hearts;
                spawnHeart(bX, bY);
                player.velY = 3;
            }
        }
    });
}

function resetPlayer() {
    player.x = 100; player.y = 40; player.velX = 0; player.velY = 0;
    mario.style.opacity = "0.5";
    setTimeout(() => mario.style.opacity = "1", 500);
}

function gameLoop() {
    if (isGameOver) return;

    if (keys['ArrowRight']) { player.velX += player.speed; mario.style.transform = "scaleX(1)"; }
    if (keys['ArrowLeft']) { player.velX -= player.speed; mario.style.transform = "scaleX(-1)"; }
    if ((keys['ArrowUp'] || keys['Space']) && player.grounded) {
        player.velY = player.jumpForce;
        player.grounded = false;
    }

    player.velX *= player.friction;
    player.velY += player.gravity;
    player.x += player.velX;
    player.y -= player.velY;

    if (player.y <= 40) { player.y = 40; player.velY = 0; player.grounded = true; }
    if (player.x < 0) player.x = 0;

    checkCollisions();

    mario.style.left = player.x + "px";
    mario.style.bottom = player.y + "px";

    let camX = -player.x + (window.innerWidth / 3);
    if (camX > 0) camX = 0;
    world.style.transform = `translateX(${camX}px)`;

    if (player.x >= 2850) { isGameOver = true; message.classList.remove('hidden'); }
    requestAnimationFrame(gameLoop);
}

gameLoop();

const btnNao = document.getElementById('btnNao');
btnNao.addEventListener('mouseover', () => {
    btnNao.style.left = Math.random() * 200 + 'px';
    btnNao.style.top = Math.random() * 100 + 'px';
});
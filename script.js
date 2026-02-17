const mario = document.getElementById('mario');
const world = document.getElementById('world');
const heartDisplay = document.getElementById('heart-count');
const message = document.getElementById('message');

let hearts = 0;
let isGameOver = false;

// Ajuste da altura do chão para 60 (mesma do CSS)
const groundLevel = 60;

let player = {
    x: 100, y: groundLevel, velX: 0, velY: 0,
    speed: 0.7, friction: 0.88, gravity: 0.6,
    jumpForce: -16, grounded: true, width: 45, height: 50
};

let keys = {};

// Teclado
document.addEventListener('keydown', (e) => keys[e.code] = true);
document.addEventListener('keyup', (e) => keys[e.code] = false);

// Touch Mobile
const handleTouch = (id, key) => {
    const btn = document.getElementById(id);
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); keys[key] = true; });
    btn.addEventListener('touchend', (e) => { e.preventDefault(); keys[key] = false; });
};

handleTouch('btnLeft', 'ArrowLeft');
handleTouch('btnRight', 'ArrowRight');
handleTouch('btnJump', 'Space');

function checkCollisions() {
    const pipes = document.querySelectorAll('.obstacle');
    const blocks = document.querySelectorAll('.item-block');

    pipes.forEach(pipe => {
        if (player.x + player.width > pipe.offsetLeft && player.x < pipe.offsetLeft + pipe.offsetWidth && player.y < (groundLevel + 80)) {
            resetPlayer();
        }
    });

    blocks.forEach(block => {
        let bX = block.offsetLeft;
        let bY = parseInt(block.style.bottom);
        if (player.x + player.width > bX && player.x < bX + 45 && 
            player.y + player.height > bY && player.y + player.height < bY + 25 && player.velY < 0) {
            if (!block.classList.contains('used')) {
                block.classList.add('used');
                block.style.background = '#888';
                hearts++;
                heartDisplay.innerText = hearts;
                player.velY = 3;
            }
        }
    });
}

function resetPlayer() {
    player.x = 100; player.y = groundLevel; player.velX = 0; player.velY = 0;
    mario.style.opacity = "0.5";
    setTimeout(() => mario.style.opacity = "1", 500);
}

function gameLoop() {
    if (isGameOver) return;

    if (keys['ArrowRight']) { player.velX += player.speed; mario.style.transform = "scaleX(1)"; }
    if (keys['ArrowLeft']) { player.velX -= player.speed; mario.style.transform = "scaleX(-1)"; }
    if ((keys['ArrowUp'] || keys['Space']) && player.grounded) { player.velY = player.jumpForce; player.grounded = false; }

    player.velX *= player.friction;
    player.velY += player.gravity;
    player.x += player.velX;
    player.y -= player.velY;

    if (player.y <= groundLevel) { player.y = groundLevel; player.velY = 0; player.grounded = true; }
    if (player.x < 0) player.x = 0;

    checkCollisions();

    mario.style.left = player.x + "px";
    mario.style.bottom = player.y + "px";

    // Câmera adaptada para celular
    let camX = -player.x + (window.innerWidth / 4);
    if (camX > 0) camX = 0;
    world.style.transform = `translateX(${camX}px)`;

    if (player.x >= 2800) { isGameOver = true; message.classList.remove('hidden'); }
    requestAnimationFrame(gameLoop);
}

gameLoop();

const btnNao = document.getElementById('btnNao');
btnNao.addEventListener('touchstart', (e) => {
    e.preventDefault();
    btnNao.style.left = Math.random() * 70 + '%';
    btnNao.style.top = Math.random() * 70 + '%';
});

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

// Eventos Touch (Melhorados para Mobile)
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
        if (player.x + player.width > pipe.offsetLeft && player.x < pipe.offsetLeft + pipe.offsetWidth && player.y < 120) {
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
                spawnHeart(bX, bY);
                player.velY = 3;
            }
        }
    });
}

function spawnHeart(x, y) {
    const h = document.createElement('div');
    h.innerText = '❤️'; h.className = 'floating-heart';
    h.style.left = x + 'px'; h.style.bottom = y + 50 + 'px';
    world.appendChild(h);
    setTimeout(() => h.remove(), 600);
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
    if ((keys['ArrowUp'] || keys['Space']) && player.grounded) { player.velY = player.jumpForce; player.grounded = false; }

    player.velX *= player.friction;
    player.velY += player.gravity;
    player.x += player.velX;
    player.y -= player.velY;

    if (player.y <= 40) { player.y = 40; player.velY = 0; player.grounded = true; }
    if (player.x < 0) player.x = 0;

    checkCollisions();

    mario.style.left = player.x + "px";
    mario.style.bottom = player.y + "px";

    // AJUSTE DA CÂMERA RESPONSIVA
    let camX = -player.x + (window.innerWidth / 4);
    if (camX > 0) camX = 0;
    world.style.transform = `translateX(${camX}px)`;

    if (player.x >= 2800) { isGameOver = true; message.classList.remove('hidden'); }
    requestAnimationFrame(gameLoop);
}

gameLoop();

// Botão foge
const btnNao = document.getElementById('btnNao');
btnNao.addEventListener('touchstart', (e) => {
    e.preventDefault();
    btnNao.style.position = 'fixed';
    btnNao.style.left = Math.random() * 70 + '%';
    btnNao.style.top = Math.random() * 70 + '%';
});

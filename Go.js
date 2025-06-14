const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.3;
const slowdown = 0.5;

function checkPlayerCollision() {
    if (player1.position.x + player1.width > player2.position.x && player1.position.x < player2.position.x + player2.width) {
        if (player1.position.y + player1.height > player2.position.y && player1.position.y < player2.position.y + player2.height) {
            
            player1.velocity.x = -player1.velocity.x;
            player2.velocity.x = -player2.velocity.x;

            if (player1.velocity.y > 0) {
                player1.velocity.y = -player1.velocity.y;
            } else if (player2.velocity.y > 0) {
                player2.velocity.y = -player2.velocity.y;
            }

        }
    }
}

function getOpponent(player) {
    if (player == player1) {
        return player2;
    } else if (player == player2) {
        return player1;
    } else {
        throw new Error("Input player does not match player 1 or player2.");   
    }
}

// for testing
class DamageBlock {
    constructor() {
        this.damage = 10;
        this.position = {
            x: 420,
            y: 200
        };
        this.width = 20;
        this.height = 20;
    }

    draw() {
        c.fillStyle = 'red';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();
    }
}

class HealthBar {
    constructor(player) {
        this.player = player;
        this.height = 10;
        this.width = 100;
    }

    draw() {
        let greenWidth = this.width - (100 - this.player.health);
        let redWidth = 100 - greenWidth;
        c.fillStyle = 'green';
        c.fillRect(this.player.position.x - 24, this.player.position.y - 30, greenWidth, this.height);
        c.fillStyle = 'red';
        c.fillRect(this.player.position.x - 24 + greenWidth, this.player.position.y - 30, redWidth, this.height);
    }
    
    update() {
        this.draw();
    }

    // need to implement damage and making health bar turn red and stuff
}

const player1 = new Player({
    position: {
        x: 150,
        y: 0
    },
    velocity: {
        x: 0,
        y: 5
    },
    height: 150,
    width: 50,
    color: 'blue',
    direction: 'right'
});
const player2 = new Player({
    position: {
        x: 800,
        y: 0
    },
    velocity: {
        x: 0,
        y: 5
    },
    height: 150,
    width: 50,
    color: 'red',
    direction: 'left'
});


function animate() {
    window.requestAnimationFrame(animate);
    document.querySelector('#displayText').innerHTML = '';
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    let player1Alive = player1.update();
    let player2Alive = player2.update();
    if (!player1Alive && !player2Alive) { // TIE
        document.querySelector('#displayText').innerHTML = 'Tie';
    } else if (!player1Alive) { // PLAYER 2 ALIVE, PLAYER 1 DEAD
        document.querySelector('#displayText').innerHTML = 'Red Wins';
    } else if (!player2Alive) { // PLAYER 1 ALIVE, PLAYER 2 DEAD
        document.querySelector('#displayText').innerHTML = 'Blue Wins';
    } else {
        checkPlayerCollision();
    }
}

function onGround(sprite) {
    return sprite.position.y + sprite.height + sprite.velocity.y >= canvas.height;
}


animate();


window.addEventListener('keydown', (event) => {
    if (event.repeat) {
        switch (event.key) {
            case 's': // block / keybeing held
                player1.velocity.x = 0;
                player1.blocking = true;

            break;
            case ';':
                player2.velocity.x = 0;
                player2.blocking = true;
            break;
        }
        return;
    }
    switch (event.key) {
        case 'w':
            if (player1.blocking) { return; }
            if (!player1.doubleJumped) {

                if (!onGround(player1)) {
                    player1.doubleJumped = true;
                }

                player1.velocity.y += -10;
            }
        break;
        case 'd':
            if (player1.blocking) { return; }
            player1.velocity.x = 20;
            player1.direction = 'right';
        break;
        case 'a':
            if (player1.blocking) { return; }
            player1.velocity.x = -20;
            player1.direction = 'left';
        break;
        case 's':
            if (!onGround(player1)) {
                player1.velocity.y = 20;
            } else {
                player1.velocity.x = player1.velocity.x / 3;
                player1.blocking = true;
            }
        break;
        case 'r':
            if (player1.blocking) { return; }
            player1.rAttack();
        break;
        case 'p':
            if (player2.blocking) { return; }
            if (!player2.doubleJumped) {

                if (!onGround(player2)) {
                    player2.doubleJumped = true;
                }

                player2.velocity.y += -10;
            }
        break;
        case '\'':
            if (player2.blocking) { return; }
            player2.velocity.x = 20;
            player2.direction = 'right';
        break;
        case 'l':
            if (player2.blocking) { return; }
            player2.velocity.x = -20;
            player2.direction = 'left';
        break;
        case ';':
            if (!onGround(player2)) {
                player2.velocity.y = 20;
            } else {
                player2.velocity.x = player2.velocity.x / 3;
                player2.blocking = true;
            }
        break;
        case ']':
            player2.rAttack();
        break;
    }
})

window.addEventListener('keyup', (event) => {
    switch(event.key) {
        case 's':
            player1.blocking = false;
        break;
        case ';':
            player2.blocking = false;
        break;
    }
})

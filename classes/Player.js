class Player {
    constructor({position, velocity, height, width, color, direction}) {
        this.position = position;
        this.velocity = velocity;
        this.height = height;
        this.width = width;
        this.color = color;
        this.health = 100;
        this.doubleJumped = false;
        this.healthBar = new HealthBar(this);
        this.direction = direction;
        this.blocking = false;
    }

    draw() {

        if (this.health <= 0) {
            return;
        }

        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
        this.healthBar.update();

        // draw shield
        if (this.blocking) {
            c.fillStyle = 'white';
            if (this.direction == 'left') {
                c.fillRect(this.position.x - 30, this.position.y + 15, 10, 120);
            } else {
                c.fillRect(this.position.x + this.width + 20, this.position.y + 15, 10, 120);
            }
        }
    }


    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (onGround(this)) {
            this.velocity.y = 0;
            this.doubleJumped = false;
        } else {
            this.velocity.y += gravity;
        }

        // check if hitting side walls
        if (this.position.x < 0) {
            if (this.velocity.x < 0) {
                this.velocity.x = -this.velocity.x;
            }
        } else if (this.position.x > canvas.width) {
            if (this.velocity.x > 0) {
                this.velocity.x = -this.velocity.x;
            }
        }

        // check if hitting roof
        if (this.position.y < 0) {
            this.velocity.y = 2;
        }

        
        if (this.velocity.x > 0) {
            this.velocity.x -= slowdown;
        } else if (this.velocity.x < 0) {
            this.velocity.x += slowdown;
        }

        if (this.health > 0) {
            return true;
        } else {
            return false;
        }
    }

    rAttack() {
        let opp = getOpponent(this);
        if (opp.blocking && opp.direction != this.direction) {
            return;
        }
        let attackDistance = 150;
        let velocity = 50;
        let attackDamage = 10;
        if (this.direction == 'left') {
            if (opp.position.x + opp.width <= this.position.x && this.position.x - opp.position.x - opp.width <= attackDistance) {
                opp.velocity.x = -velocity;
                opp.health -= attackDamage;
            }
        } else {
            if (this.position.x + this.width <= opp.position.x && opp.position.x - this.position.x - this.width <= attackDistance) {
                opp.velocity.x = velocity;
                opp.health -= attackDamage;
            }
        }
    }
}
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)
        // add object to existing scene
        scene.physics.add.existing(this)
        scene.add.existing(this)

        this.fuel = PLAYER_MAX_FUEL;
        this.engineLevel = 2;
        this.score = 0;
        this.dead = false;
        this.hit = scene.add.group()

        this.emitter = scene.add.particles(this.x, this.y, 'flame', {
            lifespan: 600,
            speedX: {min: -150, max: -250},
            speedY: {min: -100, max: 100},
            scale: {start: 1, end: .5},
            gravityX: 100,
            blendMode: 'NORMAL',
            tint: 0xFFA500,
            emitting: true
        });

        this.timer = scene.time.addEvent({
            delay: 100,                // ms
            callback: () => {
                this.emitter.setParticleTint(0xFFA500);
                this.emitter.explode(2, this.x - 115, this.y - 100);
            },
            loop: true
        });

        this.scoreTimer = scene.time.addEvent({
            delay: 100,
            callback: () => {
                this.score += BLOCK_SPEED[this.engineLevel];
            },
            loop: true
        })

    }

    update(input) {
        if (this.dead) {
            this.body.velocity.y += 1
            if (this.y > 1000) {
                this.destroy()
                return;
            }

            return;
        }

        this.body.velocity.y += PLAYER_DRAG
        this.body.rotation = this.body.velocity.y / PLAYER_ROT_SPEED;

        // this.body.velocity.x = 10;
        if (this.body.velocity.y > PLAYER_MAX_DRAG) {
            this.body.setVelocityY(PLAYER_MAX_DRAG);
        }

        if (this.body.rotation > PLAYER_MAX_ROT) {
            this.body.rotation = PLAYER_MAX_ROT;
        }
        else if (this.body.rotation < -PLAYER_MAX_ROT) {
            this.body.rotation = -PLAYER_MAX_ROT;
        }

        if (input.activePointer.isDown) {
            this.body.velocity.y -= PLAYER_FLYSPEED;

            this.emitter.setParticleTint(0xFFDD00);
            this.emitter.explode(1, this.x - 115, this.y - 100);
            // this.body.rotation -= PLAYER_ROT_SPEED;
        }

        if (this.fuel < 0) {
            this.timer.remove();
            this.scoreTimer.remove();
            this.emitter.setParticleTint(0xFF0000);
            this.emitter.explode(200, this.x - 115, this.y - 100);
            this.setCollideWorldBounds(false)
            this.dead = true;

            this.fuel = 0;
        }
    }
}
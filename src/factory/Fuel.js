class Fuel extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, player) {
        super(scene, x, y, texture, frame)

        // add object to existing scene
        scene.physics.add.existing(this)
        scene.add.existing(this)

        this.player = player;
    }

    update() {
        this.body.setVelocityX(-BLOCK_SPEED[this.player.engineLevel] * 20);

        if (this.x <= 0 - this.width) {
            this.destroy();
        }
    }
}
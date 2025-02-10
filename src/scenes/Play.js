class Play extends Phaser.Scene {
    constructor() {
        // name of scene to phaser
        super("playScene")
    }

    create() {
        this.background = this.add.sprite(0, 0,"background").setOrigin(0, 0);
        this.background2 = this.add.sprite(800, 0,"background").setOrigin(0, 0);

        this.player = new Player(this, 100, 100, "packet")
        this.player.setCollideWorldBounds(true);
        this.player.setImmovable(true);

        this.blocks = this.add.group();
        this.fuels = this.add.group();
        this.blocks.runChildUpdate = true;
        this.fuels.runChildUpdate = true;

        this.timeMultipler = 1;
        let lastEnemySpawn = new Phaser.Math.Vector2(0,0);
        this.gameOver = false;

        this.fuelBar = this.add.nineslice(config.width - 10 - 320, 10, 'bar', 0, 320, 40).setOrigin(0,0);
        this.fuelProgress = this.add.nineslice(config.width - 320, 20, 'barProgress', 0, 300, 20).setOrigin(0,0);
        this.add.image(config.width - 320 - 64, -3, 'battery').setOrigin(0);


        let scoreConfig = {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#FFFFFF',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
        }

        this.engineText = this.add.text(10, 40, `Engine Level: ${this.player.engineLevel}`, scoreConfig);
        this.scoreText = this.add.text(10, 20, `Score: 0`, scoreConfig);

        //this.cameras.main.startFollow(this.player, false, 1, 0, -100);
        this.cameras.main.setDeadzone(200, 200);
        this.cameras.main.setBackgroundColor();

        console.log("play created")
        console.log(`HP: ${this.HP} EXP: ${this.EXP}`)

        this.enemyTimer = this.time.addEvent({
            delay: 500,
            loop: true,
            callback: () => {
                let block = new Block(this, 900, Phaser.Math.Between(0, config.height), 'block', 0,
                    this.player);
                lastEnemySpawn = new Phaser.Math.Vector2(block.x,block.y);
                this.blocks.add(block);
            }
        })

        this.fuelTimer = this.time.addEvent({
            delay: 750,
            loop: true,
            callback: () => {
                let fuel = new Fuel(this, 900, Phaser.Math.Between(0, config.height), 'fuel', 0,
                    this.player);
                this.fuels.add(fuel);
            }
        })

        this.scoreTimer = this.time.addEvent({
            delay: 30000,
            loop: true,
            callback: () => {
                this.timeMultipler += 0.01;
            }
        })

        KEY_ENGINE_UP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        KEY_ENGINE_DOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        KEY_RESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        KEY_MENU = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);


        this.sound.play('mainLoop', {
            volume: .5,
            rate: 1,
            loop: true,
            delay: 0});

        this.physics.add.collider(this.player, this.blocks, (player, block) => {
            if (this.player.hit.contains(block)) {
                return;
            }
            block.anims.stop()
            block.anims.play('block-hurt')
            this.player.fuel -= 250 * this.timeMultipler;

            this.sound.play('crash', {
                volume: .1,
                rate: 1.2,
                loop: false,
                delay: 0});

            this.player.hit.add(block)
        })
        this.physics.add.collider(this.player, this.fuels, (player, fuel) => {
            fuel.destroy()
            this.player.fuel += PLAYER_MAX_FUEL * 0.1;

            if (this.player.fuel > PLAYER_MAX_FUEL) {
                this.player.fuel = PLAYER_MAX_FUEL
            }

            this.sound.play('collect', {
                volume: .65,
                rate: 1.2,
                loop: false,
                delay: 0});
        })


        this.player.on('destroy', () => {
            this.enemyTimer.remove()
            this.fuelTimer.remove()
            this.scoreTimer.remove()
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5)
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (Space) to Restart or (R) for Menu', scoreConfig).setOrigin(0.5)
            this.gameOver = true;
        })
    }

    update() {
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(KEY_RESET)) {
            this.sound.stopAll()
            this.scene.restart()
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(KEY_RESET)) {
            this.sound.stopAll()
            this.scene.start('mainMenu')
        }

        if (!this.gameOver) {
            this.player.update(this.input)
            this.player.fuel -= GAME_SPEED[4 - this.player.engineLevel] * this.timeMultipler;
        }

        this.background.x -= GAME_SPEED[this.player.engineLevel];
        this.background2.x -= GAME_SPEED[this.player.engineLevel];

        // console.log(this.player.fuel / PLAYER_MAX_FUEL);
        this.fuelProgress.width = 300 * (this.player.fuel / PLAYER_MAX_FUEL);

        this.engineText.setText(`Engine Level: ${this.player.engineLevel}`);
        this.scoreText.setText(`Score: ${this.player.score}`);

        if (Phaser.Input.Keyboard.JustDown(KEY_ENGINE_UP)) {
            this.player.engineLevel += 1;

            if (this.player.engineLevel > 4) {
                this.player.engineLevel = 4;
                return;
            }

            this.sound.play('engine', {
                volume: 1,
                rate: ENGINE_RATE[this.player.engineLevel],
                loop: false,
                delay: 0});
        }
        else if (Phaser.Input.Keyboard.JustDown(KEY_ENGINE_DOWN)) {
            this.player.engineLevel -= 1;

            if (this.player.engineLevel < 0) {
                this.player.engineLevel = 0;
                return;
            }

            this.sound.play('engine', {
                volume: 1.2,
                rate: ENGINE_RATE[this.player.engineLevel],
                loop: false,
                delay: 0});
        }


        if (this.background.x <= -800) {
            this.background.x = 800;
        }

        if (this.background2.x <= -800) {
            this.background2.x = 800;
        }
    }
}

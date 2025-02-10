class MainMenu extends Phaser.Scene {
    constructor() {
        super("mainMenu");

    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('packet', 'packet.png');
        this.load.image('background', 'background.png');
        this.load.image('flame', 'flame.png');
        this.load.spritesheet('block', 'block.png', {
            frameWidth: 64,
            frameHeight: 64,
        })
        this.load.image('bar', 'bar.png');
        this.load.image('barProgress', 'barProgress.png');
        this.load.image('battery', 'battery-pack.png');
        this.load.image('fuel', 'battery.png');

        this.load.path = './assets/sounds/'
        this.load.audio('mainLoop', 'Blank.mp3');
        this.load.audio('crash', 'crash.mp3');
        this.load.audio('collect', 'collect.mp3');
        this.load.audio('start', 'start.mp3');
        this.load.audio('engine', 'engine.mp3');
    }

    init() {
        console.log("init")
        this.HP = 100
        this.EXP = 0
        console.log(`HP: ${this.HP} EXP: ${this.EXP}`)
    }

    create() {
        console.log("scene created")

        this.background = this.add.sprite(0, 0,"background").setOrigin(0, 0);
        this.background2 = this.add.sprite(800, 0,"background").setOrigin(0, 0);

        this.anims.create({
            key: 'block',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('block', { start: 0, end: 7 }),
        })

        this.anims.create({
            key: 'block-hurt',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('block', { start: 8, end: 15 }),
        })

        let playerStats = {
            HP: this.HP,
            EXP: this.EXP,
        }

        KEY_START = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        let titleConfig = {
            fontFamily: 'Courier',
            fontSize: '40px',
            color: '#FFDDBB',
            align: 'left',
            bold: true,
            padding: {
                top: 5,
                bottom: 5,
            },
        }

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

        let creditConfig = {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#FFFFFF',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
        }

        this.add.text(game.config.width/2, game.config.height/2 - 200,
            'PACKET SENT', titleConfig).setOrigin(0.5)

        this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (Space) to start', scoreConfig).setOrigin(0.5)
        this.add.text(game.config.width/2, game.config.height/2 - 128,
            'Control your ship by holding (Mouse1), Change your engine levels using (W) and (S)', scoreConfig).setOrigin(0.5)
        this.add.text(game.config.width/2, game.config.height/2 - 64,
            'Going fast will use less fuel, so choose your speed wisely!', scoreConfig).setOrigin(0.5)
        this.add.text(game.config.width/2, game.config.height/2 - 32,
            'Your ship will blow up once you run out of fuel', scoreConfig).setOrigin(0.5)
        this.add.text(game.config.width/2, game.config.height/2 - 96,
            'Dont hit the blocks and collect the fuel cells to keep going', scoreConfig).setOrigin(0.5)
        this.add.text(game.config.width/2, game.config.height/2,
            'As time goes on, blocks will take more fuel, and fuel drains faster', scoreConfig).setOrigin(0.5)

        // credits
        this.add.text(10, game.config.height - 32,
            'CREDITS:   Music: Blank - Disfigure,  Sounds: All by me,  Art: All by me,  Programming: All by me', creditConfig).setOrigin(0)
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(KEY_START)) {
            this.sound.play('start', {
                volume: 1,
                rate: 1,
                loop: false,
                delay: 0});

            this.scene.start("playScene")

        }

        this.background.x -= 4;
        this.background2.x -= 4;

        if (this.background.x <= -800) {
            this.background.x = 800;
        }

        if (this.background2.x <= -800) {
            this.background2.x = 800;
        }
    }
}

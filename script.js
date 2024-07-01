class Scene1 extends Phaser.Scene {
    constructor() {
        super({
            key: 'scene1'
        });
    }

    blonde;
    brunette;
    music;

    preload() {
        this.load.image('fondo', 'img/menu.png');
        this.load.spritesheet('blonde', 'img/blondeIdleUpscaled.png', { frameWidth: 333, frameHeight: 667 });
        this.load.spritesheet('brunette', 'img/brunetteIdleUpscaled.png', { frameWidth: 333, frameHeight: 667 });
        this.load.audio('backgroundMusic', 'img/pingpongost.mp3');  // Cargar el archivo de audio
    }

    create() {
        this.add.image(500, 250, 'fondo');

        // Reproducir la música de fondo en bucle
        this.music = this.sound.add('backgroundMusic', {
            loop: true,
            volume: 0.3
        });
        this.music.play();

        this.input.keyboard.on('keydown-SPACE', this.iniciarJuego, this);

        this.blonde = this.add.sprite(160, 355, 'blonde');

        this.anims.create({
            key: 'blondeIdleAnim',
            frames: this.anims.generateFrameNumbers('blonde', { start: 0, end: 2 }),
            frameRate: 4,
            repeat: -1
        });

        this.brunette = this.add.sprite(840, 355, 'brunette');
        this.brunette.scaleX = -1;  // Voltear horizontalmente el sprite

        this.anims.create({
            key: 'brunetteIdleAnim',
            frames: this.anims.generateFrameNumbers('brunette', { start: 0, end: 2 }),
            frameRate: 4,
            repeat: -1
        });

        this.blonde.anims.play('blondeIdleAnim');
        this.brunette.anims.play('brunetteIdleAnim');

        this.add.text(15, 475, 'Desarrollado por: Sebastian Gamarra', { fontSize: '20px', fill: '#fff' });
    }

    iniciarJuego() {
        this.scene.start('scene2');
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
class Scene2 extends Phaser.Scene {
    constructor() {
        super('scene2');
    }

    blondeScore = 0;
    brunetteScore = 0;
    blondePlayer;
    blondeRight = true;
    blondeLeft = false;
    brunetteRight = false;
    brunetteLeft = true;
    brunettePlayer;
    wall;
    cursors;
    ground;
    ball;
    halfgroundLeft;
    halfgroundRight;
    blondeScoreText;
    brunetteScoreText;
    pongSound;

    preload() {
        this.load.image('background', 'img/background.png');
        this.load.image('ground', 'img/emptyGround.png');
        this.load.image('wall', 'img/emptyWall.png');
        this.load.image('ball', 'img/ball.png');
        this.load.image('halfground', 'img/halfground.png');
        this.load.spritesheet('blondePlayer', 'img/blonde_spriteSheet.png', { frameWidth: 50, frameHeight: 118 });
        this.load.spritesheet('brunettePlayer', 'img/brunette_spriteSheet.png', { frameWidth: 50, frameHeight: 118 });
        this.load.audio('pong', 'img/ping-pong-ball.mp3');  // Asegúrate de que la ruta sea correcta
    }

    create() {
        this.add.image(500, 250, 'background');

        this.ground = this.physics.add.staticImage(500, 460, 'ground').refreshBody();
        this.halfgroundLeft = this.physics.add.staticImage(250, 470, 'halfground').refreshBody();
        this.halfgroundRight = this.physics.add.staticImage(750, 470, 'halfground').refreshBody();
        this.wall = this.physics.add.staticImage(500, 250, 'wall').refreshBody();

        // Cargar el sonido
        this.pongSound = this.sound.add('pong');

        // blonde
        this.blondePlayer = this.physics.add.sprite(250, 330, 'blondePlayer');
        this.blondePlayer.setBounce(0.2);
        this.blondePlayer.setCollideWorldBounds(true);

        this.physics.add.collider(this.blondePlayer, this.ground);
        this.physics.add.collider(this.blondePlayer, this.wall);

        this.anims.create({
            key: 'blonderunR',
            frames: this.anims.generateFrameNumbers('blondePlayer', { start: 3, end: 8 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'blonderunL',
            frames: this.anims.generateFrameNumbers('blondePlayer', { start: 9, end: 14 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'blondeidleR',
            frames: this.anims.generateFrameNumbers('blondePlayer', { start: 0, end: 2 }),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: 'blondeidleL',
            frames: this.anims.generateFrameNumbers('blondePlayer', { start: 15, end: 17 }),
            frameRate: 4,
            repeat: -1
        });

        // brunette
        this.brunettePlayer = this.physics.add.sprite(750, 330, 'brunettePlayer');
        this.brunettePlayer.setCollideWorldBounds(true);

        this.physics.add.collider(this.brunettePlayer, this.ground);
        this.physics.add.collider(this.brunettePlayer, this.wall);

        this.anims.create({
            key: 'brunetterunR',
            frames: this.anims.generateFrameNumbers('brunettePlayer', { start: 3, end: 8 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'brunetterunL',
            frames: this.anims.generateFrameNumbers('brunettePlayer', { start: 9, end: 14 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'brunetteidleR',
            frames: this.anims.generateFrameNumbers('brunettePlayer', { start: 0, end: 2 }),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: 'brunetteidleL',
            frames: this.anims.generateFrameNumbers('brunettePlayer', { start: 15, end: 17 }),
            frameRate: 4,
            repeat: -1
        });

        // ball        
        this.ball = this.physics.add.image(500, 100, 'ball')
            .setVelocity(200, 0)
            .setBounce(1, 1)
            .setCollideWorldBounds(true);

        // Evento para la colisión con los límites del mundo
        this.ball.body.onWorldBounds = true;
        this.physics.world.on('worldbounds', (body) => {
            if (body.gameObject === this.ball) {
                this.pongSound.play();
            }
        });

        this.physics.add.collider(this.ball, this.ground, this.playPongSound, null, this);
        this.physics.add.collider(this.ball, this.blondePlayer, this.hitBlondePlayer, null, this);
        this.physics.add.collider(this.ball, this.brunettePlayer, this.hitBrunettePlayer, null, this);
        this.physics.add.collider(this.ball, this.halfgroundLeft, this.hitHalfGroundLeft, null, this);
        this.physics.add.collider(this.ball, this.halfgroundRight, this.hitHalfGroundRight, null, this);

        // controles
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,A,S,D');

        // Puntuaciones
        this.blondeScoreText = this.add.text(16, 16, 'Blonde: 0', { fontSize: '32px', fill: '#FFF' });
        this.brunetteScoreText = this.add.text(755, 16, 'Brunette: 0', { fontSize: '32px', fill: '#FFF' });
    }

    playPongSound() {
        this.pongSound.play();
    }

    hitBlondePlayer(ball, blondePlayer) {
        ball.setVelocityX(ball.body.velocity.x + 180);
        this.playPongSound();
    }

    hitBrunettePlayer(ball, brunettePlayer) {
        ball.setVelocityX(ball.body.velocity.x - 180);
        this.playPongSound();
    }

    hitHalfGroundLeft(ball, halfgroundLeft) {
        this.brunetteScore += 1;
        this.brunetteScoreText.setText('Brunette: ' + this.brunetteScore);
        ball.setPosition(500, 100);
        ball.setVelocity(200, 0);
        this.playPongSound();

        if (this.brunetteScore === 3) {
            this.scene.start('winnerScene', { winner: 'Brunette' });
        }
    }

    hitHalfGroundRight(ball, halfgroundRight) {
        this.blondeScore += 1;
        this.blondeScoreText.setText('Blonde: ' + this.blondeScore);
        ball.setPosition(500, 100);
        ball.setVelocity(200, 0);
        this.playPongSound();

        if (this.blondeScore === 3) {
            this.scene.start('winnerScene', { winner: 'Blonde' });
        }
    }

    update() {
        if (this.wasd.A.isDown) {
            this.blondePlayer.setVelocityX(-180);

            this.blondePlayer.anims.play('blonderunL', true);

            this.blondeLeft = true;
            this.blondeRight = false;
        } else if (this.wasd.D.isDown) {
            this.blondePlayer.setVelocityX(180);

            this.blondePlayer.anims.play('blonderunR', true);

            this.blondeLeft = false;
            this.blondeRight = true;
        } else {
            this.blondePlayer.setVelocityX(0);

            if (this.blondeLeft) {
                this.blondePlayer.anims.play('blondeidleL', true);
            } else if (this.blondeRight) {
                this.blondePlayer.anims.play('blondeidleR', true);
            }
        }

        if (this.cursors.left.isDown) {
            this.brunettePlayer.setVelocityX(-180);

            this.brunettePlayer.anims.play('brunetterunL', true);

            this.brunetteLeft = true;
            this.brunetteRight = false;
        } else if (this.cursors.right.isDown) {
            this.brunettePlayer.setVelocityX(180);

            this.brunettePlayer.anims.play('brunetterunR', true);

            this.brunetteLeft = false;
            this.brunetteRight = true;
        } else {
            this.brunettePlayer.setVelocityX(0);

            if (this.brunetteLeft) {
                this.brunettePlayer.anims.play('brunetteidleL', true);
            } else if (this.brunetteRight) {
                this.brunettePlayer.anims.play('brunetteidleR', true);
            }
        }

        this.ball.rotation = this.ball.body.angle;
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
class WinnerScene extends Phaser.Scene {
    constructor() {
        super('winnerScene');
    }

    create(data) {
        this.add.text(500, 250, `${data.winner} wins!`, { fontSize: '64px', fill: '#FFF' }).setOrigin(0.5);
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////

const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 500,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400 },
            debug: false
        }
    },
    scene: [Scene1, Scene2, WinnerScene]
};

const game = new Phaser.Game(config);
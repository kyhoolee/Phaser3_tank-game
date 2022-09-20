import Phaser from 'phaser'
import spritesTexture from './assets/allSprites_retina.png'
import spritesAtlas from './assets/allSprites_retina.xml'
import tracksTexture from './assets/tracks.png'
import craterTexture from './assets/crater.png'
import wall1Texture from './assets/wall1.png'
import wall2Texture from './assets/wall2.png'
import wall3Texture from './assets/wall3.png'
import wall4Texture from './assets/wall4.png'
import wall5Texture from './assets/wall5.png'
import engineAudio from './audio/engine1.mp3'
import shotAudio from './audio/shot2.mp3'
import Maze from './objects/maze'
import Tank from './objects/tank'
import Barrel from './objects/barrel'
import Crate from './objects/crate'

class TankGame extends Phaser.Scene {
    constructor(config) {
        super(config)
    }

    preload() {
        this.load.atlasXML('sprites', spritesTexture, spritesAtlas)
        this.load.image('tracks', tracksTexture)
        this.load.image('crater', craterTexture)
        this.load.image('wall1', wall1Texture)
        this.load.image('wall2', wall2Texture)
        this.load.image('wall3', wall3Texture)
        this.load.image('wall4', wall4Texture)
        this.load.image('wall5', wall5Texture)
        this.load.audio('engine', engineAudio)
        this.load.audio('shot', shotAudio)
    }

    create() {
        this.sound.unlock()

        this.anims.create({
            key: 'explosion',
            frames: this.anims.generateFrameNames('sprites', {
                prefix: 'explosion',
                start: 1,
                end: 5,
                suffix: '.png',
            }),
            frameRate: 24,
            repeat: 0,
        })

        const tileSize = {
            x: 200,
            y: 200,
        }
        const mazeSize = {
            x: Phaser.Math.RND.between(5, 8),
            y: Phaser.Math.RND.between(3, 5),
        }

        this.cameras.main.setBackgroundColor('#9393bf')
        let margin = 100
        this.cameras.main.setZoom(Math.min((this.cameras.main.width - margin) / (mazeSize.x * tileSize.x), (this.cameras.main.height - margin) / (mazeSize.y * tileSize.y)))
        this.cameras.main.centerOn(mazeSize.x * tileSize.x / 2, mazeSize.y * tileSize.y / 2)

        let tracksResolutionDivider = 0.75 / this.cameras.main.zoom
        this.floorRenderTexture = this.add.renderTexture(0, 0, mazeSize.x * tileSize.x / tracksResolutionDivider, mazeSize.y * tileSize.y / tracksResolutionDivider)
        this.floorRenderTexture.setScale(tracksResolutionDivider)

        this.maze = new Maze(this, mazeSize.x, mazeSize.y, tileSize.x, tileSize.y)
        this.add.existing(this.maze)

        const spawnTank = (color = 'blue', inputKeys) => {
            const tankSpawn = {
                x: Phaser.Math.RND.between(0, mazeSize.x - 1) * tileSize.x + tileSize.x * 0.5,
                y: Phaser.Math.RND.between(0, mazeSize.y - 1) * tileSize.y + tileSize.y * 0.5,
            }

            const tank = new Tank(this, tankSpawn.x, tankSpawn.y, color, inputKeys)
            tank.setAngle(Phaser.Math.RND.angle())
            this.add.existing(tank)
        }

        const spawnBarrel = () => {
            const barrelSpawn = {
                x: Phaser.Math.RND.between(0, mazeSize.x - 1) * tileSize.x + tileSize.x * 0.5
                    + Phaser.Math.RND.between(-tileSize.x * 0.33, tileSize.x * 0.33),
                y: Phaser.Math.RND.between(0, mazeSize.y - 1) * tileSize.y + tileSize.y * 0.5
                    + Phaser.Math.RND.between(-tileSize.y * 0.33, tileSize.y * 0.33),
            }

            const barrel = new Barrel(this, barrelSpawn.x, barrelSpawn.y)
            barrel.setAngle(Phaser.Math.RND.angle())
            this.add.existing(barrel)
        }

        const spawnCrate = () => {
            const crateSpawn = {
                x: Phaser.Math.RND.between(0, mazeSize.x - 1) * tileSize.x + tileSize.x * 0.5,
                y: Phaser.Math.RND.between(0, mazeSize.y - 1) * tileSize.y + tileSize.y * 0.5,
            }

            const crate = new Crate(this, crateSpawn.x, crateSpawn.y)
            this.add.existing(crate)
        }

        // spawnTank('red', {
        //     up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        //     left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        //     down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        //     right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        //     fire: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT),
        // })
        spawnTank('blue', {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
            fire: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
        })

        for (let i = 0; i < Math.sqrt(mazeSize.x * mazeSize.y) + Phaser.Math.RND.between(-2, 3); i++) {
            spawnBarrel()
        }

        spawnCrate()

        this.input.keyboard.addKey('r').on('down', () => {
            this.input.keyboard.removeAllKeys()
            this.scene.restart()
        })
    }
}

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'matter',
        matter: {
            gravity: {y: 0},
            // debug: {
            //     showBody: true,
            //     showStaticBody: true,
            //     showVelocity: true,
            //     showCollisions: true,
            //     showAxes: true,
            //     showPositions: true,
            //     showAngleIndicator: true,
            // },
        },
    },
    parent: 'tank-game',
    scene: TankGame,
}

const game = new Phaser.Game(config)

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
import explosionAudio from './audio/explosion1.mp3'
import ricochetAudio from './audio/ping.mp3'
import airAudio from './audio/noise.mp3'
import collectAudio from './audio/equip.mp3'
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
        this.load.audio('explosion', explosionAudio)
        this.load.audio('ricochet', ricochetAudio)
        this.load.audio('air', airAudio)
        this.load.audio('collect', collectAudio)
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

        spawnTank('red', {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            fire: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
        })
        spawnTank('blue', {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
            fire: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT),
        })

        for (let i = 0; i < Math.pow(mazeSize.x * mazeSize.y, 0.7) + Phaser.Math.RND.between(-2, 3); i++) {
            spawnBarrel()
        }

        for (let i = 0; i < Math.pow(mazeSize.x * mazeSize.y, 0.2); i++) {
            spawnCrate()
        }

        const floorDecal = this.add.rectangle(0, 0, 20, 20, 0x000000, 0.1)
        for (let i = 0; i < mazeSize.x * mazeSize.y * 3; i++) {
            floorDecal.setPosition(Phaser.Math.RND.realInRange(0, mazeSize.x * tileSize.x), Phaser.Math.RND.realInRange(0, mazeSize.y * tileSize.y))
            floorDecal.setAngle(Phaser.Math.RND.angle())
            floorDecal.setScale(Phaser.Math.RND.between(1, 5))
            floorDecal.setAlpha(Phaser.Math.RND.realInRange(0, 0.5))
            this.floorRenderTexture.draw(floorDecal)
        }
        floorDecal.destroy()

        this.input.keyboard.addKey('r').on('down', () => {
            this.input.keyboard.removeAllKeys()
            this.sound.stopAll()
            this.tweens.killAll()
            this.scene.restart()
        })
    }
}

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    pixelArt: true,
    antialias: true,
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

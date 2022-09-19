import Phaser from 'phaser'
import spritesTexture from './assets/allSprites_retina.png'
import spritesAtlas from './assets/allSprites_retina.xml'
import tracksTexture from './assets/tracks.png'
import craterTexture from './assets/crater.png'
import Maze from './objects/maze'
import Tank from './objects/tank'
import Barrel from './objects/barrel'

class TankGame extends Phaser.Scene {
    constructor(config) {
        super(config)
    }

    preload() {
        this.load.atlasXML('sprites', spritesTexture, spritesAtlas)
        this.load.image('tracks', tracksTexture)
        this.load.image('crater', craterTexture)
    }

    create() {
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
        this.tracksRenderTexture = this.add.renderTexture(0, 0, mazeSize.x * tileSize.x / tracksResolutionDivider, mazeSize.y * tileSize.y / tracksResolutionDivider)
        this.tracksRenderTexture.setScale(tracksResolutionDivider)

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

        for (let i = 0; i < 100; i++) {
            spawnBarrel()
        }

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

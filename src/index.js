import Phaser from 'phaser'
import spritesTexture from './assets/allSprites_retina.png'
import spritesAtlas from './assets/allSprites_retina.xml'
import tilesTexture from './assets/terrainTiles_retina.png'
import tracksTexture from './assets/tracks.png'
import Maze from './objects/maze'
import Tank from './objects/tank'

class TankGame extends Phaser.Scene {
    constructor(config) {
        super(config)
    }

    preload() {
        this.load.atlasXML('sprites', spritesTexture, spritesAtlas)
        this.load.image('tiles', tilesTexture)
        this.load.image('tracks', tracksTexture)
    }

    create() {
        const atlasTexture = this.textures.get('sprites')
        const sprites = atlasTexture.getFrameNames()

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
            x: Phaser.Math.RND.between(3, 8),
            y: Phaser.Math.RND.between(3, 8),
        }

        let tracksResolutionDivider = 2
        this.tracksRenderTexture = this.add.renderTexture(0, 0, mazeSize.x * tileSize.x / tracksResolutionDivider, mazeSize.y * tileSize.y / tracksResolutionDivider)
        this.tracksRenderTexture.setScale(tracksResolutionDivider)

        this.maze = new Maze(this, mazeSize.x, mazeSize.y, tileSize.x, tileSize.y)
        this.add.existing(this.maze)

        const tankSpawn = {
            x: Phaser.Math.RND.between(0, mazeSize.x - 1) * tileSize.x + tileSize.x * 0.5,
            y: Phaser.Math.RND.between(0, mazeSize.y - 1) * tileSize.y + tileSize.y * 0.5,
        }

        this.tank = new Tank(this, tankSpawn.x, tankSpawn.y)
        this.tank.setAngle(Phaser.Math.RND.angle())
        this.add.existing(this.tank)

        this.cameras.main.setBackgroundColor('#9393bf')
        let margin = 100
        this.cameras.main.setZoom(Math.min((this.cameras.main.width - margin) / (mazeSize.x * tileSize.x), (this.cameras.main.height - margin) / (mazeSize.y * tileSize.y)))
        this.cameras.main.centerOn(mazeSize.x * tileSize.x / 2, mazeSize.y * tileSize.y / 2)

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

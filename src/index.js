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

        const tileSize = 200
        const mazeSize = {x: 16, y: 12}

        this.tracksRenderTexture = this.add.renderTexture(0, 0, mazeSize.x * tileSize, mazeSize.y * tileSize)
        this.tracksRenderTexture.alpha = 0.4

        this.maze = new Maze(this, mazeSize.x, mazeSize.y, tileSize, tileSize)

        this.tank = new Tank(this, 100, 100)

        this.cameras.main.zoom = 0.5
        this.cameras.main.setBackgroundColor('#9393bf')

        this.input.keyboard.addKey('r').on('down', () => {
            this.scene.restart()
        })
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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

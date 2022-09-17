import Phaser from 'phaser'
import spritesTexture from './assets/allSprites_retina.png'
import spritesAtlas from './assets/allSprites_retina.xml'
import tilesTexture from './assets/terrainTiles_retina.png'
import Maze from './objects/maze'
import Tank from './objects/tank'

class TankGame extends Phaser.Scene {
    constructor() {
        super()
    }

    preload() {
        this.load.atlasXML('sprites', spritesTexture, spritesAtlas)
        this.load.image('tiles', tilesTexture)
    }

    create() {
        const atlasTexture = this.textures.get('sprites')
        const sprites = atlasTexture.getFrameNames()

        this.maze = new Maze(this, 16, 12, 200, 200)

        this.tank = new Tank(this, 25, 25)

        this.cameras.main.zoom = 0.5
        this.cameras.main.setBackgroundColor('#9393bf')
    }
}

const config = {
    type: Phaser.AUTO,
    width: 1400,
    height: 700,
    physics: {
        default: 'matter',
        matter: {
            fps: 60,
            gravity: {y: 0},
            debug: {
                showBody: true,
                showStaticBody: true,
                showVelocity: true,
                showCollisions: true,
                showAxes: true,
                showPositions: true,
                showAngleIndicator: true,
            },
        },
    },
    parent: 'tank-game',
    scene: TankGame,
}

const game = new Phaser.Game(config)

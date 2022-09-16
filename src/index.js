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

        this.maze = new Maze(this, 10, 10, 50, 50)

        this.tank = new Tank(this, 25, 25)
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'matter',
        matter: {
            fps: 60,
            gravity: {y: 100},
            debug: true,
        },
    },
    parent: 'tank-game',
    scene: TankGame,
}

const game = new Phaser.Game(config)

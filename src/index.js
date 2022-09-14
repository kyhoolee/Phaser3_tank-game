import Phaser from 'phaser';
import spritesTexture from './assets/allSprites_retina.png';
import spritesAtlas from './assets/allSprites_retina.xml';


class MyGame extends Phaser.Scene {
    constructor() {
        super()
    }

    preload() {
        this.load.atlasXML('sprites', spritesTexture, spritesAtlas);
    }

    create() {
        const atlasTexture = this.textures.get('sprites');

        const frames = atlasTexture.getFrameNames();

        for (let i = 0; i < frames.length; i++) {
            const x = Phaser.Math.Between(0, 800);
            const y = Phaser.Math.Between(0, 600);

            this.add.image(x, y, 'sprites', frames[i]);
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'tank-game',
    scene: MyGame
};

const game = new Phaser.Game(config);

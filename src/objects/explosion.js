export default class Explosion extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y) {
        super(scene.matter.world, x, y, 'sprites', 'explosion1.png', {
            isSensor: true,
            isStatic: true,
        })
        this.anims.play('explosion')
        this.once('animationcomplete', () => {
            this.destroy()
        })
    }
}
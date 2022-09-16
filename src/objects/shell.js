import Phaser from 'phaser'

export default class Shell extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, angle) {
        super(scene.matter.world, x, y, 'sprites', 'bulletDark1_outline.png', {
            angle: Phaser.Math.DegToRad(angle),
            frictionAir: 0.004,
        })
        this.thrustLeft(0.02)
    }
}
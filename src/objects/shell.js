import Phaser from 'phaser'
import {Pillar, Wall} from './maze'

export default class Shell extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, angle) {
        super(scene.matter.world, x, y, 'sprites', 'bulletDark1_outline.png', {
            angle: Phaser.Math.DegToRad(angle),
            frictionAir: 0.004,
        })
        this.setBounce(1)
        this.thrustLeft(0.02)
        this.setOnCollide((data) => {
            if (data.bodyA.gameObject instanceof Wall ||
                data.bodyB.gameObject instanceof Pillar) {
                console.log(data.collision.normal, data.collision.tangent)
            }
        })
    }
}
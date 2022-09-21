import Phaser from 'phaser'
import {Pillar, Wall} from './maze'
import Explosion from './explosion'

class Spark extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'sprites', 'explosionSmoke3.png')
        this.setScale(0.25)
        this.setAngle(Phaser.Math.RND.angle())
        this.scene.tweens.add({
            targets: this,
            angle: Phaser.Math.RND.angle(),
            duration: 50,
            ease: 'Quad.easeIn',
            onComplete: () => {
                this.destroy()
            },
        })
    }
}

export default class Shell extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, angle, initialVelocity = new Phaser.Math.Vector2(0, 0)) {
        super(scene.matter.world, x, y, 'sprites', 'bulletDark1_outline.png', {
            angle: Phaser.Math.DegToRad(angle),
            frictionAir: 0,
            friction: 0,
            mass: 5,
            isSensor: true,
        })
        this.birthTime = scene.time.now
        this.lastCollision = 0
        this.setFixedRotation()
        this.isBouncing = false
        this.setVelocity(initialVelocity.x, initialVelocity.y)
        this.thrustLeft(0.05)
        this.setOnCollide((data) => {
                if (scene.time.now - this.birthTime < 50) {
                    if (this.scene) this.explode()
                }
                if (data.bodyA.gameObject instanceof Pillar || data.bodyA.gameObject instanceof Wall) {
                    if (!this.isBouncing && data.timeCreated - this.lastCollision > 1 && this.body) {
                        this.isBouncing = true
                        const normal = new Phaser.Math.Vector2(data.collision.normal)
                        const velocity = new Phaser.Math.Vector2(this.body.velocity)
                        const dot = normal.dot(velocity)
                        const reflected = velocity.subtract(normal.scale(2 * dot))
                        this.setVelocity(reflected.x, reflected.y)
                        this.setAngle(Phaser.Math.RadToDeg(Math.atan2(this.body.velocity.y, this.body.velocity.x)) + 90)

                        const spark = new Spark(this.scene, this.x, this.y)
                        scene.add.existing(spark)

                        scene.sound.play('ricochet', {
                            volume: 0.25,
                            detune: Phaser.Math.RND.realInRange(-100, 100),
                        })
                    }
                    this.lastCollision = data.timeCreated
                } else {
                    if (this.scene) this.explode()
                }
            },
        )

        this.setOnCollideEnd((data) => {
            if (data.bodyA.gameObject instanceof Pillar || data.bodyA.gameObject instanceof Wall) {
                this.isBouncing = false
            }
        })

        this.airSound = scene.sound.add('air', {
            loop: true,
            volume: 0.4,
            detune: Phaser.Math.RND.realInRange(-100, 100),
        })
        this.airSound.play()
    }

    explode() {
        let explosion = new Explosion(this.scene, this.x, this.y)
        this.scene.add.existing(explosion)
        this.airSound.stop()
        this.destroy()
    }
}
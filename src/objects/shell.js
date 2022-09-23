import Phaser from 'phaser'
import {Pillar, Wall} from './maze'
import Explosion from './explosion'
import Trail from "./trail"

class Spark extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'atlas', 'explosionSmoke3')
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
    constructor(scene, x, y, angle, initialVelocity = new Phaser.Math.Vector2(0, 0), speed = 1) {
        super(scene.matter.world, x, y, 'atlas', 'bulletDark1_outline', {
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
        this.speed = speed
        this.thrustLeft(0.05 * speed)
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

                        scene.sound.play('ping', {
                            volume: 0.25,
                            detune: Phaser.Math.RND.realInRange(-200, 200),
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

        this.trail = new Trail(scene)
        scene.add.existing(this.trail)

        this.airSound = scene.sound.add('noise', {
            loop: true,
            volume: 3,
            detune: Phaser.Math.RND.realInRange(-100, 100),
        })
        this.airSound.play()
    }

    preUpdate(time, delta) {
        this.trail.addPoint(this.x, this.y, 1000 / this.speed)
        const dist = Phaser.Math.Clamp(this.distanceToNearestTank() / 300, 0, 0.8)
        this.airSound.rate = Math.sqrt(1 - dist)
        this.airSound.volume = 3 * (1 - dist)
    }

    distanceToNearestTank() {
        let distance = 100000
        this.scene.tanks.forEach((tank) => {
            if (tank !== this) {
                let d = Phaser.Math.Distance.Between(this.x, this.y, tank.x, tank.y)
                if (d < distance) {
                    distance = d
                }
            }
        })
        return distance
    }

    explode() {
        let explosion = new Explosion(this.scene, this.x, this.y)
        this.scene.add.existing(explosion)
        this.airSound.stop()
        this.trail.destroy()
        this.destroy()
    }
}
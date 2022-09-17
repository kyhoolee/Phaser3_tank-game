import Shell from './shell'

export class TankBody extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'sprites', 'tankBody_blue.png')
        this.setOrigin(0.5, 0.5)
    }
}

export class TankTurret extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y)
        this.barrel = scene.add.sprite(0, 0, 'sprites', 'tankBlue_barrel1.png')
        this.barrel.setOrigin(0.5, 0)
        this.add(this.barrel)
        this.knockback = 0
        scene.sys.updateList.add(this)
    }

    fire() {
        this.knockback = 15
        this.y = -this.knockback
        let flash = new MuzzleFlash(this.scene, 0, this.barrel.height)
        this.add(flash)
    }

    preUpdate(time, delta) {
        if (this.knockback !== 0) {
            this.knockback = Math.max(0, this.knockback - delta * 0.03)
        }
        this.y = -this.knockback
        console.log(this.knockback)
    }
}

export class MuzzleFlash extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'sprites', 'shotLarge.png')
        this.setOrigin(0.5, 0)
        scene.time.addEvent({
            delay: 75,
            callback: () => this.destroy(),
        })
    }
}

export default class Tank extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y)

        this.tankBody = new TankBody(scene, 0, 0)
        this.add(this.tankBody)

        this.tankTurret = new TankTurret(scene, 0, 0)
        this.add(this.tankTurret)

        this.setSize(this.tankBody.displayWidth - 10, this.tankBody.displayHeight - 20)

        this.movementKeys = scene.input.keyboard.createCursorKeys()
        let fireKey = scene.input.keyboard.addKey('space')
        fireKey.on('down', (event) => {
            const fireOffset = new Phaser.Math.Vector2().setToPolar(this.rotation + this.tankTurret.rotation, this.tankTurret.barrel.height).rotate(Phaser.Math.PI2 / 4)
            let shell = new Shell(scene, this.x + fireOffset.x, this.y + fireOffset.y, this.angle + this.tankTurret.angle + 180)
            this.scene.add.existing(shell)
            this.tankTurret.fire()
            this.thrustLeft(3)
        })

        scene.matter.add.gameObject(this)
        this.body.frictionAir = 0.1
        this.body.mass = 100
        this.body.friction = 1

        scene.add.existing(this)
    }

    preUpdate(time, delta) {
        let throttle = 0
        let throttleRate = 0.05
        if (this.movementKeys.up.isDown) {
            throttle += throttleRate
        }
        if (this.movementKeys.down.isDown) {
            throttle -= throttleRate
        }
        this.thrustRight(throttle)
        let turn = 0
        let turnRate = 0.1
        if (this.movementKeys.left.isDown) {
            turn -= turnRate
        }
        if (this.movementKeys.right.isDown) {
            turn += turnRate
        }
        this.body.torque = turn
    }
}
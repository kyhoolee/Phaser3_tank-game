export class TankBody extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'sprites', 'tankBody_blue.png')
        this.setOrigin(0.5, 0.5)
        this.setScale(0.25)
    }
}

export class TankTurret extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'sprites', 'tankBlue_barrel1.png')
        this.setOrigin(0.5, 0)
        this.setScale(0.25)
    }
}

export default class Tank extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y)

        this.tankBody = new TankBody(scene, 0, 0)
        this.add(this.tankBody)

        this.tankTurret = new TankTurret(scene, 0, 0)
        this.add(this.tankTurret)

        this.setSize(this.tankBody.displayWidth, this.tankBody.displayHeight)

        scene.matter.add.gameObject(this)

        scene.add.existing(this)
    }
}
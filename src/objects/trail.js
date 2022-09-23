class Point {
    constructor(x, y, time) {
        this.x = x
        this.y = y
        this.time = time
    }
}

export default class Trail extends Phaser.GameObjects.Graphics {
    constructor(scene) {
        super(scene)
        this.points = []
        this.setAlpha(0.15)
    }

    lerp(start, end, amt) {
        return (1 - amt) * start + amt * end
    }

    preUpdate(time, delta) {
        let point
        let index
        this.clear()
        if (this.points.length > 4) {
            this.lineStyle(1, 0xFFFF00, 1.0)
            this.beginPath()
            this.lineStyle(0, 0xFFFF00, 1.0)
            this.moveTo(this.points[0].x, this.points[0].y)
            for (index = 1; index < this.points.length - 4; ++index) {
                point = this.points[index]
                this.lineStyle(
                    this.lerp(0, 20, index / (this.points.length - 4)),
                    ((0xFF & 0x0ff) << 16) | (((this.lerp(index / this.points.length, 0x00, 0xFF) | 0) & 0x0ff) << 8) | (0o00 & 0x0ff),
                    0.5,
                )
                this.lineTo(point.x, point.y)
            }
            let count = 0
            for (index = this.points.length - 4; index < this.points.length; ++index) {
                point = this.points[index]
                this.lineStyle(
                    this.lerp(20, 0, count++ / 4),
                    0xFFFFFF,
                    1,
                )
                this.lineTo(point.x, point.y)
            }
            this.strokePath()
            this.closePath()
        }
        for (index = 0; index < this.points.length; ++index) {
            point = this.points[index]

            point.time -= delta
            if (point.time <= 0) {
                this.points.splice(index, 1)
                index -= 1
            }
        }
    }

    addPoint(x, y, length) {
        this.points.push(new Point(x, y, length))
    }
}
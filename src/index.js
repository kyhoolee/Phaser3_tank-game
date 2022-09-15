import Phaser from 'phaser'
import spritesTexture from './assets/allSprites_retina.png'
import spritesAtlas from './assets/allSprites_retina.xml'
import tilesTexture from './assets/terrainTiles_retina.png'

class Cell {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.walls = [true, true, true, true] // top, right, bottom, left
        this.visited = false
    }

    draw(game, size = 50, color = 0xffffff, width = 3) {
        //draw the cell walls using rectangle
        if (this.walls[0]) {
            game.add.rectangle(this.x * size + size / 2, this.y * size, size, width, color)
        }
        if (this.walls[1]) {
            game.add.rectangle(this.x * size + size, this.y * size + size / 2, width, size, color)
        }
        if (this.walls[2]) {
            game.add.rectangle(this.x * size + size / 2, this.y * size + size, size, width, color)
        }
        if (this.walls[3]) {
            game.add.rectangle(this.x * size, this.y * size + size / 2, width, size, color)
        }
    }
}

class Maze {
    constructor(width, height) {
        this.width = width
        this.height = height
        this.grid = Array.from({length: width},
            (_, x) => Array.from({length: height},
                (_, y) => new Cell(x, y),
            ),
        )
        this.i = 0
    }

    getNeighbours(cell) {
        const neighbours = []
        const {x, y} = cell
        if (y > 0) {
            neighbours.push(this.grid[x][y - 1])
        }
        if (x < this.width - 1) {
            neighbours.push(this.grid[x + 1][y])
        }
        if (y < this.height - 1) {
            neighbours.push(this.grid[x][y + 1])
        }
        if (x > 0) {
            neighbours.push(this.grid[x - 1][y])
        }
        return neighbours
    }

    generate(current) {
        current.visited = true
        let neighbours = this.getNeighbours(current)
        let unvisitedNeighbours = neighbours.filter(n => !n.visited)
        while (unvisitedNeighbours.length > 0) {
            const randomNeighbour = Phaser.Math.RND.pick(unvisitedNeighbours)
            //remove walls between current and randomNeighbour
            if (randomNeighbour.x === current.x) {
                if (randomNeighbour.y < current.y) {
                    current.walls[0] = false
                    randomNeighbour.walls[2] = false
                } else {
                    current.walls[2] = false
                    randomNeighbour.walls[0] = false
                }
            } else {
                if (randomNeighbour.x < current.x) {
                    current.walls[3] = false
                    randomNeighbour.walls[1] = false
                } else {
                    current.walls[1] = false
                    randomNeighbour.walls[3] = false
                }
            }
            this.generate(randomNeighbour)
            neighbours = this.getNeighbours(current)
            unvisitedNeighbours = neighbours.filter(n => !n.visited)
        }
    }

    removeWall(cell, wallIndex) {
        if ((wallIndex === 0 && cell.y === 0) ||
            (wallIndex === 1 && cell.x === this.width - 1) ||
            (wallIndex === 2 && cell.y === this.height - 1) ||
            (wallIndex === 3 && cell.x === 0)) {
            return false
        }
        cell.walls[wallIndex] = false
        if (wallIndex === 0) {
            this.grid[cell.x][cell.y - 1].walls[2] = false
        } else if (wallIndex === 1) {
            this.grid[cell.x + 1][cell.y].walls[3] = false
        } else if (wallIndex === 2) {
            this.grid[cell.x][cell.y + 1].walls[0] = false
        } else if (wallIndex === 3) {
            this.grid[cell.x - 1][cell.y].walls[1] = false
        }
        return true
    }

    removeWalls(count) {
        for (let i = 0; i < count; i++) {
            const x = Phaser.Math.RND.between(0, this.width - 1)
            const y = Phaser.Math.RND.between(0, this.height - 1)
            const cell = this.grid[x][y]
            const wallIndices = [...cell.walls.keys()].filter(i => cell.walls[i])
            const wallIndex = Phaser.Math.RND.pick(wallIndices)
            this.removeWall(cell, wallIndex)
        }
    }
}

class MyGame extends Phaser.Scene {
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

        const width = 10
        const height = 10

        const maze = new Maze(width, height)

        maze.generate(maze.grid[0][0])

        maze.removeWalls(width * height / 5)

        maze.grid.forEach(col => col.forEach(cell => cell.draw(this, 50)))
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'tank-game',
    scene: MyGame,
}

const game = new Phaser.Game(config)

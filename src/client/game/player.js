
// Contains the player class and its update function
export class PlayerClass {
    constructor(pos, speed) {
        this.pos = pos
        this.speed = speed
    }

    get type() {
        return "player"
    }

    static create(pos) {
        return new Player(pos.plus(new Vec(0, -0)), new Vec(0, 0))
    }
}

export const Player = PlayerClass

Player.prototype.update = function (time, state) {


    let xSpeed = 0
    let pos = this.pos
    let movedX = pos.plus(new Vec(xSpeed * time, 0))

    if (
        !state.level.touches(movedX, this.size, "ground-bottom-left") &&
        !state.level.touches(movedX, this.size, "ground-bottom-right") &&
        !state.level.touches(movedX, this.size, "ground-bottom-body") &&
        !state.level.touches(movedX, this.size, "ground-top-right") &&
        !state.level.touches(movedX, this.size, "ground-top-body") &&
        !state.level.touches(movedX, this.size, "ground-top-left") &&
        !state.level.touches(movedX, this.size, "ground-full") &&
        !state.level.touches(movedX, this.size, "pipe-top-left") &&
        !state.level.touches(movedX, this.size, "pipe-top-right") &&
        !state.level.touches(movedX, this.size, "pipe-body-left") &&
        !state.level.touches(movedX, this.size, "pipe-body-right") &
        !state.level.touches(movedX, this.size, "block") &&
        !state.level.touches(movedX, this.size, "box-extra-life")
    ) {
        pos = movedX
    }
    let ySpeed = this.speed.y + time * gravity
    let movedY = pos.plus(new Vec(0, ySpeed * time))



   if (
        !state.level.touches(movedY, this.size, "ground-top-body") &&
        !state.level.touches(movedY, this.size, "ground-top-right") &&
        !state.level.touches(movedY, this.size, "ground-top-left") &&
        !state.level.touches(movedY, this.size, "ground-bottom-body") &&
        !state.level.touches(movedY, this.size, "ground-bottom-right") &&
        !state.level.touches(movedY, this.size, "ground-bottom-left") &&
        !state.level.touches(movedY, this.size, "ground-full") &&
        !state.level.touches(movedY, this.size, "pipe-top-left") &&
        !state.level.touches(movedY, this.size, "pipe-top-right") &&
        !state.level.touches(movedY, this.size, "pipe-body-left") &&
        !state.level.touches(movedY, this.size, "pipe-body-right") &&
        !state.level.touches(movedY, this.size, "block") &&
        !state.level.touches(movedY, this.size, "box-extra-life")
    ) {
        pos = movedY
    }

    return new Player(pos, new Vec(xSpeed, ySpeed))
}

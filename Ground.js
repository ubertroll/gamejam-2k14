﻿function Ground(_x, _y) {
    this.sprite = game.add.sprite(_x, _y, "chopper");

    game.physics.p2.enable(this.sprite, true);

    this.sprite.body.clearShapes();
    this.sprite.body.setRectangle(game.world.width, 30);
    this.sprite.body.data.gravityScale = 0;
    this.sprite.body.setCollisionGroup(ObstaclesCollisionGroup);
    this.sprite.body.collides(m.chopper.bikeCollisionGroup);
    this.sprite.body.static = true;
}


Ground.prototype.delete = function () {
    this.sprite.destroy();
}
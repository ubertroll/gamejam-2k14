﻿function Chopper(_x, _y) {
    this.explosion;
    this.explosionTween;

    this.leftWheel = game.add.sprite(_x-100, _y-25, "tire");
    this.rightWheel = game.add.sprite(_x + 100, _y-25, "tire");
    this.bike = game.add.sprite(_x, _y - 100, "chopper");
    this.merkel = game.add.sprite(_x, _y-200, "merkel");

    game.physics.enable([this.leftWheel, this.rightWheel, this.bike, this.merkel], Phaser.Physics.P2JS);

    //the collision group of the chopper to prevent it from colliding with itself
    this.bikeCollisionGroup = game.physics.p2.createCollisionGroup(); //COLLISION GROUP
    game.physics.p2.updateBoundsCollisionGroup();

    this.leftWheel.body.setCircle(25);
    this.leftWheel.body.mass = 1;
    this.leftWheel.body.setCollisionGroup(this.bikeCollisionGroup);
    this.leftWheel.body.collideWorldBounds = true;
    this.leftWheel.body.collides(ObstaclesCollisionGroup, SetOnGround1, this);
    this.leftWheel.body.collides(winFlagCollisionGroup, nextLevel, this);
   
    

    this.rightWheel.body.setCircle(25);
    this.rightWheel.body.mass = 1;
    this.rightWheel.body.setCollisionGroup(this.bikeCollisionGroup);
    this.rightWheel.body.collideWorldBounds = true;
    this.rightWheel.body.collides(ObstaclesCollisionGroup, SetOnGround2, this);
    this.rightWheel.body.collides(winFlagCollisionGroup, nextLevel, this);

    if (DEBUG)
    {
        this.leftWheel.body.debug = true;
        this.rightWheel.body.debug = true;
        this.bike.body.debug = true;
        this.merkel.body.debug = true;
    }

    this.bike.body.setRectangle(200, 80);
    this.bike.body.mass = 1;
    this.bike.body.setCollisionGroup(this.bikeCollisionGroup);
    this.bike.body.collideWorldBounds = true;
    this.bike.body.collides(ObstaclesCollisionGroup);
    this.bike.body.collides(winFlagCollisionGroup, nextLevel, this);

    this.merkel.body.setRectangle(100, 70);
    this.merkel.body.mass = 1;
    this.merkel.body.setCollisionGroup(this.bikeCollisionGroup);
    this.merkel.body.collideWorldBounds = true;
    this.merkel.body.collides(ObstaclesCollisionGroup, this.die, this);
    this.merkel.body.collides(winFlagCollisionGroup, nextLevel, this);

    //Spring(world, bodyA, bodyB, restLength, stiffness, damping, worldA, worldB, localA, localB)
    this.spring1 = game.physics.p2.createSpring(this.bike, this.rightWheel, 70, 150, 50, null, null, [30, 0], null);
    this.spring2 = game.physics.p2.createSpring(this.bike, this.leftWheel, 70, 150, 50, null, null, [-30, 0], null);

    //ADD CONSTRAINTS
    //PrismaticConstraint(world, bodyA, bodyB, lockRotation, anchorA, anchorB, axis, maxForce)
    this.constraint1 = game.physics.p2.createPrismaticConstraint(this.bike, this.leftWheel, false, [-60, 0], [0, 0], [0, 1]);

    //SET LIMITS
    this.constraint1.lowerLimitEnabled = this.constraint1.upperLimitEnabled = true;
    this.constraint1.upperLimit = -1;
    this.constraint1.lowerLimit = -8;

    //PrismaticConstraint(world, bodyA, bodyB, lockRotation, anchorA, anchorB, axis, maxForce)
    this.constraint2 = game.physics.p2.createPrismaticConstraint(this.bike, this.rightWheel, false, [80, 0], [0, 0], [0, 1]);

    //SET LIMITS
    this.constraint2.lowerLimitEnabled = this.constraint2.upperLimitEnabled = true;
    this.constraint2.upperLimit = -1;
    this.constraint2.lowerLimit = -8;


    this.constraint3 = game.physics.p2.createLockConstraint(this.bike, this.merkel, [3, 73], 0);
}

Chopper.prototype.delete = function () {
    if (this.leftWheel != undefined) {
        this.leftWheel.destroy();
    }
    if (this.rightWheel != undefined) {
        this.rightWheel.destroy();
    }
    if (this.bike != undefined) {
        this.bike.destroy();
    }
    if (this.merkel != undefined) {
        this.merkel.destroy();
    }
    if (this.explosionTween != undefined) {
        if (!this.explosionTween.isRunning) {
            if (this.explosion != undefined) {
                this.explosion.destroy();
            }
            this.explosionTween = undefined;
        }
    }
}

Chopper.prototype.hide = function () {
    this.leftWheel.alpha = 0;
    this.rightWheel.alpha = 0;
    this.bike.alpha = 0;
    this.merkel.alpha = 0;
    game.camera.unfollow();
}

Chopper.prototype.die = function () {
    if (this.explosionTween === undefined) {
        this.explosion = game.add.sprite(this.bike.x, this.bike.y, "explosion");
        this.explosion.anchor.setTo(0.5, 0.5);
        this.explosion.scale.x = 0.1;
        this.explosion.scale.y = 0.1;
        this.explosionTween = game.add.tween(this.explosion.scale).to({ x: 2, y: 2 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false);
        this.explosionAlpha = game.add.tween(this.explosion).to({ alpha: 0 }, 1200, Phaser.Easing.Linear.None, true, 0, 0, false);
        game.add.tween(this.explosion).to({ y: this.bike.y - 300 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false);
        this.explosionAlpha.onComplete.add(this.dead);
        this.hide();
    }
}

Chopper.prototype.dead = function () {
    currentState = new GameOver(currentState.level);
}

function nextLevel() {
    currentState = new NextLevel(currentState.level);
}
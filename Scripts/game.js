
var Game = new function () {
	this.debug = false;
	this.enableJoystick = false;
	this.mapSize=2;
	this.map = {};
	this.canvas = document.getElementById("renderCanvas");
	this.engine = new BABYLON.Engine(this.canvas, true);
	//this.engine.renderEvenInBackground = false;
	this.engine.loopCounter = 0;
	this.scene = [];
	this.sceneType = {
		Start: 0,
		Game: 1
	};
	this.activeScene = this.sceneType.Game;
	this.ltArray = lookupTableATan2();
	this.difficultyLevel = 1;
    this.round = 1;
    this.preferences = new function () {
        this.isCameraInverted = false;
        this.touchEnabled = false;
    }
	
	this.performance = new function () {
		this.quality = 1;
		this.particleDensity;
		this.viewDistance = 200;
	}
}

Game.startNextRound = function(player, scene) {
    Game.round++;
    
    // Show end of round score
    $('.sceneAlert').html("Score<br/>" + player.points);
    $('.sceneAlert').fadeIn(200, function () {
        setTimeout(function () {
            $('.sceneAlert').fadeOut(500, function () {
                $('.sceneAlert').html("Round " +  Game.round);
                $('.sceneAlert').fadeIn(200, function () {
                    setTimeout(function () {
                        $('.sceneAlert').fadeOut(500, function () {});
                        player.points = 0;
                        player.arrows = 5;
                        $('.roundInfo').html("ROUND " +  Game.round);
                        $('.scoreInfo').html(pad(player.points,3));
                        $('.arrowInfo').html("x " +  pad(player.arrows, 2));
                        scene.disposeOfArrows();
                        scene.activeArrow = scene.createNewArrow();
                    },2000);
                });
            });
            // $('.infoRight').fadeIn(500, function () {});
        },2000);
    });    
}
// Pointer lock function for hiding pointer binding pointer movement to camera
Game.initPointerLock = function(whichCamera) {
    var self = this;
    // On click event, request pointer lock
    self.canvas.addEventListener("click", function(evt) {
        self.canvas.requestPointerLock = self.canvas.requestPointerLock || self.canvas.msRequestPointerLock || self.canvas.mozRequestPointerLock || self.canvas.webkitRequestPointerLock;
        if (self.canvas.requestPointerLock) {
            self.canvas.requestPointerLock();
        }
    }, false);

    // Event listener when the pointerlock is updated (or removed by pressing ESC for example).
    var pointerlockchange = function (evt) {
        self.controlEnabled = ( document.mozPointerLockElement === self.canvas
                        || document.webkitPointerLockElement === self.canvas
                        || document.msPointerLockElement === self.canvas
                        || document.pointerLockElement === self.canvas);
        // If the user is alreday locked
        if (!self.controlEnabled) {
            whichCamera.detachControl(self.canvas);
        } else {
            whichCamera.attachControl(self.canvas);
        }
    };

    // Attach events to the document
    document.addEventListener("pointerlockchange", pointerlockchange, false);
    document.addEventListener("mspointerlockchange", pointerlockchange, false);
    document.addEventListener("mozpointerlockchange", pointerlockchange, false);
    document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
}
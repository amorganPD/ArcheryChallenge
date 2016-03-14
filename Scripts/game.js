
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

Game.targetType = {
    NORMAL: 0,
    ONESHOT: 1
}

Game.stageInformation = new function() {
    var newRoundIndex = 0;
    this.rounds = [];
    this.round = function (TotalPoints, TargetData) {
        this.totalPoints = 0;
        this.targetData = {
            positions : {},
            type : targetType.NORMAL
        };
    }
    // Round 1 - 1 Normal Target - Need 100 points - 5 arrows
    // newRoundIndex = this.rounds.push()
    
    // Round 2 - 1 Normal Target - Need 200 points - 5 arrows
    
    // Round 3 - 1 Normal Target - Need 300 points - 5 arrows
    
    // Round 4 - 3 OneShot Targets - N/A Points - 5 Arrows
    
    // Round 5 - 5 OneShot Targets - N/A Points - 8 Arrows
    
    // Round 6 - 4 OneShot Targets - 1 Normal Target - 200 Points - 12 Arrows
    
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
    // self.canvas.addEventListener("click", function(evt) {
    Game.pointerLock = function() {
        self.canvas.requestPointerLock = self.canvas.requestPointerLock || self.canvas.msRequestPointerLock || self.canvas.mozRequestPointerLock || self.canvas.webkitRequestPointerLock;
        if (self.canvas.requestPointerLock) {
            self.canvas.requestPointerLock();
        }
    }
    // }, false);

    // Event listener when the pointerlock is updated (or removed by pressing ESC for example).
    var pointerlockchange = function (evt) {
        self.controlEnabled = ( document.mozPointerLockElement === self.canvas
                        || document.webkitPointerLockElement === self.canvas
                        || document.msPointerLockElement === self.canvas
                        || document.pointerLockElement === self.canvas);
        // If the user is alreday locked
        whichCamera.detachControl(self.canvas);
        whichCamera.attachControl(self.canvas);
    };

    // Attach events to the document
    document.addEventListener("pointerlockchange", pointerlockchange, false);
    document.addEventListener("mspointerlockchange", pointerlockchange, false);
    document.addEventListener("mozpointerlockchange", pointerlockchange, false);
    document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
}
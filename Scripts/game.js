
var Game = new function () {
    var self = this;
    this.debug = false;
    this.enableJoystick = false;
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
    this.challengeCount = 0;
    this.isMenuOpen = false;

    this.cameraType = {
        Normal: 0,
        Touch: 1,
        VR: 2,
        Debug: 3
    };
    this.preferences = new function () {
        this.pageType = {
            Control: 0,
            Camera: 1,
            About: 2
        };
        this.activePage = this.pageType.Control;
        this.isCameraInverted = false;
        this.cameraType = self.cameraType.Normal;
    }

    this.performance = new function () {
        this.quality = 1;
        this.particleDensity;
        this.viewDistance = 200;
    }
}

Game.openMenu = function () {
    Game.isMenuOpen = true;
    Game.engine.stopRenderLoop(); // pause game

    $('#modal').removeClass("modalSmall");
    $('#menuText').fadeOut(200);
    $('#prefMenu').addClass("menuExpanded");
    setTimeout(function () {
        $('#preferenceModal').fadeIn(1000);
    }, 500);
    $('#prefCloseButton').fadeIn(200);
    $('.logo').fadeIn(150);
};
Game.closeMenu = function () {
    Game.isMenuOpen = false;
    Game.runRenderLoop(); // resume game

    $('.logo').fadeOut(150);
    $('#preferenceModal').stop().fadeOut(250, function () {
        $('#prefCloseButton').fadeOut(250);
        $('#prefMenu').removeClass("menuExpanded");
        // $('#prefMenu').animate({ opacity: 1 }, 200);
        setTimeout(function () {
            $('#menuText').fadeIn(500, function () {
                $('#modal').addClass("modalSmall");
            });
        }, 500);
    });
}
Game.menuRight = function () {
    switch(Game.preferences.activePage) {
        case Game.preferences.pageType.Control:
            $("#menuControls").fadeOut(500);
            $("#menuCamera").fadeIn(500);
            Game.preferences.activePage = Game.preferences.pageType.Camera;
            break;
        case Game.preferences.pageType.Camera:
            $("#menuCamera").fadeOut(500);
            $("#menuAbout").fadeIn(500);
            Game.preferences.activePage = Game.preferences.pageType.About;
            break;
        case Game.preferences.pageType.About:
            $("#menuAbout").fadeOut(500);
            $("#menuControls").fadeIn(500);
            Game.preferences.activePage = Game.preferences.pageType.Control;
            break;
    }
}
Game.menuLeft = function () {
    switch(Game.preferences.activePage) {
        case Game.preferences.pageType.Control:
            $("#menuControls").fadeOut(500);
            $("#menuAbout").fadeIn(500);
            Game.preferences.activePage = Game.preferences.pageType.About;
            break;
        case Game.preferences.pageType.Camera:
            $("#menuCamera").fadeOut(500);
            $("#menuControls").fadeIn(500);
            Game.preferences.activePage = Game.preferences.pageType.Control;
            break;
        case Game.preferences.pageType.About:
            $("#menuAbout").fadeOut(500);
            $("#menuCamera").fadeIn(500);
            Game.preferences.activePage = Game.preferences.pageType.Camera;
            break;
    }
}

Game.allowStart = function () {
    $('#startGame').click(function () {
        clearTimeout(Game.pauseId);
        Game.runRenderLoop(); // resume game
        $('.logo').fadeOut(200);

        $('#modalUnderlay').fadeOut(200);
        $('#startMenu').fadeOut(200, function () {
            Game.activeScene = Game.sceneType.Game;
            Game.runRenderLoop();

            window.addEventListener('pointerdown', pointerDown, true);
            window.addEventListener('pointerup', pointerUp, true);
            
		    document.getElementById("renderCanvas").focus();

            $('#modal').addClass("modalSmall");
            // Preference menu click events
            $('#prefMenu').animate({
                opacity: 1,
            }, 200, function () {
                // $('#prefMenu').fadeIn(200, function () {
                $('#menuText').click(function () {
                    Game.openMenu();
                });
                $('#prefCloseButton').click(function () {
                    Game.closeMenu();
                });
                $('#rightArrow').click(function () {
                    Game.menuRight();
                });
                $('#leftArrow').click(function () {
                    Game.menuLeft();
                });
                $('#cameraInverted').click(function () {
                    var activeCamera = Game.scene[Game.activeScene].activeCamera;
                    if (!Game.preferences.isCameraInverted) {
                        $('#cameraInverted').html('On');
                        activeCamera.angularSensibility = -activeCamera.angularSensibility;
                    }
                    else {
                        $('#cameraInverted').html('Off');
                        activeCamera.angularSensibility = Math.abs(activeCamera.angularSensibility);
                    }
                    Game.preferences.isCameraInverted = !Game.preferences.isCameraInverted;
                });
                $('#cameraMode').click(function () {
                    var activeScene = Game.scene[Game.activeScene];
                    var CameraType = Game.cameraType.Normal;
                    if (Game.preferences.cameraType == Game.cameraType.Normal) {
                        $('#cameraMode').html('Touch');
                        CameraType = Game.cameraType.Touch;
                        launchIntoFullscreen(document.documentElement);
                    }
                    else if (Game.preferences.cameraType == Game.cameraType.Touch) {
                        $('#cameraMode').html('VR');
                        CameraType = Game.cameraType.VR;
                        // Initiate Full Screen
                        launchIntoFullscreen(document.documentElement);
                    }
                    else {
                        $('#cameraMode').html('Normal');
                        CameraType = Game.cameraType.Normal;
                    }
                    Game.cameras.switch(CameraType);
                    Game.scene[Game.activeScene].render(); // in case scene is "paused"
                });
            });
            var thisScene = Game.scene[Game.activeScene];
            Game.startStage(thisScene.Players[thisScene.activePlayer], thisScene);

            if (Game.debug) {
                $('#debugMenu').fadeIn(200, function () { });
            }
        });
    });
    $('#startGame').html("Start Game");
    $('#startGame').removeClass("loadingGame");
}

// Pointer lock function for hiding pointer binding pointer movement to camera
Game.initPointerLock = function (whichCamera) {
    var self = this;
    // On click event, request pointer lock
    // self.canvas.addEventListener("click", function(evt) {
    Game.pointerLock = function () {
        self.canvas.requestPointerLock = self.canvas.requestPointerLock || self.canvas.msRequestPointerLock || self.canvas.mozRequestPointerLock || self.canvas.webkitRequestPointerLock;
        if (self.canvas.requestPointerLock) {
            self.canvas.requestPointerLock();
        }
    }
    // }, false);

    // Event listener when the pointerlock is updated (or removed by pressing ESC for example).
    var pointerlockchange = function (evt) {
        self.controlEnabled = (document.mozPointerLockElement === self.canvas
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
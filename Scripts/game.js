var Game = (function(game, BABYLON, $, undefined) {

    game.debug = false;
    game.enableJoystick = false;
    game.canvas = document.getElementById("renderCanvas");
    game.engine = new BABYLON.Engine(game.canvas, true);
    //game.engine.renderEvenInBackground = false;
    game.engine.loopCounter = 0;
    game.scene = [];
    game.sceneType = {
        Start: 0,
        Game: 1
    };
    game.activeScene = game.sceneType.Game;
    game.ltArray = lookupTableATan2();
    game.difficultyLevel = 1;
    game.challengeCount = 0;
    game.isMenuOpen = false;

    game.cameraType = {
        Normal: 0,
        Touch: 1,
        VR: 2,
        Debug: 3
    };
    game.preferences = new function () {
        this.pageType = {
            Control: 0,
            Camera: 1,
            About: 2
        };
        this.activePage = this.pageType.Control;
        this.isCameraInverted = false;
        this.cameraType = game.cameraType.Normal;
    }

    game.performance = new function () {
        this.quality = 1;
        this.particleDensity;
        this.viewDistance = 200;
    }

    game.openMenu = function () {
        game.isMenuOpen = true;
        game.engine.stopRenderLoop(); // pause game
    
        $('#modal').removeClass("modalSmall");
        $('#menuText').fadeOut(200);
        $('#prefMenu').addClass("menuExpanded");
        setTimeout(function () {
            $('#preferenceModal').fadeIn(1000);
        }, 500);
        $('#prefCloseButton').fadeIn(200);
        $('.logo').fadeIn(150);
    };
    game.closeMenu = function () {
        game.isMenuOpen = false;
        game.runRenderLoop(); // resume game
    
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
    game.menuRight = function () {
        switch(game.preferences.activePage) {
            case game.preferences.pageType.Control:
                $("#menuControls").fadeOut(500);
                $("#menuCamera").fadeIn(500);
                game.preferences.activePage = game.preferences.pageType.Camera;
                break;
            case game.preferences.pageType.Camera:
                $("#menuCamera").fadeOut(500);
                $("#menuAbout").fadeIn(500);
                game.preferences.activePage = game.preferences.pageType.About;
                break;
            case game.preferences.pageType.About:
                $("#menuAbout").fadeOut(500);
                $("#menuControls").fadeIn(500);
                game.preferences.activePage = game.preferences.pageType.Control;
                break;
        }
    }
    game.menuLeft = function () {
        switch(game.preferences.activePage) {
            case game.preferences.pageType.Control:
                $("#menuControls").fadeOut(500);
                $("#menuAbout").fadeIn(500);
                game.preferences.activePage = game.preferences.pageType.About;
                break;
            case game.preferences.pageType.Camera:
                $("#menuCamera").fadeOut(500);
                $("#menuControls").fadeIn(500);
                game.preferences.activePage = game.preferences.pageType.Control;
                break;
            case game.preferences.pageType.About:
                $("#menuAbout").fadeOut(500);
                $("#menuCamera").fadeIn(500);
                game.preferences.activePage = game.preferences.pageType.Camera;
                break;
        }
    }
    
    game.allowStart = function () {
        $('#startGame').click(function () {
            clearTimeout(game.pauseId);
            game.runRenderLoop(); // resume game
            $('.logo').fadeOut(200);
    
            $('#modalUnderlay').fadeOut(200);
            $('#startMenu').fadeOut(200, function () {
                game.activeScene = game.sceneType.Game;
                game.runRenderLoop();
    
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
                        game.openMenu();
                    });
                    $('#prefCloseButton').click(function () {
                        game.closeMenu();
                    });
                    $('#rightArrow').click(function () {
                        game.menuRight();
                    });
                    $('#leftArrow').click(function () {
                        game.menuLeft();
                    });
                    $('#cameraInverted').click(function () {
                        var activeCamera = game.scene[game.activeScene].activeCamera;
                        if (!game.preferences.isCameraInverted) {
                            $('#cameraInverted').html('On');
                            activeCamera.angularSensibility = -activeCamera.angularSensibility;
                        }
                        else {
                            $('#cameraInverted').html('Off');
                            activeCamera.angularSensibility = Math.abs(activeCamera.angularSensibility);
                        }
                        game.preferences.isCameraInverted = !game.preferences.isCameraInverted;
                    });
                    $('#cameraMode').click(function () {
                        var activeScene = game.scene[game.activeScene];
                        var CameraType = game.cameraType.Normal;
                        if (game.preferences.cameraType == game.cameraType.Normal) {
                            $('#cameraMode').html('Touch');
                            CameraType = game.cameraType.Touch;
                            launchIntoFullscreen(document.documentElement);
                        }
                        else if (game.preferences.cameraType == game.cameraType.Touch) {
                            $('#cameraMode').html('VR');
                            CameraType = game.cameraType.VR;
                            // Initiate Full Screen
                            launchIntoFullscreen(document.documentElement);
                        }
                        else {
                            $('#cameraMode').html('Normal');
                            CameraType = game.cameraType.Normal;
                        }
                        game.cameras.switch(CameraType);
                        game.scene[game.activeScene].render(); // in case scene is "paused"
                    });
                });
                var thisScene = game.scene[game.activeScene];
                game.startStage(thisScene.Players[thisScene.activePlayer], thisScene);
    
                if (game.debug) {
                    $('#debugMenu').fadeIn(200, function () { });
                }
            });
        });
        $('#startGame').html("Start Game");
        $('#startGame').removeClass("loadingGame");
    }
    
    // Pointer lock function for hiding pointer binding pointer movement to camera
    game.initPointerLock = function (whichCamera) {
        var self = this;
        // On click event, request pointer lock
        // self.canvas.addEventListener("click", function(evt) {
        game.pointerLock = function () {
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
    return game;    
})(Game || {}, BABYLON, jQuery);

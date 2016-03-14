/*********************************************************************
 BabylonMechanics.js
   Create the init functions for each scene. These functions should
   call the Game.Create<sceneType>Scene and setup their renderLoops.
*********************************************************************/

//-- Start screen is for the initial Scene, this could allow the user to --//
//-- view settings, information about the game, and/or to start the game --//
//-- this is not needed, but can be used if desired. --//
Game.initStartScene = function() {
	var activeScene; // index for current scene
	
	// Create Start Scene
	activeScene = Game.scene.push(Game.CreateStartScene(Game.engine)) - 1;
	
	Game.scene[activeScene].renderLoop = function () {
		//Render scene and any changes
		if (this.isLoaded) { // don't render until scene is ready (non-BJS)
			//-- Non BJS code --//
			if (Game.engine.loopCounter > 1000) {
				Game.engine.loopCounter=0;
			}
			else {
				Game.engine.loopCounter++;
			}
			if (Game.engine.loopCounter % 5 == 0) {
				$('#fps').text('FPS: ' + Game.engine.getFps().toFixed());
			}
			//-- Required BJS code --//
			this.render();
		}
	};
}

Game.initGameScene = function() {
	var activeScene; // index for current scene
	
	// Create Game Scene
	activeScene = Game.scene.push(Game.CreateGameScene(Game.engine)) - 1;
	
	Game.scene[activeScene].renderLoop = function () {
		
		//-- isErrthingReady is a created variable used determine when
		//   I consider everything is ready. This is used to couple with
		//   isLoaded (non-BJS) and .isRead() (BJS) to make sure everything
		//   in addition to the scene is ready --//
		if (!this.isErrthingReady) {
			if (this.isReady() && this.isLoaded) {
				this.isErrthingReady = true;
			}
			//-- when everything is ready this gets executed once --//
			if (this.isErrthingReady) {
				/* Initialization Code */
				
				// this.octree = this.createOrUpdateSelectionOctree(64, 2);
				
				if (Game.debug) {
					this.debugLayer.show();
					$('#DebugLayerStats').css({"bottom": "1em"});
					$('#DebugLayerStats').css({"right": "1em"});
					$('#DebugLayerDrawingCanvas').css({"width": "90%"});
					$('#DebugLayerDrawingCanvas').css({"height": "90%"});
				}
				
				//-- start game logic loop (only one instance can occur) --//
				timedLoop.registerFunction(this.logicLoop);
				timedLoop.start();
                
                // Give the scene a chance to render, but pause renderLoop until player press start
                Game.pauseId = setTimeout(function () {
                    Game.engine.stopRenderLoop(); // pause game
                }, 1000);
				
				// TO DO: Implement optimization (only available in BJS v2+)
				//BABYLON.SceneOptimizer.OptimizeAsync(Game.scene[Game.activeScene]);
				// this.optimizeOptions = BABYLON.SceneOptimizerOptions.ModerateDegradationAllowed();
				// this.optimizeOptions.targetFrameRate=60;
				// BABYLON.SceneOptimizer.OptimizeAsync(Game.scene[activeScene], this.optimizeOptions, function() {
				   // // On success
				// }, function() {
				   // // FPS target not reached
				// });
				
				// Allow Game to be started
				$('#startGame').click(function () {
                    clearTimeout(Game.pauseId);
                    Game.runRenderLoop(); // resume game
                    $('.logo').fadeOut(200);
					$('#modal').fadeOut(200, function () {
						Game.activeScene=Game.sceneType.Game;
						Game.runRenderLoop();
                        
                        window.addEventListener('pointerdown', pointerDown, true);
                        window.addEventListener('pointerup', pointerUp, true);
                        
                        // Preference menu click events
						$('#prefMenu').fadeIn(200, function () {
                            $('#prefMenu').click(function () {
                                Game.engine.stopRenderLoop(); // pause game
                                $('.logo').fadeIn(50);
                                $('#modalDiv').css({'display':'none'});
                                $('#modal').fadeIn(50);
                                $('#preferenceModal').fadeIn(200);
                            });
                            $('#exitButton').click(function () {
                                Game.runRenderLoop(); // resume game
                                $('.logo').fadeOut(50);
                                $('#modal').fadeOut(50);
                                $('#preferenceModal').fadeOut(200);
                            });
                            $('#cameraMode').click(function () {
                                var activeCamera = Game.scene[Game.activeScene].camera;
                                if (!Game.preferences.isCameraInverted) {
                                    $('#cameraMode').html('Inverted');
                                    activeCamera.angularSensibility = -activeCamera.angularSensibility;
                                }
                                else {
                                    $('#cameraMode').html('Normal');
                                    activeCamera.angularSensibility = Math.abs(activeCamera.angularSensibility);
                                }
                                Game.preferences.isCameraInverted = !Game.preferences.isCameraInverted;
                            });
                            $('#touchScreenMode').click(function () {
                                var activeScene = Game.scene[Game.activeScene];
                                if (!Game.preferences.touchEnabled) {
                                    $('#touchScreenMode').html('On');
                                    activeScene.activeCamera = activeScene.mobileCamera;
                                }
                                else {
                                    $('#touchScreenMode').html('Off');
                                    activeScene.activeCamera = activeScene.camera;
                                }
                                Game.preferences.touchEnabled = !Game.preferences.touchEnabled;
                            });
                        });
                        // Fade In Round 1 Alert
						$('.sceneAlert').fadeIn(500, function () {
                            setTimeout(function () {
                                $('.sceneAlert').fadeOut(500, function () {});
                                $('.infoRight').fadeIn(500, function () {});
                            },1000);
                        });
						if (Game.debug) {
							$('#debugMenu').fadeIn(200, function () {	});
						}
					});
				});
				$('#startGame').html("Start Game");
				$('#startGame').removeClass("loadingGame");
			}
		}
		else {
			//-- Required BJS code --//
			this.render();
		}
	};	
	
}

//-- Used to control which scene is being ran
//   Change Game.activeScene index before calling to switch scenes --//
Game.runRenderLoop = function () {
	Game.engine.stopRenderLoop();

	//-- Once the scene is loaded, register a render loop to render it --//
	setImmediate(function(){
		Game.engine.runRenderLoop(function () { 
			Game.scene[Game.activeScene].renderLoop();
		});
	});
}

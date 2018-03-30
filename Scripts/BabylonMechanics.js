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
				// BABYLON.SceneOptimizer.OptimizeAsync(Game.scene[Game.activeScene]);
				// this.optimizeOptions = BABYLON.SceneOptimizerOptions.HighDegradationAllowed();
				// this.optimizeOptions.targetFrameRate=60;
				// BABYLON.SceneOptimizer.OptimizeAsync(Game.scene[activeScene], this.optimizeOptions, function() {
				//    // On success
				// }, function() {
				//    // FPS target not reached
				// });
				// BABYLON.SceneOptimizer.OptimizeAsync(Game.scene[Game.activeScene], BABYLON.SceneOptimizerOptions.HighDegradationAllowed(),
				// 	function() {
				// 	// On success
				// 	}, function() {
				// 	alert("Not Reached");
				// });
				
				// Allow Game to be started
				Game.allowStart();
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

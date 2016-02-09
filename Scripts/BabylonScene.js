/*********************************************************************
 BabylonScene.js
   Functions for the core scene elements, loading, setup,
   and the manipulation of the scene, including the logicLoop().
*********************************************************************/

//Helpful Info
// X Z are analogous to x and y cartesian coor.

Game.CreateStartScene = function() {
    //Creation of the scene 
    var scene = new BABYLON.Scene(Game.engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
	scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
	scene.collisionsEnabled = true;
	scene.isErrthingReady = false;
    
    //Adding an Arc Rotate Camera
    //var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 1, -15), scene);
    var Alpha = 3*Math.PI/2;
    var Beta = 0.00000001;
    scene.camera = new BABYLON.ArcRotateCamera("Camera", Alpha, Beta, 40, new BABYLON.Vector3.Zero(), scene);
	scene.camera.attachControl(Game.canvas, true);
    // //set camera to not move
    scene.camera.lowerAlphaLimit = Alpha;
    scene.camera.upperAlphaLimit = Alpha;
    scene.camera.lowerBetaLimit = Beta;
    scene.camera.upperBetaLimit = Beta;
	
	scene.ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 1, 0), scene);
	scene.ambientLight.diffuse = new BABYLON.Color3(.98, .95, .9);
	scene.ambientLight.specular = new BABYLON.Color3(.1, .1, .1);
	scene.ambientLight.groundColor = new BABYLON.Color3(.1, .1, .1);
	scene.ambientLight.intensity = .1;
	
	scene.light= new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 20, 0), scene);
	scene.light.diffuse = new BABYLON.Color3(.18, .15, .1);
	scene.light.specular = new BABYLON.Color3(0, 0, 0);
	
	scene.isLoaded=false;
	
	/******************************************************/
	/*START - STUB CODE*/
	
	//create Asset Manager
	scene.assetsManager = new BABYLON.AssetsManager(scene);
	scene.assetsManager.useDefaultLoadingScreen=false;
	
	//create Asset Tasks
	scene.playerTask = scene.assetsManager.addMeshTask("playerTask", "", "./Assets/", "target-01.b.js");
		
	//Set functions to assign loaded meshes
	scene.playerTask.onSuccess = function (task) {
		//stub function
	}
	
	//Set up Scene after all Tasks are complete
	scene.assetsManager.onFinish = function (tasks) {
		//stub function
		
		// Allow Game to be started
		$('#startGame').click(function () {
			$('#modal').fadeOut(50, function () {
				$('#modalDiv').html('');
				Game.activeScene=Game.sceneType.Game;
				Game.runRenderLoop();
				//prepareHealthBars();
				$('#topMenu').fadeIn(200, function () {	});
				$('#hotKeys').fadeIn(200, function () {	});
				if (Game.debug) {
					$('#debugMenu').fadeIn(200, function () {	});
				}
			});
		});
		$('#startGame').html("Start Game");
		$('#startGame').removeClass("loadingGame");
		scene.isLoaded=true;
	};
	
	//Load all tasks
	scene.assetsManager.load();

	scene.logicLoop = function () {
		var self = scene;
		switch (Game.engine.loopCounter) {   
			case 500:
				Game.engine.loopCounter=0;
				break;
			default:
				Game.engine.loopCounter++;
				break;
		}
		$('#lps').text('LPS: ' + timedLoop.getLoopTime().toFixed());
		$('#fps').text('FPS: ' + Game.engine.getFps().toFixed());
		//Game.processEnemies(self);
		//processInput(self.player, self.player.speed);
	};
	
	scene.moveMeshes = function () {
		//stub function
	}
	
    scene.registerBeforeRender(function(){
		scene.moveMeshes();
	});
	
	/******************************************************/
	/*END - STUB CODE*/

    return scene;

}

Game.CreateGameScene = function() {
    //Creation of the scene 
    var scene = new BABYLON.Scene(Game.engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
	scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
	scene.collisionsEnabled = true;
	scene.isErrthingReady = false;
    
    //Adding an Arc Rotate Camera
    var Alpha = 0;
    var Beta = 0.00000001;
    // scene.camera = new BABYLON.ArcRotateCamera("Camera", Alpha, Math.PI/2, 5, new BABYLON.Vector3(0,0,0), scene);
	// scene.camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
	// scene.camera.aspectRatio = $( window ).width()/$( window ).height();
	// scene.camera.magnification = 30;
	// scene.camera.attachControl(Game.canvas, true);
	scene.camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 8, 0), scene);
	scene.camera.rotation.y = -Math.PI/2;
	scene.camera.keysUp.push(87);// W
	scene.camera.keysLeft.push(65); // A 
	scene.camera.keysDown.push(83); // S 
	scene.camera.keysRight.push(68); // D
	
	
	// scene.debugCamera = new BABYLON.FreeCamera("DebugFreeCamera", new BABYLON.Vector3(0, 8, 0), scene);
	// scene.debugCamera.rotation.y = -Math.PI/2;
	// // scene.activeCamera = scene.debugCamera;
	// scene.debugCamera.keysUp.push(87);// W
	// scene.debugCamera.keysLeft.push(65); // A 
	// scene.debugCamera.keysDown.push(83); // S 
	// scene.debugCamera.keysRight.push(68); // D
	
	scene.activeCamera = scene.camera;
	scene.activeCamera.attachControl(Game.canvas);
	
	// scene.camera.target = new BABYLON.Vector3(0,0,0);
    // //set camera to not move
    // scene.camera.lowerAlphaLimit = Alpha;
    // scene.camera.upperAlphaLimit = Alpha;
    // scene.camera.lowerBetaLimit = Beta;
    // scene.camera.upperBetaLimit = Beta;
	
    // var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 1, -15), scene);
	// scene.camera.attachControl(Game.canvas, true);
	// camera.keysUp = null;
	// camera.keysDown = null;
	// camera.keysLeft = null;
	// camera.keysRight = null;
	
	scene.ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 20, 0), scene);
	scene.ambientLight.diffuse = new BABYLON.Color3(.98, .98, .98);
	scene.ambientLight.specular = new BABYLON.Color3(0, 0, 0);
	// scene.ambientLight.groundColor = new BABYLON.Color3(.2, .2, .2);
	scene.ambientLight.intensity = 1.75;
	
	scene.ambientLight2 = new BABYLON.HemisphericLight("ambientLight2", new BABYLON.Vector3(0, -20, 0), scene);
	scene.ambientLight2.diffuse = new BABYLON.Color3(.98, .98, .98);
	scene.ambientLight2.specular = new BABYLON.Color3(0, 0, 0);
	scene.ambientLight2.intensity = .15;
	
	// scene.light = new BABYLON.HemisphericLight("Omni", new BABYLON.Vector3(5, 0, 0), scene);
	// scene.light.diffuse = new BABYLON.Color3(.98, .98, .98);
	// scene.light.specular = new BABYLON.Color3(0, 0, 0);
	
	scene.isLoaded=false;
	
	/******************************************************/
	/*START - STUB CODE*/
	
	//create Asset Manager
	scene.assetsManager = new BABYLON.AssetsManager(scene);
	scene.assetsManager.useDefaultLoadingScreen=false;
	
	//create Asset Tasks
	// scene.playerTask = scene.assetsManager.addMeshTask("playerTask", "", "./Assets/", "target-01.b.js");
	scene.skyDomeTask = scene.assetsManager.addMeshTask("skyDomeTask", "", "./Assets/", "sky_dome.b.js");
	scene.bowModelTask = scene.assetsManager.addMeshTask("bowModelTask", "", "./Assets/", "longBowCentered.b.js");
	scene.arrowModelTask = scene.assetsManager.addMeshTask("arrowModelTask", "", "./Assets/", "arrow_wood.b.js");
	scene.targetModelTask = scene.assetsManager.addMeshTask("targetModelTask", "", "./Assets/", "target-01.b.js");
	scene.bowShotTask = scene.assetsManager.addBinaryFileTask("bowShotTask", "./Audio/Bow_Shot_Sound.wav");
	scene.arrowHitTask = scene.assetsManager.addBinaryFileTask("arrowHitTask", "./Audio/Target_Hit-03.wav");
		
	//Set functions to assign loaded meshes
	// scene.playerTask.onSuccess = function (task) {
		// var bodyMesh = task.loadedMeshes[0];
		// var weaponMesh = task.loadedMeshes[1];
		// var playerSkeletons = task.loadedSkeletons[0];
		// //bodyMesh.isVisible = true;
		// bodyMesh.scaling = new BABYLON.Vector3(2, 2, 2);
		// bodyMesh.rotation = new BABYLON.Vector3(0, -Math.PI/2, 0);
		// bodyMesh.position = new BABYLON.Vector3(0, 2, 0);
		
		// scene.player = new Entity(bodyMesh,{weaponMesh: weaponMesh, type: EntityType.Player, health: 4, damage: 1, speed: .2});
		// // scene.player.skeletons = playerSkeletons;
		// // scene.player.weaponCollisionMesh = task.loadedMeshes[2];
	// }
	scene.applyOutline = function(mesh) {
		mesh.renderOutline = true;
		mesh.outlineColor = new BABYLON.Color3(0.01,0.01,0.01);
		mesh.outlineWidth *= .25;
		
	}
	scene.skyDomeTask.onSuccess = function(task) {
		//-- Load known meshes from model --//
		scene.skyDomeMesh = task.loadedMeshes[0];
		
		//-- Manipulate model --/
		scene.skyDomeMesh.scaling = new BABYLON.Vector3(10, 10, 10);
		scene.skyDomeMesh.position = new BABYLON.Vector3(0, -40, 0);
		scene.skyDomeMesh.material.diffuseColor.r*=2;
		scene.skyDomeMesh.material.diffuseColor.g*=2;
		scene.skyDomeMesh.material.diffuseColor.b*=2;
	}
	
	scene.bowModelTask.onSuccess = function(task) {
		//-- Load known meshes from model --//
		scene.bowMesh = task.loadedMeshes[0];
		scene.bowMesh.skeletons = task.loadedSkeletons[0];
		
		//-- Manipulate model --/
		scene.bowMesh.scaling = new BABYLON.Vector3(2, 2, 2);
		scene.bowMesh.material.ambientColor = new BABYLON.Color3(.1, .1, .1);
		scene.bowMesh.material.subMaterials[0].diffuseColor = new BABYLON.Color3(.5, .5, .5);
		// scene.bowMesh.material.subMaterials[1].diffuseColor = new BABYLON.Color3(.5, .5, .5);
		scene.applyOutline(scene.bowMesh);
		//create Animation functions
		scene.bowMesh.drawArrow = function () {
			if (scene.bowMesh.animatable) {
				scene.bowMesh.animatable.stop();
			}
			scene.bowMesh.animatable = scene.beginAnimation(scene.bowMesh.skeletons, 0, 40, false, 1, function () {
				// scene.arrowMeshes[scene.activeArrow].arrowDrawing = false;
			});
		}
		scene.bowMesh.shootArrow = function () {
			var completionRatio = 1; // used to calculate initial speed of arrow and start frame of shoot animation
			if (scene.bowMesh.animatable) {
				var lengthOfAnim = scene.bowMesh.animatable.toFrame - scene.bowMesh.animatable.fromFrame;
				// unclear why there is an array for _animations, but choosing 0
				completionRatio= scene.bowMesh.animatable._animations[0].currentFrame / lengthOfAnim;
				scene.bowMesh.animatable.stop();
			}
			scene.arrowMeshes[scene.activeArrow].speed = 1*completionRatio;
			scene.bowMesh.animatable = scene.beginAnimation(scene.bowMesh.skeletons, 105 - 5*(completionRatio), 105, false, 2, function () {});
		}
	}
	scene.arrowModelTask.onSuccess = function(task) {
		//-- Load known meshes from model --//
		scene.arrowMesh = task.loadedMeshes[0];
		
		//-- Manipulate model --/
		scene.arrowMesh.scaling = new BABYLON.Vector3(.78, .5, .5);
		// scene.arrowMesh.material.backfaceCulling = false;
		scene.arrowMesh.isVisible = false;
		scene.applyOutline(scene.arrowMesh);
	}
	
	scene.targetModelTask.onSuccess = function(task) {
		//-- Load known meshes from model --//
		scene.targetMesh = task.loadedMeshes[0];
		
		//-- Manipulate model --/
		scene.targetMesh.scaling = new BABYLON.Vector3(3, 3, 3);
		scene.targetMesh.rotation = new BABYLON.Vector3(0, -Math.PI/2, 0);
		scene.targetMesh.position = new BABYLON.Vector3(-40, 6, 0);
		scene.applyOutline(scene.targetMesh);
	}
	
	// On success Audio Tasks
	scene.audio = {};
	scene.bowShotTask.onSuccess = function (task) {
		scene.audio.bowShot = new BABYLON.Sound("BowShot", task.data, scene, function () {}, { loop: false });
	}
	scene.arrowHitTask.onSuccess = function (task) {
		scene.audio.targetHit = new BABYLON.Sound("targetHit", task.data, scene, function () {}, { loop: false });
	}
	
	// Set up Players
	scene.Players = [];
	scene.activePlayer = scene.Players.push(new Player({points: 0})) - 1;
	//Set up Scene after all Tasks are complete
	scene.assetsManager.onFinish = function (tasks) {
		// If audio is not working (seems to be something wrong with Chrome and BJS?)
		if (scene.audio.bowShot == undefined) {
			scene.audio.bowShot = new Howl({
				urls: ['./Audio/Bow_Shot_Sound.wav']
			});
		}
		if (scene.audio.targetHit == undefined) {
			scene.audio.targetHit = new Howl({
				urls: ['./Audio/Target_Hit-03.wav']
			});
		}
		
		// Create Skybox
		// scene.skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
		// scene.skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
		// scene.skyboxMaterial.backFaceCulling = false;
		// scene.skyboxMaterial.disableLighting = true;
		// scene.skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
		// scene.skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
		// scene.skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./Textures/ds", scene);
		// scene.skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
		// scene.skybox.material = scene.skyboxMaterial;
		// scene.skybox.infiniteDistance = true;
		
		// Bind Bow Mesh to camera
		scene.bowMesh.parent = scene.camera;
		// scene.bowMesh.position = new BABYLON.Vector3(.125, -.3, 3.1);
		// scene.bowMesh.rotation = new BABYLON.Vector3(-Math.PI/16, .05, -Math.PI/16);
		scene.bowMesh.position = new BABYLON.Vector3(.15, -.3, 3.1);
		scene.bowMesh.rotation = new BABYLON.Vector3(.02, 0, -Math.PI/16);
		
		scene.arrowMeshes = [];
		scene.createNewArrow = function () {
			var newIndex = scene.arrowMeshes.push(scene.arrowMesh.clone()) - 1;
			
			scene.arrowMeshes[newIndex].parent = scene.camera;
			// scene.arrowMeshes[newIndex].position = new BABYLON.Vector3(.15, -.28, 6.5); //4.1
			// scene.arrowMeshes[newIndex].rotation = new BABYLON.Vector3(.2, Math.PI/1.999, 0.02);
			scene.arrowMeshes[newIndex].position = new BABYLON.Vector3(.16, -.25, 6.3); //4.1
			scene.arrowMeshes[newIndex].rotation = new BABYLON.Vector3(0, Math.PI/2, .019);
			scene.arrowMeshes[newIndex].arrowFiring = false;
			scene.arrowMeshes[newIndex].arrowDrawing = false;
			
			scene.arrowMeshes[newIndex].isVisible = true;
			
			return newIndex;
		};
		scene.bindActionToArrow = function(index) {
			// create BJS Action Manger
			scene.arrowMeshes[index].actionManager = new BABYLON.ActionManager(scene);
			// detect collision between enemy and player's weapon for an attack
			scene.arrowMeshes[index].actionManager.registerAction(new BABYLON.ExecuteCodeAction(
			{ trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: { mesh: scene.targetMesh, usePreciseIntersection: true} }, function (data) {
				scene.arrowMeshes[index].arrowFiring = false;
				scene.audio.targetHit.play();
				// get points
				var distance = getDistance(scene.targetMesh.position, scene.arrowMeshes[index].position, [0, 1, 1], new BABYLON.Vector3(0, .5, .5));
				scene.Players[scene.activePlayer].updatePoints(distance, 3);
				$('#scoreInfo').html(pad(scene.Players[scene.activePlayer].points,3));
				
				// scene.arrowMeshes[index].parent = scene.targetMesh;
				// Clear Timeout
				if (scene.timerId) {
					clearTimeout(scene.timerId);
				}
				
				// Create a new arrow
				if (scene.Players[scene.activePlayer].arrows != 0) {
					scene.activeArrow = scene.createNewArrow();
				}
			}));
		}
		
		// Create First arrow
		scene.activeArrow = scene.createNewArrow();

		scene.ground = BABYLON.Mesh.CreateGround("ground", 1000, 1000, 2, scene);
		scene.ground.material = new BABYLON.StandardMaterial("textureGround", scene);
		scene.ground.material.diffuseColor = new BABYLON.Color3(.01, .1, .01);
		scene.ground.checkCollisions = true;
		scene.camera.checkCollisions = true;
		scene.camera.ellipsoid = new BABYLON.Vector3(3, 4, 3);
		
		// // Set up Collisions
		// scene.player.mesh.checkCollisions = true;
		// scene.player.mesh.isVisible = true;
		// scene.player.mesh.ellipsoid = new BABYLON.Vector3(3, .1, 3);
		// scene.player.mesh.ellipsoidOffset = new BABYLON.Vector3(0, .2, 0);
		
		// //Set the ellipsoid around the camera (e.g. your player's size)
		// scene.player.weaponMesh.parent = scene.player.mesh;
		// // Assign Rotation Offset
		// scene.player.mesh.rotationOffset = new BABYLON.Vector3(0,0,0);
		// scene.player.mesh.previousRotation = scene.player.mesh.rotation.y;
		
		// scene.player.mesh.playerAnimations = new Game.importedAnimations(scene.player);
		// scene.player.mesh.playerAnimations.init(scene);
		
		// Allow Game to be started
		$('#startGame').click(function () {
			$('#modal').fadeOut(50, function () {
				$('#modalDiv').html('');
				Game.activeScene=Game.sceneType.Game;
				Game.runRenderLoop();
				//prepareHealthBars();
				// $('#topMenu').fadeIn(200, function () {	});
				// $('#hotKeys').fadeIn(200, function () {	});
				if (Game.debug) {
					$('#debugMenu').fadeIn(200, function () {	});
				}
			});
		});
		$('#startGame').html("Start Game");
		$('#startGame').removeClass("loadingGame");
		scene.isLoaded=true;
	};
	
	//Load all tasks
	scene.assetsManager.load();
	
	if (Game.debug) {
		scene.joystick = {};
		scene.joystickAction = {};
		scene.joystick.deltaJoystickVector = new BABYLON.Vector2(0,0);
		scene.joystickAction._isPressed = false;
	}
	else if (Game.enableJoystick) {
		scene.joystick = new BABYLON.GameFX.VirtualJoystick(true,"white");
		scene.joystickAction = new BABYLON.GameFX.VirtualJoystick(false,"yellow");
	}

	scene.logicLoop = function () {
		var self = scene;
		switch (Game.engine.loopCounter) {   
			case 500:
				Game.engine.loopCounter=0;
				break;
			default:
				Game.engine.loopCounter++;
				break;
		}
		$('#lps').text('LPS: ' + timedLoop.getLoopTime().toFixed());
		$('#fps').text('FPS: ' + Game.engine.getFps().toFixed());
		//Game.processEnemies(self);
		// processInput(self.player, self.player.speed);
	};
	
	scene.cameraCounter = 0;
	scene.easingCounter = 0;
	scene.targetCounter = 0;
	scene.moveMeshes = function () {
		var self = scene;
		var i=0;
		var tempVal;
		var animationRatio = self.getAnimationRatio();
		
		var arrowRot = new BABYLON.Vector3(0,0,0);
		var activeArrowMesh = scene.arrowMeshes[scene.activeArrow];
		
		if (scene.Players[scene.activePlayer].arrows != 0) {
			if ((SpacebarState == KeyState.Down) && activeArrowMesh.arrowDrawing == false) {
				// This gets called once for drawing the arrow
				scene.bowMesh.drawArrow();
				SpacebarState = KeyState.Clear;
				activeArrowMesh.arrowDrawing = true;
				scene.easingCounter=0;
			}
			else if ((SpacebarState == KeyState.Up) && activeArrowMesh.arrowFiring == false) {
				// This gets called once for shooting the arrow
				var currentCameraPos = scene.camera.position;
				var currentCameraRot = scene.camera.rotation;
				var arrowPos = activeArrowMesh.position;
				
				SpacebarState = KeyState.Clear;
				activeArrowMesh.arrowDrawing = false;
				scene.Players[scene.activePlayer].arrowFired();
				$('#arrowInfo').html('x ' + pad(scene.Players[scene.activePlayer].arrows,2));
				
				scene.bindActionToArrow(scene.activeArrow); // Create onIntersectMesh Action
				scene.audio.bowShot.play(); // Play Shooting sound
				
				arrowRot = activeArrowMesh.rotation;
				activeArrowMesh.parent = null;
				
				activeArrowMesh.rotation = new BABYLON.Vector3(0, arrowRot.y + currentCameraRot.y, arrowRot.z + currentCameraRot.x);
				var newPos = translateAlongVector(currentCameraPos, arrowPos, currentCameraRot.y, currentCameraRot.x);
				activeArrowMesh.position = new BABYLON.Vector3(newPos.x, newPos.y, newPos.z);
				// activeArrowMesh.speed = 1;
				
				activeArrowMesh.arrowFiring = true;
				scene.bowMesh.shootArrow();
				// Make sure timer is not active, if it is kill it
				if (scene.timerId) {
					clearTimeout(scene.timerId);
				}
				scene.timerId = setTimeout(function () {
					if (scene.arrowMeshes[scene.activeArrow].arrowFiring) {
						scene.arrowMeshes[scene.activeArrow].arrowFiring = false;
						scene.arrowMeshes[scene.activeArrow].position.y = 0.0;
						// Create a new arrow
						if (scene.Players[scene.activePlayer].arrows != 0) {
							scene.activeArrow = scene.createNewArrow();
						}
					}
				}, 5000); // drop arrow after 5 seconds
			}
		}
		if (activeArrowMesh.arrowDrawing) {
			// Handles the arrow getting drawn back
			if (activeArrowMesh.position.z > 4.08) {
				activeArrowMesh.position.z -= 3.2*Math.sin(scene.easingCounter)*animationRatio; //starting: 6.5, ending: 4.1, 40 frames
			}
			if (activeArrowMesh.position.y < -0.21) {
				activeArrowMesh.position.y += .09*Math.sin(scene.easingCounter)*animationRatio; //starting: 6.5, ending: 4.1, 40 frames
			}
			scene.easingCounter += .00009;
			
			// scene.arrowMeshes[newIndex].position = new BABYLON.Vector3(.16, -.2, 6.3); //4.1
			// scene.arrowMeshes[newIndex].rotation = new BABYLON.Vector3(0, Math.PI/2, .019);
			// activeArrowMesh.position.z -= ((6.5-4.1)/160)*animationRatio; //starting: 6.5, ending: 4.1, 40 frames
		}
		else if (activeArrowMesh.arrowFiring) {
			// Handles the arrow firing
			var motion = calcProjectileMotion(activeArrowMesh.position.x, activeArrowMesh.position.y, activeArrowMesh.position.z, activeArrowMesh.speed, animationRatio, scene.camera.rotation.y, scene.camera.rotation.x);
			// var motion = calcProjectileMotion(activeArrowMesh.position.x, activeArrowMesh.position.y, activeArrowMesh.position.z, activeArrowMesh.speed, animationRatio, activeArrowMesh.rotation.y - Math.PI/1.999, activeArrowMesh.rotation.z - .02);
			activeArrowMesh.position.x = motion.x;
			activeArrowMesh.position.y = motion.y;
			activeArrowMesh.position.z = motion.z;
			activeArrowMesh.speed = motion.v;
		}
		
		$('#debugInfo').html('Camera<br />rY: ' + scene.camera.rotation.y + '<br />rX: ' + scene.camera.rotation.x + '<br />X: ' + scene.camera.position.x + '<br />Y: ' + scene.camera.position.y + '<br />Z: ' + scene.camera.position.z +
		'<br />Arrow<br />X: ' + activeArrowMesh.position.x + '<br />Y: ' + activeArrowMesh.position.y + '<br />Z: ' + activeArrowMesh.position.z +
		'<br />rX: ' + activeArrowMesh.rotation.x + '<br />rY: ' + activeArrowMesh.rotation.y + '<br />rZ: ' + activeArrowMesh.rotation.z);
		
		// Move camera up and down to simulate breathing
		scene.cameraCounter += .01;
		scene.bowMesh.position.y += .000025*Math.cos(scene.cameraCounter);
		scene.arrowMeshes[scene.activeArrow].position.y += .000025*Math.cos(scene.cameraCounter);
		// scene.arrowMeshes[scene.activeArrow].rotation.z += .000015*Math.sin(scene.cameraCounter - .4);
		
		// scene.targetCounter += .01;
		// scene.targetMesh.position.z += .1*Math.cos(scene.targetCounter);
		
		//----For movement, this needs updated every frame, otherwise it would not update----//
		//tempVal = new BABYLON.Vector3(self.player.velocity.magnitude.x*animationRatio,self.player.velocity.magnitude.y*animationRatio,self.player.velocity.magnitude.z*animationRatio);
		// tempVal = self.player.velocity.magnitude.multiply(new BABYLON.Vector3(animationRatio,animationRatio,animationRatio));
		// self.player.mesh.moveWithCollisions(tempVal);
		
		if (KDown == true) {
			if (scene.activeCamera === scene.camera) {
				scene.activeCamera = scene.debugCamera;
			}
			else {
				scene.activeCamera = scene.camera;
			}
		}
		scene.camera.applyGravity=true;
	}
	
    scene.registerBeforeRender(function(){
		scene.moveMeshes();
	});
	
	/******************************************************/
	/*END - STUB CODE*/

    return scene;

}

// Game.CreateGameSceneOriginal = function() {
    // //Creation of the scene 
    // var scene = new BABYLON.Scene(Game.engine);
    // scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
	// scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
	// scene.collisionsEnabled = true;
	// scene.isErrthingReady = false;
    
    // //Adding an Arc Rotate Camera
    // //var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 1, -15), scene);
    // var Alpha = 3*Math.PI/2;
    // var Beta = Math.PI/16;
    // scene.camera = new BABYLON.ArcRotateCamera("Camera", Alpha, Beta, Game.RoomHeight*13.2, new BABYLON.Vector3.Zero(), scene);
	// scene.camera.attachControl(Game.canvas, true);
    // //set camera to not move
	// if (!Game.debug) {
		// scene.camera.lowerAlphaLimit = Alpha;
		// scene.camera.upperAlphaLimit = Alpha;
		// scene.camera.lowerBetaLimit = Beta;
		// scene.camera.upperBetaLimit = Beta;
	// }
	
	// scene.ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 1, 0), scene);
	// scene.ambientLight.diffuse = new BABYLON.Color3(.98, .95, .9);
	// scene.ambientLight.specular = new BABYLON.Color3(.1, .1, .1);
	// scene.ambientLight.groundColor = new BABYLON.Color3(.1, .1, .1);
	// scene.ambientLight.intensity = 1;
	
	// createMaterials(scene);
    // scene.rooms = Game.map.rooms;
    // scene.door = 0;
	// scene.isLoaded=false;

	// //create Asset Manager
	// scene.assetsManager = new BABYLON.AssetsManager(scene);
	// scene.assetsManager.useDefaultLoadingScreen=false;
	
	// //create Asset Tasks
	// scene.playerTask = scene.assetsManager.addMeshTask("playerTask", "", "./Models3D/", "PlayerBody-1.b.js");
	// scene.doorFrameTask = scene.assetsManager.addMeshTask("doorFrameTask", "", "./Models3D/", "DoorFrame.b.js");
	// scene.torchTopTask = scene.assetsManager.addMeshTask("doorFrameTask", "", "./Models3D/", "TorchTopFrame.b.js");
	// scene.doorTask = scene.assetsManager.addMeshTask("doorTask", "", "./Models3D/", "Door.b.js");
	
	// // enemy tasks
	// scene.bossTask = [];
	// scene.enemyTask = [];
	// scene.bossTask.push(scene.assetsManager.addMeshTask("bossTask0", "", "./Models3D/", "Book_Golem2.b.js"));
	// scene.enemyTask.push(scene.assetsManager.addMeshTask("enemyTask0", "", "./Models3D/", "FlyingBook.b.js"));
	
	// //Set functions to assign loaded meshes
	// scene.playerTask.onSuccess = function (task) {
		// var bodyMesh = task.loadedMeshes[0];
		// var weaponMesh = task.loadedMeshes[1];
		// var playerSkeletons = task.loadedSkeletons[0];
		// //bodyMesh.isVisible = true;
		// bodyMesh.scaling = new BABYLON.Vector3(2, 2, 2);
		// bodyMesh.rotation = new BABYLON.Vector3(0, Math.PI, 0);
		
		// scene.player = new Entity(bodyMesh,{weaponMesh: weaponMesh, type: EntityType.Player, health: 4, damage: 1, speed: .6});
		// scene.player.skeletons = playerSkeletons;
		// scene.player.weaponCollisionMesh = task.loadedMeshes[2];
		// prepareHealthBars();
	// }
	// scene.doorFrameTask.onSuccess = function (task) {
		// scene.doorFrame = task.loadedMeshes;
	// }
	// scene.torchTopTask.onSuccess = function (task) {
		// scene.torchTop = task.loadedMeshes[0];
	// }
	// scene.doorTask.onSuccess = function (task) {
		// scene.doorMesh = task.loadedMeshes[2];
		// scene.doorMesh.isVisible = false;
		// scene.doorMesh.scaling = new BABYLON.Vector3(4.8, 4.8, 4.8);
	// }
	
	// scene.enemies = [];
	// for (var i_loop = 0; i_loop < scene.enemyTask.length; i_loop++) {
		// var Index = i_loop;
		// scene.enemyTask[i_loop].onSuccess = function (task) {
			// var j_loop=0;
			// // Load Meshes
			// scene.enemies.push({ meshes: [] });
			// for (j_loop = 0; j_loop < task.loadedMeshes.length; j_loop++) {
				// scene.enemies[Index].meshes[j_loop] = task.loadedMeshes[j_loop];
				// // set all other meshes as children to first mesh
				// if (j_loop > 0) {
					// scene.enemies[Index].meshes[j_loop].parent = scene.enemies[Index].meshes[0];
				// }
			// }
			// // Always set the new mesh to not visible
			// scene.enemies[Index].meshes[0].isVisible = false;
			// // Load Skeletons/Animations
			// scene.enemies[Index].skeletons = [];
			// for (j_loop = 0; j_loop < task.loadedSkeletons.length; j_loop++) {
				// scene.enemies[Index].skeletons[j_loop] = task.loadedSkeletons[j_loop];
			// }
		// }
	// }
	
	// scene.bosses = [];
	// for (var i_loop = 0; i_loop < scene.bossTask.length; i_loop++) {
		// var Index = i_loop;
		// scene.bossTask[i_loop].onSuccess = function (task) {
			// var j_loop=0;
			// // Load Meshes
			// scene.bosses.push({ meshes: [] });
			// for (j_loop = 0; j_loop < task.loadedMeshes.length; j_loop++) {
				// scene.bosses[Index].meshes[j_loop] = task.loadedMeshes[j_loop];
				// // set all other meshes as children to first mesh
				// if (j_loop > 0) {
					// //scene.bosses[Index].meshes[j_loop].parent = scene.bosses[Index].meshes[0];
				// }
			// }
			// // Always set the new mesh to not visible
			// scene.bosses[Index].meshes[0].isVisible = false;
			// // Load Skeletons/Animations
			// scene.bosses[Index].skeletons = [];
			// for (j_loop = 0; j_loop < task.loadedSkeletons.length; j_loop++) {
				// scene.bosses[Index].skeletons[j_loop] = task.loadedSkeletons[j_loop];
			// }
		// }
	// }
	
	// scene.doorFrameTask.onSuccess = function (task) {
		// scene.doorFrame = task.loadedMeshes;
	// }
	
	// //Set up Scene after all Tasks are complete
	// scene.assetsManager.onFinish = function (tasks) {
	
		// Game.createNativeEnemies(scene);
		// // Create Player shadow, which will be the parent mesh
		// scene.player.mesh.checkCollisions = true;
		// scene.player.mesh.isVisible = true;
		// scene.player.mesh.ellipsoid = new BABYLON.Vector3(3, .2, 3);
		
		// //Set the ellipsoid around the camera (e.g. your player's size)
		// scene.player.weaponMesh.parent = scene.player.mesh;
		// // Assign Rotation Offset
		// scene.player.mesh.rotationOffset = new BABYLON.Vector3(0,-Math.PI/2,0);
		// scene.player.mesh.previousRotation = scene.player.mesh.rotation.y;
		
		// scene.player.weaponCollisionMesh.parent = scene.player.mesh;
		// scene.player.weaponCollisionMesh.position.y=2;
		// scene.player.weaponCollisionMesh.rotation.y=-.4;
		// scene.player.weaponCollisionMesh.isVisible = false;
		// //scene.player.weaponCollisionMesh.showBoundingBox = true;
		
		// scene.player.mesh.playerAnimations = new Game.playerAnimations();
		// scene.player.mesh.playerAnimations.init(scene);
		// //set up the action manager for attacks
		// scene.actionManager = new BABYLON.ActionManager(scene);
		// // Detect player input, then play attack animation
		// scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
		// BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
				// if (evt.sourceEvent.keyCode == KEYS.SPACE) {
					// if (scene.player.action != scene.player.Attack) {
						// scene.player.mesh.playerAnimations.attack.start(scene,scene.player);
						// // Loop through meshes and see if an attack landed
						// for (var i_enemy = 0; i_enemy < scene.activeRoom.enemy.length; i_enemy++) {
							// if (!scene.activeRoom.enemy[i_enemy].isDead) {
								// if (Game.detectCollision(scene.player,scene.activeRoom.enemy[i_enemy])) {
									// scene.activeRoom.enemy[i_enemy].health--;
									// if (scene.activeRoom.enemy[i_enemy].health <=0) {
										// scene.activeRoom.enemy[i_enemy].isDead=true;
										// scene.activeRoom.enemy[i_enemy].mesh.enemyAnimations.die.start(scene,scene.activeRoom.enemy[i_enemy]);
										// if (scene.activeRoom.enemy[i_enemy].type == EntityType.Boss) {
											// Game.transportRing.enableIntersect();
										// }
									// }
									// else if (scene.activeRoom.enemy[i_enemy].type != EntityType.Boss) {
										// scene.activeRoom.enemy[i_enemy].mesh.enemyAnimations.takeDmg.start(scene,scene.activeRoom.enemy[i_enemy]);
									// }
								// }
							// }
						// }
					// }
				// }
		// }));
		
		// //Set up initial door and torches
		// scene.torchTop.isVisible = false;
		// scene.doorFrame[0].isVisible = false;
		// scene.doorFrame[0].addLODLevel(Game.performance.viewDistance, null);
		// scene.doorFrame.push(scene.torchTop.clone());
		// scene.doorFrame.push(scene.torchTop.clone());
		// var arrayLength = scene.doorFrame.length;
		// for (var j=1;j < arrayLength;j++){
			// scene.doorFrame[j].parent = scene.doorFrame[0];
			// scene.doorFrame[j].isVisible = false;
		// }
		
		// //create left and right torch tops
		// scene.doorFrame[arrayLength-1].position = new BABYLON.Vector3(1.5,3.2,-1.7);
		// scene.doorFrame[arrayLength-2].position = new BABYLON.Vector3(-1.5,3.2,-1.7);
		// scene.doorFrame[0].scaling = new BABYLON.Vector3(4.8, 4.8, 4.8);
		
		// //create parent tiles for the room
		// scene.parentTile = {'mesh': []};
		// for (var iParent=0; iParent < bjsHelper.tileType.length; iParent++) {
			// Game.createParentTiles(scene, iParent);
		// }
		
		// //Draw Rooms
		// for (var i_room=0; i_room < Game.map.rooms.length; i_room++) {
			// if (Game.map.rooms[i_room].type != Game.RoomType.Empty) {
				// Game.activeRooms++;
				// //set room properties
				// scene.rooms[i_room].originOffset = new BABYLON.Vector3(Game.map.rooms[i_room].col*Game.map.rooms[i_room].width*Game.map.rooms[i_room].tiles[0].width,0,-Game.map.rooms[i_room].row*Game.map.rooms[i_room].height*Game.map.rooms[i_room].tiles[0].width);
				// scene.rooms[i_room].centerPosition = new BABYLON.Vector3((Game.map.rooms[i_room].width-1)/2*Game.map.rooms[i_room].tiles[0].width,0,(Game.map.rooms[i_room].height-1)/2*Game.map.rooms[i_room].tiles[0].width);
				// scene.rooms[i_room].index=i_room;
				// scene.rooms[i_room].enemy=[];
				// scene.rooms[i_room].enemiesDead=false;
				
				// //scene.rooms[i_room].door=[];
				// for (var i = 0; i < Game.map.rooms[i_room].tiles.length ; i++) {
					// scene.rooms[i_room].tiles[i].mesh = Game.drawTile(scene, Game.map.rooms[i_room].tiles[i],i);
					// // scene.rooms[i_room].tiles[i].mesh.useOctreeForRenderingSelection = true;
					// //reposition to room location
					// scene.rooms[i_room].tiles[i].mesh.position.x=scene.rooms[i_room].tiles[i].mesh.position.x+scene.rooms[i_room].originOffset.x;
					// scene.rooms[i_room].tiles[i].mesh.position.z=scene.rooms[i_room].tiles[i].mesh.position.z+scene.rooms[i_room].originOffset.z;
					
					// scene.rooms[i_room].tiles[i].mesh.checkCollisions = true;
					// scene.rooms[i_room].tiles[i].mesh.tileId = i;
					// //create and position doors, adding the torch flame and light
					// if (scene.rooms[i_room].tiles[i].type == Game.TileType.Door) {
						// var doorIndex = scene.rooms[i_room].tiles[i].doorIndex;
						// scene.rooms[i_room].doors[doorIndex].frame.push(scene.doorFrame[0].clone());
						// scene.rooms[i_room].doors[doorIndex].frame[0].isVisible = true;
						// for (var j=1;j < scene.doorFrame.length;j++) {
							// scene.rooms[i_room].doors[doorIndex].frame.push(scene.doorFrame[j].clone());
							// scene.rooms[i_room].doors[doorIndex].frame[j].parent = scene.rooms[i_room].doors[doorIndex].frame[0];
							// scene.rooms[i_room].doors[doorIndex].frame[j].isVisible = true;
						// }
						// scene.rooms[i_room].doors[doorIndex].frame[0].position = new BABYLON.Vector3(scene.rooms[i_room].tiles[i].mesh.position.x, -2,scene.rooms[i_room].tiles[i].mesh.position.z);
						// var doorRotation = ((scene.rooms[i_room].tiles[i].col==scene.rooms[i_room].width-1)*1 + (scene.rooms[i_room].tiles[i].row==scene.rooms[i_room].height-1)*2 + (scene.rooms[i_room].tiles[i].col==0)*3)*Math.PI/2;
						// scene.rooms[i_room].doors[doorIndex].frame[0].rotation = new BABYLON.Vector3(0, doorRotation, 0);
						
						// //set up door and matching door
						// scene.rooms[i_room].doors[doorIndex].mesh=scene.doorMesh.clone();
						// scene.rooms[i_room].doors[doorIndex].mesh.position = new BABYLON.Vector3(scene.rooms[i_room].tiles[i].mesh.position.x, -2,scene.rooms[i_room].tiles[i].mesh.position.z);
						// scene.rooms[i_room].doors[doorIndex].mesh.rotation = new BABYLON.Vector3(0, doorRotation, 0);
						// if (scene.rooms[i_room].tiles[i].col==scene.rooms[i_room].width-1) { // right
							// scene.rooms[i_room].doors[doorIndex].mesh.position.x-=5;
							// scene.rooms[i_room].doors[doorIndex].mesh.position.z+=5;
						// }
						// else if (scene.rooms[i_room].tiles[i].row==scene.rooms[i_room].height-1) { // bottom
							// scene.rooms[i_room].doors[doorIndex].mesh.position.x+=5;
							// scene.rooms[i_room].doors[doorIndex].mesh.position.z+=5;
						// }
						// else if (scene.rooms[i_room].tiles[i].col==0) { // left
							// scene.rooms[i_room].doors[doorIndex].mesh.position.x+=5;
							// scene.rooms[i_room].doors[doorIndex].mesh.position.z-=5;
						// }
						// else { // top
							// scene.rooms[i_room].doors[doorIndex].mesh.position.x-=5;
							// scene.rooms[i_room].doors[doorIndex].mesh.position.z-=5;
						// }
						// scene.rooms[i_room].doors[doorIndex].mesh.isVisible=true;
						// scene.rooms[i_room].doors[doorIndex].mesh.checkCollisions = true;
						
						// //attach fire to TorchTop
						// arrayLength = scene.doorFrame.length-1;
						// scene.rooms[i_room].doors[doorIndex].frame[arrayLength].torchFire = [];
						// scene.rooms[i_room].doors[doorIndex].frame[arrayLength-1].torchFire = [];
						// createTorchFire(scene, scene.rooms[i_room].doors[doorIndex].frame[arrayLength]);
						// createTorchFire(scene, scene.rooms[i_room].doors[doorIndex].frame[arrayLength-1]);
						// scene.rooms[i_room].doors[doorIndex].frame[arrayLength].torchFire[0].light.intensity = 3;
						// scene.rooms[i_room].doors[doorIndex].frame[arrayLength-1].torchFire[0].light.intensity = 3;
						// scene.rooms[i_room].doors[doorIndex].frame[arrayLength].torchFire[0].light.range = 40;
						// scene.rooms[i_room].doors[doorIndex].frame[arrayLength-1].torchFire[0].light.range = 40;
						// scene.rooms[i_room].doors[doorIndex].frame[arrayLength].torchFire[0].emitter = scene.rooms[i_room].doors[doorIndex].frame[arrayLength];
						// scene.rooms[i_room].doors[doorIndex].frame[arrayLength-1].torchFire[0].emitter = scene.rooms[i_room].doors[doorIndex].frame[arrayLength-1];
						// scene.rooms[i_room].doors[doorIndex].frame[arrayLength].torchFire[0].light.setEnabled(false);
						// scene.rooms[i_room].doors[doorIndex].frame[arrayLength-1].torchFire[0].light.setEnabled(false);
					// }
				// }
				// //Game.activateRoom(scene.rooms[i_room],scene.rooms[i_room]);
				
				// if (Game.map.rooms[i_room].type == Game.RoomType.Boss) {
					// Game.spawnBoss(scene, scene.rooms[i_room]);
					// Game.transportRing = new Game.createTransportRing(scene, scene.rooms[i_room]);
				// }
				// else {
					// //Spawn an enemy on some random tile
					// var maxEmenies = Game.getRandomInt(1,3);
					// for (var iSpawn = 0; iSpawn < maxEmenies; iSpawn++) {
						// Game.spawnEnemy(scene, scene.rooms[i_room]);
					// }
				// }
				
				// //Game.activateRoom(scene.rooms[i_room],scene.rooms[i_room]);
				
				// if (Game.map.rooms[i_room].type == Game.RoomType.Entrance) {
					// //Game.activateRoom(scene.rooms[i_room]);
					// scene.camera.target = new BABYLON.Vector3(scene.rooms[i_room].originOffset.x+scene.rooms[i_room].centerPosition.x, 0, scene.rooms[i_room].originOffset.z-scene.rooms[i_room].centerPosition.z);
					// //set active room to entrance
					// scene.activeRoom=Game.map.rooms[i_room];
					// scene.indexOfEntrance=i_room;
					// //activate torch lights
					// for (doorIndex = 0; doorIndex < scene.activeRoom.doors.length; doorIndex++) {
						// arrayLength = scene.activeRoom.doors[doorIndex].frame.length-1;
						// scene.activeRoom.doors[doorIndex].frame[arrayLength].torchFire[0].start();
						// scene.activeRoom.doors[doorIndex].frame[arrayLength-1].torchFire[0].start();
						// scene.activeRoom.doors[doorIndex].frame[arrayLength].torchFire[0].light.setEnabled(true);
						// scene.activeRoom.doors[doorIndex].frame[arrayLength-1].torchFire[0].light.setEnabled(true);
					// }
					// //Game.activateRoom(scene.activeRoom);
				// }
				
			// }
		// }
		// var entranceIndex=scene.activeRoom.index;
		// x0=Game.map.rooms[entranceIndex].col*Game.map.rooms[entranceIndex].width*Game.map.rooms[entranceIndex].tiles[0].width+(Math.floor(Game.map.rooms[entranceIndex].width/2)*Game.map.rooms[entranceIndex].tiles[0].width);
		// z0=-Game.map.rooms[entranceIndex].row*Game.map.rooms[entranceIndex].height*Game.map.rooms[entranceIndex].tiles[0].width-((Game.map.rooms[entranceIndex].height-1)*Game.map.rooms[entranceIndex].tiles[0].width);
		
		// scene.player.mesh.position = new BABYLON.Vector3(x0, 50, z0+10);
		// scene.player.mesh.applyGravity=true;
		// scene.isLoaded=true;
		
		// if (Game.debug) {
			// $('#debugMenu').html('Rooms: ' + parseInt(Game.activeRooms));
		// }
	// };
	
	// //Load all tasks
	// scene.assetsManager.load();
	
	// if (Game.debug) {
		// scene.joystick = {};
		// scene.joystickAction = {};
		// scene.joystick.deltaJoystickVector = new BABYLON.Vector2(0,0);
		// scene.joystickAction._isPressed = false;
	// }
	// else {
		// scene.joystick = new BABYLON.GameFX.VirtualJoystick(true,"white");
		// scene.joystickAction = new BABYLON.GameFX.VirtualJoystick(false,"yellow");
	// }

	// scene.logicLoop = function () {
		// var self = scene;
		// switch (Game.engine.loopCounter) {   
			// case 500:
				// Game.engine.loopCounter=0;
				// break;
			// default:
				// Game.engine.loopCounter++;
				// break;
		// }
		// $('#lps').text('LPS: ' + timedLoop.getLoopTime().toFixed());
		// $('#fps').text('FPS: ' + Game.engine.getFps().toFixed());
		// Game.processEnemies(self);
		// processInput(self.player, self.player.speed);
		// //check what room the player is in
		// self.checkActiveRoom();
	// };
	
	// scene.moveMeshes = function () {
		// var self = scene;
		// var i=0;
		// var tempVal;
		// var animationRatio = self.getAnimationRatio();
		
		// //Need to update self every loop, I guess
		// for (i=0; i < self.activeRoom.enemy.length;i++) {
			// if (self.activeRoom.enemy[i].action == 1 && self.activeRoom.enemy[i].isDead == false) {
				// self.activeRoom.enemy[i].mesh.previousPosition = new BABYLON.Vector3(self.activeRoom.enemy[i].mesh.position.x,self.activeRoom.enemy[i].mesh.position.y,self.activeRoom.enemy[i].mesh.position.z);
				// tempVal = self.activeRoom.enemy[i].velocity.direction.multiply(new BABYLON.Vector3(animationRatio,animationRatio,animationRatio));
				// self.activeRoom.enemy[i].mesh.moveWithCollisions(tempVal);
			// }
		// }
		// //tempVal = new BABYLON.Vector3(self.player.velocity.direction.x*animationRatio,self.player.velocity.direction.y*animationRatio,self.player.velocity.direction.z*animationRatio);
		// tempVal = self.player.velocity.direction.multiply(new BABYLON.Vector3(animationRatio,animationRatio,animationRatio));
		// self.player.mesh.moveWithCollisions(tempVal);
	// }
	
    // scene.registerBeforeRender(function(){
		// scene.moveMeshes();
	// });

    // //When click event is raised
    // // $('#renderCanvas').on("click", function (evt) {

        // // var scale = getScale();
        // // if (scale == null) {
            // // scale = 1;
        // // }
        // // // We try to pick an object
        // // var pickResult = scene.pick(evt.offsetX, evt.offsetY);

        // // // if the click hits the ground object, we change the impact position
        // // if (pickResult.hit) {
            // // //some function
        // // }
    // // });
	
    // return scene;

// }


this.getScale = function () {
    this.viewportScale = undefined;
    // Calculate viewport scale 
    this.viewportScale = screen.width / window.innerWidth;
    return this.viewportScale;
}

// This is for creating textures for native BJS objects
function createMaterials(activeScene) {
	//var activeScene = Game.scene[Game.activeScene];
	//Create me some textures
	var randomColor = new BABYLON.Color3(Game.getRandomInt(0,10)/10, Game.getRandomInt(0,10)/10, Game.getRandomInt(0,10)/10);
	// randomColor =  new BABYLON.Color3(0,0,0); // awesome black tiles
	activeScene.transportRingMaterial = function () {
		var fireTexture = new BABYLON.FireProceduralTexture("fire", 128, activeScene);
		fireTexture.fireColors = BABYLON.FireProceduralTexture.PurpleFireColors;
		
		$.extend(this,new BABYLON.StandardMaterial("transportRingMaterial", activeScene));
		this.diffuseTexture = fireTexture;
		this.opacityTexture = fireTexture;
	}
}

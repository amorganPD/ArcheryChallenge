// Handles creation and parameters of the BJS Cameras

Game.cameras = function (scene) {
    var self = Game.cameras;
    
    var createFreeCamera = function () {
        scene.camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 8, 0), scene);
        scene.camera.position.z = -60;
        scene.camera.rotation.y = .03;
        scene.camera.keysUp.push(87);// W
        scene.camera.keysLeft.push(65); // A 
        scene.camera.keysDown.push(83); // S 
        scene.camera.keysRight.push(68); // D
    }
    var createTouchCamera = function () {
        scene.touchCamera = new BABYLON.VirtualJoysticksCamera("TouchCamera", new BABYLON.Vector3(0, 8, 0), scene);
        scene.touchCamera.position.z = -60;
        scene.touchCamera.rotation.y = .03;
        scene.touchCamera.angularSensibility *= .75;
        scene.touchCamera.inertia = .1;
        scene.touchCamera.keysUp.push(87);// W
        scene.touchCamera.keysLeft.push(65); // A 
        scene.touchCamera.keysDown.push(83); // S 
        scene.touchCamera.keysRight.push(68); // D
    }
    var createVRCamera = function () {
        scene.vrCamera = new BABYLON.VRDeviceOrientationFreeCamera("VRCamera", new BABYLON.Vector3(0, 8, 0), scene);
    }
    var createDebugCamera = function () {
        scene.debugCamera = new BABYLON.FreeCamera("DebugFreeCamera", new BABYLON.Vector3(0, 8, 0), scene);
        scene.debugCamera.rotation.y = Math.PI;
        scene.debugCamera.keysUp.push(87);// W
        scene.debugCamera.keysLeft.push(65); // A 
        scene.debugCamera.keysDown.push(83); // S 
        scene.debugCamera.keysRight.push(68); // D
    }
    
    self.init = function () {
        createFreeCamera();
        createVRCamera();
        createDebugCamera();
        // Check if Device is a touch device
	    if (Modernizr.touchevents) {
            createTouchCamera();
            scene.touchCamera.attachControl(Game.canvas, true);
	        scene.activeCamera = scene.touchCamera;
            Game.preferences.cameraType = Game.cameraType.Touch;
            $('#cameraMode').html('Touch');
        }
        else {
            scene.camera.attachControl(Game.canvas, true);
	        scene.activeCamera = scene.camera;
            Game.preferences.cameraType = Game.cameraType.Normal;
        }
    }
    self.switch = function(whichCamera) {
        // get current rotation and position of activeCamera
        var currentPosZ = scene.activeCamera.position.z;
        var currentRotY = scene.activeCamera.rotation.y;
        if (scene.touchCamera) {
            scene.touchCamera.dispose();
        }
        switch(whichCamera) {
            case Game.cameraType.Touch:
                createTouchCamera();
                scene.touchCamera.attachControl(Game.canvas, true);
                Game.preferences.cameraType = Game.cameraType.Touch;
                // Align with current camera
                scene.touchCamera.position.z = currentPosZ;
                scene.touchCamera.rotation.y = currentRotY;
                scene.activeCamera = scene.touchCamera;
                break;
            case Game.cameraType.VR:
                scene.vrCamera.attachControl(Game.canvas, true);
                Game.preferences.cameraType = Game.cameraType.VR;
                // Align with current camera
                scene.vrCamera.position.z = currentPosZ;
                scene.vrCamera.rotation.y = currentRotY;
                scene.activeCamera = scene.vrCamera;
                break;
            case Game.cameraType.Debug:
                scene.debugCamera.attachControl(Game.canvas, true);
                Game.preferences.cameraType = Game.cameraType.Debug;
                // Align with current camera
                scene.debugCamera.position.z = currentPosZ;
                scene.debugCamera.rotation.y = currentRotY;
                scene.activeCamera = scene.debugCamera;
                break;
            default:
                scene.camera.attachControl(Game.canvas, true);
                Game.preferences.cameraType = Game.cameraType.Normal;
                // Align with current camera
                scene.camera.position.z = currentPosZ;
                scene.camera.rotation.y = currentRotY;
                scene.activeCamera = scene.camera;
                break;
        }
		// Update Binding of Bow/Arrow Mesh to camera
		scene.bowMesh.parent = scene.activeCamera;
        scene.arrowMeshes[scene.activeArrow].parent = scene.activeCamera;
        // Make sure Gravity and Collisions are active
        scene.activeCamera.checkCollisions = true;
        scene.activeCamera.ellipsoid = new BABYLON.Vector3(10, 4, 10);
		scene.activeCamera.applyGravity = true;
        Game.initPointerLock(scene.activeCamera);
    }
    // self.calibrateVROrientation = function() {
    //     // get Offset from Target
    //     vrCamera.inputs.attached.VRDeviceOrientation.detachControl(canvas);
    //     var onOrientationEvent = function(evt) {
    //         this._alpha = (+evt.alpha | 0) + 45;
    //         this._beta = (+evt.beta | 0) + 45;
    //         this._gamma = +evt.gamma | 0;
    //         this._dirty = true;
    //     }
        
    //     vrCamera.inputs.attached.VRDeviceOrientation._deviceOrientationHandler = onOrientationEvent.unbind(camera.inputs.attached.VRDeviceOrientation);
    //     vrCamera.inputs.attached.VRDeviceOrientation._deviceOrientationHandler = onOrientationEvent.bind(camera.inputs.attached.VRDeviceOrientation);
    //     vrCamera.inputs.attached.VRDeviceOrientation.attachControl(canvas);
    // }
}

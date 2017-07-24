
//Key States
var KeyState = {
		'Down': 0,
		'Up': 1,
		'Clear': 2
	};
var LeftDown = false;
var RightDown = false;
var UpDown = false;
var DownDown = false;
var KDown = false;
var SpacebarState = KeyState.Clear;
var ShiftDown = false;

function getKeyState(keystate) {
	var state = keystate;
	keystate = KeyState.Clear;
	return state;
}

//KEYS
var KEYS = {
    ENTER: 13,
    SHIFT: 16,
    ESCAPE: 27,
    SPACE: 32,
    LEFT: 'A'.charCodeAt(0),
    UP: 'W'.charCodeAt(0),
    RIGHT: 'D'.charCodeAt(0),
    DOWN: 'S'.charCodeAt(0),
    K: 'K'.charCodeAt(0),
    P: 'P'.charCodeAt(0),
    ONE: '1'.charCodeAt(0),
    EIGHT: '8'.charCodeAt(0)
};

//Key Listeners
window.addEventListener('keydown', doKeyDown, true);
window.addEventListener('keyup', doKeyUp, true);
window.addEventListener('mousedown', mouseDown, true);
window.addEventListener('mouseup', mouseUp, true);

function doKeyDown(evt) {
    switch (evt.keyCode) {
        case KEYS.SPACE:
            SpacebarState = KeyState.Down;
            break;
        case KEYS.K:
            KDown = true;
            break;
        case KEYS.LEFT:
            LeftDown = true;
            break;
            //right      
        case KEYS.RIGHT:
            RightDown = true;
            break;
        case KEYS.UP:
            UpDown = true;
            break;
        case KEYS.DOWN:
            DownDown = true;
            break;
        case KEYS.ONE:
            if (Game.pointerLock != undefined) {
                Game.pointerLock();
            }
            break;
        case KEYS.SHIFT:
            ShiftDown = true;
            break;   
        case KEYS.EIGHT:
            if ((Game.skipRound != undefined) && ShiftDown) {
                Game.skipRound();
            }
            break;     
        case KEYS.ESCAPE:
            if (Game.isMenuOpen) {
                Game.closeMenu();
            }
            else {
                Game.openMenu();
            }
            break;          
    }
}
function mouseDown(evt) {
    if (Game.controlEnabled) {
        SpacebarState = KeyState.Down;
    }
}
function pointerDown(evt) {
    if (Game.preferences.cameraType == Game.cameraType.Touch || Game.preferences.cameraType == Game.cameraType.VR) {
        SpacebarState = KeyState.Down;
    }
}

function doKeyUp(evt) {
    switch (evt.keyCode) {
        case KEYS.SPACE:
            SpacebarState = KeyState.Up;
            break;
        case KEYS.K:
            KDown = false;
            break;
        case KEYS.LEFT:
            LeftDown = false;
            break;
            //right      
        case KEYS.RIGHT:
            RightDown = false;
            break;
        case KEYS.UP:
            UpDown = false;
            break;
        case KEYS.SHIFT:
            ShiftDown = false;
            break;
        case KEYS.DOWN:
            DownDown = false;
            break;
    }
}
function mouseUp(evt) {
    if (Game.controlEnabled) {
        SpacebarState = KeyState.Up;
    }
}
function pointerUp(evt) {
    if (Game.preferences.cameraType == Game.cameraType.Touch || Game.preferences.cameraType == Game.cameraType.VR) {
        SpacebarState = KeyState.Up;
    }
}

function lookupTableATan2() {
	var ltArray = [[],[],[]];
	ltArray[0][0] = 0;
	ltArray[0][1] = Math.atan2(0,1);
	ltArray[0][2] = Math.atan2(0,-1);
	ltArray[1][0] = Math.atan2(1,0);
	ltArray[2][0] = Math.atan2(-1,0);
	ltArray[1][1] = Math.atan2(1,1);
	ltArray[1][2] = Math.atan2(1,-1);
	ltArray[2][1] = Math.atan2(-1,1);
	ltArray[2][2] = Math.atan2(-1,-1);
	
	return ltArray;
}


function processInput(entity,speed) {
	var vX=0;
	var iX=0;
	var vZ=0;
	var iZ=0;
	var activeScene = Game.scene[Game.activeScene];
	var delta = activeScene.joystick.deltaJoystickVector;
	
    // if (UpDown && !DownDown || delta.y < -5) {
        // vZ=1; // velocity
		// iZ=1; // angle index
    // }
    // else if (DownDown && !UpDown || delta.y > 5) {
        // vZ=-1; // velocity
		// iZ=2; // angle index
    // }
    if (LeftDown && !RightDown || delta.x < -5) {
        vZ=-1; // velocity
		iX=1; // angle index
    }
    else if (RightDown && !LeftDown || delta.x > 5) {
        vZ=1; // velocity
		iX=2; // angle index
    }
	if (vX || vZ) {
		var angle = Game.ltArray[iZ][iX];
		var newRotation = -angle + entity.mesh.rotationOffset.y;
		entity.mesh.rotation.y = newRotation;
		entity.mesh.currentFacingAngle = new BABYLON.Vector3(entity.mesh.rotation.x, newRotation, entity.mesh.rotation.z);
		
		entity.velocity.magnitude = new BABYLON.Vector3(0, activeScene.gravity.y, speed*vZ);
		entity.velocity.angle = angle;
		entity.mesh.playerAnimations.move.start(activeScene, entity);
	}
	else {
		entity.velocity.magnitude = new BABYLON.Vector3(speed*vX, activeScene.gravity.y, 0);
		entity.mesh.playerAnimations.idle.start(activeScene, entity);
	}	
	
	if (activeScene.joystickAction._joystickPressed) {
		if (entity.attacking==false) {
			entity.mesh.playerAnimations.attack.start(activeScene, entity);
		}
	}

}


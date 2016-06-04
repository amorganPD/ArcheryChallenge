

Game.importedAnimations = function(mesh, keysArray) {
	var self = this;
	self.animating = 0;
	self.length = 0;
	self.keys = keysArray;
	
	self.Animation = function(activeScene, mesh, keys) {
		var create = function () {
			// find and set keys 0 - 100
			mesh.moveKeys = [];
			mesh.moveKeys.push(0);
			mesh.moveKeys.push(40);
		}
		this.start = function (activeScene, mesh) {
			// Only play animation if previous state was idle
			if (mesh.action == mesh.actionType.Idle) {
				// Make sure no other animations are running
				if (mesh.animatable) {
					mesh.animatable.stop();
				}
				mesh.action = mesh.actionType.Move;
				mesh.animatable = activeScene.beginAnimation(mesh.skeletons, mesh.moveKeys[0], mesh.moveKeys[1], false, 1, function () {
					mesh.action=mesh.actionType.Idle;
				});
			}
		}
		create(); // create animation
	};
	
	self.init = function (activeScene) {
		this.idle = new self.Idle(activeScene, mesh);
		this.move = new self.Move(activeScene, mesh);
		this.attack = new self.Attack(activeScene);
		this.die = new self.Die(activeScene, mesh);
		this.takeDmg = new self.TakeDmg(activeScene);
	}
}


Game.importedAnimationsOG = function(mesh) {
	var self = this;
	self.animating = 0;
	
	self.Move = function(activeScene, mesh) {
		var create = function () {
			// find and set keys 0 - 100
			mesh.moveKeys = [];
			mesh.moveKeys.push(0);
			mesh.moveKeys.push(40);
		}
		this.start = function (activeScene, mesh) {
			// Only play animation if previous state was idle
			if (mesh.action == mesh.actionType.Idle) {
				// Make sure no other animations are running
				if (mesh.animatable) {
					mesh.animatable.stop();
				}
				mesh.action = mesh.actionType.Move;
				mesh.animatable = activeScene.beginAnimation(mesh.skeletons, mesh.moveKeys[0], mesh.moveKeys[1], false, 1, function () {
					mesh.action=mesh.actionType.Idle;
				});
			}
		}
		create(); // create animation
	};
	
	self.Idle = function(activeScene) {
		var create = function () {
			// Use imported skeleton
			self.Idle.animation = activeScene.player.skeletons;
		}
		this.start = function (activeScene, mesh) {
			// Only play animation if previous state was idle
			if (mesh.action == mesh.actionType.Idle) {
				// Make sure no other animations are running
				if (mesh.animatable) {
					mesh.animatable.stop();
				}
				mesh.action = mesh.actionType.Idle;
				// TO DO: Add idle animation
				//mesh.animatable = activeScene.beginAnimation(self.Move.animation, 0, 40, true, 1.0);
			}
		}
		create(); // create animation
	};
	
	self.Attack = function(activeScene) {
		var create = function () {
			// Use imported skeleton
			//self.Attack.animation = activeScene.player.skeletons;
		}
		this.start = function (activeScene, mesh) {
			// Only play animation if previous state was idle
			if (mesh.action != mesh.actionType.Attack) {
				// Make sure no other animations are running
				if (mesh.animatable) {
					mesh.animatable.stop();
				}
				mesh.action=mesh.actionType.Attack;
				mesh.animatable = activeScene.beginAnimation(mesh.skeletons, mesh.attackKeys[mesh.attack[mesh.activeAttack].type*2], mesh.attackKeys[mesh.attack[mesh.activeAttack].type*2+1], false, 1*mesh.weapon[mesh.activeAttack].speedModifier, function () {
					Game.detectEnemyHit(activeScene, mesh);
					mesh.action=mesh.actionType.Idle;
					if (mesh.type == meshType.Boss) {
						mesh.activeAttack = Game.getRandomInt(0,(mesh.attack.length)-1);
					}
				});
			}
		}
		create(); // create animation
	};
	
	self.TakeDmg = function(activeScene) {
		var create = function () {
			//create animations for player
			self.TakeDmg.animation = new BABYLON.Animation("dieAnimation", "material.emissiveColor", 60, BABYLON.Animation.ANIMATIONTYPE_COLOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);// Animation keys
			// create keys
			var keys = [];
			keys.push({
				frame: 0,
				value: new BABYLON.Color3(1,0,0)
			});
			keys.push({
				frame: 20,
				value: new BABYLON.Color3(0,0,0)
			});
			keys.push({
				frame: 40,
				value: new BABYLON.Color3(1,0,0)
			});
			keys.push({
				frame: 60,
				value: new BABYLON.Color3(0,0,0)
			});
			//Add keys to the animation object
			self.TakeDmg.animation.setKeys(keys);
			//create animations for player
			//self.TakeDmg.animationKnockback = new BABYLON.Animation("knockbackAnimation", "position", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
		}
		this.start = function (activeScene, mesh) {
			// Make sure no other animations are running
			if (mesh.animatable) {
				mesh.animatable.stop();
			}
			mesh.action = mesh.actionType.TakeDmg;
			self.animating = 1;
			//Attach animation to player mesh
			if (mesh.animations == undefined) {
				mesh.animations.push(self.TakeDmg.animation);
			}
			else {
				mesh.animations[0] = self.TakeDmg.animation;
			}
			mesh.animatable = activeScene.beginAnimation(mesh, 0, 60, false, 1.0, function () {
				mesh.action = mesh.actionType.Move;
			});
		}
		create(); // create animation
	}
	
	self.Die = function(activeScene, mesh) {
		var create = function () {
			//create animations for player
			self.Die.animation = new BABYLON.Animation("dieAnimation", "scaling", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
			// create keys
			var keys = [];
			var startScaling = mesh.scaling;
			var endScaling = mesh.scaling;
			//At the animation key 0, the value of scaling is "1"
			keys.push({
				frame: 0,
				value: startScaling.add(new BABYLON.Vector3(.1, .1, .1))
			});
			keys.push({
				frame: 10,
				value: startScaling.subtract(new BABYLON.Vector3(.5, .5, .5))
			});
			keys.push({
				frame: 20,
				value: startScaling.add(new BABYLON.Vector3(.4, .4, .4))
			});
			keys.push({
				frame: 30,
				value: endScaling.subtract(new BABYLON.Vector3(.5, .5, .5))
			});
			//Add keys to the animation object
			self.Die.animation.setKeys(keys);
			//Attach animation to player mesh
			//activeScene.player.mesh.animations.push(self.Die.animation);
		}
		this.start = function (activeScene, mesh, dieFunction) {
			// Make sure no other animations are running
			if (mesh.animatable) {
				mesh.animatable.stop();
			}
			mesh.action = mesh.actionType.Die;
			self.animating = 1;
			//Attach animation to player mesh
			if (mesh.animations == undefined) {
				mesh.animations.push(self.Die.animation);
			}
			else {
				mesh.animations[0] = self.Die.animation;
				//mesh.animatable.stop();
			}
			mesh.animatable = activeScene.beginAnimation(mesh, 0, 30, false, 1.0, function () {
				mesh.dispose();
				if (mesh.actionManager) {
					mesh.actionManager.actions = []; // remove actions
				} 
				// activeScene.activeRoom.enemy.splice(mesh.index, 1);
				if (dieFunction != undefined) {
					dieFunction(); // execute Callback function
				}
			});
		}
		create(); // create animation
	};
	
	self.init = function (activeScene) {
		this.idle = new self.Idle(activeScene, mesh);
		this.move = new self.Move(activeScene, mesh);
		this.attack = new self.Attack(activeScene);
		this.die = new self.Die(activeScene, mesh);
		this.takeDmg = new self.TakeDmg(activeScene);
	}
}
Game.targetType = {
    NORMAL: 0,
    ONESHOT: 1
};
Game.Data = {
    activeStage: {},
    stages: [],
    stageCount: 1
};

Game.createStage = function(scene, whichStage) {
    // Create Skybox
    scene.skybox = BABYLON.Mesh.CreateBox("skyBox", 2000.0, scene);
    scene.skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    scene.skyboxMaterial.backFaceCulling = false;
    scene.skyboxMaterial.disableLighting = true;
    scene.skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    scene.skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    scene.skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./Textures/TropicalSunnyDay/TropicalSunnyDay", scene);
    scene.skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    scene.skybox.material = scene.skyboxMaterial;
    scene.skybox.position = new BABYLON.Vector3(0, -10, 0);
    scene.skybox.infiniteDistance = true;

    // Bind Bow Mesh to camera
    scene.bowMesh.parent = scene.activeCamera;
    scene.bowMesh.position = new BABYLON.Vector3(.05, -.3, 3.57);
    scene.bowMesh.rotation = new BABYLON.Vector3(.02, 0, -Math.PI/16);

    Game.initArrows(scene);
    // Create First arrow
    scene.activeArrow = scene.createNewArrow();

    // scene.ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "./Textures/heightmap_Valley.jpg", 800, 800, 30, 0, 100, scene, false, function (mesh) {
    //     scene.ground.material = new BABYLON.StandardMaterial("textureGround", scene);
    //     scene.ground.material.diffuseTexture = new BABYLON.Texture('./Textures/texture_Grass-03.jpg', scene);
    //     scene.ground.material.diffuseTexture.uScale=16;
    //     scene.ground.material.diffuseTexture.vScale=16;
    //     scene.ground.checkCollisions = true;
    //     scene.activeCamera.checkCollisions = true;
    //     scene.activeCamera.ellipsoid = new BABYLON.Vector3(10, 4, 10);
    // });
    scene.imposterTrunk.checkCollisions = true;

    // Generate some random trees
    scene.generateTrees();

    // Set up the fence
    scene.fenceMeshes = [];
    var xMult = 9;
    var xOffset = xMult/2 - 18;
    scene.fenceMesh.position = new BABYLON.Vector3(xOffset, 0, -40);
    var newFenceIndex = scene.fenceMeshes.push(scene.instanceWithChildren(scene.fenceMesh, 'fenceClone', scene, 0, true)) - 1; // create new Fence
    scene.fenceMeshes[newFenceIndex].position = new BABYLON.Vector3(-(newFenceIndex + 1)*xMult + xOffset, 0, -40);
    for (var i=0; i < 11; i++) {
        newFenceIndex = scene.fenceMeshes.push(scene.instanceWithChildren(scene.fenceMesh, 'fenceClone', scene, (newFenceIndex + 1), true)) - 1; // create new Fence
        scene.fenceMeshes[newFenceIndex].position = new BABYLON.Vector3(-(newFenceIndex + 1)*xMult + xOffset, 0, -40);
    }
    
    xOffset += 8;
    newFenceIndex = scene.fenceMeshes.push(scene.instanceWithChildren(scene.fenceMesh, 'fenceClone', scene, (newFenceIndex + 1), true)) - 1; // create new Fence
    var rightStart = newFenceIndex;
    scene.fenceMeshes[newFenceIndex].position = new BABYLON.Vector3((newFenceIndex - rightStart + 1)*xMult + xOffset, 0, -40);
    for (var i=0; i < 13; i++) {
        newFenceIndex = scene.fenceMeshes.push(scene.instanceWithChildren(scene.fenceMesh, 'fenceClone', scene, (newFenceIndex + 1), true)) - 1; // create new Fence
        scene.fenceMeshes[newFenceIndex].position = new BABYLON.Vector3((newFenceIndex - rightStart + 1)*xMult + xOffset, 0, -40);
    }

    Game.Data.activeStage = Game.Data.stages[whichStage];
}

Game.creatRandomChallenge = function (scene, whichChallenge) {
    if (whichChallenge >= Game.Data.activeStage.challenges.length) {
        // Generate random until more stages and challenges exist
        var points = 200 + (Math.floor(Math.random()*10)*30);
        Game.Data.activeStage.MaxChallenges = Game.Data.activeStage.challenges.push(new Game.challenge( {
            requiredPoints: points,
            targetData: [{
                positionOffset: new BABYLON.Vector3(Math.random()*100-50, 6, Math.random()*100),
                type: Game.targetType.NORMAL
            }]
        }));
    }
}
Game.createChallenge = function(scene, whichChallenge) {
    var thisChallenge = Game.Data.activeStage.challenges[whichChallenge];
    for (var i=0; i < thisChallenge.targetData.length; i++) {
        var thisTarget = thisChallenge.targetData[i];
        switch (thisTarget.type) {
            case Game.targetType.NORMAL:
                thisChallenge.targetData[i].mesh = scene.targetMesh;                
                break;
            case Game.targetType.ONESHOT:
                // clone target of this type
                thisChallenge.targetData[i].mesh = scene.instanceWithChildren(scene.targetOneShotMesh, 'targetOneShotClone', scene);
                thisChallenge.targetData[i].mesh.isVisible = true;
                thisChallenge.targetData[i].isHit = false;
                break;
        }
        //set position and movement
        if (thisChallenge.targetData[i].mesh.targetAnimation != undefined) {
            thisChallenge.targetData[i].mesh.targetAnimation.stop();
        }
        thisChallenge.targetData[i].mesh.position = Game.Data.activeStage.positionOrigin.add(thisChallenge.targetData[i].positionOffset);
        if (thisChallenge.targetData[i].startPositionOffset != undefined) {
            thisChallenge.targetData[i].mesh.animation = new BABYLON.Animation(
                "targetAnimation",
                "position",
                30,
                BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
                BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
            );
            thisChallenge.targetData[i].mesh.keys = []; 
            thisChallenge.targetData[i].mesh.keys.push({
                frame: 0 / thisChallenge.targetData[i].speed,
                value: thisChallenge.targetData[i].mesh.position.add(thisChallenge.targetData[i].startPositionOffset)
            });
            thisChallenge.targetData[i].mesh.keys.push({
                frame: 60 / thisChallenge.targetData[i].speed,
                value: thisChallenge.targetData[i].mesh.position.add(thisChallenge.targetData[i].endPositionOffset)
            });
            thisChallenge.targetData[i].mesh.keys.push({
                frame: 120 / thisChallenge.targetData[i].speed,
                value: thisChallenge.targetData[i].mesh.position.add(thisChallenge.targetData[i].startPositionOffset)
            });
            thisChallenge.targetData[i].mesh.animation.setKeys(thisChallenge.targetData[i].mesh.keys);
            thisChallenge.targetData[i].mesh.animations.push(thisChallenge.targetData[i].mesh.animation);
            thisChallenge.targetData[i].mesh.targetAnimation = scene.beginAnimation(thisChallenge.targetData[i].mesh, 0, 120 / thisChallenge.targetData[i].speed, true);
        }
    }
	
}

Game.challenge = function(options) {
	$.extend(this,{
		requiredPoints: 500,
		targetData: [{
            positionOffset: new BABYLON.Vector3(0, 6, -15),
            type: Game.targetType.NORMAL,
            speed: 0,
            startPositionOffset: new BABYLON.Vector3(0, 0, 0),
            endPositionOffset: new BABYLON.Vector3(0, 0, 0)
        }]
	},options||{});
};
Game.hasOneShot = function (targetData) {
    for (var i=0; i < targetData.length; i++ ) {
        if (targetData[i].type == Game.targetType.ONESHOT) {
            return true;
        }
    }
    return false;
}
Game.areAllOneShotsHit = function (targetData) {
    var result = true;
    for (var i=0; i < targetData.length; i++ ) {
        if (targetData[i].type == Game.targetType.ONESHOT) {
            result = result && targetData[i].isHit;
        }
    }
    return result;
}

Game.Data.stages.push(new function () {
    var MaxChallenges = 0;
    this.challenges = [];
    this.name = "The Forest";
    this.positionOrigin = new BABYLON.Vector3(0,0,0);
    this.allowNextStage = function (scene) {
        scene.gateMesh.openGate();
        Game.challengeCount = 0;
        Game.Data.activeStage = Game.Data.stages[Game.Data.stageCount++];
    }
    
    //Challenge 1
    MaxChallenges = this.challenges.push(new Game.challenge( {
		requiredPoints: 300,
		targetData: [{
            positionOffset: new BABYLON.Vector3(0, 6, -15),
            type: Game.targetType.NORMAL
        }]
    }));
    //Challenge 2
    MaxChallenges = this.challenges.push(new Game.challenge( {
		requiredPoints: 325,
		targetData: [{
            positionOffset: new BABYLON.Vector3(0, 6, 15),
            type: Game.targetType.NORMAL
        }]
    }));
    //Challenge 3
    MaxChallenges = this.challenges.push(new Game.challenge( {
		requiredPoints: 300,
		targetData: [{
            positionOffset: new BABYLON.Vector3(0, 6, 20),
            type: Game.targetType.NORMAL,
            speed: .5,
            startPositionOffset: new BABYLON.Vector3(-15, 0, 0),
            endPositionOffset: new BABYLON.Vector3(15, 0, 0)
        }]
    }));
    //Challenge 4
    MaxChallenges = this.challenges.push(new Game.challenge( {
		requiredPoints: 325,
		targetData: [{
            positionOffset: new BABYLON.Vector3(10, 6, 30),
            type: Game.targetType.NORMAL,
            speed: .75,
            startPositionOffset: new BABYLON.Vector3(-15, 0, 0),
            endPositionOffset: new BABYLON.Vector3(15, 0, 0)
        }]
    }));
    //Challenge 5
    MaxChallenges = this.challenges.push(new Game.challenge( {
		requiredPoints: 250,
		targetData: [{
            positionOffset: new BABYLON.Vector3(15, 6, 50),
            type: Game.targetType.NORMAL,
            speed: .7,
            startPositionOffset: new BABYLON.Vector3(0, 0, 0),
            endPositionOffset: new BABYLON.Vector3(40, 0, 0)
        }]
    }));
});
Game.Data.stages.push(new function () {
    var MaxChallenges = 0;
    this.challenges = [];
    this.name = "The Cliff";
    this.positionOrigin = new BABYLON.Vector3(0,0,500);
    this.allowNextStage = function (scene) {
        Game.challengeCount = 0;
        Game.Data.activeStage = Game.Data.stages[Game.Data.stageCount++];
    }
    
    //Challenge 1
    MaxChallenges = this.challenges.push(new Game.challenge( {
		requiredPoints: 200,
		targetData: [{
            positionOffset: new BABYLON.Vector3(0, 6, -15),
            type: Game.targetType.NORMAL
        },
        {
            positionOffset: new BABYLON.Vector3(-10, 16, -15),
            type: Game.targetType.ONESHOT,
            isHit: false
        }]
    }));
    //Challenge 2
    MaxChallenges = this.challenges.push(new Game.challenge( {
		requiredPoints: 250,
		targetData: [{
            positionOffset: new BABYLON.Vector3(0, 6, 15),
            type: Game.targetType.NORMAL
        },
        {
            positionOffset: new BABYLON.Vector3(-10, 0, -30),
            type: Game.targetType.ONESHOT,
            isHit: false
        },
        {
            positionOffset: new BABYLON.Vector3(20, 16, -30),
            type: Game.targetType.ONESHOT,
            isHit: false
        }]
    }));
    //Challenge 3
    MaxChallenges = this.challenges.push(new Game.challenge( {
		requiredPoints: 200,
		targetData: [{
            positionOffset: new BABYLON.Vector3(0, 6, 20),
            type: Game.targetType.NORMAL,
            speed: .5,
            startPositionOffset: new BABYLON.Vector3(0, 20, 0),
            endPositionOffset: new BABYLON.Vector3(0, -10, 0)
        },
        {
            positionOffset: new BABYLON.Vector3(-10, 0, -30),
            type: Game.targetType.ONESHOT,
            isHit: false,
            speed: .5,
            startPositionOffset: new BABYLON.Vector3(-20, 6, 0),
            endPositionOffset: new BABYLON.Vector3(10, 6, 0)
        },
        {
            positionOffset: new BABYLON.Vector3(20, 16, -30),
            type: Game.targetType.ONESHOT,
            isHit: false,
            speed: .5,
            startPositionOffset: new BABYLON.Vector3(0, 6, -40),
            endPositionOffset: new BABYLON.Vector3(0, 6, 0)
        }]
    }));
    //Challenge 4
    MaxChallenges = this.challenges.push(new Game.challenge( {
		requiredPoints: 300,
		targetData: [{
            positionOffset: new BABYLON.Vector3(0, 6, 30),
            type: Game.targetType.NORMAL,
            speed: .35,
            startPositionOffset: new BABYLON.Vector3(0, 6, -80),
            endPositionOffset: new BABYLON.Vector3(0, 6, 0)
        },
        {
            positionOffset: new BABYLON.Vector3(-10, 0, -30),
            type: Game.targetType.ONESHOT,
            isHit: false,
            speed: .5,
            startPositionOffset: new BABYLON.Vector3(-20, 30, 0),
            endPositionOffset: new BABYLON.Vector3(10, 0, 0)
        },
        {
            positionOffset: new BABYLON.Vector3(20, 16, -20),
            type: Game.targetType.ONESHOT,
            isHit: false,
            speed: .5,
            startPositionOffset: new BABYLON.Vector3(10, 20, -30),
            endPositionOffset: new BABYLON.Vector3(40, 0, 0)
        }]
    }));
    //Challenge 5
    MaxChallenges = this.challenges.push(new Game.challenge( {
		requiredPoints: 250,
		targetData: [{
            positionOffset: new BABYLON.Vector3(0, 0, 50),
            type: Game.targetType.NORMAL
        },
        {
            positionOffset: new BABYLON.Vector3(0, 20, 20),
            type: Game.targetType.ONESHOT,
            isHit: false,
            speed: .75,
            startPositionOffset: new BABYLON.Vector3(0, 0, 0),
            endPositionOffset: new BABYLON.Vector3(0, 30, 0)
        }   ,
        {
            positionOffset: new BABYLON.Vector3(-20, -10, 20),
            type: Game.targetType.ONESHOT,
            isHit: false,
            speed: .75,
            startPositionOffset: new BABYLON.Vector3(0, 0, 0),
            endPositionOffset: new BABYLON.Vector3(-25, -30, 0)
        },
        {
            positionOffset: new BABYLON.Vector3(20, -10, 20),
            type: Game.targetType.ONESHOT,
            isHit: false,
            speed: .75,
            startPositionOffset: new BABYLON.Vector3(0, 0, 0),
            endPositionOffset: new BABYLON.Vector3(25, -30, 0)
        }]
    }));
});
Game.Data.stages.push(new function () {
    var MaxChallenges = 0;
    this.challenges = [];
    this.name = "The Floating Island";
    this.positionOrigin = new BABYLON.Vector3(0,0,0);
    this.allowNextStage = function (scene) {
    }
    
    //Challenge 1
    MaxChallenges = this.challenges.push(new Game.challenge( {
		requiredPoints: 300,
		targetData: [{
            positionOffset: new BABYLON.Vector3(0, 6, -15),
            type: Game.targetType.NORMAL
        }]
    }));
    //Challenge 2
    MaxChallenges = this.challenges.push(new Game.challenge( {
		requiredPoints: 325,
		targetData: [{
            positionOffset: new BABYLON.Vector3(0, 6, 15),
            type: Game.targetType.NORMAL
        }]
    }));
    //Challenge 3
    MaxChallenges = this.challenges.push(new Game.challenge( {
		requiredPoints: 300,
		targetData: [{
            positionOffset: new BABYLON.Vector3(0, 6, 20),
            type: Game.targetType.NORMAL,
            speed: 1,
            startPositionOffset: new BABYLON.Vector3(-15, 0, 0),
            endPositionOffset: new BABYLON.Vector3(15, 0, 0)
        }]
    }));
    //Challenge 4
    MaxChallenges = this.challenges.push(new Game.challenge( {
		requiredPoints: 325,
		targetData: [{
            positionOffset: new BABYLON.Vector3(10, 6, 30),
            type: Game.targetType.NORMAL,
            speed: 1,
            startPositionOffset: new BABYLON.Vector3(-15, 0, 0),
            endPositionOffset: new BABYLON.Vector3(15, 0, 0)
        }]
    }));
    //Challenge 5
    MaxChallenges = this.challenges.push(new Game.challenge( {
		requiredPoints: 250,
		targetData: [{
            positionOffset: new BABYLON.Vector3(15, 6, 50),
            type: Game.targetType.NORMAL,
            speed: .7,
            startPositionOffset: new BABYLON.Vector3(0, 0, 0),
            endPositionOffset: new BABYLON.Vector3(40, 0, 0)
        }]
    }));
});

Game.sceneAlert = function(text, callback, cbData) {
    var readFactor = (text.length / 20) * 1000;
    $('.sceneAlert').html(text);
    $('.sceneAlert').fadeIn(500, function () {
        setTimeout(function () {
            $('.sceneAlert').fadeOut(500, function () { 
                callback(cbData);
            });
        }, 1000 + readFactor);
    });
}
Game.resetChallengeInfo = function (player, scene) {
    player.points = 0;
    player.arrows = 5;
    $('.roundInfo').html("Challenge " + (Game.challengeCount + 1));
    $('.scoreInfo').html(pad(player.points, 3));
    $('.arrowInfo').html(pad(player.arrows, 2));
    scene.disposeOfArrows();
    scene.activeArrow = scene.createNewArrow();
}
Game.startStage = function (player, scene) {
    var thisChallenge = Game.Data.activeStage.challenges[Game.challengeCount];
    Game.sceneAlert("Stage " + Game.Data.stageCount + "<br/>" + Game.Data.activeStage.name, function () {
        var challengeText = "Challenge " + (Game.challengeCount + 1) + "<br/>Get <div class='points'>" + Game.Data.activeStage.challenges[Game.challengeCount].requiredPoints + "</div> points";
        if (Game.hasOneShot(thisChallenge.targetData)) {
            challengeText += "<br/>Eliminate All <div class='targets' >Yellow</div> Targets";
        }
        Game.sceneAlert(challengeText, function () {
            Game.resetChallengeInfo(player, scene);
            $('.infoRight').fadeIn(500, function () { });
        });
    });
}
Game.startNextRound = function (player, scene) {

    var thisChallenge = Game.Data.activeStage.challenges[Game.challengeCount];
    if (player.points >= thisChallenge.requiredPoints && Game.areAllOneShotsHit(thisChallenge.targetData)) {
        Game.challengeCount++;
        
        Game.sceneAlert("Great Job!<br/>Score: <div class='points'>" + player.points + "</div><br/>Challenge Complete!", function () {
            scene.hideArrows();
            if (Game.challengeCount >= Game.Data.activeStage.challenges.length) {
                Game.Data.activeStage.allowNextStage(scene);
                Game.createChallenge(scene, Game.challengeCount);
                Game.startStage(player, scene);
            }
            else {
                Game.createChallenge(scene, Game.challengeCount);
                var challengeText = "Challenge " + (Game.challengeCount + 1) + "<br/>Get <div class='points'>" + Game.Data.activeStage.challenges[Game.challengeCount].requiredPoints + "</div> points";
                if (Game.hasOneShot(thisChallenge.targetData)) {
                    challengeText += "<br/>Eliminate All <div class='targets' >Yellow</div> Targets";
                }
                Game.sceneAlert(challengeText, function () {
                    Game.resetChallengeInfo(player, scene);
                });
            }
        });
    }
    else {
        Game.createChallenge(scene, Game.challengeCount);
        Game.sceneAlert("Too bad<br/>Score: <div class='points'>" + player.points + "</div><br/>Try Again", function () {
            Game.resetChallengeInfo(player, scene);
        });
    }

    // Get Leaderboard
    // $.ajax({
    //     dataType: "json",
    //     url: "http://acleaderboardapi.azurewebsites.net/api/scoreboard/",
    //     data: {},
    //     success: function (data) {
    //         var ScoreList = "";
    //         data.forEach(function (element, index, array) {
    //             if (index < 10) {
    //                 ScoreList = ScoreList + element.UserName + " : " + element.Score + "<br/>";
    //             }
    //         });
    //         $('.sceneAlert').html("Score<br/>" + player.points + "<br/><br/>Leader Board<div class='leaderboard'>" + ScoreList + "</div>");
    //         $('.sceneAlert').fadeIn(200, function () {
    //             setTimeout(function () {
    //                 $('.sceneAlert').fadeOut(500, function () {
    //                     $('.sceneAlert').html("Challenge " + Game.challengeCount);
    //                     $('.sceneAlert').fadeIn(200, function () {
    //                         setTimeout(function () {
    //                             $('.sceneAlert').fadeOut(500, function () { });
    //                             player.points = 0;
    //                             player.arrows = 5;
    //                             $('.roundInfo').html("Challenge " + Game.challengeCount);
    //                             $('.scoreInfo').html(pad(player.points, 3));
    //                             $('.arrowInfo').html("x " + pad(player.arrows, 2));
    //                             scene.disposeOfArrows();
    //                             scene.activeArrow = scene.createNewArrow();
    //                         }, 2000);
    //                     });
    //                 });
    //                 // $('.infoRight').fadeIn(500, function () {});
    //             }, 8000);
    //         });
    //     },
    //     error: function (jqXHR, textStatus, errorThrown) {
    //         console.log(JSON.stringify(errorThrown));
    //     }
    // });

}
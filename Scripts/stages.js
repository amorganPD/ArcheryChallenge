Game.targetType = {
    NORMAL: 0,
    ONESHOT: 1
}

Game.createStage = function(scene, whichStage) {
    // Create Skybox
    scene.skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
    scene.skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    scene.skyboxMaterial.backFaceCulling = false;
    scene.skyboxMaterial.disableLighting = true;
    scene.skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    scene.skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    scene.skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./Textures/TropicalSunnyDay/TropicalSunnyDay", scene);
    scene.skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    scene.skybox.material = scene.skyboxMaterial;
    scene.skybox.infiniteDistance = true;

    // Bind Bow Mesh to camera
    scene.bowMesh.parent = scene.activeCamera;
    scene.bowMesh.position = new BABYLON.Vector3(.05, -.3, 3.1);
    scene.bowMesh.rotation = new BABYLON.Vector3(.02, 0, -Math.PI/16);

    Game.initArrows(scene);
    // Create First arrow
    scene.activeArrow = scene.createNewArrow();

    scene.ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "./Textures/heightmap_Valley.jpg", 800, 800, 30, 0, 100, scene, false, function (mesh) {
        scene.ground.material = new BABYLON.StandardMaterial("textureGround", scene);
        scene.ground.material.diffuseTexture = new BABYLON.Texture('./Textures/texture_Grass-03.jpg', scene);
        scene.ground.material.diffuseTexture.uScale=16;
        scene.ground.material.diffuseTexture.vScale=16;
        scene.ground.checkCollisions = true;
        scene.activeCamera.checkCollisions = true;
        scene.activeCamera.ellipsoid = new BABYLON.Vector3(10, 4, 10);
    });
    scene.imposterTrunk.checkCollisions = true;

    // Generate some random trees
    scene.generateTrees();

    // Set up the fence
    scene.fenceMeshes = [];
    var xMult = 9;
    var xOffset = xMult/2;
    scene.fenceMesh.position = new BABYLON.Vector3(xOffset, 0, -40);
    var newFenceIndex = scene.fenceMeshes.push(scene.instanceWithChildren(scene.fenceMesh, 'fenceClone', scene, 0)) - 1; // create new Fence
    scene.fenceMeshes[newFenceIndex].position = new BABYLON.Vector3(-(newFenceIndex + 1)*xMult + xOffset, 0, -40);
    for (var i=0; i < 10; i++) {
        newFenceIndex = scene.fenceMeshes.push(scene.instanceWithChildren(scene.fenceMesh, 'fenceClone', scene, (newFenceIndex + 1))) - 1; // create new Fence
        scene.fenceMeshes[newFenceIndex].position = new BABYLON.Vector3(-(newFenceIndex + 1)*xMult + xOffset, 0, -40);
    }

    newFenceIndex = scene.fenceMeshes.push(scene.instanceWithChildren(scene.fenceMesh, 'fenceClone', scene, (newFenceIndex + 1))) - 1; // create new Fence
    var rightStart = newFenceIndex;
    scene.fenceMeshes[newFenceIndex].position = new BABYLON.Vector3((newFenceIndex - rightStart + 1)*xMult + xOffset, 0, -40);
    for (var i=0; i < 14; i++) {
        newFenceIndex = scene.fenceMeshes.push(scene.instanceWithChildren(scene.fenceMesh, 'fenceClone', scene, (newFenceIndex + 1))) - 1; // create new Fence
        scene.fenceMeshes[newFenceIndex].position = new BABYLON.Vector3((newFenceIndex - rightStart + 1)*xMult + xOffset, 0, -40);
    }
}

Game.createChallenge = function(scene, whichChallenge) {

    if (whichChallenge >= Game.stageInformation.challenges.length) {
        // Generate random until more stages and challenges exist
        var points = 200 + (Math.floor(Math.random()*10)*30);
        Game.stageInformation.MaxChallenges = Game.stageInformation.challenges.push(new Game.challenge( {
            requiredPoints: points,
            targetData: [{
                positionOffset: new BABYLON.Vector3(Math.random()*100-50, 6, Math.random()*100),
                type: Game.targetType.NORMAL
            }]
        }));
    }

    var thisChallenge = Game.stageInformation.challenges[whichChallenge];
    for (var i=0; i < thisChallenge.targetData.length; i++) {
        var thisTarget = thisChallenge.targetData[i];
        switch (thisTarget.type) {
            case Game.targetType.NORMAL:
                // clone target of this type

                //set position and movement
                scene.targetMesh.position = thisChallenge.targetData[i].positionOffset;
                break;
            case Game.targetType.ONESHOT:
                // clone target of this type

                //set position and movement
                scene.targetOneShotMesh.position = thisChallenge.targetData[i].positionOffset;
                break;
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

Game.stageInformation = new function () {
    var MaxChallenges = 0;
    this.challenges = [];
    
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
		requiredPoints: 350,
		targetData: [{
            positionOffset: new BABYLON.Vector3(0, 6, 20),
            type: Game.targetType.NORMAL,
            speed: 1,
            startPositionOffset: new BABYLON.Vector3(0, 0, 0),
            endPositionOffset: new BABYLON.Vector3(0, 15, 0)
        }]
    }));
    //Challenge 4
    MaxChallenges = this.challenges.push(new Game.challenge( {
		requiredPoints: 375,
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
		requiredPoints: 400,
		targetData: [{
            positionOffset: new BABYLON.Vector3(15, 6, 40),
            type: Game.targetType.NORMAL,
            speed: 2,
            startPositionOffset: new BABYLON.Vector3(-15, 0, 0),
            endPositionOffset: new BABYLON.Vector3(15, 0, 0)
        }]
    }));
}

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
Game.startNextRound = function (player, scene) {

    var thisChallenge = Game.stageInformation.challenges[Game.challengeCount];
    if (player.points >= thisChallenge.requiredPoints) {
        Game.challengeCount++;
        
        Game.sceneAlert("Great Job!<br/>Score: " + player.points + "<br/>Challenge Complete!", function () {
            scene.hideArrows();
            Game.createChallenge(scene, Game.challengeCount);
            Game.sceneAlert("Challenge " + (Game.challengeCount + 1) + "<br/>Get " + Game.stageInformation.challenges[Game.challengeCount].requiredPoints + " points", function () {
                player.points = 0;
                player.arrows = 5;
                $('.roundInfo').html("Challenge " + (Game.challengeCount + 1));
                $('.scoreInfo').html(pad(player.points, 3));
                $('.arrowInfo').html("x " + pad(player.arrows, 2));
                scene.disposeOfArrows();
                scene.activeArrow = scene.createNewArrow();
            });
        });
    }
    else {
        Game.sceneAlert("Too bad<br/>Score: " + player.points + "<br/>Try Again", function () {
            player.points = 0;
            player.arrows = 5;
            $('.roundInfo').html("Challenge " + (Game.challengeCount + 1));
            $('.scoreInfo').html(pad(player.points, 3));
            $('.arrowInfo').html("x " + pad(player.arrows, 2));
            scene.disposeOfArrows();
            scene.activeArrow = scene.createNewArrow();
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
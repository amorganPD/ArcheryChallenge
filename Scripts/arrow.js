


Game.initArrows = function(scene) {
    scene.arrowMeshes = [];
    scene.createNewArrow = function () {
        var cloneIndex = scene.arrowMeshes.length;
        var newIndex = scene.arrowMeshes.push(scene.arrowMesh.clone('arrowClone-' + cloneIndex)) - 1;
        scene.arrowMeshes[newIndex].imposterArrowTip = scene.getMeshByName('arrowClone-' + newIndex + '.imposterTip');
        
        scene.arrowMeshes[newIndex].parent = scene.activeCamera;
        // scene.arrowMeshes[newIndex].position = new BABYLON.Vector3(.17, -.2, 3.05);
        scene.arrowMeshes[newIndex].position = new BABYLON.Vector3(.07, -.2, 3.57);
        scene.arrowMeshes[newIndex].rotation = new BABYLON.Vector3(.02, 0, -0.19);
        scene.arrowMeshes[newIndex].arrowFiring = false;
        scene.arrowMeshes[newIndex].arrowDrawing = false;
        
        scene.arrowMeshes[newIndex].isVisible = false;
        scene.bowArrowMesh.isVisible = true;
        // scene.octree.dynamicContent.push(scene.arrowMeshes[newIndex]); // allow dynamic content when using octrees
        
        return newIndex;
    };
    scene.arrowCollision = function (activeArrow, scene, isTarget, parentData) {
        var parentMesh = parentData.mesh;
        activeArrow.arrowFiring = false;
        scene.audio.targetHit.play();
        if (isTarget) {
            // get screen coords
    		var globalViewPort = scene.activeCamera.viewport.toGlobal(Game.engine.getRenderWidth(), Game.engine.getRenderHeight());
            var screenCoords = BABYLON.Vector3.Project(activeArrow.position, BABYLON.Matrix.Identity(), scene.getTransformMatrix(), globalViewPort);
            
            scene.isfloatingScoreActive = true;
            scene.floatingTextCounter = 0;
            // get points
            var arrowTipWorldMat = activeArrow.imposterArrowTip.getWorldMatrix(); // get world matrix since it is parented
            var arrowTipPos = new BABYLON.Vector3();
            arrowTipWorldMat.decompose(new BABYLON.Vector3(), new BABYLON.Quaternion(), arrowTipPos);
            var distance = getDistance(parentMesh.position, arrowTipPos, [1, 1, 0], new BABYLON.Vector3(0, .5, .5));
            var hitScore = scene.Players[scene.activePlayer].updatePoints(distance, 3);

            // attach arrow to mesh
            if (parentData.type == Game.targetType.ONESHOT) {
                activeArrow.isVisible = false;
                parentData.mesh.isVisible = false;
                parentData.isHit = true;
                if (parentData.targetAnimation != undefined) {
                    parentData.targetAnimation.stop();
                }
            }
            else {
                scene.parentMesh(activeArrow, parentMesh);
                activeArrow.parent = parentMesh;
            }
            
            // Manipulate DOM
            $('#scoreInfo').html(pad(scene.Players[scene.activePlayer].points,3));
            // Set up Floating text
            $('.floatingHitScore').html(hitScore);
            $('.floatingHitScore').fadeIn(50, function () {
                $('.floatingHitScore').fadeOut(2000, function () {
                    scene.isfloatingScoreActive = false;
                });
            });
            $('.floatingHitScore').css({'left': ((screenCoords.x - 30) / window.devicePixelRatio) + 'px', 'top': ((screenCoords.y + 30) / window.devicePixelRatio) + 'px'})
        }
        
        // Clear Timeout
        if (scene.timerId) {
            clearTimeout(scene.timerId);
        }
        
        // Create a new arrow
        if (scene.Players[scene.activePlayer].arrows != 0) {
            scene.activeArrow = scene.createNewArrow();
        }
        else {
            setTimeout(function () {
                Game.startNextRound(scene.Players[scene.activePlayer], scene);
            }, 2000);
        }
    }
    scene.bindActionToArrow = function(index) {
        // create BJS Action Manger
        scene.arrowMeshes[index].actionManager = new BABYLON.ActionManager(scene);
        // detect collision between arrow and the targets
        var thisChallenge = Game.Data.activeStage.challenges[Game.challengeCount];
        for (var i_targets = 0; i_targets < thisChallenge.targetData.length; i_targets++) {
            var targetData = thisChallenge.targetData[i_targets];
            if (targetData.isHit == undefined ? true : !targetData.isHit) {
                scene.arrowMeshes[index].actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                { trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: { mesh: targetData.mesh, usePreciseIntersection: true} }, 
                    function (data) {
                        var i_loop = 0;
                        while (thisChallenge.targetData[i_loop].mesh != data.additionalData && i_loop < thisChallenge.targetData.length) {
                            i_loop++;
                        }
                        scene.arrowCollision(scene.arrowMeshes[index], scene, true, thisChallenge.targetData[i_loop]);
                        scene.arrowMeshes[index].actionManager.dispose();
                    }
                ));
            }
        }
        scene.arrowMeshes[index].actionManager.registerAction(new BABYLON.ExecuteCodeAction(
        { trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: { mesh: scene.imposterTrunk, usePreciseIntersection: true} }, 
            function (data) {
                scene.arrowCollision(scene.arrowMeshes[index], scene, false);
            }
        ));
        for (var i_trees = 0; i_trees < scene.treeMeshes.length; i_trees++) {
            scene.arrowMeshes[index].actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            { trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: { mesh: scene.treeMeshes[i_trees].imposterTrunk, usePreciseIntersection: true} }, 
                function (data) {
                    scene.arrowCollision(scene.arrowMeshes[index], scene, false);
                }
            ));
        }
    }
    scene.disposeOfArrows = function () {
        for (var i = 0; i < scene.arrowMeshes.length; i++) {
            scene.arrowMeshes[i].dispose();
        }
        scene.arrowMeshes = [];
    }
    scene.hideArrows = function () {
        for (var i = 0; i < scene.arrowMeshes.length; i++) {
            scene.arrowMeshes[i].isVisible = false;
        }
    }
} 
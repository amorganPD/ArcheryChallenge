

Game.initAssetHelper = function(scene) {
    
    scene.generateTrees = function () {
        scene.treeMeshes = [];
        var baseTreeY = scene.treeMesh.position.y;
		var newTreeIndex = scene.treeMeshes.push(scene.instanceWithChildren(scene.treeMesh, 'treeClone', scene)) - 1;
		scene.treeMeshes[newTreeIndex].position = new BABYLON.Vector3(-40, baseTreeY, -100);
		scene.treeMeshes[newTreeIndex].rotation = new BABYLON.Vector3(0, Math.PI/1.5, 0);
        scene.treeMeshes[newTreeIndex].imposterTrunk = scene.getMeshByName('treeClone-' + newTreeIndex + '.imposterTrunk');
		
		newTreeIndex = scene.treeMeshes.push(scene.instanceWithChildren(scene.treeMesh, 'treeClone', scene, (newTreeIndex + 1))) - 1;
		scene.treeMeshes[newTreeIndex].position = new BABYLON.Vector3(70, baseTreeY, 110);
		scene.treeMeshes[newTreeIndex].rotation = new BABYLON.Vector3(0, 2*Math.PI/3, 0);
        scene.treeMeshes[newTreeIndex].imposterTrunk = scene.getMeshByName('treeClone-' + newTreeIndex + '.imposterTrunk');
        
		newTreeIndex = scene.treeMeshes.push(scene.instanceWithChildren(scene.treeMesh, 'treeClone', scene, (newTreeIndex + 1))) - 1;
		scene.treeMeshes[newTreeIndex].position = new BABYLON.Vector3(100, baseTreeY, 90);
		scene.treeMeshes[newTreeIndex].rotation = new BABYLON.Vector3(0, Math.PI/4, 0);
        scene.treeMeshes[newTreeIndex].imposterTrunk = scene.getMeshByName('treeClone-' + newTreeIndex + '.imposterTrunk');
		
		newTreeIndex = scene.treeMeshes.push(scene.instanceWithChildren(scene.treeMesh, 'treeClone', scene, (newTreeIndex + 1))) - 1;
		scene.treeMeshes[newTreeIndex].position = new BABYLON.Vector3(-50, baseTreeY + 1, -135);
		scene.treeMeshes[newTreeIndex].rotation = new BABYLON.Vector3(0, Math.PI/.5, 0);
		scene.treeMeshes[newTreeIndex].scaling = new BABYLON.Vector3(4.6, 4.6, 4.6);
        scene.treeMeshes[newTreeIndex].imposterTrunk = scene.getMeshByName('treeClone-' + newTreeIndex + '.imposterTrunk');
		
		newTreeIndex = scene.treeMeshes.push(scene.instanceWithChildren(scene.treeMesh, 'treeClone', scene, (newTreeIndex + 1))) - 1;
		scene.treeMeshes[newTreeIndex].position = new BABYLON.Vector3(-42, baseTreeY, 100);
		scene.treeMeshes[newTreeIndex].rotation = new BABYLON.Vector3(0, Math.PI/1.9, 0);
        scene.treeMeshes[newTreeIndex].imposterTrunk = scene.getMeshByName('treeClone-' + newTreeIndex + '.imposterTrunk');
		
		newTreeIndex = scene.treeMeshes.push(scene.instanceWithChildren(scene.treeMesh, 'treeClone', scene, (newTreeIndex + 1))) - 1;
		scene.treeMeshes[newTreeIndex].position = new BABYLON.Vector3(100, baseTreeY + 0.6, -100);
		scene.treeMeshes[newTreeIndex].rotation = new BABYLON.Vector3(0, Math.PI/3, 0);
		scene.treeMeshes[newTreeIndex].scaling = new BABYLON.Vector3(4, 4, 4);
        scene.treeMeshes[newTreeIndex].imposterTrunk = scene.getMeshByName('treeClone-' + newTreeIndex + '.imposterTrunk');
		
		newTreeIndex = scene.treeMeshes.push(scene.instanceWithChildren(scene.treeMesh, 'treeClone', scene, (newTreeIndex + 1))) - 1;
		scene.treeMeshes[newTreeIndex].position = new BABYLON.Vector3(-80, baseTreeY + 2, 80);
		scene.treeMeshes[newTreeIndex].rotation = new BABYLON.Vector3(0, Math.PI/1.5, 0);
        scene.treeMeshes[newTreeIndex].imposterTrunk = scene.getMeshByName('treeClone-' + newTreeIndex + '.imposterTrunk');
        
        // Create random forest behind player, commented out for performance for now
        // for (var i_trees=0; i_trees < 22; i_trees++) {
        //     newTreeIndex = scene.treeMeshes.push(scene.instanceWithChildren(scene.treeMesh, 'treeClone', scene, (newTreeIndex + 1))) - 1;
        //     scene.treeMeshes[newTreeIndex].position = new BABYLON.Vector3(-130 + i_trees*12 + Math.random()*4, baseTreeY, -140 + Math.random()*12 );
        //     scene.treeMeshes[newTreeIndex].rotation.y = Math.random()*2*Math.PI;
        //     var scaleFactor = Math.random();
        //     scene.treeMeshes[newTreeIndex].scaling = new BABYLON.Vector3(Math.round(scaleFactor*10),Math.round(scaleFactor*10), Math.round(scaleFactor*10));
        //     scene.treeMeshes[newTreeIndex].imposterTrunk = scene.getMeshByName('treeClone-' + newTreeIndex + '.imposterTrunk');   
        // }
        // for (var i_trees=0; i_trees < 16; i_trees++) {
        //     newTreeIndex = scene.treeMeshes.push(scene.instanceWithChildren(scene.treeMesh, 'treeClone', scene, (newTreeIndex + 1))) - 1;
        //     scene.treeMeshes[newTreeIndex].position = new BABYLON.Vector3(-130 + i_trees*12 + Math.random()*4, baseTreeY, -170 + Math.random()*12 );
        //     scene.treeMeshes[newTreeIndex].rotation.y = Math.random()*2*Math.PI;
        //     var scaleFactor = Math.random();
        //     scene.treeMeshes[newTreeIndex].scaling = new BABYLON.Vector3(Math.round(scaleFactor*10),Math.round(scaleFactor*10), Math.round(scaleFactor*10));
        //     scene.treeMeshes[newTreeIndex].imposterTrunk = scene.getMeshByName('treeClone-' + newTreeIndex + '.imposterTrunk');   
        // }
        // for (var i_trees=0; i_trees < 12; i_trees++) {
        //     newTreeIndex = scene.treeMeshes.push(scene.instanceWithChildren(scene.treeMesh, 'treeClone', scene, (newTreeIndex + 1))) - 1;
        //     scene.treeMeshes[newTreeIndex].position = new BABYLON.Vector3(-130 + i_trees*12 + Math.random()*4, baseTreeY, -220 + Math.random()*12 );
        //     scene.treeMeshes[newTreeIndex].rotation.y = Math.random()*2*Math.PI;
        //     var scaleFactor = Math.random();
        //     scene.treeMeshes[newTreeIndex].scaling = new BABYLON.Vector3(Math.round(scaleFactor*10),Math.round(scaleFactor*10), Math.round(scaleFactor*10));
        //     scene.treeMeshes[newTreeIndex].imposterTrunk = scene.getMeshByName('treeClone-' + newTreeIndex + '.imposterTrunk');   
        // }
    }
    
}
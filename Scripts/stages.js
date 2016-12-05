Game.targetType = {
    NORMAL: 0,
    ONESHOT: 1
}

Game.challenge = function(options) {
	$.extend(this,{
		requiredPoints: 100,
		targetData: [{
            positionOffset: { 'x': 0, 'y': 0, 'z': -15 },
            type: Game.targetType.NORMAL
        }],
        speed: 0,
        startPositionOffset: { 'x': 0, 'y': 0, 'z': 0 },
        endPositionOffset: { 'x': 0, 'y': 0, 'z': 0 }
	},options||{});
};

Game.stageInformation = new function () {
    var MaxChallenges = 0;
    this.challenges = [];
    
    //Challenge 1
    MaxChallenges = this.challenges.push(new Game.challenge( {
		requiredPoints: 100,
		targetData: [{
            positionOffset: { 'x': 0, 'y': 0, 'z': -15 },
            type: Game.targetType.NORMAL
        }]
    }));
    //Challenge 2
    MaxChallenges = this.challenges.push(new Game.challenge( {
		requiredPoints: 100,
		targetData: [{
            positionOffset: { 'x': 0, 'y': 0, 'z': 15 },
            type: Game.targetType.NORMAL
        }]
    }));
    //Challenge 3
    MaxChallenges = this.challenges.push(new Game.challenge( {
		requiredPoints: 100,
		targetData: [{
            positionOffset: { 'x': 0, 'y': 0, 'z': 15 },
            type: Game.targetType.NORMAL
        }],
        speed: 1,
        startPositionOffset: { 'x': 0, 'y': 0, 'z': 0 },
        endPositionOffset: { 'x': 0, 'y': 15, 'z': 0 },
    }));
    //Challenge 4
    MaxChallenges = this.challenges.push(new Game.challenge( {
		requiredPoints: 100,
		targetData: [{
            positionOffset: { 'x': 0, 'y': 0, 'z': 15 },
            type: Game.targetType.NORMAL
        }],
        speed: 1,
        startPositionOffset: { 'x': -15, 'y': 0, 'z': 0 },
        endPositionOffset: { 'x': 15, 'y': 0, 'z': 0 },
    }));
    //Challenge 5
    MaxChallenges = this.challenges.push(new Game.challenge( {
		requiredPoints: 100,
		targetData: [{
            positionOffset: { 'x': 0, 'y': 0, 'z': 15 },
            type: Game.targetType.NORMAL
        }],
        speed: 2,
        startPositionOffset: { 'x': -15, 'y': 0, 'z': 0 },
        endPositionOffset: { 'x': 15, 'y': 0, 'z': 0 },
    }));
}

Game.startNextRound = function (player, scene) {
    Game.challengeCount++;

    // Show end of round score
    // Get Leaderboard
    $.ajax({
        dataType: "json",
        url: "http://acleaderboardapi.azurewebsites.net/api/scoreboard/",
        data: {},
        success: function (data) {
            var ScoreList = "";
            data.forEach(function (element, index, array) {
                if (index < 10) {
                    ScoreList = ScoreList + element.UserName + " : " + element.Score + "<br/>";
                }
            });
            $('.sceneAlert').html("Score<br/>" + player.points + "<br/><br/>Leader Board<div class='leaderboard'>" + ScoreList + "</div>");
            $('.sceneAlert').fadeIn(200, function () {
                setTimeout(function () {
                    $('.sceneAlert').fadeOut(500, function () {
                        $('.sceneAlert').html("Challenge " + Game.challengeCount);
                        $('.sceneAlert').fadeIn(200, function () {
                            setTimeout(function () {
                                $('.sceneAlert').fadeOut(500, function () { });
                                player.points = 0;
                                player.arrows = 5;
                                $('.roundInfo').html("Challenge " + Game.challengeCount);
                                $('.scoreInfo').html(pad(player.points, 3));
                                $('.arrowInfo').html("x " + pad(player.arrows, 2));
                                scene.disposeOfArrows();
                                scene.activeArrow = scene.createNewArrow();
                            }, 2000);
                        });
                    });
                    // $('.infoRight').fadeIn(500, function () {});
                }, 8000);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(errorThrown));
        }
    });

}
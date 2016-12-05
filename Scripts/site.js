/*********************************************************************
 site.js 
   Entry point > calls $(document).ready() and creates Game variable
	-> BabylonMechanics.js sets up the Babylon render loops
	-> BabylonScene.js sets up the scene and all of the objects in it, including
	   the logic loop
	-> Everything else are helpers tha should get called inside the above
	
	Note: In order to load locally in Chrome, open it with security disabled.
	You can create a shortcut to this locally:
	"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --disable-web-security
*********************************************************************/

var onStartScreen=1;

$(document).ready(function () {
	// modal('Browser not supported. Download latest version of Chrome here: https://www.google.com/chrome/browser/');
	// Check support
	if (!BABYLON.Engine.isSupported()) {
		window.alert('Browser not supported.');
		//TO DO: Display a different screen
	} 
	else {
		//Game.map = Game.GenerateMap(Game.mapSize,Game.mapSize);
		Game.initStartScene();
		Game.initGameScene();
		// Resize
		window.addEventListener("resize", function () {
			Game.engine.resize();
			Game.scene[Game.activeScene].render(); // in case scene is "paused"
		});
		Game.runRenderLoop();
	};
	// Show About information
	$('#aboutText').click( function () {
		$('#startButton').animate({
			opacity: 0,
		}, 200, function () {
			$('#about').addClass("aboutExpanded");
			setTimeout(function () {
				$('#aboutModal').fadeIn(1000);
			}, 500);
			$('#aboutCloseButton').fadeIn(200);
		});
		$('#aboutText').fadeOut(200);
		$(".modalButton").unbind('mouseenter mouseleave');
	});
	$('#aboutCloseButton').click(function () {
		$('#aboutModal').stop().fadeOut(250, function () {
			$('#aboutCloseButton').fadeOut(250);
			$('#about').removeClass("aboutExpanded");
			$('#startButton').animate({ opacity: 1 }, 200);
			setTimeout(function () {
				$('#aboutText').fadeIn(500);
			}, 500);
		});
		
	});
	// fullscreenClick = function () {
	// 	// Launch fullscreen for browsers that support it!
	// 	launchIntoFullscreen(document.documentElement); // the whole page
	// 	$(window).unbind( "click", fullscreenClick );
	// };
	// $(window).click(fullscreenClick);
});

var pad = function(n, width, z) {
	z = z || '0';
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

// Launch fullscreen mode
var launchIntoFullscreen = function(element) {
	// Get correct command per browser
	if(element.requestFullscreen) {
		element.requestFullscreen();
	} else if(element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	} else if(element.webkitRequestFullscreen) {
		element.webkitRequestFullscreen();
	} else if(element.msRequestFullscreen) {
		element.msRequestFullscreen();
	}
}

//function for modal pop-up
var modal = function(Html,okFunction,data) {

	alertBoxDefault = function () {
        var htmlTemplate = "<div class=\"btn-group\"> \
                    <button id=\"alertBox-Ok\" type=\"button\" class=\"btn btn-default btn-width btn-shadow\">Ok</button> \
                </div> \
                <div class=\"btn-group\"> \
                    <button id=\"alertBox-Cancel\" type=\"button\" class=\"btn btn-default btn-width btn-shadow\">Cancel</button> \
                </div>";

        return htmlTemplate;
    }

    $('#modalDiv').html(Html);

    //Fade in Div and foreground overlay
    $('#modal').fadeIn(100, function () {
        $('#modalButtons').html(alertBoxDefault());
        $('#modalCancel').click(function () {
            // Close alert Box
            $('#modal').fadeOut(50, function () {
                $('#modalDiv').html('');
            });
        });
        $('#modalConfirm').click(function () {
            var closeModal;
            if (okFunction != undefined) {
                closeModal = okFunction(data); // execute Callback function
                //Allows function to return a value to defer closing modal
                if (closeModal == undefined) {
                    closeModal = 1;
                }
            }
            // Close alert Box
            if (closeModal == 1) {
                $('#modal').fadeOut(50, function () {
                    $('#modalDiv').html('');
                });
            }
        });
    });
}

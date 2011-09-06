// load graphics base, because this is a graphics app
// ...this doesn't really work yet
LAB.require("js/lab/app/BaseApp.js");
LAB.require("js/utils/utils.js");

var demoApp;

$(document).ready( function() {
	demoApp 	= new DemoApp();
	// is there a good way to call this automatically?
	demoApp.begin();
});

// ===========================================
// ===== DEMO APP
// ===========================================

	DemoApp = function(){
		LAB.app.BaseApp.call( this );		
		
		var amazingDiv = document.getElementById("amazingDiv");
		
		var divX	= 0;
		var divY	= 0;
			
		//setup
			
		this.setup = function (){
			// catch mouse events!
			this.registerMouseEvents();
		}
		
		//update

		this.update = function (){
			divX = divX + (LAB.self.mouse.x-divX)/10;
			divY = divY + (LAB.self.mouse.y-divY)/10;
		}
	
		//draw

		this.draw = function (){
			// do some amazing rustic javascript here
			amazingDiv.style.left = divX-amazingDiv.clientWidth/2+"px";
			amazingDiv.style.top = divY-amazingDiv.clientHeight/2+"px";
		}
		
		this.onMessageReceived = function( data ) {
			
		}
 		this.onConnectionColsed = function( event ) { }
		this.onConnectionOpened = function() { }
	}
	
	
	
	// using jquery extend:
	// YourAppName.prototype = $.extend(true, whatYouWantToExtend.prototype, ..., YourApp.prototype)
	// ... = extend as many classes as you want (within reason, dude)
	
	DemoApp.prototype = $.extend(true, LAB.app.BaseApp.prototype, DemoApp.prototype);
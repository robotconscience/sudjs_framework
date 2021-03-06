/** @namespace SUD.app */
SUD.app = SUD.app || {};

/** 
	Creates a new SUD base app. Extend this in your main app
	or with a new SUD app class
	@constructor
	@augments SUD.EventDispatcher
*/

SUD.app.BaseApp = function()
{
	SUD.EventDispatcher.call( this, this );
	
	/**
		Mouse object: {x:Number, y:Number, bDown:Boolean}
		@type Object
	*/
	this.mouse	= {x:0, y:0, bDown:false};
	this.mouseEventsRegistered 	= false;
	this.keyEventsRegistered 	= false;
	this.windowEventsRegistered = false;
	
	this.startTime 		= Date.now();
	this.elapsedTime 	= 0;
}

SUD.app.BaseApp.prototype				= new SUD.EventDispatcher();
SUD.app.BaseApp.prototype.constructor 	= SUD.app.BaseApp;
SUD.app.BaseApp.prototype.supr 			= SUD.EventDispatcher.prototype;

/**
Call setup and begin animating
@function
*/

SUD.app.BaseApp.prototype.begin = function(){
	this.registerWindowEvents();
	this.registerKeyEvents();
	this.registerMouseEvents();
	this.setup();
	this.animate();
};

// suggestions for overriding: updating + rendering

/**
	override in your main class. called once
	@function
*/
SUD.app.BaseApp.prototype.setup 	= function(){};

/**
	override when extending BaseApp; gets called automatically before update()
	@function
	@private
*/

SUD.app.BaseApp.prototype.preupdate = function(){};

/**
	override in your main class. called once a frame before predraw(), draw(), and postdraw()
	@function
*/

SUD.app.BaseApp.prototype.update	= function(){};

/**
	override when extending BaseApp; gets called automatically before draw().
	useful when setting up an WebGL context, clearing a canvas, etc.
	@function
	@private
*/

SUD.app.BaseApp.prototype.predraw	= function(){};	// e.g. setup screen

/**
	override your main class. called once a frame after update();
	@function
*/

SUD.app.BaseApp.prototype.draw		= function(){};	// override this in your main app

/**
	override when extending BaseApp; gets called automatically after draw().
	useful when tearing down WebGL context, resetting the camera/view, etc
	@function
	@private
*/
SUD.app.BaseApp.prototype.postdraw 	= function(){}; // e.g. teardown screen

/**
	starts off animation + sets up preupdate-update-predraw-draw-postdraw chain
	@function
	@private
*/
SUD.app.BaseApp.prototype.animate	= function(time){
	// update time
	if (time === undefined){
	} else {
		this.elapsedTime = time - this.startTime;
	}
	
	requestAnimationFrame(this.animate.bind(this), this);
			
	this.preupdate();
   	this.update();
	this.predraw();
	this.draw();
	this.postdraw();
}


// ===========================================
// ===== WINDOW
// ===========================================
	/**
		start listening to window events
		@function
		@public
	*/
	SUD.app.BaseApp.prototype.registerWindowEvents = function(){
		if (this.windowEventsRegistered) return;
		window.addEventListener("focus", this._onWindowFocus.bind(this));
		window.addEventListener("blur", this._onWindowBlur.bind(this));
		window.addEventListener("resize", this._onWindowResized.bind(this));
		this.windowEventsRegistered = true;
	}

	/**
		stop listening to window events
		@function
		@public
	*/
	SUD.app.BaseApp.prototype.unregisterWindowEvents = function(){
		if (!this.windowEventsRegistered) return;
		window.removeEventListener("focus", this._onWindowFocus.bind(this));
		window.removeEventListener("blur", this._onWindowBlur.bind(this));
		window.removeEventListener("resize", this._onWindowResized.bind(this));
		this.windowEventsRegistered = false;
	}

	SUD.app.BaseApp.prototype._onWindowResized	= function(event) {
		this.onWindowResized(window.innerWidth, window.innerHeight);
	}

	SUD.app.BaseApp.prototype.onWindowResized	= function(width, height) {}

	SUD.app.BaseApp.prototype._onWindowFocus	= function(event) {
		this.onWindowFocus();
	}

	SUD.app.BaseApp.prototype.onWindowFocus	= function() {}

	SUD.app.BaseApp.prototype._onWindowBlur	= function(event) {
		this.onWindowBlur();
	}

	SUD.app.BaseApp.prototype.onWindowBlur	= function() {}

// ===========================================
// ===== MOUSE
// ===========================================

	/**
		start listening to mouse events
		@function
		@public
	*/
	SUD.app.BaseApp.prototype.registerMouseEvents = function(){
		if (this.mouseEventsRegistered) return;
		window.addEventListener("mousemove", this._onMouseMoved.bind(this));
		window.addEventListener("mousedown", this._onMousePressed.bind(this));
		window.addEventListener("mouseup", this._onMouseReleased.bind(this));
		this.mouseEventsRegistered = true;
	}
	/**
		stop listening to mouse events
		@function
		@public
	*/
	SUD.app.BaseApp.prototype.unregisterMouseEvents = function()
	{
		if (!this.mouseEventsRegistered) return;
		window.removeEventListener("mousemove", this._onMouseMoved.bind(this));
		window.removeEventListener("mousedown", this._onMousePressed.bind(this));
		window.removeEventListener("mouseup", this._onMouseReleased.bind(this));
		this.mouseEventsRegistered = false;
	}
	
	/**
		override in your main app to catch mouse moved events
		@function
		@public
		@param {number} x Mouse x position
		@param {number} y Mouse y position
	*/
	
	SUD.app.BaseApp.prototype.onMouseMoved		= function (x,y){};
	
	/**
		override in your main app to catch mouse pressed events
		@function
		@public
		@param {number} x Mouse x position
		@param {number} y Mouse y position
	*/
	SUD.app.BaseApp.prototype.onMousePressed	= function (x,y){};
	
	/**
		override in your main app to catch mouse pressed events
		@function
		@public
		@param {number} x Mouse x position
		@param {number} y Mouse y position
	*/
	SUD.app.BaseApp.prototype.onMouseDragged	= function (x,y){};
	
	/**
		override in your main app to catch mouse released events
		@function
		@public
		@param {number} x Mouse x position
		@param {number} y Mouse y position
	*/
	SUD.app.BaseApp.prototype.onMouseReleased	= function (x,y){};

	/**
		called directly by Window. override in your app to directly
		catch the "mousemove" event from Window.
		@function
		@private
		@param {Event} event DOM mouse event
	*/

	SUD.app.BaseApp.prototype._onMouseMoved		= function( event )
	{	 
		// if the mouse is down, call dragged instead of moved
		if (this.mouse.bDown){
			this._onMouseDragged(event);
			return;
		}
		this.mouse.x = event.clientX; 
		this.mouse.y = event.clientY;
		this.dispatchEvent("onMouseMoved", this.mouse);
		this.onMouseMoved(this.mouse.x, this.mouse.y);
	}

	/**
		called directly by Window. override in your app to directly
		catch the "mousedown" event from Window.
		@function
		@private
		@param {Event} event DOM mouse event
	*/

	SUD.app.BaseApp.prototype._onMousePressed	= function( event )
	{
		this.mouse.x = event.clientX; 
		this.mouse.y = event.clientY;
		this.mouse.bDown = true;
		this.dispatchEvent("onMousePressed", this.mouse);
		this.onMousePressed(this.mouse.x, this.mouse.y);
	}

	/**
		called directly by Window. override in your app to directly
		catch the "mouseup" event from Window.
		@function
		@private
		@param {Event} event DOM mouse event
	*/

	SUD.app.BaseApp.prototype._onMouseReleased	= function( event )
	{
		this.mouse.x = event.clientX; 
		this.mouse.y = event.clientY;
		this.mouse.bDown = false;
		this.dispatchEvent("onMouseReleased", this.mouse);
		this.onMouseReleased(this.mouse.x, this.mouse.y);
	}
	
	/**
		helper function to call onMouseDragged instead of onMouseMoved.
		overriding this won't help anybody.
		@function
		@private
		@param {Event} event DOM mouse event
	*/ 

	SUD.app.BaseApp.prototype._onMouseDragged	= function( event )
	{
		this.mouse.x = event.clientX; 
		this.mouse.y = event.clientY;
		this.dispatchEvent("onMouseDragged", this.mouse);
		this.onMouseDragged(this.mouse.x, this.mouse.y);
	}


// ===========================================
// ===== KEYBOARD
// ===========================================

	/**
		start listening to key events
		@function
		@public
	*/
	SUD.app.BaseApp.prototype.registerKeyEvents = function(){
		if (this.keyEventsRegistered) return;
		window.addEventListener("keydown", this._onDocumentKeyDown.bind(this));
		window.addEventListener("keyup", this._onDocumentKeyUp.bind(this));
		this.keyEventsRegistered = true;
	}
	/**
		stop listening to mouse events
		@function
		@public
	*/
	SUD.app.BaseApp.prototype.unregisterKeyEvents = function(){
		if (!this.keyEventsRegistered) return;
		window.removeEventListener("keydown", this._onDocumentKeyDown.bind(this));
		window.removeEventListener("keyup", this._onDocumentKeyUp.bind(this));
		this.keyEventsRegistered = false;
	}

	/*
		override in your main app to catch keyboard events
		@function
		@public
		@param {event}
	*/
	SUD.app.BaseApp.prototype.onDocumentKeyDown = function( key ) {}

	SUD.app.BaseApp.prototype._onDocumentKeyDown	= function( event ) {
	   this.dispatchEvent("onDocumentKeyDown", event);
	   this.onDocumentKeyDown( event.keyCode );
	}

	/*
		override in your main app to catch keyboard events
		@function
		@public
		@param {event}
	*/
	SUD.app.BaseApp.prototype.onDocumentKeyUp = function( key ) {}

	SUD.app.BaseApp.prototype._onDocumentKeyUp	= function( event ) {
	   this.dispatchEvent("onDocumentKeyUp", event);
	   this.onDocumentKeyUp( event.keyCode );
	}


// ===========================================
// ===== TIME
// ===========================================

	/**
		get ellapsed time in milliseconds
		@function
		@public
	*/
	
	SUD.getElapsedTimeMillis = SUD.app.BaseApp.prototype.getElapsedTimeMillis	= function()
	{
		return this.elapsedTime;
	};
	
	/**
		get ellapsed time in seconds
		@function
		@public
	*/
	
	SUD.getElapsedTimeSeconds = SUD.app.BaseApp.prototype.getElapsedTimeSeconds	= function()
	{
		return this.elapsedTime/1000;
	};

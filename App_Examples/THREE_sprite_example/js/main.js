// load graphics base, because this is a graphics app
// ...this doesn't really work yet
LAB.require("js/lab/app/ThreeApp.js");
LAB.require("js/utils/utils.js");
LAB.require("models/walt_reduced.js");
//LAB.require("shaders/basicShader.vert");

var demoApp;

$(document).ready( function() {
                  DemoApp.prototype = $.extend(true, LAB.app.ThreeApp.prototype, DemoApp.prototype);
                  demoApp 	= new DemoApp();
                  // is there a good way to call this automatically?
                  demoApp.begin();
                  });

// ===========================================
// ===== DEMO APP
// ===========================================

DemoApp = function(){
   LAB.app.ThreeApp.call( this );		
   
   var _self = this;
   
   var lastMouse = {x:0, y:0};
   
   var camera;	
   var particleShader;
   var particles;
   var particleSystem;
   
   var targetBlend = 0;
   
	// ===========================================
	// ===== SETUP
	// ===========================================

		
		this.setup = function (){
			// catch mouse events!
			this.registerMouseEvents();
         
         //cameras
         camera = new THREE.Camera(60, window.innerWidth/window.innerHeight,
                                   10, 10000 );
         camera.target.position.set( window.innerWidth/2, window.innerHeight/2, 0);

         
         //shaders
         var shaderUniforms = {
            attScale: { type: "f", value: window.innerHeight/2  },
            radius: { type: "f", value: 15 },
            particleTexture:   { type: "t", value: 0, texture: THREE.ImageUtils.loadTexture( "textures/sphere.png" )}
         };
         particleShader = new LAB.three.Shader({name: "shaders/particleShader", uniforms: shaderUniforms } );
         
         //geometry
         var targetMesh = new LAB.three.Geometry();
         targetMesh.loadLabModel( walt_reduced );
         
         particles = new LAB.three.Geometry();
         particles.vel = [];
         particles.targetPos = []
         for(var i=0; i<6000; i++){
            particles.addVertex(labRandom(0, window.innerWidth), labRandom(0, window.innerHeight),labRandom(-200, 200));
            particles.vel[i] = new THREE.Vector3(0,0,0);
            
            particles.targetPos[i] = targetMesh.getPointOnFace(labRandomInt(0, targetMesh.faces.length ),
                                                               labRandom(0, 1), labRandom(0,1));
            particles.targetPos[i].multiplyScalar( 12 );//scale it up
            particles.targetPos[i].addSelf( new THREE.Vector3( window.innerWidth/2, 0, 0) );//move it to bottom center
         }
         particleSystem = new THREE.ParticleSystem( particles, particleShader ); 
         
         this.scene.addObject( particleSystem );
      }

   
   // ===========================================
	// ===== UPDATE
	// ===========================================
   
   this.update = function (){
      camera.position.set(Math.sin(labDegToRad(lastMouse.x)) * window.innerWidth/2 + window.innerWidth/2,
                          Math.sin(labDegToRad(lastMouse.y)) * window.innerWidth/2 + window.innerHeight/2, 
                          Math.cos(labDegToRad(lastMouse.x)) * window.innerWidth/2);
      
      
      //update particle positions and velocities
      targetBlend = labClamp( labMap( Math.sin( LAB.self.getElapsedTimeSeconds()*.2), -1, 1, -1, 2 ),0, 1) ;
      var mb = 1 - targetBlend;
      //update particle positions
      var pPos, tPos;
      var force = new THREE.Vector3();
      //var attractor = new THREE.Vector3(lastMouse.x, window.innerHeight - lastMouse.y, .7 );
      var attractor = this.projectToWorld( new THREE.Vector3(lastMouse.x, window.innerHeight - lastMouse.y, .95 ) );
      var accel = .3;
      var attenuation = labMap( mb, 0, 1, .95, .99);
      for(var i=0; i<particles.vertices.length; i++){
         pPos = particles.vertices[i].position;
         tPos = particles.targetPos[i];
         force.set((attractor.x * mb + tPos.x * targetBlend) - pPos.x,
                   (attractor.y * mb + tPos.y * targetBlend) - pPos.y,
                   (attractor.z * mb + tPos.z * targetBlend) - pPos.z);
         force.normalize();
         particles.vel[i].multiplyScalar( attenuation );
         particles.vel[i].addSelf( force.multiplyScalar( accel ) );
         
         particles.vertices[i].position.addSelf( particles.vel[i] );
      }
      particles.update();
      
   }
   
   this.projectToWorld = function( screenPos ){
      //this was helpful http://jsfiddle.net/gero3/PE4x7/25/
      var pos = screenPos.clone();
      pos.x = ( pos.x / window.innerWidth ) * 2 - 1;
      pos.y = ( -(window.innerHeight-pos.y) / window.innerHeight ) * 2 + 1;
      
      var projector = new THREE.Projector();
      projector.unprojectVector( pos, camera );
      return pos;
   };
   
	// ===========================================
	// ===== DRAW
	// ===========================================
   
   this.draw = function (){
      
      gl.clearColor( .2, .2, .24, 1 );
      gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
      
      gl.disable( gl.DEPTH_TEST );
      gl.enable( gl.BLEND);
      gl.blendFunc( gl.SRC_ALPHA, gl.ONE );
      this.renderer.render( this.scene, camera );
            
   }
   
	// ===========================================
	// ===== MOUSE
	// ===========================================
   
   this.onMouseMoved		= function( x, y )
   {
      lastMouse.x = x;
      lastMouse.y = y;
   }		
   
   this.onMousePressed	= function (x,y){
   }
}

/*DemoApp.prototype 				= new LAB.ThreeApp();
 DemoApp.prototype.constructor 	= DemoApp;
 DemoApp.prototype.supr 			= LAB.ThreeApp.prototype;	
 */	

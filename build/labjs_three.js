// labjs_three.js - http://github.com/labatrockwell/LAB_JS_Framework
var gl=gl||null;LAB.app.ThreeApp=function(){LAB.app.BaseApp.call(this);this._canvas=this.renderer=this.projector=this.scene=this.camera=this.container=null;this.mouse={x:0,y:0};this._height=this._width=0};LAB.app.ThreeApp.prototype=new LAB.app.BaseApp;LAB.app.ThreeApp.prototype.constructor=LAB.app.ThreeApp;LAB.app.ThreeApp.prototype.supr=LAB.app.BaseApp.prototype;
LAB.app.ThreeApp.prototype.begin=function(a){a=a||{};console.log("base app set up");this.registerKeyEvents();this.registerMouseEvents();this._width=a.width||window.innerWidth;this._height=a.height||window.innerHeight;this._canvas=void 0!==a.canvas?a.canvas:document.createElement("canvas");this._canvas.id=void 0!==a.canvasId?a.canvasId:"labCanvas";this.renderer=new THREE.WebGLRenderer({antialias:void 0!==a.antialias?a.antialias:!0,canvas:this._canvas});this.renderer.sortObjects=!1;this.renderer.setSize(this._width,
this._height);this.camera=new THREE.PerspectiveCamera(60,this._width/this._height,0.1,2E3);this.camera.position.set(0,0,50);this.camera.lookAt(new THREE.Vector3(0,0,0));this.scene=a.scene||new THREE.Scene;this.scene.add(this.camera);this.projector=new THREE.Projector;if(null!=document.getElementById("labContainer"))this.container=document.getElementById("labContainer");else if(console.log("no labContainer in document, generating container div"),this.container=document.createElement("div"),document.body)document.body.appendChild(this.container);
else return;this.container.appendChild(this.renderer.domElement);gl=gl||this.renderer.getContext();this.setup();this.animate()};LAB.app.ThreeApp.prototype.__defineSetter__("canvasWidth",function(){console.log("error: please don't set this variable")});LAB.app.ThreeApp.prototype.__defineSetter__("canvasHeight",function(){console.log("error: please don't set this variable")});LAB.app.ThreeApp.prototype.__defineGetter__("canvasWidth",function(){return this._width});
LAB.app.ThreeApp.prototype.__defineGetter__("canvasHeight",function(){return this._height});LAB.three=LAB.three||{};LAB.three.Camera=function(a,b,c,d){THREE.PerspectiveCamera.call(this,a,b,c,d);this.matrix.identity();this.mvMatrixStack=[];this.useQuaternion=this.useTarget=!0;this.bUsePushPop=!1;this.setToWindowPerspective()};LAB.three.Camera.prototype=new THREE.PerspectiveCamera;LAB.three.Camera.prototype.constructor=LAB.three.Camera;LAB.three.Camera.prototype.supr=THREE.PerspectiveCamera.prototype;
LAB.three.Camera.prototype.usePushPop=function(a){this.bUsePushPop=a||!0;this.useTarget=!1;this.matrixAutoUpdate=!this.bUsePushPop};
LAB.three.Camera.prototype.updateMatrix=function(){if(!1==this.bUsePushPop){if(this.matrix.setPosition(this.position),this.useQuaternion?this.matrix.setRotationFromQuaternion(this.quaternion):this.matrix.setRotationFromEuler(this.rotation,this.eulerOrder),1!==this.scale.x||1!==this.scale.y||1!==this.scale.z)this.matrix.scale(this.scale),this.boundRadiusScale=Math.max(this.scale.x,Math.max(this.scale.y,this.scale.z))}else this.position.getPositionFromMatrix(this.matrix),this.position.getRotationFromMatrix(this.matrix);
this.matrixWorldNeedsUpdate=!0};LAB.three.Camera.prototype.setToWindowPerspective=function(a,b,c){this.setPerspective(a,window.innerWidth,window.innerHeight,b,c)};LAB.three.Camera.prototype.setPerspective=function(a,b,c,d,f){var a=a||60,g=b/2,e=c/2,h=Math.tan(Math.PI*a/360),h=e/h;this.projectionMatrix=THREE.Matrix4.makePerspective(a,b/c,d||h/10,f||10*h);this.position.set(g,e,h);this.up.set(0,1,0);this.matrix.lookAt(this.position,new THREE.Vector3(g,e,0),this.up);this.matrix.setPosition(this.position)};
LAB.three.Camera.prototype.projectToScreen=function(a){var a=a.clone(),b=new THREE.Matrix4;b.multiply(this.projectionMatrix,this.matrixWorldInverse);b.multiplyVector3(a);return{x:(a.x+1)*window.innerWidth/2,y:window.innerHeight-(-a.y+1)*window.innerHeight/2,z:0}};LAB.three.Camera.prototype.projectToWorld=function(a){a=a.clone();a.x=2*(a.x/window.innerWidth)-1;a.y=2*(-(window.innerHeight-a.y)/window.innerHeight)+1;(new THREE.Projector).unprojectVector(a,this);return a};
LAB.three.Camera.prototype.pushMatrix=function(){this.mvMatrixStack.push((new THREE.Matrix4).copy(this.matrix))};LAB.three.Camera.prototype.popMatrix=function(){0<this.mvMatrixStack.length&&this.matrix.copy(this.mvMatrixStack.pop());this.updateMatrix()};LAB.three.Camera.prototype.lookAt=function(a,b,c){this.bUsePushPop?this.matrix.lookAt(this.matrix.getPosition(),new THREE.Vector3(a,b,c),this.up):this.useTarget=!0;this.updateMatrix()};
LAB.three.Camera.prototype.translateMatrix=function(a,b,c){this.matrix.multiply((new THREE.Matrix4).setTranslation(a,b,c),this.matrix);this.updateMatrix()};LAB.three.Camera.prototype.scaleMatrix=function(a,b,c){this.matrix.n11*=a;this.matrix.n12*=a;this.matrix.n13*=a;this.matrix.n14*=a;this.matrix.n21*=b;this.matrix.n22*=b;this.matrix.n23*=b;this.matrix.n24*=b;this.matrix.n31*=c;this.matrix.n32*=c;this.matrix.n33*=c;this.matrix.n34*=c;this.updateMatrix()};
LAB.three.Camera.prototype.rotateMatrix=function(a,b,c,d){var f=Math.sqrt(b*b+c*c+d*d),b=b/f,c=c/f,d=d/f,f=b*b,g=c*c,e=d*d,h=Math.cos(a),i=Math.sin(a),m=1-h,f=f+(1-f)*h,a=b*c*m+d*i,k=b*d*m-c*i,r=b*c*m-d*i,g=g+(1-g)*h,o=c*d*m+b*i,s=b*d*m+c*i,b=c*d*m-b*i,c=e+(1-e)*h,d=this.matrix.n11,e=this.matrix.n12,h=this.matrix.n13,i=this.matrix.n14,m=this.matrix.n21,p=this.matrix.n22,l=this.matrix.n23,j=this.matrix.n24,n=this.matrix.n31,t=this.matrix.n32,u=this.matrix.n33,q=this.matrix.n34;this.matrix.n11=f*d+
a*m+k*n;this.matrix.n12=f*e+a*p+k*t;this.matrix.n13=f*h+a*l+k*u;this.matrix.n14=f*i+a*j+k*q;this.matrix.n21=r*d+g*m+o*n;this.matrix.n22=r*e+g*p+o*t;this.matrix.n23=r*h+g*l+o*u;this.matrix.n24=r*i+g*j+o*q;this.matrix.n31=s*d+b*m+c*n;this.matrix.n32=s*e+b*p+c*t;this.matrix.n33=s*h+b*l+c*u;this.matrix.n34=s*i+b*j+c*q;this.updateMatrix()};LAB.three.Camera.prototype.multMatrix=function(a){this.matrix.multiply(a,this.matrix)};
LAB.three.Camera.prototype.setToWindowOrtho=function(a,b){this.projectionMatrix=THREE.Matrix4.makeOrtho(window.innerWidth/-2,window.innerWidth/2,window.innerHeight/2,window.innerHeight/-2,a||-1E3,b||1E3)};LAB.three.Camera.prototype.makeOrtho=function(a,b){this.projectionMatrix=THREE.Matrix4.makeOrtho(window.innerWidth/-2,window.innerWidth/2,window.innerHeight/2,window.innerHeight/-2,a||-1E3,b||1E3)};LAB.three=LAB.three||{};
LAB.three.Geometry=function(){THREE.Geometry.call(this);this.vertexEdges=[];this.vertexFaces=[];this.vertexNormals=[];this.faceEdges=[]};LAB.three.Geometry.prototype=new THREE.Geometry;LAB.three.Geometry.prototype.constructor=LAB.three.Geometry;LAB.three.Geometry.prototype.supr=THREE.Geometry.prototype;LAB.three.Geometry.prototype.loadModel=function(a,b){var c=new THREE.JSONLoader(!0);c.load({model:a,callback:b||function(a){return a}})};
LAB.three.Geometry.prototype.loadLabModel=function(a){if(0<a.positions.length){this.vertices=[];for(var b=0;b<a.positions.length;b++)this.vertices[b]=new THREE.Vertex(new THREE.Vector3(a.positions[b][0],a.positions[b][1],a.positions[b][2]))}if(a.normals.length)for(b=0;b<a.normals.length;b++)this.vertexNormals[b]=new THREE.Vector3(a.normals[b][0],a.normals[b][1],a.normals[b][2]);for(b=0;b<a.indices.length;b++){var c=a.indices[b];3==c.length?(this.faces.push(new THREE.Face3(c[0],c[1],c[2])),a.texCoords&&
(this.faceVertexUvs[0][b]=[new THREE.UV(a.texCoords[c[0]][0],a.texCoords[c[0]][1]),new THREE.UV(a.texCoords[c[1]][0],a.texCoords[c[1]][1]),new THREE.UV(a.texCoords[c[2]][0],a.texCoords[c[2]][1])])):4==c.length&&(this.faces.push(new THREE.Face4(c[0],c[1],c[2],c[3])),a.texCoords&&(this.faceVertexUvs[0][b]=[new THREE.UV(a.texCoords[c[0]][0],a.texCoords[c[0]][1]),new THREE.UV(a.texCoords[c[1]][0],a.texCoords[c[1]][1]),new THREE.UV(a.texCoords[c[2]][0],a.texCoords[c[2]][1]),new THREE.UV(a.texCoords[c[3]][0],
a.texCoords[c[3]][1])]))}};LAB.three.Geometry.prototype.addVertex=function(a,b,c){this.vertices.push(new THREE.Vertex(new THREE.Vector3(a,b,c)));return this.vertices.length-1};LAB.three.Geometry.prototype.addFace=function(a,b,c){this.faces.push(new THREE.Face3(a,b,c));return this.faces.length-1};LAB.three.Geometry.prototype.update=function(){this.__dirtyVertices=!0};LAB.three.Geometry.prototype.calculateNormals=function(){this.computeFaceNormals();this.computeVertexNormals()};
LAB.three.Geometry.prototype.getPointOnFace=function(a,b,c){var d=this.faces[Math.min(a,this.faces.length-1)],a=new THREE.Vector3;if(d instanceof THREE.Face3){1<b+c&&(b=1-b,c=1-c);var f=1-b-c,g=this.vertices[d.a].position,e=this.vertices[d.b].position,h=this.vertices[d.c].position;a.set(g.x*b+e.x*c+h.x*f,g.y*b+e.y*c+h.y*f,g.z*b+e.z*c+h.z*f)}else if(d instanceof THREE.Face4){var f=1-b,i=1-c,g=this.vertices[d.a].position,e=this.vertices[d.b].position,h=this.vertices[d.c].position,d=this.vertices[d.d].position;
a.set((g.x*f+e.x*b)*i+(d.x*f+h.x*b)*c,(g.y*f+e.y*b)*i+(d.y*f+h.y*b)*c,(g.z*f+e.z*b)*i+(d.z*f+h.z*b)*c)}return a};
LAB.three.Geometry.prototype.getSmoothedNormalOnFace=function(a,b,c){var d=this.faces[Math.min(a,this.faces.length-1)],a=new THREE.Vector3;if(d instanceof THREE.Face3){1<b+c&&(b=1-b,c=1-c);var f=1-b-c,g=this.getVertexNormal(d.a),e=this.getVertexNormal(d.b),h=this.getVertexNormal(d.c);a.set(g.x*b+e.x*c+h.x*f,g.y*b+e.y*c+h.y*f,g.z*b+e.z*c+h.z*f)}else if(d instanceof THREE.Face4){var f=1-b,i=1-c,g=this.getVertexNormal(d.a),e=this.getVertexNormal(d.b),h=this.getVertexNormal(d.c),d=this.getVertexNormal(d.d);
a.set((g.x*f+e.x*b)*i+(d.x*f+h.x*b)*c,(g.y*f+e.y*b)*i+(d.y*f+h.y*b)*c,(g.z*f+e.z*b)*i+(d.z*f+h.z*b)*c)}return a};
LAB.three.Geometry.prototype.findEdges=function(){function a(a,b){for(var c=b.faces.length-1;0<=c;c--){g=b.faces.pop();f=b.faceIndices.pop();for(var d=0;d<a.faces.length;d++)f!=a.faceIndices[d]&&(a.faces.push(g),a.faceIndices.push(f))}}for(var b=0;b<this.faces.length;b++){var c=this.faces[b];if(c instanceof THREE.Face3){var d=new THREE.Edge(this.vertices[c.a],this.vertices[c.b],c.a,c.b);d.faces.push(c);d.faceIndices.push(b);this.edges.push(d);d=new THREE.Edge(this.vertices[c.b],this.vertices[c.c],
c.b,c.c);d.faces.push(c);d.faceIndices.push(b);this.edges.push(d);d=new THREE.Edge(this.vertices[c.c],this.vertices[c.a],c.c,c.a);d.faces.push(c);d.faceIndices.push(b);this.edges.push(d)}else c instanceof THREE.Face4&&(d=new THREE.Edge(this.vertices[c.a],this.vertices[c.b],c.a,c.b),d.faces.push(c),d.faceIndices.push(b),this.edges.push(d),d=new THREE.Edge(this.vertices[c.b],this.vertices[c.c],c.b,c.c),d.faces.push(c),d.faceIndices.push(b),this.edges.push(d),d=new THREE.Edge(this.vertices[c.c],this.vertices[c.d],
c.c,c.d),d.faces.push(c),d.faceIndices.push(b),this.edges.push(d),d=new THREE.Edge(this.vertices[c.d],this.vertices[c.a],c.d,c.a),d.faces.push(c),d.faceIndices.push(b),this.edges.push(d))}for(var f,g,b=0;b<this.edges.length;b++)for(var c=this.edges[b],e=b+1;e<this.edges.length;e++)d=this.edges[e],c.vertexIndices[0]==d.vertexIndices[0]&&c.vertexIndices[1]==d.vertexIndices[1]?a(c,d):c.vertexIndices[1]==d.vertexIndices[0]&&c.vertexIndices[0]==d.vertexIndices[1]&&a(c,d);for(b=this.edges.length-1;0<=b;b--)0==
this.edges[b].faces.length&&this.edges.splice(b,1)};LAB.three.Geometry.prototype.findVertexEdges=function(){0==this.edges.length&&this.findEdges();for(var a=0;a<this.vertices.length;a++)this.vertexEdges[a]=[];for(a=0;a<this.edges.length;a++)this.vertexEdges[this.edges[a].vertexIndices[0]].push([a,this.edges[a]]),this.vertexEdges[this.edges[a].vertexIndices[1]].push([a,this.edges[a]])};
LAB.three.Geometry.prototype.findVertexFaces=function(){for(var a=0;a<this.vertices.length;a++)this.vertexFaces[a]=[];for(var b,a=0;a<this.faces.length;a++)b=this.faces[a],b instanceof THREE.Face3?(this.vertexFaces[b.a].push([a,b]),this.vertexFaces[b.b].push([a,b]),this.vertexFaces[b.c].push([a,b])):b instanceof THREE.Face4&&(this.vertexFaces[b.a].push([a,b]),this.vertexFaces[b.b].push([a,b]),this.vertexFaces[b.c].push([a,b]),this.vertexFaces[b.d].push([a,b]))};
LAB.three.Geometry.prototype.findFaceEdges=function(){0==this.edges.length&&this.findEdges();for(var a=0;a<this.faces.length;a++)this.faceEdges[a]=[];for(a=0;a<this.edges.length;a++)for(var b=0;b<this.edges[a].faceIndices.length;b++)this.faceEdges[this.edges[a].faceIndices[b]].push([a,this.edges[a]])};LAB.three.Geometry.prototype.getFaceNormal=function(a){return this.faces[a].normal};
LAB.three.Geometry.prototype.getVertexNormal=function(a){this.vertexNormals[a]||(this.vertexNormals[a]=new THREE.Vector3,this.calcVertexNormal(a));return this.vertexNormals[a]};LAB.three.Geometry.prototype.calcVertexNormal=function(a){this.vertexNormals[a]||(this.vertexNormals[a]=new THREE.Vector3);for(var b=this.vertexFaces[a],c=0;c<b.length;c++)this.vertexNormals[a].addSelf(b[c][1].normal);return this.vertexNormals[a].normalize()};
LAB.three.Geometry.prototype.calculateVertexNormals=function(){for(var a=0;a<this.vertices.length;a++)this.calcVertexNormal(a)};LAB.three.Geometry.prototype.getVertexLocalPosition=function(a){return this.vertices[a].position};LAB.three=LAB.three||{};LAB.three.Mesh=function(){THREE.Mesh.call(this);this.loader=null;this.isLoaded=!1;this.location=""};LAB.three.Mesh.prototype=new THREE.Mesh;LAB.three.Mesh.prototype.constructor=LAB.three.Mesh;LAB.three.Mesh.prototype.supr=THREE.Mesh.prototype;
LAB.three.Mesh.prototype.loadGeometry=function(a,b){var c=this;this.loader=new THREE.JSONLoader(!0);this.loader.onLoadComplete=b||function(){};this.loader.load(this.location,function(a){c.geometry=a})};LAB.three.Mesh.prototype.load=function(a,b,c){this.scene=c||console.warn("please pass in a THREE.Scene object");if(!c)this.scene=new THREE.Scene;this.material=b||new THREE.NormalMaterial;this.location=a;this.loadGeometry(this.location,this._onload.bind(this))};
LAB.three.Mesh.prototype._onload=function(){this.geometry.computeBoundingSphere();this.boundRadius=this.geometry.boundingSphere.radius;this.scene.add(this);console.log(this.location," loaded")};namespace("LAB.three.MouseHandler3D");
LAB.three.MouseHandler3D=function(a,b){function c(c,d){var e,f,g,h,i;e=new THREE.Vector3(2*(d.clientX/window.innerWidth)-1,2*-(d.clientY/window.innerHeight)+1,0.5);r.unprojectVector(e,b);g=(new THREE.Ray(b.position,e.subSelf(b.position).normalize())).intersectObjects(a.children);f=g.length;if(0<f)for(e=0;e<f;e++)if(h=g[e].object,k[h.id])h===k[h.id].object?(i=k[h.id].events,void 0!=i&&-1<i.indexOf(c)&&(h={object:h,data:d},m.dispatchEvent(new LAB.three.MouseEvent3D(c),h))):console.log("no match")}function d(a){c(LAB.three.MouseEvent3D.MOVE,
a)}function f(a){c(LAB.three.MouseEvent3D.DOWN,a)}function g(a){c(LAB.three.MouseEvent3D.UP,a)}function e(a){c(LAB.three.MouseEvent3D.CLICK,a)}function h(a){c(LAB.three.MouseEvent3D.OVER,a)}function i(a){c(LAB.three.MouseEvent3D.OUT,a)}LAB.EventDispatcher.call(this,this);var m=this,k={},r;r=new THREE.Projector;this.register=function(a,b){for(var c=b.length,l=0;l<c;l++)switch(b[l]){case LAB.three.MouseEvent3D.DOWN:document.addEventListener("mousedown",f,!1);break;case LAB.three.MouseEvent3D.UP:document.addEventListener("mouseup",
g,!1);break;case LAB.three.MouseEvent3D.CLICK:document.addEventListener("click",e,!1);break;case LAB.three.MouseEvent3D.MOVE:document.addEventListener("mousemove",d,!1);break;case LAB.three.MouseEvent3D.OVER:document.addEventListener("mouseover",h,!1);break;case LAB.three.MouseEvent3D.OUT:document.addEventListener("mouseout",i,!1)}if(k[a.id])for(var l=k[a.id].events,j=0;j<c;j++)l.indexOf(-1==b[j])&&l.push(b[j]);else k[a.id]={object:a,events:b}};this.unregister=function(a,b){var b=b||null,c,d;if(k[a.id])if(null==
b)delete k[a.id];else{c=k[a.id];for(var e=0,f=b.length;e<f;e++)d=c.events.indexOf(b[e]),-1<d&&c.events.splice(d,1)}}};LAB.three.MouseHandler3D.prototype=LAB.inherit(LAB.EventDispatcher.prototype);LAB.three.MouseHandler3D.prototype.constructor=LAB.three.MouseHandler3D;LAB.namespace("LAB.three.MouseEvent3D");LAB.three.MouseEvent3D=function(a){LAB.Event.call(this,a)};LAB.three.MouseEvent3D.DOWN="mouse3DDown";LAB.three.MouseEvent3D.UP="mouse3DUp";LAB.three.MouseEvent3D.MOVE="mouse3DMove";
LAB.three.MouseEvent3D.OVER="mouse3DOver";LAB.three.MouseEvent3D.OUT="mouse3DOut";LAB.three.MouseEvent3D.CLICK="mouse3DClick";LAB.three.MouseEvent3D.prototype=LAB.inherit(LAB.Event.prototype);LAB.three.MouseEvent3D.prototype.constructor=LAB.three.MouseEvent3D;LAB.three=LAB.three||{};LAB.three.Object=function(a,b){this.renderer=a;this.scene=b||new THREE.Scene;this.autoClear=!0;this.labObj=new THREE.Object3D;this.posStack=[];this.rotStack=[];this.sclStack=[];this.scene.add(this.labObj)};
LAB.three.Object.prototype={constructor:LAB.three.Object,addGeometry:function(a,b){this.labObj.addChild(new THREE.Mesh(a,b))},addObject:function(a){this.labObj.add(a)},addChild:function(a){this.labObj.add(a)},addLight:function(a){this.scene.add(a)},draw:function(a,b,c){this.scene.overrideMaterial=b||null;this.renderer.render(this.scene,a,c||null,this.autoClear)},translate:function(a,b,c){this.labObj.position.x+=a;this.labObj.position.y+=b;this.labObj.position.z+=c},setTranslation:function(a,b,c){this.labObj.position.x=
a;this.labObj.position.y=b;this.labObj.position.z=c},setRotation:function(a,b,c,d){this.labObj.rotation.setRotationFromMatrix((new THREE.Matrix4).setRotationAxis((new THREE.Vector3(b,c,d)).normalize(),0.0174532925*a))},scale:function(a,b,c){this.labObj.scale.set(this.labObj.scale.x*a,this.labObj.scale.y*b,this.labObj.scale.z*c)},setScale:function(a,b,c){this.labObj.scale.set(a,b,c)},multMatrix:function(){},pushMatrix:function(){this.posStack.push(this.labObj.position);this.rotStack.push(this.labObj.rotation);
this.sclStack.push(this.labObj.scale)},popMatrix:function(){this.posStack.length&&(this.labObj.position.copy(this.posStack.pop()),this.labObj.rotation.copy(this.rotStack.pop()),this.labObj.scale.copy(this.sclStack.pop()))}};LAB.three=LAB.three||{};
var labParticle=function(){this.pos=new THREE.Vector3;this.vel=new THREE.Vector3;this.col=new THREE.Vector3(1,1,1);this.radius=10;this.birth=0;this.lifespan=1;this.copy=function(a){this.pos.copy(a.pos);this.vel.copy(a.vel);this.col.copy(a.col);this.radius=a.radius;this.birth=a.birth;this.lifespan=a.lifespan}};
LAB.three.ParticleEmitter=function(a){a=a||{};this.maxParticleCount=a.maxParticleCount||5E3;this.particles=[];this.scene=a.scene||new THREE.Scene;this.renderer=a.renderer||new THREE.WebGLRenderer;this.camera=a.camera||new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight);for(var b=this.currentTime=0;b<this.maxParticleCount;b++)this.particles[b]=a.createParticle?a.createParticle():new labParticle;this.attributes={pColor:{type:"v3",value:[]},radius:{type:"f",value:[]},birth:{type:"f",
value:[]},lifespan:{type:"f",value:[]}};this.geometry=new THREE.Geometry;for(b=0;b<this.particles.length;b++)this.geometry.vertices[b]=new THREE.Vertex(this.particles[b].pos),this.attributes.pColor.value[b]=new THREE.Vector3(1,0,0),this.particles[b].col=this.attributes.pColor.value[b],this.attributes.radius.value[b]=this.particles[b].radius,this.attributes.birth.value[b]=this.particles[b].birth,this.attributes.lifespan.value[b]=this.particles[b].lifespan;this.geometry.dynamic=!0;this.geometry.__dirtyVertices=
!0;a={tex:{type:"t",value:0,texture:THREE.ImageUtils.loadTexture("textures/sphereNormal.png")},currentTime:{type:"f",value:0},pScl:{type:"f",value:100}};this.shader=new LAB.three.Shader({name:"shaders/basicParticle",uniforms:a,attributes:this.attributes});this.particleSystem=new THREE.ParticleSystem(this.geometry,this.shader);this.scene.add(this.particleSystem);this.renderer.render(this.scene,this.camera);this.particleSystem.geometry.__webglParticleCount=0};
LAB.three.ParticleEmitter.prototype.addParticle=function(a,b,c,d,f,g){if(this.particleSystem.geometry.__webglParticleCount<this.maxParticleCount-1){var e=this.particleSystem.geometry.__webglParticleCount;this.particles[e].pos.copy(a||{x:0,y:0,z:0});this.particles[e].vel.copy(b||{x:0,y:0,z:0});this.particles[e].col.copy(c||{x:1,y:1,z:1});this.particles[e].radius=this.attributes.radius.value[e]=d||10;this.particles[e].birth=this.attributes.birth.value[e]=f||LAB.getElapsedTimeSeconds();this.particles[e].lifespan=
this.attributes.lifespan.value[e]=g||10;this.particleSystem.geometry.__webglParticleCount++;this.geometry.__dirtyVertices=!0;this.attributes.pColor.needsUpdate=!0;this.attributes.radius.needsUpdate=!0;this.attributes.birth.needsUpdate=!0;this.attributes.lifespan.needsUpdate=!0;return this.particles[e]}return null};
LAB.three.ParticleEmitter.prototype.removeParticle=function(a){if(0<this.geometry.__webglParticleCount)this.geometry.__webglParticleCount-=1,this.particles[a].copy(this.particles[this.geometry.__webglParticleCount]),this.attributes.radius.value[a]=this.particles[a].radius,this.attributes.lifespan.value[a]=this.particles[a].lifespan,this.attributes.birth.value[a]=this.particles[a].birth,this.geometry.__dirtyVertices=!0,this.attributes.pColor.needsUpdate=!0,this.attributes.radius.needsUpdate=!0,this.attributes.birth.needsUpdate=
!0,this.attributes.lifespan.needsUpdate=!0};LAB.three=LAB.three||{};
LAB.three.Ray=function(a,b){function c(a,b,c){p.sub(c,a);n=p.dot(b);t=l.add(a,j.copy(b).multiplyScalar(n));return u=c.distanceTo(t)}function d(a,b,c,d){p.sub(d,b);l.sub(c,b);j.sub(a,b);q=p.dot(p);w=p.dot(l);x=p.dot(j);y=l.dot(l);z=l.dot(j);A=1/(q*y-w*w);B=(y*x-w*z)*A;C=(q*z-w*x)*A;return 0<=B&&0<=C&&1>B+C}this.origin=a||new THREE.Vector3;this.direction=b||new THREE.Vector3;this.intersectObjects=function(a){var b,c,d=[];for(b=0,c=a.length;b<c;b++)Array.prototype.push.apply(d,this.intersectObject(a[b]));
d.sort(function(a,b){return a.distance-b.distance});return d};var f=1.0E-4;this.setPrecision=function(a){f=a};var g=new THREE.Vector3,e=new THREE.Vector3,h=new THREE.Vector3,i=new THREE.Vector3,m=new THREE.Vector3,k=new THREE.Vector3,r=new THREE.Vector3,o=new THREE.Vector3,s=new THREE.Vector3;this.intersectObject=function(a){var b,l=[];if(0==a.boundRadius)for(var j=0,p=a.children.length;j<p;j++)Array.prototype.push.apply(l,this.intersectObject(a.children[j]));if(a instanceof THREE.Particle){j=c(this.origin,
this.direction,a.matrixWorld.getPosition());if(j>a.scale.x)return[];b={distance:j,point:a.position,face:null,object:a};l.push(b)}else if(a instanceof THREE.Mesh){j=c(this.origin,this.direction,a.matrixWorld.getPosition());p=THREE.Frustum.__v1.set(a.matrixWorld.getColumnX().length(),a.matrixWorld.getColumnY().length(),a.matrixWorld.getColumnZ().length());if(j>a.geometry.boundingSphere.radius*Math.max(p.x,Math.max(p.y,p.z)))return l;var n,t,u=a.geometry,q=u.vertices,v;a.matrixRotationWorld.extractRotation(a.matrixWorld);
for(j=0,p=u.faces.length;j<p;j++)if(b=u.faces[j],m.copy(this.origin),k.copy(this.direction),v=a.matrixWorld,r=v.multiplyVector3(r.copy(b.centroid)).subSelf(m),o=a.matrixRotationWorld.multiplyVector3(o.copy(b.normal)),n=k.dot(o),!(Math.abs(n)<f)&&(t=o.dot(r)/n,!(0>t)&&(a.doubleSided||(a.flipSided?0<n:0>n))))if(s.add(m,k.multiplyScalar(t)),b instanceof THREE.Face3)g=v.multiplyVector3(g.copy(q[b.a].position)),e=v.multiplyVector3(e.copy(q[b.b].position)),h=v.multiplyVector3(h.copy(q[b.c].position)),d(s,
g,e,h)&&(b={distance:m.distanceTo(s),point:s.clone(),face:b,object:a},l.push(b));else if(b instanceof THREE.Face4&&(g=v.multiplyVector3(g.copy(q[b.a].position)),e=v.multiplyVector3(e.copy(q[b.b].position)),h=v.multiplyVector3(h.copy(q[b.c].position)),i=v.multiplyVector3(i.copy(q[b.d].position)),d(s,g,e,i)||d(s,e,h,i)))b={distance:m.distanceTo(s),point:s.clone(),face:b,object:a},l.push(b)}return l};var p=new THREE.Vector3,l=new THREE.Vector3,j=new THREE.Vector3,n,t,u,q,w,x,y,z,A,B,C};
LAB.three=LAB.three||{};LAB.three.Shader=function(a){THREE.ShaderMaterial.call(this);a=a||{};a.name&&($.ajax({async:!1,type:"GET",url:a.name.concat(".vert"),success:function(b){a.vertexShader=b.slice(0,b.length)}}),$.ajax({async:!1,type:"GET",url:a.name.concat(".frag"),success:function(b){a.fragmentShader=b.slice(0,b.length)}}),THREE.ShaderMaterial.call(this,a))};LAB.three.Shader.prototype=new THREE.ShaderMaterial;LAB.three.Shader.prototype.constructor=LAB.three.Shader;
LAB.three.Shader.prototype.supr=THREE.ShaderMaterial.prototype;LAB.three.Shader.prototype.loadFromString=function(a,b,c){c=c||{};c.vertexShader=a;c.fragmentShader=b;THREE.ShaderMaterial.call(this,c)};
LAB.three.Shader.prototype.loadFile=function(a,b){console.log(a);b=b||{};a&&($.ajax({async:!1,type:"GET",url:a.concat(".vert"),success:function(a){b.vertexShader=a.slice(0,a.length)}}),$.ajax({async:!1,type:"GET",url:a.concat(".frag"),success:function(a){b.fragmentShader=a.slice(0,a.length)}}),THREE.ShaderMaterial.call(this,b))};namespace("LAB.three.TouchHandler3D");
LAB.three.TouchHandler3D=function(a,b){function c(c,d){var e,f,h,g,i;e=new THREE.Vector3(2*(d.target.getTouchX()/window.innerWidth)-1,2*-(d.target.getTouchY()/window.innerHeight)+1,0.5);r.unprojectVector(e,b);h=(new THREE.Ray(b.position,e.subSelf(b.position).normalize())).intersectObjects(a.children);f=h.length;if(0<f)for(e=0;e<f;e++)if(g=h[e].object,k[g.id])g===k[g.id].object?(i=k[g.id].events,void 0!=i&&-1<i.indexOf(c)&&(g={object:g,data:d},m.dispatchEvent(new LAB.three.TouchEvent3D(c),g))):console.log("no match")}
function d(a){c(LAB.three.TouchEvent3D.TAP,a)}function f(a){c(LAB.three.TouchEvent3D.DRAG,a)}function g(a){c(LAB.three.TouchEvent3D.FLICK,a)}function e(a){c(LAB.three.TouchEvent3D.DOWN,a)}function h(a){c(LAB.three.TouchEvent3D.UP,a)}function i(a){c(LAB.three.TouchEvent3D.OUT,a)}LAB.EventDispatcher.call(this,this);var m=this,k={},r,o;r=new THREE.Projector;o=new LAB.TouchGestureHandler;o.register(window);this.register=function(a,b){for(var c=b.length,j=0;j<c;j++){var n=b[j];if(!o.hasEventListener({touch3DDown:LAB.TouchEvent.PRESS,
touch3DUp:LAB.TouchEvent.RELEASE,touch3DFlick:LAB.TouchEvent.FLICK,touch3DDrag:LAB.TouchEvent.DRAG,touch3DTap:LAB.TouchEvent.TAP,touch3DOut:LAB.TouchEvent.OUT}[n]))switch(n){case LAB.three.TouchEvent3D.DOWN:o.addEventListener(LAB.TouchEvent.PRESS,e);break;case LAB.three.TouchEvent3D.UP:o.addEventListener(LAB.TouchEvent.RELEASE,h);break;case LAB.three.TouchEvent3D.FLICK:o.addEventListener(LAB.TouchEvent.FLICK,g);break;case LAB.three.TouchEvent3D.DRAG:o.addEventListener(LAB.TouchEvent.DRAG,f);break;
case LAB.three.TouchEvent3D.TAP:o.addEventListener(LAB.TouchEvent.TAP,d);break;case LAB.three.TouchEvent3D.OUT:o.addEventListener(LAB.TouchEvent.PRESS,i)}}if(k[a.id]){j=k[a.id].events;for(n=0;n<c;n++)j.indexOf(-1==b[n])&&j.push(b[n])}else k[a.id]={object:a,events:b}};this.unregister=function(a,b){var b=b||null,c,d;if(k[a.id])if(null==b)delete k[a.id];else{c=k[a.id];for(var e=0,f=b.length;e<f;e++)d=c.events.indexOf(b[e]),-1<d&&c.events.splice(d,1)}}};LAB.three.TouchHandler3D.prototype=LAB.inherit(LAB.EventDispatcher.prototype);
LAB.three.TouchHandler3D.prototype.constructor=LAB.three.TouchHandler3D;namespace("LAB.three.TouchEvent3D");LAB.three.TouchEvent3D=function(a){LAB.Event.call(this,a)};LAB.three.TouchEvent3D.DOWN="touch3DDown";LAB.three.TouchEvent3D.UP="touch3DUp";LAB.three.TouchEvent3D.OUT="touch3DOut";LAB.three.TouchEvent3D.TAP="touch3DTap";LAB.three.TouchEvent3D.FLICK="touch3DFlick";LAB.three.TouchEvent3D.DRAG="touch3DDrag";LAB.three.TouchEvent3D.prototype=LAB.inherit(LAB.Event.prototype);
LAB.three.TouchEvent3D.prototype.constructor=LAB.three.TouchEvent3D;

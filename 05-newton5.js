import * as THREE from './js/three.module.js';
import {OrbitControls} from './js/OrbitControls.js';
import {RoomEnvironment} from './js/RoomEnvironment.js';

const canvas = document.getElementById('canvas1');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//// Color 61
const colors = [
     "#D0E7F5",
     "#D9E7F4",
     "#D6E3F4",
     "#BCDFF5",
     "#B7D9F4",
     "#C3D4F0",
     "#9DC1F3",
     "#9AA9F4",
     "#8D83EF",
     "#AE69F0",
     "#D46FF1",
     "#DB5AE7",
     "#D911DA",
     "#D601CB",
     "#E713BF",
     "#F24CAE",
     "#FB79AB",
     "#FFB6C1",
     "#FED2CF",
     "#FDDFD5",
     "#D0E7F5",
     "#D9E7F4",
     "#D6E3F4",
     "#BCDFF5",
     "#B7D9F4",
     "#C3D4F0",
     "#9DC1F3",
     "#9AA9F4",
     "#8D83EF",
     "#AE69F0",
     "#D46FF1",
     "#DB5AE7",
     "#D911DA",
     "#D601CB",
     "#E713BF",
     "#F24CAE",
     "#FB79AB",
     "#FFB6C1",
     "#FED2CF",
     "#FDDFD5",
     "#D0E7F5",
     "#D9E7F4",
     "#D6E3F4",
     "#BCDFF5",
     "#B7D9F4",
     "#C3D4F0",
     "#9DC1F3",
     "#9AA9F4",
     "#8D83EF",
     "#AE69F0",
     "#D46FF1",
     "#DB5AE7",
     "#D911DA",
     "#D601CB",
     "#E713BF",
     "#F24CAE",
     "#FB79AB",
     "#FFB6C1",
     "#FED2CF",
     "#FDDFD5",
     "#FEDCD1"
];

let soundEnabled = false;
let collisionSoundEnabled = false;

const clap = new Audio('./assets/audios/clap.mp3');
clap.currentTime = 0;
clap.volume = 0.1;





const getFileName = (index) => {
     return `key-${index}`;
}

const getURL = (index) => {
     return `./assets/audios/bell/${getFileName(index)}.mp3`;
}

const keys = [];
for(let i = 0; i < colors.length; i++) {
     const audio = new Audio(getURL(i));
     audio.currentTime = 0.2;
     audio.volume = 0.4;
     keys.push(audio);
}

const playKey = (index) => {
     //keys[index].currentTime = 0;     
     keys[index].play();
}


///// Init Variables /////
// THREE //
let scene, camera, renderer, orbitControls;
let cameraFront, cameraTop, insetWidth, insetHeight;

const textureLoader = new THREE.TextureLoader();
const space = textureLoader.load('./assets/images/galaxy1.jpg');
const metalTextureColor = textureLoader.load('./assets/textures/Metal043A_1K_Color.jpg');
const metalTextureRoughness = textureLoader.load('./assets/textures/Metal043A_1K_Roughness.jpg');

// For Collision detect Sound //
// point circles//
let points1 = [];
let points2 = [];
let points3 = [];
let points4 = [];
let points5 = [];

let cylinders = [];
let balls = [];
let boom = new THREE.Group();
let ballBB;
let ballMeshes = [];
let boxHelpers = [];
let targets = [];

// Pendulum Variables //
const maxPendulum = 5;
let distance = (maxPendulum - 1) * 2.1; 

let ballRadius = 2;
let stringLength = 31;
let stringWidth = 0.18;
let a = 0;
const pendulums = [];
let amplitude = 0;
let frequency = 0.5; 

let angle = 0.2;
let duration = 1;
let angleZ = 0;

// vibraphone
let groupLeft = new THREE.Group();
let groupRight = new THREE.Group();
let rightCubes = [];
let leftCubes = [];

// Init Functions //
initThree();
createCylinderBalls();
//createVibraphone();
createLights();
createBar();
createRing();
//boomCamera();
cameraFrontMove();
createGroundMirror();

///// Init THREE /////////////////////////////////////////

function initThree(){
     scene = new THREE.Scene();
     scene.background = new THREE.Color(0x111111);
     scene.background = space;
     scene.fog = new THREE.Fog(0x555555, 1, 580);
     camera = new THREE.PerspectiveCamera(
          55,
          window.innerWidth/window.innerHeight,
          0.1,
          10000
     )
     camera.position.set(0, 6, 75);
     camera.lookAt(0, 0, 0);
     boom.add(camera);

     insetWidth = window.innerWidth * 0.30;
     insetHeight = window.innerWidth * 0.16;

     // camera top //
     cameraTop = new THREE.PerspectiveCamera(70, insetWidth/insetHeight, 1, 500);
     cameraTop.position.set(0, 60, 0);
     cameraTop.lookAt(0, 0, 0);
     cameraTop.name = 'cameraTop';
     
     //cameraFront
     
     cameraFront = new THREE.PerspectiveCamera( 70, insetWidth / insetHeight,
     1, 500)
     cameraFront.position.set(0, 5, 10);
     //cameraFront.lookAt(0, 0, 0);
     cameraFront.name = 'frontCamera';     

     renderer = new THREE.WebGLRenderer({antialias: true, 
     canvas: canvas});
     renderer.setPixelRatio(window.devicePixelRatio);
     renderer.setSize(window.innerWidth, window.innerHeight);
     renderer.shadowMap.enabled = true;
     renderer.toneMapping = THREE.ACESFilmicToneMapping;
     renderer.toneMappingExposure = 1;

     const environment = new RoomEnvironment(renderer);
     const pmremGenerator = new THREE.PMREMGenerator(renderer);
     scene.environment = pmremGenerator.fromScene(environment).texture;


     orbitControls = new OrbitControls(camera, renderer.domElement);
     orbitControls.enableDamping = true;
     orbitControls.dampingFactor = 0.04;  
}

//cameraFront controls
function cameraFrontMove(){
     let tl = gsap.timeline({repeat: 4, repeatDelay: 5});
     tl.to(cameraFront.position, {z: 50, delay: 5, duration:12});
     tl.to(cameraFront.position, {z: 30, duration:6});
     tl.to(cameraFront.position, {z: 60, duration:6});
     tl.to(cameraFront.position, {x: -30, duration: 8});
     tl.to(cameraFront.position, {y: 10, duration: 8});
     tl.to(cameraFront.position, {x: 38, duration:4});
     tl.to(cameraFront.position, {x: 0, duration:2});
     tl.to(cameraFront.position, {z: 30 , duration: 6});
     tl.to(cameraFront.position, {y: 0 , duration: 12});
     tl.to(cameraFront.position, {x: 30  , duration: 6});
     tl.to(cameraFront.position, {z: 38, duration:6}); 
     tl.to(cameraFront.position, {y: 10, duration:4}); 
     tl.to(cameraFront.position, {x: 60, duration:4}); 
     tl.to(cameraFront.position, {x: -50, duration:6}); 
     tl.to(cameraFront.position, {x: 1, duration:8});  
     tl.to(cameraFront.position, {z: 20, duration:4});  
     tl.to(cameraFront.position, {y: 5, duration:6});  
     tl.to(cameraFront.position, {z: 10, duration:8});  
     tl.to(cameraFront.position, {y: 10, duration:4});  
     tl.to(cameraFront.position, {z: 50, duration:6});
}

//Action Camera Gsap// 600s // make it 8min (480s)
function boomCamera(){
     let tl = gsap.timeline({repeat: 5, repeatDelay: 30});
     tl.to(camera.position, {z: 65, y: 31, duration: 30, delay: 30});
     tl.fromTo(boom.rotation, {y: Math.PI}, {y: 0, duration: 30, delay: 30, yoyo: true, ease: 'power1.inOut'});
     tl.fromTo(boom.rotation, {y: 0}, {y: Math.PI, duration: 30, delay: 30, ease: 'power1.inOut'});
     tl.to(camera.position, {z: 55, duration: 15, delay: 15 }, );
     tl.to(camera.position, {z: 75, duration: 15, delay: 15 }, ); // 240s
     tl.fromTo(boom.rotation, {y: Math.PI}, {y: 0, duration: 15, delay: 15, yoyo: true, ease: 'power1.inOut'});
     tl.fromTo(boom.rotation, {y: 0}, {y: Math.PI, duration: 15, delay: 15, ease: 'power1.inOut'});//300s
     tl.to(camera.position, {z: 55, y: 31, duration: 30, delay: 10 }, );
     tl.to(camera.position, {z: 65, y: 55,  duration: 30, delay: 10}, );
     tl.fromTo(boom.rotation, {y: Math.PI}, {y: 0, duration: 30, delay: 15, ease: 'power1.inOut'});
     tl.fromTo(boom.rotation, {y: 0}, {y: Math.PI, duration: 30, delay: 10, ease: 'power1.inOut'});
     tl.to(camera.position, {z: 20, y: 0,  duration: 30 }, );
     tl.to(camera.position, {z: 75, y: 6, duration: 30, delay: 30 }, ); 

     tl.fromTo(boom.rotation, {y: Math.PI}, {y: 0, duration: 30, delay: 15, yoyo: true, ease: 'power1.inOut'});//600s
     tl.fromTo(boom.rotation, {y: 0}, {y: Math.PI, duration: 30, delay: 15, yoyo: true, ease: 'power1.inOut'});//600s
}

function createLights(){
     const ambientLight = new THREE.AmbientLight(0xaaaaaa, 0.51);
     scene.add(ambientLight);
     const dirLight = new THREE.DirectionalLight(0xffffff, 1);
     dirLight.position.set(5, 150, 50);
     scene.add(dirLight);
     dirLight.castShadow = true;
     dirLight.shadow.mapSize.width = 1024;
     dirLight.shadow.mapSize.height = 1024;
     const d = 150;
     dirLight.shadow.camera.top = d;
     dirLight.shadow.camera.right = d;
     dirLight.shadow.camera.bottom = -d;
     dirLight.shadow.camera.left = -d;
     dirLight.shadow.camera.near = 0.1;
     dirLight.shadow.camera.far = 100;

     const pointLight1 = new THREE.PointLight(0xffffff, 1);
     pointLight1.position.set(0, 0, 45);
     scene.add(pointLight1);
     const pointLight2 = new THREE.PointLight(0xffffff, 1);
     pointLight2.position.set(0, 0, -45);
     scene.add(pointLight2);

     const greenLight = new THREE.PointLight(0x00ff00, 0.5, 1000, 0);
     greenLight.position.set(550, 50, 0);
     scene.add(greenLight);

     const redLight = new THREE.PointLight(0xff0000, 0.5, 1000, 0);
     redLight.position.set(-550, 50, 0);
     scene.add(redLight);

     const blueLight = new THREE.PointLight(0x0000ff, 0.5, 1000, 0);
     greenLight.position.set(0, 50, 550);
     scene.add(blueLight); 
}

//create Ring Points //
let pointRadius = 32; //maxPendulum distance

function createRingPoints(){
     for(let i = 0; i < 61; i++){
          let group = new THREE.Group();
          const geo = new THREE.SphereGeometry(0.2, 10, 10);
          const mat  = new THREE.MeshStandardMaterial({
               color: 0xffffff,
               transparent: true,
               opacity: 0.2
          })
          const dot = new THREE.Mesh(geo, mat);
          let a = Math.PI * 2 / 61;
          dot.position.x = pointRadius * Math.cos( a * i );
          dot.position.y = pointRadius * Math.sin( a * i );
          group.add(dot);
          group.position.y = 31;
          group.rotation.z = -Math.PI/2;
          scene.add(group);
          
     }
}

createRingPoints();



//create points
let anglePoint = Math.PI * 2 / 61; //keys.length
function createPoints(group, offset){     
     for(let i = 0; i < 61; i++ ){
          let point = new THREE.Vector3(pointRadius * Math.cos(anglePoint * i - Math.PI) + offset, pointRadius * Math.sin(anglePoint * i - Math.PI) + pointRadius, 0);
          group.push(point);
     }
};
createPoints(points1, -8.4);
createPoints(points2, -4.2);
createPoints(points3, 0);
createPoints(points4, 4.2);
createPoints(points5, 8.4);


///// cylinderBalls /////

function createCylinderBalls(){
     for ( let i = 0; i < 61; i++ ) {          
          let radius = maxPendulum * 6;
          let cylinderMaterial = new THREE.MeshPhongMaterial();
          cylinderMaterial.roughness = 0.5 * Math.random();
          cylinderMaterial.metalness =  0.75;
          cylinderMaterial.color.setHSL( Math.random(), 1.0, 0.5 );

          let cylinder = new THREE.Mesh( new THREE.CylinderGeometry( 0.5, 0.25, 1, 40, 20 ), cylinderMaterial );
          cylinder.castShadow = true;
          cylinder.receiveShadow = true;
          let anglePosition = Math.PI * 2 / 61;
          cylinder.position.x = radius * Math.cos( anglePosition * i );
          cylinder.position.z = radius * Math.sin( anglePosition * i );
          cylinder.position.y = -10;
          
          // Balls
          let ballGeometry = new THREE.SphereGeometry( 0.75, 32, 16 );
          ballGeometry.translate( 0, -8, 0 );

          let ballMaterial = new THREE.MeshStandardMaterial();
          ballMaterial.roughness = 0.25 * Math.random() + 0.25;
          ballMaterial.metalness =  0.9;
          ballMaterial.color.setHSL( Math.random(), 1.0, 0.5 );
          //ballMaterial.color = new THREE.Color(colors[i]);
          let ball = new THREE.Mesh( ballGeometry, ballMaterial );
          ball.castShadow = true;
          ball.receiveShadow = true;

          ball.position.x = radius * Math.cos( anglePosition * i );
          ball.position.z = radius * Math.sin( anglePosition * i );

          scene.add( ball );
          scene.add( cylinder );
          cylinders.push( cylinder );
          balls.push( ball );
     } 
}

///// Vibraphone /////
function createCubeMesh(){
     const geometry = new THREE.BoxGeometry();
     const material = new THREE.MeshPhongMaterial({
          color: 0x999999,
          transparent: true,
          opacity: 1,
     })
     const cubeMesh = new THREE.Mesh(geometry, material);
     cubeMesh.castShadow = true;
     cubeMesh.receiveShadow = true;
     scene.add(cubeMesh);
     return cubeMesh;
}

function createVibraphone(){
     for(let i = 0; i < 21; i++){
          const cubeR = createCubeMesh();
          cubeR.material.color = new THREE.Color(`hsla(${i*36}, 100%, 50%, 1)`);
          cubeR.scale.set(1, i * 0.25 + 1, 2);
          cubeR.position.set(1.25 * i + 5,   i * 0.125, 0);
          rightCubes.push(cubeR);
          groupRight.add(cubeR);  
          groupRight.position.y = -10;
     
          const cubeL = createCubeMesh();
          cubeL.material.color = new THREE.Color(`hsla(${ i*36}, 100%, 50%, 1)`);
          cubeL.scale.set(1, i * 0.25 + 1, 2);
          cubeL.position.set(-1.25 * i - 5, i * 0.125, 0);
          leftCubes.push(cubeL);
          groupLeft.add(cubeL);  
          groupLeft.position.y = -10;
     } 
     scene.add(groupRight);
     scene.add(groupLeft);
};

//

function createGroundMirror(){
     const geo = new THREE.CircleGeometry(40, 30, 30);
     const mat = new THREE.MeshPhongMaterial({
          color: 0x000000,
          transparent: true,
          opacity: 0.85,
     })
     const screen = new THREE.Mesh(geo, mat);
     screen.position.y = -12.5;
     screen.rotation.x = -Math.PI / 2;
     scene.add(screen);
}

function createBar() {
     const geo = new THREE.BoxGeometry(1, 1, 0.5);
     const mat =  new THREE.MeshStandardMaterial({
          color: 0xeeeeee,
          map: metalTextureColor,
          roughness: 0.35,
          roughnessMap: metalTextureRoughness,
          metalness: 1 
     })
     const bar = new THREE.Mesh(geo, mat);
     bar.scale.x = maxPendulum * 4 - 1;
     bar.position.set(0, 31.5, 0);
     scene.add(bar);
     const bar2 = new THREE.Mesh(geo, mat);
     bar2.scale.x = maxPendulum * 4 - 1;
     bar2.position.set(0, 31, 0);
     bar2.rotation.y = Math.PI/2;
     scene.add(bar2);
};
// create ring//
function createRing(){
     const ringGeo = new THREE.TorusGeometry(distance, 0.5, 16, 50);
     const ringMat =  new THREE.MeshStandardMaterial({
          color: 0xeeeeee,
          map: metalTextureColor,
          roughness: 0.3,
          roughnessMap: metalTextureRoughness,
          metalness: 1 
     })
     const ring = new THREE.Mesh(ringGeo, ringMat);
     ring.rotation.x = -Math.PI / 2;
     ring.position.y = 31.5;
     ring.castShadow = true;
     ring.receiveShadow = true;
     scene.add(ring);
}

// pendulum string mesh / ball mesh////

function createStringMesh(){
     const geometry = new THREE.CylinderGeometry(stringWidth, stringWidth, stringLength);
     const material = new THREE.MeshStandardMaterial({
          color: 0xeeffee,
          map: metalTextureColor,
          roughnessMap: metalTextureRoughness,
          transparent: true,
          opacity: 1,
          roughness: 0.5,
          metalness: 0.5

     })
     const string = new THREE.Mesh(geometry, material);
     string.position.set(0, 0, 0);
     //string.castShadow = true;
     //string.receiveShadow = true;
     scene.add(string);
     return string;
}

function createBallMesh(){
     const geometry = new THREE.SphereGeometry(ballRadius, 30, 30);
     const material = new THREE.MeshStandardMaterial({
          map: metalTextureColor,
          roughnessMap: metalTextureRoughness,
          transparent: true,
          roughness: 0.5,
          opacity: 1,
          metalness: 1
     })
     const ball = new THREE.Mesh(geometry, material);
     ball.castShadow = true;
     ball.receiveShadow = true;
     scene.add(ball);     
     return ball;
}

class Pendulum {
     constructor(string, ball, frequency, amplitude){
          this.string = string;
          this.ball = ball;
          this.frequency = frequency;
          this.amplitude = amplitude;
          
     }
     update(totalTime, a){
          this.amplitude += a; 
          // 360 limit
          /* if(this.amplitude >= Math.PI){
               this.amplitude = -Math.PI
          };*/
          //180 limit
          if(this.amplitude >= Math.PI / 2 + 0.2){     this.amplitude = -Math.PI / 2 - 0.2
          };

          this.string.rotation.z = this.amplitude * Math.cos((this.frequency * totalTime)/500);          
          this.ball.rotation.z = this.amplitude * Math.cos((this.frequency * totalTime)/500);          
     }
};

function createPendulum(origin, frequency, amplitude){
     const stringMesh = createStringMesh();
     stringMesh.position.add(origin);
     stringMesh.translateY(stringLength);
     stringMesh.geometry.translate(0, -(stringLength * 0.5), 0);

     const ballMesh = createBallMesh();
     ballMesh.position.add(origin);
     ballMesh.translateY(stringLength);
     ballMesh.geometry.translate(0, -stringLength, 0);
     ballMeshes.push(ballMesh);
     //ballMesh.geometry.computeBoundingSphere();
     
     const pendulum = new Pendulum(stringMesh, ballMesh, frequency, amplitude);
     
     // For Collision detect //
     let ballBoxHelper = new THREE.BoxHelper(ballMesh, 0x00ff00);
     ballBoxHelper.update();
     ballBoxHelper.visible = false;
     boxHelpers.push(ballBoxHelper);
     scene.add(ballBoxHelper);
     ballBB = new THREE.Box3();
     ballBB.setFromObject(ballBoxHelper);
     targets.push(ballBB); 
     
     return pendulum;
};

//create pendulums//
for(let i = 0; i < maxPendulum; i++){
     const pendulum = createPendulum(new THREE.Vector3(i * 4.2 - distance, 0, 0), frequency, amplitude);
     pendulums.push(pendulum);
} 
// 0: -8.2 1: -4.1 2: 0 3: 4.1 4: 8.2 
// distance = (maxPendulum - 1) * 2.1 = 8.4; 
const p1 = pendulums[0];
const p2 = pendulums[1];
const p3 = pendulums[2];
const p4 = pendulums[3];
const p5 = pendulums[4];
const target1 = targets[0]; 
const target2 = targets[1]; 
const target3 = targets[2]; 
const target4 = targets[3]; 
const target5 = targets[4]; 

///// SWINGS /////
// activate at render!!
function swing(totalTime){
     soundEnabled = true;
     collisionSoundEnabled = false;
     a = 0.0004
     p1.update(totalTime, a);
     p2.update(totalTime, a);
     p3.update(totalTime, a);
     p4.update(totalTime, a);
     p5.update(totalTime, a);
}


//swingUp or swingDown
function swing1(){
     soundEnabled = true;
     collisionSoundEnabled = false;
     let tl = gsap.timeline({repeat: 0, onComplete: swingUp, defaults: {duration: 3, repeat: 1, yoyo: true, ease: 'Power1.easeInOut'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, 
          p2.ball.rotation, p2.string.rotation, 
          p3.ball.rotation, p3.string.rotation, 
          p4.ball.rotation, p4.string.rotation,
          p5.ball.rotation, p5.string.rotation,], {z: -0.2 - angleZ}, {z: 0.2 + angleZ,})
    
}

function swingUp(){
     soundEnabled = true;
     collisionSoundEnabled = false;
     angleZ += 0.05;
      
     let tl = gsap.timeline({repeat: 0, onComplete: swingUp, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, 
     p2.ball.rotation, p2.string.rotation, 
     p3.ball.rotation, p3.string.rotation, 
     p4.ball.rotation, p4.string.rotation,
     p5.ball.rotation, p5.string.rotation,
     ], {z: 0}, {z: 0.2 + angleZ,});
tl.fromTo([p1.ball.rotation, p1.string.rotation, 
          p2.ball.rotation, p2.string.rotation, 
          p3.ball.rotation, p3.string.rotation, 
          p4.ball.rotation, p4.string.rotation, 
          p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: -0.2 - angleZ,});
}  
function swingDown(){
     soundEnabled = true;
     collisionSoundEnabled = false;
     angleZ += 0.05;    
     let tl = gsap.timeline({repeat: 0, onComplete: swingDown, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, 
          p2.ball.rotation, p2.string.rotation, 
          p3.ball.rotation, p3.string.rotation, 
          p4.ball.rotation, p4.string.rotation,
          p5.ball.rotation, p5.string.rotation,
     ], {z: 0}, {z: Math.PI / 2 - angleZ,});
     tl.fromTo([p1.ball.rotation, p1.string.rotation, 
          p2.ball.rotation, p2.string.rotation, 
          p3.ball.rotation, p3.string.rotation, 
          p4.ball.rotation, p4.string.rotation, 
          p5.ball.rotation, p5.string.rotation],
          {z: 0}, {z: -Math.PI / 2 + angleZ,});
}  


///// swing2 up down

function swing2Up(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 0, onComplete: swing2up, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'power1.easeOutIn'}})
      tl.fromTo([p1.ball.rotation,p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: 0.012, repeat: 1}) 

     tl.fromTo([p1.ball.rotation, p1.string.rotation], 
          {z: 0}, {z: -0.1 + angleZ,}, );
     tl.fromTo([p5.ball.rotation, p5.string.rotation], 
               {z: 0}, {z: 0.1 - angleZ,}, '<');
     tl.fromTo([p1.ball.rotation, p1.string.rotation], 
                    {z: 0}, {z: 0.015, duration: 0.02}, );
     
     tl.fromTo([p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation], {z: 0}, {z: -0.012, duration: 0.02, }, '<');          
}

function swing2up(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     angleZ += 0.05;
     let tl = gsap.timeline({repeat: 1, onComplete: swing2up, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation], 
          {z: 0}, {z: -0.1 - angleZ,}, );
     tl.fromTo([p5.ball.rotation, p5.string.rotation], 
               {z: 0}, {z: 0.1 + angleZ,}, '<');
     tl.fromTo([p1.ball.rotation, p1.string.rotation], 
                    {z: 0}, {z: 0.015, duration: 0.02}, );
     tl.fromTo([p5.ball.rotation, p5.string.rotation], 
          {z: 0}, {z: -0.015, duration: 0.02}, '<');
     tl.fromTo([p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation], {z: 0}, {z: 0.005, duration: 0.02, }, );          
}
function swing2Down(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 0, onComplete: swing2down, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'power1.easeOutIn'}})
    /*  tl.fromTo([p1.ball.rotation,p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: 0.012, repeat: 3}) */

     tl.fromTo([p1.ball.rotation, p1.string.rotation], 
          {z: 0}, {z: -Math.PI / 2 + angleZ,}, );
     tl.fromTo([p5.ball.rotation, p5.string.rotation], 
               {z: 0}, {z: Math.PI / 2 - angleZ,}, '<');
     tl.fromTo([p1.ball.rotation, p1.string.rotation], 
                    {z: 0}, {z: 0.015, duration: 0.02}, );
     
     tl.fromTo([p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation], {z: 0}, {z: -0.012, duration: 0.02, }, '<');          
}

function swing2down(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     angleZ += 0.05;
     let tl = gsap.timeline({repeat: 1, onComplete: swing2down, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation], 
          {z: 0}, {z: -Math.PI / 2 + angleZ,}, );
     tl.fromTo([p5.ball.rotation, p5.string.rotation], 
               {z: 0}, {z: Math.PI / 2 - angleZ,}, '<');
     tl.fromTo([p1.ball.rotation, p1.string.rotation], 
                    {z: 0}, {z: 0.015, duration: 0.02}, );
     tl.fromTo([p5.ball.rotation, p5.string.rotation], 
          {z: 0}, {z: -0.015, duration: 0.02}, '<');
     tl.fromTo([p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation], {z: 0}, {z: 0.005, duration: 0.02, }, );          
}


///// Swing 2 double
function swing22Up(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 0, onComplete: swing22up, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation,p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: 0.012, repeat: 3})

     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation], {z: 0}, {z: -0.1} );
     tl.fromTo([p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: 0.1}, '<');
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02});
     tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, '<');         
}

function swing22up(){
     angleZ += 0.05;
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 0, onComplete: swing22up, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation], {z: 0}, {z: -0.1 - angleZ,}, );
     tl.fromTo([p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: 0.1 + angleZ,}, '<');
     tl.fromTo([p5.ball.rotation, p5.string.rotation, p3.ball.rotation, p3.string.rotation], {z: 0}, {z: -0.015, duration: 0.02});
     tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, '<');
}

function swing22Down(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 0, onComplete: swing22down, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation,p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: 0.012, repeat: 3})

     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation], {z: 0}, {z: -Math.PI / 2 + angleZ,}, );
     tl.fromTo([p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: Math.PI / 2 - angleZ,}, '<');
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02});
     tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, '<');         
}

function swing22down(){
     angleZ += 0.05;
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 0, onComplete: swing22down, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation], {z: 0}, {z: -Math.PI / 2 + angleZ,}, );
     tl.fromTo([p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: Math.PI / 2 - angleZ,}, '<');
     tl.fromTo([p5.ball.rotation, p5.string.rotation, p3.ball.rotation, p3.string.rotation], {z: 0}, {z: -0.015, duration: 0.02});
     tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, '<');
}


////swing3 low
function swing3Up(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 0, onComplete: swing3up, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -0.005, repeat: 1})

     tl.fromTo([p1.ball.rotation, p1.string.rotation], 
          {z: 0}, {z: -0.1},);
     tl.fromTo([p1.ball.rotation, p1.string.rotation], 
          {z: 0}, {z: 0.015, duration: 0.02});
     tl.fromTo([p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02})
               
     tl.fromTo([p5.ball.rotation, p5.string.rotation], 
               {z: 0}, {z: 0.1},);
     tl.fromTo([p5.ball.rotation, p5.string.rotation], 
               {z: 0}, {z: -0.015, duration: 0.02});
     tl.fromTo([p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation], {z: 0}, {z: -0.015, duration: 0.02})
}

function swing3up(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     angleZ += 0.1;
     let tl = gsap.timeline({repeat: 1, onComplete: swing3up, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation], 
          {z: 0}, {z: -0.1 - angleZ,},);
     tl.fromTo([p1.ball.rotation, p1.string.rotation], 
          {z: 0}, {z: 0.015, duration: 0.02});
     tl.fromTo([p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02})
               
     tl.fromTo([p5.ball.rotation, p5.string.rotation], 
               {z: 0}, {z: 0.1 + angleZ,},);
     tl.fromTo([p5.ball.rotation, p5.string.rotation], 
               {z: 0}, {z: -0.015, duration: 0.02});
     tl.fromTo([p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation], {z: 0}, {z: -0.015, duration: 0.02})
}

function swing3Down(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 0, onComplete: swing3down, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -0.005, repeat: 1})

     tl.fromTo([p1.ball.rotation, p1.string.rotation], 
          {z: 0}, {z: -Math.PI/2 + angleZ,},);
     tl.fromTo([p1.ball.rotation, p1.string.rotation], 
          {z: 0}, {z: 0.015, duration: 0.02});
     tl.fromTo([p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02})
               
     tl.fromTo([p5.ball.rotation, p5.string.rotation], 
               {z: 0}, {z: Math.PI/2 - angleZ,},);
     tl.fromTo([p5.ball.rotation, p5.string.rotation], 
               {z: 0}, {z: -0.015, duration: 0.02});
     tl.fromTo([p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation], {z: 0}, {z: -0.015, duration: 0.02})
}

function swing3down(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     angleZ += 0.1;
     let tl = gsap.timeline({repeat: 1, onComplete: swing3down, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation], 
          {z: 0}, {z: -Math.PI/2 + angleZ,},);
     tl.fromTo([p1.ball.rotation, p1.string.rotation], 
          {z: 0}, {z: 0.015, duration: 0.02});
     tl.fromTo([p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02})
               
     tl.fromTo([p5.ball.rotation, p5.string.rotation], 
               {z: 0}, {z: Math.PI/2 - angleZ,},);
     tl.fromTo([p5.ball.rotation, p5.string.rotation], 
               {z: 0}, {z: -0.015, duration: 0.02});
     tl.fromTo([p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation], {z: 0}, {z: -0.015, duration: 0.02})
}


////swing3 low
function swing32Up(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 0, onComplete: swing32up, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -0.005, repeat: 1})

     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation], {z: 0}, {z: -0.1},);
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: 0.015, duration: 0.02});
                    
     tl.fromTo([p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: 0.1},);
     tl.fromTo([p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -0.015, duration: 0.02});
     tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: -0.015, duration: 0.02}, '<');
     
}

function swing32up(){
     angleZ += 0.1;
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 1, onComplete: swing32up, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation], {z: 0}, {z: -0.1 - angleZ,},);
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: 0.015, duration: 0.02});
     tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, '<');
                    
     tl.fromTo([p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: 0.1 + angleZ,},);
     tl.fromTo([p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -0.015, duration: 0.02});
     tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: -0.015, duration: 0.02}, '<');
}

function swing32Down(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 0, onComplete: swing32down, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -0.005, repeat: 1})

     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation], {z: 0}, {z: -Math.PI/2 + angleZ,},);
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: 0.015, duration: 0.02});
                    
     tl.fromTo([p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: Math.PI/2 - angleZ,},);
     tl.fromTo([p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -0.015, duration: 0.02});
     tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: -0.015, duration: 0.02}, '<');
     
}

function swing32down(){
     angleZ += 0.1;
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 1, onComplete: swing32down, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation], {z: 0}, {z: -Math.PI/2 + angleZ,},);
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: 0.015, duration: 0.02});
                    
     tl.fromTo([p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: Math.PI/2 - angleZ,},);
     tl.fromTo([p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -0.015, duration: 0.02});
     tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: -0.015, duration: 0.02}, '<');
}


// Triple //
function swing23Up(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 0, onComplete: swing23up, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation,p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: 0.012, repeat: 3})

     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: -0.1}, );
     tl.fromTo([ p5.ball.rotation, p5.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation], 
          {z: 0}, {z: 0.1,}, '<');
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
               {z: 0}, {z: 0.015, duration: 0.02});
     tl.fromTo([ p1.ball.rotation, p1.string.rotation, p3.ball.rotation, p3.string.rotation, p2.ball.rotation, p2.string.rotation], 
               {z: 0}, {z: -0.1}, );
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: 0.1,}, '<');
     
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], 
               {z: 0}, {z: -0.015, duration: 0.02});
}
function swing23up(){
     angleZ += 0.1;
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 1, onComplete: swing23up, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: -0.1 - angleZ,}, );
     tl.fromTo([ p5.ball.rotation, p5.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation], 
          {z: 0}, {z: 0.1 + angleZ/3,}, '<');
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
               {z: 0}, {z: 0.015, duration: 0.02});
     tl.fromTo([ p1.ball.rotation, p1.string.rotation, p3.ball.rotation, p3.string.rotation, p2.ball.rotation, p2.string.rotation], 
               {z: 0}, {z: -0.1 - angleZ/3,}, );
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: 0.1 + angleZ,}, '<');
     
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], 
               {z: 0}, {z: -0.015, duration: 0.02});
}

function swing23Down(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 0, onComplete: swing23down, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation,p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: 0.012, repeat: 3})

     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: -Math.PI / 2 + angleZ,}, );
     tl.fromTo([ p5.ball.rotation, p5.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation], 
          {z: 0}, {z: Math.PI / 6 - angleZ/3,}, '<');
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
               {z: 0}, {z: 0.015, duration: 0.02});
     tl.fromTo([ p1.ball.rotation, p1.string.rotation, p3.ball.rotation, p3.string.rotation, p2.ball.rotation, p2.string.rotation], 
               {z: 0}, {z: -Math.PI / 6,}, );
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: Math.PI / 2,}, '<');
     
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], 
               {z: 0}, {z: -0.015, duration: 0.02});
}
function swing23down(){
     angleZ += 0.1;
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 1, onComplete: swing23down, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: -Math.PI / 2 + angleZ,}, );
     tl.fromTo([ p5.ball.rotation, p5.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation], 
          {z: 0}, {z: Math.PI / 6 - angleZ/3,}, '<');
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
               {z: 0}, {z: 0.015, duration: 0.02});
     tl.fromTo([ p1.ball.rotation, p1.string.rotation, p3.ball.rotation, p3.string.rotation, p2.ball.rotation, p2.string.rotation], 
               {z: 0}, {z: -Math.PI / 6 + angleZ/3,}, );
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: Math.PI / 2 - angleZ,}, '<');
     
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], 
               {z: 0}, {z: -0.015, duration: 0.02});
}

// swing3Triple
function swing33Up(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 0, onComplete: swing33up, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation,p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: 0.012, repeat: 3})

     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: -0.1,}, );
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: 0.015, duration: 0.02}, );
     tl.fromTo([ p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: 0.1}, );
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: -0.015, duration: 0.02}, );
          
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation,], 
          {z: 0}, {z: -0.1}, );
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: 0.015, duration: 0.02}, );
     tl.fromTo([ p5.ball.rotation, p5.string.rotation], {z: 0}, {z: 0.1}, );
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: -0.015, duration: 0.02}, );
}
function swing33up(){
     angleZ += 0.2;
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 1, onComplete: swing33up, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: -0.1 - angleZ,}, );
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: 0.015, duration: 0.02}, );
     tl.fromTo([ p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: 0.1 + angleZ/3,}, );
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: -0.015, duration: 0.02}, );
          
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation,], 
          {z: 0}, {z: -0.1 - angleZ/3,}, );
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: 0.015, duration: 0.02}, );
     tl.fromTo([ p5.ball.rotation, p5.string.rotation], {z: 0}, {z: 0.1 + angleZ,}, );
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: -0.015, duration: 0.02}, );
           
}
function swing33Down(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 0, onComplete: swing33down, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation,p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: 0.012, repeat: 3})

     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: -Math.PI / 2 + angleZ,}, );
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: 0.015, duration: 0.02}, );
     tl.fromTo([ p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: Math.PI / 6 - angleZ/3,}, );
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: -0.015, duration: 0.02}, );
          
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation,], 
          {z: 0}, {z: -Math.PI / 6 + angleZ/3,}, );
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: 0.015, duration: 0.02}, );
     tl.fromTo([ p5.ball.rotation, p5.string.rotation], {z: 0}, {z: Math.PI / 2 - angleZ,}, );
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: -0.015, duration: 0.02}, );
}
function swing33down(){
     angleZ += 0.2;
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 1, onComplete: swing33down, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: -Math.PI / 2 + angleZ,}, );
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: 0.015, duration: 0.02}, );
     tl.fromTo([ p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: Math.PI / 6 - angleZ/3,}, );
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: -0.015, duration: 0.02}, );
          
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation,], 
          {z: 0}, {z: -Math.PI / 6 + angleZ/3,}, );
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: 0.015, duration: 0.02}, );
     tl.fromTo([ p5.ball.rotation, p5.string.rotation], {z: 0}, {z: Math.PI / 2 - angleZ,}, );
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: -0.015, duration: 0.02}, );
           
}

// swing3Triple
function swing332Up(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 0, onComplete: swing332up, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation,p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: 0.012, repeat: 3})

     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation,], 
          {z: 0}, {z: -0.1,}, );
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: 0.015, duration: 0.02}, );
     tl.fromTo([ p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: 0.1}, );
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: -0.015, duration: 0.02}, );
          
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, ], 
          {z: 0}, {z: -0.1}, );
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: 0.015, duration: 0.02}, );
     tl.fromTo([ p5.ball.rotation, p5.string.rotation, p4.ball.rotation, p4.string.rotation,], {z: 0}, {z: 0.1}, );
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: -0.015, duration: 0.02}, );
}
function swing332up(){
     angleZ += 0.2;
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 1, onComplete: swing332up, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation,], 
          {z: 0}, {z: -0.1 - angleZ,}, );
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: 0.015, duration: 0.02}, );
     tl.fromTo([ p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: 0.1 + angleZ/3,}, );
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: -0.015, duration: 0.02}, );
          
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, ], 
          {z: 0}, {z: -0.1 - angleZ/3,}, );
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: 0.015, duration: 0.02}, );
     tl.fromTo([p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: 0.1 + angleZ,}, );
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: -0.015, duration: 0.02}, );
           
}

function swing332Down(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 0, onComplete: swing332down, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation,p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: 0.012, repeat: 3})

     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation,], 
          {z: 0}, {z: -Math.PI / 2 + angleZ,}, );
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: 0.015, duration: 0.02}, );
     tl.fromTo([ p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: Math.PI / 6 - angleZ/3,}, );
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: -0.015, duration: 0.02}, );
          
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, ], 
          {z: 0}, {z: -Math.PI / 6 + angleZ/3,}, );
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: 0.015, duration: 0.02}, );
     tl.fromTo([p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: Math.PI / 2 - angleZ,}, );
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: -0.015, duration: 0.02}, );
}
function swing332down(){
     angleZ += 0.2;
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 1, onComplete: swing332down, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation,p2.ball.rotation, p2.string.rotation,], 
          {z: 0}, {z: -Math.PI / 2 + angleZ,}, );
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: 0.015, duration: 0.02}, );
     tl.fromTo([  p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: Math.PI / 6 - angleZ/3,}, );
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: -0.015, duration: 0.02}, );
          
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, ], 
          {z: 0}, {z: -Math.PI / 6 + angleZ/3,}, );
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: 0.015, duration: 0.02}, );
     tl.fromTo([p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: Math.PI / 2 - angleZ,}, );
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: -0.015, duration: 0.02}, );
           
}


//swing1221Down(); need to fix
function swing1221Down(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 0, onComplete: swing1221down, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation,p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation,], {z: 0}, {z: 0.012, repeat: 3})

     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation,], {z: 0}, {z: -Math.PI / 4 + angleZ,}, );
     tl.fromTo([p1.ball.rotation, p1.string.rotation], 
          {z: 0}, {z: 0.015, duration: 0.02} );
     tl.fromTo([p5.ball.rotation, p5.string.rotation], 
          {z: 0}, {z: Math.PI / 2 - angleZ} );
     tl.fromTo([p5.ball.rotation, p5.string.rotation], 
          {z: 0}, {z: -0.015, duration: 0.02} );

     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: -Math.PI / 2 + angleZ,}, );
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: 0.015, duration: 0.02}, );
     tl.fromTo([p5.ball.rotation, p5.string.rotation,p4.ball.rotation, p4.string.rotation], 
          {z: 0}, {z: Math.PI / 4 - angleZ,}, );
     tl.fromTo([p4.ball.rotation, p4.string.rotation], 
          {z: 0}, {z: -0.015, duration: 0.02} );
             
}

function swing1221down(){
     angleZ += 0.2;
     let tl = gsap.timeline({repeat: 1, onComplete: swing1221down, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation,], {z: 0}, {z: -Math.PI / 4 + angleZ,}, );
     tl.fromTo([p1.ball.rotation, p1.string.rotation], 
          {z: 0}, {z: 0.015, duration: 0.02} );
     tl.fromTo([p5.ball.rotation, p5.string.rotation], 
          {z: 0}, {z: Math.PI / 2 - angleZ} );
     tl.fromTo([p5.ball.rotation, p5.string.rotation], 
          {z: 0}, {z: -0.015, duration: 0.02} );

     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: -Math.PI / 2 + angleZ,}, );
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: 0.015, duration: 0.02}, );
     tl.fromTo([p5.ball.rotation, p5.string.rotation,p4.ball.rotation, p4.string.rotation], 
          {z: 0}, {z: Math.PI / 4 - angleZ,}, );
     tl.fromTo([p4.ball.rotation, p4.string.rotation], 
          {z: 0}, {z: -0.015, duration: 0.02} );
         
}


// 1/2 = 3/4
function swing12Up(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 0, onComplete: swing12up, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation,p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation,], {z: 0}, {z: 0.012, repeat: 3})

     tl.fromTo([p1.ball.rotation, p1.string.rotation], 
          {z: 0}, {z: -0.2}, );
     tl.fromTo([p2.ball.rotation, p2.string.rotation], 
          {z: 0}, {z: -0.1 }, '<');
     
     tl.fromTo([p4.ball.rotation, p4.string.rotation], 
          {z: 0}, {z: 0.1,}, '<');
     tl.fromTo([p5.ball.rotation, p5.string.rotation], 
          {z: 0}, {z: 0.2,}, '<');

     tl.fromTo([p3.ball.rotation, p3.string.rotation], 
               {z: 0}, {z: -0.015, duration: 0.02});
     tl.fromTo([p5.ball.rotation, p5.string.rotation], 
               {z: 0}, {z: -0.015, duration: 0.02});       
}

function swing12up(){
     angleZ += 0.05;
     let tl = gsap.timeline({repeat: 1, onComplete: swing12up, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation], 
          {z: 0}, {z: -0.2 - angleZ,}, );
     tl.fromTo([p2.ball.rotation, p2.string.rotation], 
          {z: 0}, {z: -0.1 - (angleZ/2),}, '<');
     
     tl.fromTo([p4.ball.rotation, p4.string.rotation], 
          {z: 0}, {z: 0.1 + (angleZ/2),}, '<');
     tl.fromTo([p5.ball.rotation, p5.string.rotation], 
          {z: 0}, {z: 0.2 + angleZ,}, '<');

     tl.fromTo([p1.ball.rotation, p1.string.rotation], 
               {z: 0}, {z: 0.015, duration: 0.02});
     tl.fromTo([p3.ball.rotation, p3.string.rotation], 
               {z: 0}, {z: -0.015, duration: 0.02}, '<');
}
function swing12Down(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 0, onComplete: swing12down, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation,p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation,], {z: 0}, {z: 0.012, repeat: 3})

     tl.fromTo([p1.ball.rotation, p1.string.rotation], 
          {z: 0}, {z: -Math.PI / 2 + angleZ,}, );
     tl.fromTo([p2.ball.rotation, p2.string.rotation], 
          {z: 0}, {z: -Math.PI / 4 + (angleZ/2),}, '<');
     
     tl.fromTo([p4.ball.rotation, p4.string.rotation], 
          {z: 0}, {z: Math.PI / 4 - (angleZ/2),}, '<');
     tl.fromTo([p5.ball.rotation, p5.string.rotation], 
          {z: 0}, {z: Math.PI / 2 - angleZ,}, '<');

     tl.fromTo([p3.ball.rotation, p3.string.rotation], 
               {z: 0}, {z: -0.015, duration: 0.02});
     tl.fromTo([p5.ball.rotation, p5.string.rotation], 
               {z: 0}, {z: -0.015, duration: 0.02});       
}

function swing12down(){
     angleZ += 0.05;
     let tl = gsap.timeline({repeat: 1, onComplete: swing12down, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation], 
          {z: 0}, {z: -Math.PI / 2 + angleZ,}, );
     tl.fromTo([p2.ball.rotation, p2.string.rotation], 
          {z: 0}, {z: -Math.PI / 4 + (angleZ/2),}, '<');
     
     tl.fromTo([p4.ball.rotation, p4.string.rotation], 
          {z: 0}, {z: Math.PI / 4 - (angleZ/2),}, '<');
     tl.fromTo([p5.ball.rotation, p5.string.rotation], 
          {z: 0}, {z: Math.PI / 2 - angleZ,}, '<');

     tl.fromTo([p1.ball.rotation, p1.string.rotation], 
               {z: 0}, {z: 0.015, duration: 0.02});
     tl.fromTo([p3.ball.rotation, p3.string.rotation], 
               {z: 0}, {z: -0.015, duration: 0.02}, '<');
}

// 1(2)/34 // 12(3)4

function swing212Up(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 0, onComplete: swing212up, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation,p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation,], {z: 0}, {z: 0.012, repeat: 3})

     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: -0.1,}, );
     tl.fromTo([p4.ball.rotation, p4.string.rotation], {z: 0}, {z: 0.025}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation], {z: 0}, {z: 0.05}, '<');
     tl.fromTo([ p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02}, );     
     tl.fromTo([ p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02}, '<');   

     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: -0.05}, );
     tl.fromTo([p2.ball.rotation, p2.string.rotation,], 
          {z: 0}, {z: -0.025}, '<');     
     tl.fromTo([ p5.ball.rotation, p5.string.rotation], {z: 0}, {z: 0.1}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02}, );     
     tl.fromTo([ p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, '<');     
}

function swing212up(){
     angleZ += 0.1;
     let tl = gsap.timeline({repeat: 1, onComplete: swing212up, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: -0.1 - angleZ,}, );
     tl.fromTo([p4.ball.rotation, p4.string.rotation], {z: 0}, {z: 0.025 + (angleZ/4)}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation], {z: 0}, {z: 0.05 + (angleZ/2)}, '<');
     tl.fromTo([ p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02}, );     
     tl.fromTo([ p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02}, '<');   

     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: -0.05 - angleZ/2,}, );
     tl.fromTo([p2.ball.rotation, p2.string.rotation,], 
          {z: 0}, {z: -0.025 - angleZ/4,}, '<');     
     tl.fromTo([ p5.ball.rotation, p5.string.rotation], {z: 0}, {z: 0.1 + angleZ}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02}, );     
     tl.fromTo([ p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, '<');     
}

function swing212Down(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 0, onComplete: swing212down, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation,p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation,], {z: 0}, {z: 0.012, repeat: 3})

     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: -Math.PI / 2 + angleZ,}, );
     tl.fromTo([p4.ball.rotation, p4.string.rotation], {z: 0}, {z: Math.PI / 8 - (angleZ/4)}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation], {z: 0}, {z: Math.PI / 4 - (angleZ/2)}, '<');
     tl.fromTo([ p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02}, );     
     tl.fromTo([ p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02}, '<');   

     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: -Math.PI / 4 + angleZ/2,}, );
     tl.fromTo([p2.ball.rotation, p2.string.rotation,], 
          {z: 0}, {z: -Math.PI / 8 + angleZ/4,}, '<');     
     tl.fromTo([ p5.ball.rotation, p5.string.rotation], {z: 0}, {z: Math.PI / 2 - angleZ}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02}, );     
     tl.fromTo([ p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, '<');     
}
function swing212down(){
     angleZ += 0.1;
     let tl = gsap.timeline({repeat: 1, onComplete: swing212down, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: -Math.PI / 2 + angleZ,}, );
     tl.fromTo([p4.ball.rotation, p4.string.rotation], {z: 0}, {z: Math.PI / 8 - (angleZ/4)}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation], {z: 0}, {z: Math.PI / 4 - (angleZ/2)}, '<');
     tl.fromTo([ p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02}, );     
     tl.fromTo([ p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02}, '<');   

     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: -Math.PI / 4 + angleZ/2,}, );
     tl.fromTo([p2.ball.rotation, p2.string.rotation,], 
          {z: 0}, {z: -Math.PI / 8 + angleZ/4,}, '<');     
     tl.fromTo([ p5.ball.rotation, p5.string.rotation], {z: 0}, {z: Math.PI / 2 - angleZ}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02}, );     
     tl.fromTo([ p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, '<');     
}

//swing2332Up();
function swing2332Up(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 0, onComplete: swing2332up, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation,p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation,], {z: 0}, {z: 0.012, repeat: 3})

     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: -0.1,}, );
     tl.fromTo([p2.ball.rotation, p2.string.rotation,], 
          {z: 0}, {z: -0.05,}, '<');
     tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0}, '<');
     tl.fromTo([p4.ball.rotation, p4.string.rotation], {z: 0}, {z: 0.025}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation], {z: 0}, {z: 0.05}, '<');
     tl.fromTo([ p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02}, );     
     tl.fromTo([ p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02}, '<');   

     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: -0.05}, );
     tl.fromTo([p2.ball.rotation, p2.string.rotation,], 
          {z: 0}, {z: -0.025}, '<');     
     tl.fromTo([p3.ball.rotation, p3.string.rotation,], 
          {z: 0}, {z: 0}, '<');     
     tl.fromTo([ p4.ball.rotation, p4.string.rotation], {z: 0}, {z: 0.05}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation], {z: 0}, {z: 0.1}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02}, );     
     tl.fromTo([ p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, '<');     
}

function swing2332up(){
     angleZ += 0.1;
     let tl = gsap.timeline({repeat: 1, onComplete: swing2332up, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})

     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: -0.1 - angleZ,}, );
     tl.fromTo([p2.ball.rotation, p2.string.rotation,], 
          {z: 0}, {z: -0.05 - angleZ/2,}, '<');
     tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0 + angleZ/8}, '<');
     tl.fromTo([p4.ball.rotation, p4.string.rotation], {z: 0}, {z: 0.025 + angleZ/4}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation], {z: 0}, {z: 0.05 + angleZ}, '<');
     tl.fromTo([ p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02}, );     
     tl.fromTo([ p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02}, '<');   

     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: -0.05 - angleZ/2}, );
     tl.fromTo([p2.ball.rotation, p2.string.rotation,], 
          {z: 0}, {z: -0.025 - angleZ/4}, '<');     
     tl.fromTo([p3.ball.rotation, p3.string.rotation,], 
          {z: 0}, {z: -angleZ/8}, '<');     
     tl.fromTo([ p4.ball.rotation, p4.string.rotation], {z: 0}, {z: 0.05 + angleZ/2}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation], {z: 0}, {z: 0.1 + angleZ}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02}, );     
     tl.fromTo([ p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, '<');     
}

function swing2332Down(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 0, onComplete: swing2332down, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation,p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation,], {z: 0}, {z: 0.012, repeat: 3})

     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: -Math.PI / 2 + angleZ,}, );
     tl.fromTo([p4.ball.rotation, p4.string.rotation], {z: 0}, {z: Math.PI / 8 - (angleZ/4)}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation], {z: 0}, {z: Math.PI / 4 - (angleZ/2)}, '<');
     tl.fromTo([ p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02}, );     
     tl.fromTo([ p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02}, '<');   

     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: -Math.PI / 4 + angleZ/2,}, );
     tl.fromTo([p2.ball.rotation, p2.string.rotation,], 
          {z: 0}, {z: -Math.PI / 8 + angleZ/4,}, '<');     
     tl.fromTo([ p5.ball.rotation, p5.string.rotation], {z: 0}, {z: Math.PI / 2 - angleZ}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02}, );     
     tl.fromTo([ p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, '<');     
}
function swing2332down(){
     angleZ += 0.1;
     let tl = gsap.timeline({repeat: 1, onComplete: swing2332down, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: -Math.PI / 2 + angleZ,}, );
          tl.fromTo([p2.ball.rotation, p2.string.rotation,], 
               {z: 0}, {z: -Math.PI / 4 + angleZ / 2}, '<');
          tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: -Math.PI / 8 + angleZ/4}, '<');     
     tl.fromTo([p4.ball.rotation, p4.string.rotation], {z: 0}, {z: Math.PI / 8 - (angleZ/4)}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation], {z: 0}, {z: Math.PI / 4 - (angleZ/2)}, '<');
     tl.fromTo([ p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02}, );     
     tl.fromTo([ p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02}, '<');   

     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: -Math.PI / 4 + angleZ/2,}, );
     tl.fromTo([p2.ball.rotation, p2.string.rotation,], 
          {z: 0}, {z: -Math.PI / 8 + angleZ/4,}, '<');     
          tl.fromTo([p3.ball.rotation, p3.string.rotation,], 
               {z: 0}, {z: Math.PI/8 - angleZ/4}, '<');     
          tl.fromTo([ p4.ball.rotation, p4.string.rotation], {z: 0}, {z: Math.PI / 4 - angleZ/2}, '<');    
     tl.fromTo([ p5.ball.rotation, p5.string.rotation], {z: 0}, {z: Math.PI / 2 - angleZ}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02}, );     
     tl.fromTo([ p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, '<');     
}



function swing1441Up(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 0, onComplete: swing1441up, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation,p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation,], {z: 0}, {z: 0.012, repeat: 3})

     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: -0.1,}, );
     tl.fromTo([p2.ball.rotation, p2.string.rotation,], 
          {z: 0}, {z: 0}, '<');
     tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.025}, '<');
     tl.fromTo([p4.ball.rotation, p4.string.rotation], {z: 0}, {z: 0.05}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation], {z: 0}, {z: 0.075}, '<');
     tl.fromTo([ p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02}, );     
     tl.fromTo([ p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02}, '<');   

     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: -0.075}, );
     tl.fromTo([p2.ball.rotation, p2.string.rotation,], 
          {z: 0}, {z: -0.05}, '<');     
     tl.fromTo([p3.ball.rotation, p3.string.rotation,], 
          {z: 0}, {z: -0.025}, '<');     
     tl.fromTo([ p4.ball.rotation, p4.string.rotation], {z: 0}, {z: 0}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation], {z: 0}, {z: 0.1}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02}, );     
     tl.fromTo([ p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, '<');     
}

function swing1441up(){
     angleZ += 0.1;
     let tl = gsap.timeline({repeat: 1, onComplete: swing1441up, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})

     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: -0.1 - angleZ,}, );
     tl.fromTo([p2.ball.rotation, p2.string.rotation,], 
          {z: 0}, {z:  angleZ/16,}, '<');
     tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.025 + angleZ/8}, '<');
     tl.fromTo([p4.ball.rotation, p4.string.rotation], {z: 0}, {z: 0.025 + angleZ/4}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation], {z: 0}, {z: 0.05 + angleZ/2}, '<');
     tl.fromTo([ p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02}, );     
     tl.fromTo([ p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02}, '<');   

     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: -0.075 - angleZ/2}, );
     tl.fromTo([p2.ball.rotation, p2.string.rotation,], 
          {z: 0}, {z: -0.05 - angleZ/4}, '<');     
     tl.fromTo([p3.ball.rotation, p3.string.rotation,], 
          {z: 0}, {z: -0.025 - angleZ/8}, '<');     
     tl.fromTo([ p4.ball.rotation, p4.string.rotation], {z: 0}, {z: 0 - angleZ/16}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation], {z: 0}, {z: 0.1 + angleZ}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02}, );     
     tl.fromTo([ p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, '<');     
}



function swing1441Down(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 0, onComplete: swing1441down, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation,p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation,], {z: 0}, {z: 0.012, repeat: 3})

     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: -Math.PI / 2,}, );
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: Math.PI * 0.4}, '<');
     tl.fromTo([p4.ball.rotation, p4.string.rotation], {z: 0}, {z: Math.PI * 0.3}, '<');
     tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: Math.PI * 0.2}, '<');
     tl.fromTo([ p2.ball.rotation, p2.string.rotation], {z: 0}, {z: Math.PI * 0.1}, '<');
     tl.fromTo([ p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02}, );     
     tl.fromTo([ p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02}, '<');   

     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: -Math.PI * 0.4}, );
     tl.fromTo([p2.ball.rotation, p2.string.rotation,], 
          {z: 0}, {z: -Math.PI * 0.3}, '<');     
     tl.fromTo([p3.ball.rotation, p3.string.rotation,], 
          {z: 0}, {z: -Math.PI * 0.2}, '<');     
     tl.fromTo([ p4.ball.rotation, p4.string.rotation], {z: 0}, {z: -Math.PI * 0.1}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation], {z: 0}, {z: Math.PI / 2}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02}, );     
     tl.fromTo([ p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, '<');     
}

function swing1441down(){
     angleZ += 0.1;
     let tl = gsap.timeline({repeat: 1, onComplete: swing1441down, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})

     
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: -Math.PI / 2 + angleZ,}, );
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: Math.PI * 0.4 - angleZ * 0.8}, '<');
     tl.fromTo([p4.ball.rotation, p4.string.rotation], {z: 0}, {z: Math.PI * 0.3 - angleZ * 0.6}, '<');
     tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: Math.PI * 0.2 - angleZ * 0.4}, '<');
     tl.fromTo([ p2.ball.rotation, p2.string.rotation], {z: 0}, {z: Math.PI * 0.1 - angleZ * 0.2}, '<');
     tl.fromTo([ p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02}, );     
     tl.fromTo([ p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02}, '<');   

     tl.fromTo([p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: -Math.PI * 0.4 + angleZ * 0.8}, );
     tl.fromTo([p2.ball.rotation, p2.string.rotation,], 
          {z: 0}, {z: -Math.PI * 0.3 + angleZ * 0.6}, '<');     
     tl.fromTo([p3.ball.rotation, p3.string.rotation,], 
          {z: 0}, {z: -Math.PI * 0.2 + angleZ * 0.4}, '<');     
     tl.fromTo([ p4.ball.rotation, p4.string.rotation], {z: 0}, {z: -Math.PI * 0.1 + angleZ * 0.2}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation], {z: 0}, {z: Math.PI / 2 - angleZ}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02}, );     
     tl.fromTo([ p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, '<');     
}

// swing312
function swing312Up(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 0, onComplete: swing312up, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation,p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation,], {z: 0}, {z: 0.012, repeat: 3})

     tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: -0.2}, );
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02});     
     tl.fromTo([p2.ball.rotation, p2.string.rotation,], {z: 0}, {z: 0});
     tl.fromTo([p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: 0.05}, '<');     
     tl.fromTo([p4.ball.rotation, p4.string.rotation,], {z: 0}, {z: 0.10}, '<');     
     tl.fromTo([p5.ball.rotation, p5.string.rotation], 
          {z: 0}, {z: 0.15}, '<');          
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02});  

     tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: -0.15}, );
     tl.fromTo([p2.ball.rotation, p2.string.rotation,], {z: 0}, {z: -0.1}, '<');
     tl.fromTo([p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: -0.05}, '<');
     tl.fromTo([p4.ball.rotation, p4.string.rotation,], {z: 0}, {z: 0}, '<');
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: 0.2}, );
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02});     
    
     tl.fromTo([p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: -0.005, duration: 0.02}, '<');     
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02});     
}
function swing312up(){
     angleZ += 0.2;
     let tl = gsap.timeline({repeat: 1, onComplete: swing312up, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})

     tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: -0.2 - angleZ}, );
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02});     
     tl.fromTo([p2.ball.rotation, p2.string.rotation,], {z: 0}, {z: 0 + angleZ * 0.2});
     tl.fromTo([p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: 0.05 + angleZ * 0.4}, '<');     
     tl.fromTo([p4.ball.rotation, p4.string.rotation,], {z: 0}, {z: 0.10 + angleZ * 0.6}, '<');     
     tl.fromTo([p5.ball.rotation, p5.string.rotation], 
          {z: 0}, {z: 0.15 + angleZ * 0.8}, '<');          
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02});  

     tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: -0.15 - angleZ * 0.8}, );
     tl.fromTo([p2.ball.rotation, p2.string.rotation,], {z: 0}, {z: -0.1 - angleZ * 0.6}, '<');
     tl.fromTo([p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: -0.05 - angleZ * 0.4}, '<');
     tl.fromTo([p4.ball.rotation, p4.string.rotation,], {z: 0}, {z: 0 - angleZ* 0.2}, '<');
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02});     
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: 0.2 + angleZ}, );
    
     tl.fromTo([p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: -0.005, duration: 0.02}, '<');     
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02});     
}

// swing312
function swing312Down(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 0, onComplete: swing312down, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: -Math.PI / 2 + (angleZ)}, );
     tl.fromTo([p2.ball.rotation, p2.string.rotation,], {z: 0}, {z: -Math.PI / 4 - (angleZ/2)}, '<');
     tl.fromTo([p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: -Math.PI / 6 - (angleZ/3)}, '<');
     tl.fromTo([p4.ball.rotation, p4.string.rotation,], {z: 0}, {z: -Math.PI / 8 - (angleZ/4)}, '<');
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -Math.PI / 10 - (angleZ/5)}, '<');

     tl.fromTo([p2.ball.rotation, p2.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02});     

     tl.fromTo([  p5.ball.rotation, p5.string.rotation], 
          {z: 0}, {z: Math.PI / 2 - angleZ,}, );
     tl.fromTo([  p4.ball.rotation, p4.string.rotation], 
          {z: 0}, {z: Math.PI / 4 - angleZ/2,}, '<');
     tl.fromTo([  p3.ball.rotation, p3.string.rotation], 
          {z: 0}, {z: Math.PI / 6 - angleZ/3,}, '<');
     tl.fromTo([  p2.ball.rotation, p2.string.rotation], 
          {z: 0}, {z: Math.PI / 8 - angleZ/4,}, '<');
     tl.fromTo([  p1.ball.rotation, p1.string.rotation], 
          {z: 0}, {z: Math.PI / 10 - angleZ/5,}, '<');
     

     
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02});    
}
function swing312down(){
     angleZ += 0.2;
     let tl = gsap.timeline({repeat: 1, onComplete: swing312down, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: -Math.PI / 2 + (angleZ)}, );
     tl.fromTo([p2.ball.rotation, p2.string.rotation,], {z: 0}, {z: -Math.PI / 4 + (angleZ/2)}, '<');
     tl.fromTo([p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: -Math.PI / 6 + (angleZ/3)}, '<');
     tl.fromTo([p4.ball.rotation, p4.string.rotation,], {z: 0}, {z: -Math.PI / 8 + (angleZ/4)}, '<');
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -Math.PI / 10 + (angleZ/5)}, '<');

     tl.fromTo([p2.ball.rotation, p2.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02});     

     tl.fromTo([  p5.ball.rotation, p5.string.rotation], 
          {z: 0}, {z: Math.PI / 2 - angleZ,}, );
     tl.fromTo([  p4.ball.rotation, p4.string.rotation], 
          {z: 0}, {z: Math.PI / 4 - angleZ/2,}, '<');
     tl.fromTo([  p3.ball.rotation, p3.string.rotation], 
          {z: 0}, {z: Math.PI / 6 - angleZ/3,}, '<');
     tl.fromTo([  p2.ball.rotation, p2.string.rotation], 
          {z: 0}, {z: Math.PI / 8 - angleZ/4,}, '<');
     tl.fromTo([  p1.ball.rotation, p1.string.rotation], 
          {z: 0}, {z: Math.PI / 10 - angleZ/5,}, '<');
     

     
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02});     
}

//swing312Down();
///// Swing Function //////////////
//swing1();
//swing2();
//swing3();
swingTotal();// 8min 25s
//swingShorts();
////////////////////////////////////

///// Total Swing ///// 
// angle use anglePoint * 30 = Math.PI
//SwingTotal // 8min 30s

function swingTotal(){
     soundEnabled = true;
     collisionSoundEnabled = false;
     let tl = gsap.timeline({repeat: 0, onComplete: swingTotal0, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}});
     tl.to(boom.rotation, {y: Math.PI * 2, delay: 2, repeat: 0, duration: 8, yoyo: false, ease: 'back'})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -anglePoint * 15, duration: 4, delay: 4})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, 
          p2.ball.rotation, p2.string.rotation, 
          p3.ball.rotation, p3.string.rotation, 
          p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], 
          {z: 0}, {z: anglePoint * 15, duration: 2});
}
function swingTotal0(){
     soundEnabled = true;
     collisionSoundEnabled = false;
     let tl = gsap.timeline({repeat: 1, onComplete: swingTotal1, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}});
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -anglePoint * 14})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, 
          p2.ball.rotation, p2.string.rotation, 
          p3.ball.rotation, p3.string.rotation, 
          p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], 
          {z: 0}, {z: anglePoint * 14,});
}


function swingTotal1(){
     soundEnabled = true;
     collisionSoundEnabled = false;
     let tl = gsap.timeline({repeat: 1, onComplete: swingTotal2, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}});

     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation,p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -anglePoint * 13})

     tl.fromTo([p1.ball.rotation, p1.string.rotation, 
          p2.ball.rotation, p2.string.rotation, 
          p3.ball.rotation, p3.string.rotation, 
          p4.ball.rotation, p4.string.rotation,p5.ball.rotation, p5.string.rotation], 
          {z: 0}, {z: anglePoint * 13,});
}

function swingTotal2(){
     soundEnabled = true;
     collisionSoundEnabled = false;
     let tl = gsap.timeline({repeat: 1, onComplete: swingTotal3, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}});

     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -anglePoint * 12})

     tl.fromTo([p1.ball.rotation, p1.string.rotation, 
          p2.ball.rotation, p2.string.rotation, 
          p3.ball.rotation, p3.string.rotation, 
          p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], 
          {z: 0}, {z: anglePoint * 12,});
}

function swingTotal3(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal4, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}});

     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation], {z: 0}, {z: -anglePoint * 12})
     tl.fromTo([p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint/2}, '<')
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: 0.015, duration: 0.02})
     tl.fromTo([p2.ball.rotation, p2.string.rotation, 
          p3.ball.rotation, p3.string.rotation, 
          p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation, ], {z: 0}, {z: anglePoint * 12,});

     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: -anglePoint/2}, '<')
     tl.fromTo([p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -0.015, duration: 0.02})
}

function swingTotal4(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal5, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}});

     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 12})
     tl.fromTo([p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint/2}, '<')
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: 0.015, duration: 0.02})
     tl.fromTo([p3.ball.rotation, p3.string.rotation, 
          p4.ball.rotation, p4.string.rotation, 
          p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: anglePoint * 12,}); 
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation], {z: 0}, {z: -anglePoint/2}, '<')          
     tl.fromTo([p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -0.015, duration: 0.02})
}
function swingTotal5(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal6, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}});

     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: -anglePoint * 12})
     tl.fromTo([p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: anglePoint / 2,}, '<'); 
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: 0.015, duration: 0.02})
     tl.fromTo([p4.ball.rotation, p4.string.rotation, 
          p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: anglePoint * 12,}); 
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: -anglePoint / 2,}, '<'); 
     tl.fromTo([p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -0.015, duration: 0.02})
}

function swingTotal6(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal7, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}});

     tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: -anglePoint * 12})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: 0.015, duration: 0.02})
     tl.fromTo([p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation], {z: 0}, {z: 0.015, duration: 0.02})
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: anglePoint * 12,});
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02});
     tl.fromTo([p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation], {z: 0}, {z: -0.015, duration: 0.02})
}


//swing1234/5 1/2345
function swingTotal7(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal8, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})

     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation], {z: 0}, {z: -anglePoint * 7}, )
     tl.fromTo([p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint / 4}, '<');
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, );
         
     tl.fromTo([p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint * 14}, );
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation], {z: 0}, {z: -anglePoint / 4}, '<')
     tl.fromTo([p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -0.015, duration: 0.02}, );
    
     tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: -anglePoint * 14}, )         
     tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: 0.015, duration: 0.02}, )         
     tl.fromTo([p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint * 7}, );
     tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: -anglePoint / 4}, '<')   
     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {z: 0}, {z: -0.015, duration: 0.02}, ) 
}
// 1/2345
function swingTotal8(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal9, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})

     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation], {z: 0}, {z: -anglePoint * 5}, )         
     tl.fromTo([p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint / 4}, '<');
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, );
     tl.fromTo([p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint * 14}, );
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation], {z: 0}, {z: -anglePoint / 5}, '<')   
     tl.fromTo([p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -0.015, duration: 0.02}, );
     
     tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: -anglePoint * 14}, )         
     tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: 0.015, duration: 0.02}, )         
     tl.fromTo([p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint * 5}, );
     tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: -anglePoint / 4}, '<')  
     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {z: 0}, {z: -0.015, duration: 0.02}, )
}

// 12/345
function swingTotal9(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal10, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})

     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: -anglePoint * 12}, )
     tl.fromTo([p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint / 4}, '<');
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, )
         
     tl.fromTo([p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint * 8}, );
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: -anglePoint / 2}, '<')
     tl.fromTo([ p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -0.015, duration: 0.02}, );
}
// 12/3<4<5
function swingTotal10(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal11, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})

     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: -anglePoint * 12}, )
     tl.fromTo([p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation ], {z: 0}, {z: -anglePoint / 2}, '<')
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, )
         
     tl.fromTo([p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: anglePoint * 4}, );
     tl.fromTo([p4.ball.rotation, p4.string.rotation, ], {z: 0}, {z: anglePoint * 8}, '<');
     tl.fromTo([p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint * 12}, '<');
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: -anglePoint / 2}, '<')
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02}, );
}


// 123/45
function swingTotal11(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal12, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})

     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: -anglePoint * 8}, )
     tl.fromTo([ p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint / 2}, '<');
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02}, )
         
     tl.fromTo([ p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint * 12}, );
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: -anglePoint / 4}, '<')
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02}, )
}
// 123/45
function swingTotal12(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal13, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})

     tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: -anglePoint * 12}, )
     tl.fromTo([ p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: -anglePoint * 8}, '<')
     tl.fromTo([ p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: -anglePoint * 4}, '<')
     tl.fromTo([ p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint / 2}, '<');
     tl.fromTo([ p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02},)     
     
     tl.fromTo([ p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint * 12}, );
     tl.fromTo([ p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation], {z: 0}, {z: anglePoint / 4}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02},)
}

//swing 12/(3)/45
function swingTotal13(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal14, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: -anglePoint * 12,}, )
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02,})    
     tl.fromTo([ p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint * 12,}, );
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02,})  
}
//swing 1>2/(3)/4<5
function swingTotal14(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal15, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: -anglePoint * 12,}, )
     tl.fromTo([ p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: -anglePoint * 8,}, '<')
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02,})    
     tl.fromTo([ p4.ball.rotation, p4.string.rotation, ], {z: 0}, {z: anglePoint * 8,}, );
     tl.fromTo([ p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint * 12,}, '<');
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02, })  
}

// 1=(234)=5
function swingTotal15(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal16, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})

     tl.fromTo([p1.ball.rotation, p1.string.rotation, ], 
          {z: 0.012}, {z: -anglePoint * 14});
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
          {z: -0.012}, {z: anglePoint * 14}, '<');
     tl.fromTo([p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: 0.015, duration: 0.02}, '<');     
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02}, '<');     
}
// 12=(3)=45
function swingTotal16(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal17, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: -anglePoint * 14});
     tl.fromTo([p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: anglePoint * 14}, '<');
     tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: 0.015, duration: 0.02}, );     
}

// 1>2=(3)=4<5
function swingTotal17(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 7, onComplete: swingTotal18, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, ], 
          {z: 0}, {z: -anglePoint * 14});
     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], 
          {z: 0}, {z: -anglePoint * 7}, '<');
     tl.fromTo([p4.ball.rotation, p4.string.rotation, ], 
          {z: 0}, {z: anglePoint * 7}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: anglePoint * 14}, '<');
     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {z: 0}, {z: -0.015, duration: 0.02},);     
}

// 123=45 12=345
function swingTotal18(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal19, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 10});     
     tl.fromTo([p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: anglePoint * 14}, '<');
     tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: 0.015, duration: 0.02});    

     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: -anglePoint * 14});    
     tl.fromTo([p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: anglePoint * 10}, '<');
     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {z: 0}, {z: -0.015, duration: 0.02});

}

// 1>2>3=4<5 12=345
function swingTotal19(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal20, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, ], 
          {z: 0}, {z: -anglePoint * 9});
     tl.fromTo([ p2.ball.rotation, p2.string.rotation, ], 
          {z: 0}, {z: -anglePoint * 6}, '<');
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], 
          {z: 0}, {z: -anglePoint * 3}, '<');
     tl.fromTo([p4.ball.rotation, p4.string.rotation,], 
          {z: 0}, {z: anglePoint * 6}, '<');
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: anglePoint * 12}, '<');
     tl.fromTo([p1.ball.rotation, p1.string.rotation, ], 
               {z: 0}, {z: 0.015, duration: 0.02},);

     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation,], {z: 0}, {z: -anglePoint * 14});
     tl.fromTo([p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: anglePoint * 10}, '<');
     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], 
          {z: 0}, {z: -0.015, duration: 0.02},);

}

// 1=2345 1234=5
function swingTotal20(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal21, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})

     tl.fromTo([p1.ball.rotation, p1.string.rotation,  ], 
          {z: 0}, {z: -anglePoint * 16});
     tl.fromTo([p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: anglePoint * 8}, '<');
     tl.fromTo([p1.ball.rotation, p1.string.rotation,  ], 
               {z: 0}, {z: 0.015, duration: 0.02});

     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation], {z: 0}, {z: -anglePoint * 8});
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: anglePoint * 16}, '<');
     tl.fromTo([p5.ball.rotation, p5.string.rotation,  ], 
               {z: 0}, {z: -0.015, duration: 0.02});
}

function swingTotal21(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal22, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})

     tl.fromTo([p1.ball.rotation, p1.string.rotation,  ], 
          {z: 0}, {z: -anglePoint * 16});
     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], 
          {z: 0}, {z: anglePoint * 2}, '<');
     tl.fromTo([ p3.ball.rotation, p3.string.rotation, ], 
          {z: 0}, {z: anglePoint * 4}, '<');
     tl.fromTo([p4.ball.rotation, p4.string.rotation,], 
          {z: 0}, {z: anglePoint * 6}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: anglePoint * 8}, '<');

     tl.fromTo([p1.ball.rotation, p1.string.rotation,  ], 
          {z: 0}, {z: 0.015, duration: 0.02});

     tl.fromTo([p1.ball.rotation, p1.string.rotation,  ], 
          {z: 0}, {z: -anglePoint * 8});
     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], 
          {z: 0}, {z: -anglePoint * 6}, '<');
     tl.fromTo([ p3.ball.rotation, p3.string.rotation, ], 
          {z: 0}, {z: -anglePoint * 4}, '<');
     tl.fromTo([ p4.ball.rotation, p4.string.rotation,  ], 
          {z: 0}, {z: -anglePoint * 2}, '<');
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: anglePoint * 16}, '<');
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: -0.015, duration: 0.02},);
}
// 1=(234)=5
function swingTotal22(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal23, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, ], 
          {z: 0}, {z: -anglePoint * 16});
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: anglePoint * 16}, '<');
     tl.fromTo([p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02});
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: 0.015, duration: 0.02});     
}

// 1>2=(3)=4<5
function swingTotal23(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal24, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, ], 
          {z: 0}, {z: -anglePoint * 16});
     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], 
          {z: 0}, {z: -anglePoint * 12}, '<');
     tl.fromTo([ p4.ball.rotation, p4.string.rotation,], 
          {z: 0}, {z: anglePoint * 12}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: anglePoint * 16}, '<');
     
     tl.fromTo([ p2.ball.rotation, p2.string.rotation], {z: 0}, {z: 0.015, duration: 0.02});      
     tl.fromTo([ p4.ball.rotation, p4.string.rotation], {z: 0}, {z: -0.015, duration: 0.02}, '<');      
     tl.fromTo([ p3.ball.rotation, p3.string.rotation], {z: 0}, {z: -0.015, duration: 0.02}, );      
}

//1<2 (3) 4<5
function swingTotal24(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal25, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, ], 
          {z: 0}, {z: -anglePoint * 14});
     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], 
          {z: 0}, {z: -anglePoint * 10}, '<');
          tl.fromTo([ p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: 0.012, duration: 0.02},);     
     tl.fromTo([ p4.ball.rotation, p4.string.rotation,], 
          {z: 0}, {z: anglePoint * 10}, );    
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: anglePoint * 14}, '<');     
          tl.fromTo([ p5.ball.rotation, p5.string.rotation, ], {z: 0}, {z: -0.012, duration: 0.02},);     
     tl.fromTo([ p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: 0.012, duration: 0.02}, '<');     
}

// 1<2<3/4 5,  1 2/3>4>5
function swingTotal25(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal26, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})

     tl.fromTo([p1.ball.rotation, p1.string.rotation, ], 
          {z: 0}, {z: -anglePoint * 15});
     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], 
          {z: 0}, {z: -anglePoint * 12}, '<');
     tl.fromTo([ p3.ball.rotation, p3.string.rotation,], 
          {z: 0}, {z: -anglePoint * 6}, '<');
     tl.fromTo([ p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint / 4}, '<');
          tl.fromTo([ p1.ball.rotation, p1.string.rotation,], 
               {z: 0}, {z: 0.015, duration: 0.02},);

     tl.fromTo([ p3.ball.rotation, p3.string.rotation,], 
          {z: 0}, {z: anglePoint * 6}, );
     tl.fromTo([ p4.ball.rotation, p4.string.rotation,], 
          {z: 0}, {z: anglePoint * 9}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: anglePoint * 12}, '<');
     tl.fromTo([ p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation], {z: 0}, {z: -anglePoint / 4}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
               {z: 0}, {z: -0.015, duration: 0.02},);
}
// 1<2<3<4 5 1 2>3>4>5
function swingTotal26(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal27, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})

     tl.fromTo([p1.ball.rotation, p1.string.rotation, ], 
          {z: 0}, {z: -anglePoint * 15});
     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], 
          {z: 0}, {z: -anglePoint * 12}, '<');
     tl.fromTo([ p3.ball.rotation, p3.string.rotation,], 
          {z: 0}, {z: -anglePoint * 6}, '<');
     tl.fromTo([ p4.ball.rotation, p4.string.rotation,], 
          {z: 0}, {z: -anglePoint * 3}, '<');
          tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
               {z: 0}, {z: anglePoint / 4}, '<');
     tl.fromTo([ p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: 0.015, duration: 0.02},);

     tl.fromTo([ p2.ball.rotation, p2.string.rotation,], 
          {z: 0}, {z: anglePoint * 3}, );
     tl.fromTo([ p3.ball.rotation, p3.string.rotation,], 
          {z: 0}, {z: anglePoint * 6}, '<');
     tl.fromTo([ p4.ball.rotation, p4.string.rotation,], 
          {z: 0}, {z: anglePoint * 9}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: anglePoint * 12}, '<');
          tl.fromTo([p1.ball.rotation, p1.string.rotation, ], 
               {z: 0}, {z: -anglePoint / 4}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
               {z: 0}, {z: -0.015, duration: 0.02}, );
        
}

// 1<2<3<4<5 5>4>3>2>1
function swingTotal27(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal28, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
    
     tl.fromTo([p1.ball.rotation, p1.string.rotation, ], 
          {z: 0}, {z: -anglePoint * 15});
     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], 
          {z: 0}, {z: -anglePoint * 12}, '<');
     tl.fromTo([ p3.ball.rotation, p3.string.rotation,], 
          {z: 0}, {z: -anglePoint * 9}, '<');
     tl.fromTo([ p4.ball.rotation, p4.string.rotation,], 
          {z: 0}, {z: -anglePoint * 6}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: -anglePoint * 3}, '<');
     tl.fromTo([ p1.ball.rotation, p1.string.rotation,], 
               {z: 0}, {z: 0.015, duration: 0.015},);

     tl.fromTo([ p1.ball.rotation, p1.string.rotation,], 
          {z: 0}, {z: anglePoint * 3}, );
     tl.fromTo([ p2.ball.rotation, p2.string.rotation,], 
          {z: 0}, {z: anglePoint * 6}, '<');
     tl.fromTo([ p3.ball.rotation, p3.string.rotation,], 
          {z: 0}, {z: anglePoint * 9}, '<');
     tl.fromTo([ p4.ball.rotation, p4.string.rotation,], 
          {z: 0}, {z: anglePoint * 12}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: anglePoint * 15}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
               {z: 0}, {z: -0.015, duration: 0.015},);
    
}

// swing
function swingTotal28(){
     soundEnabled = true;
     collisionSoundEnabled = false;
     let tl = gsap.timeline({repeat: 2, onComplete: swingTotal29, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}});
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -anglePoint * 10})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, 
          p2.ball.rotation, p2.string.rotation, 
          p3.ball.rotation, p3.string.rotation, 
          p4.ball.rotation, p4.string.rotation,
          p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: anglePoint * 10,});
}
// swing
function swingTotal29(){
     soundEnabled = true;
     collisionSoundEnabled = false;
     let tl = gsap.timeline({repeat: 2, onComplete: swingTotal30, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}});
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -anglePoint * 8})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, 
          p2.ball.rotation, p2.string.rotation, 
          p3.ball.rotation, p3.string.rotation, 
          p4.ball.rotation, p4.string.rotation,
          p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: anglePoint * 8,});
}
// swing
function swingTotal30(){
     soundEnabled = true;
     collisionSoundEnabled = false;
     let tl = gsap.timeline({repeat: 2, onComplete: boomSwing, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}});
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation], {z: 0}, {z: -anglePoint * 5})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, 
          p2.ball.rotation, p2.string.rotation, 
          p3.ball.rotation, p3.string.rotation, 
          p4.ball.rotation, p4.string.rotation,
          p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: anglePoint * 5,});
}

function boomSwing(){
     gsap.to(boom.rotation, {y: -Math.PI * 2, delay: 2, duration: 8, repeat: 0, ease: 'back' });
}

///// Shorts //////
function swingShorts(){
       //3 
       gsap.to(camera.position, {z: 120});
       duration = 0.6; // 1min 2sec
          soundEnabled = false;
          collisionSoundEnabled = true;
          let tl = gsap.timeline({repeat: 0, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}});
     
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, ], {z: 0}, {z: -anglePoint * 12})
          tl.fromTo([p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint/2}, '<')
          tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: 0.015, duration: 0.02})

          tl.fromTo([p2.ball.rotation, p2.string.rotation, 
               p3.ball.rotation, p3.string.rotation, 
               p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation, ], {z: 0}, {z: anglePoint * 12,});
     
          tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: -anglePoint/2}, '<')
          tl.fromTo([p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -0.015, duration: 0.02})
     
     //4
            
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 12})
          tl.fromTo([p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint/2}, '<')
          tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: 0.015, duration: 0.02})
          tl.fromTo([p3.ball.rotation, p3.string.rotation, 
               p4.ball.rotation, p4.string.rotation, 
               p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: anglePoint * 12,}); 
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation], {z: 0}, {z: -anglePoint/2}, '<')          
          tl.fromTo([p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -0.015, duration: 0.02})
     
     //5
     
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: -anglePoint * 12})
          tl.fromTo([p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: anglePoint / 2,}, '<'); 
          tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: 0.015, duration: 0.02})
          tl.fromTo([p4.ball.rotation, p4.string.rotation, 
               p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: anglePoint * 12,}); 
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: -anglePoint / 2,}, '<'); 
          tl.fromTo([p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -0.015, duration: 0.02})
     
     //6
     
          tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: -anglePoint * 12})
          tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: 0.015, duration: 0.02})
          tl.fromTo([p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: anglePoint * 12,});
          tl.fromTo([p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -0.015, duration: 0.02})
     
     //7
     
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation], {z: 0}, {z: -anglePoint * 7}, )
          tl.fromTo([p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint / 4}, '<');
          tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, );
              
          tl.fromTo([p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint * 14}, );
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation], {z: 0}, {z: -anglePoint / 4}, '<')
          tl.fromTo([p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -0.015, duration: 0.02}, );
         
          tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: -anglePoint * 14}, )         
          tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: 0.015, duration: 0.02}, )         
          tl.fromTo([p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint * 7}, );
          tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: -anglePoint / 4}, '<')   
          tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {z: 0}, {z: -0.015, duration: 0.02}, ) 
     
     //8
      
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation], {z: 0}, {z: -anglePoint * 5}, )         
          tl.fromTo([p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint / 4}, '<');
          tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, );
          tl.fromTo([p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint * 14}, );
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation], {z: 0}, {z: -anglePoint / 5}, '<')   
          tl.fromTo([p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -0.015, duration: 0.02}, );
          
          tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: -anglePoint * 14}, )         
          tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: 0.015, duration: 0.02}, )         
          tl.fromTo([p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint * 5}, );
          tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: -anglePoint / 4}, '<')  
          tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {z: 0}, {z: -0.015, duration: 0.02}, )     
    
     // 9
     
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: -anglePoint * 12}, )
          tl.fromTo([p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint / 4}, '<');
          tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, )
              
          tl.fromTo([p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint * 8}, );
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: -anglePoint / 2}, '<')
          tl.fromTo([p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -0.015, duration: 0.02}, );
     
     // 10
     
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: -anglePoint * 12}, )
          tl.fromTo([p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation ], {z: 0}, {z: -anglePoint / 2}, '<')
          tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, )
              
          tl.fromTo([p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: anglePoint * 4}, );
          tl.fromTo([p4.ball.rotation, p4.string.rotation, ], {z: 0}, {z: anglePoint * 8}, '<');
          tl.fromTo([p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint * 12}, '<');
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: -anglePoint / 2}, '<')
          tl.fromTo([p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02}, );         
    
     // 11
     
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: -anglePoint * 8}, )
          tl.fromTo([ p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint / 2}, '<');
          tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02}, )
              
          tl.fromTo([ p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint * 12}, );
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: -anglePoint / 4}, '<')
          tl.fromTo([p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02}, )
     
     // 12
     
          tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: -anglePoint * 12}, )
          tl.fromTo([ p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: -anglePoint * 8}, '<')
          tl.fromTo([ p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: -anglePoint * 4}, '<')
          tl.fromTo([ p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint / 2}, '<');
          tl.fromTo([ p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02},)     
          
          tl.fromTo([ p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint * 12}, );
          tl.fromTo([ p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation], {z: 0}, {z: anglePoint / 4}, '<');
          tl.fromTo([ p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02},)
           
     //13
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: -anglePoint * 12,}, )
          tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02,})    
          tl.fromTo([ p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint * 12,}, );
          tl.fromTo([p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02,})  
     
     //14
          tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: -anglePoint * 12,}, )
          tl.fromTo([ p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: -anglePoint * 8,}, '<')
          tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02,})    
          tl.fromTo([ p4.ball.rotation, p4.string.rotation, ], {z: 0}, {z: anglePoint * 8,}, );
          tl.fromTo([ p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint * 12,}, '<');
          tl.fromTo([p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02, })       
    
     // 15
     
          tl.fromTo([p1.ball.rotation, p1.string.rotation, ], 
               {z: 0}, {z: -anglePoint * 14});
          tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
               {z: 0}, {z: anglePoint * 14}, '<');
          tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, );     
     
     // 16
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: -anglePoint * 14});
          tl.fromTo([p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: anglePoint * 14}, '<');
          tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: 0.015, duration: 0.02}, );     

          // 17
          tl.fromTo([p1.ball.rotation, p1.string.rotation, ], 
               {z: 0}, {z: -anglePoint * 14});
          tl.fromTo([p2.ball.rotation, p2.string.rotation, ], 
               {z: 0}, {z: -anglePoint * 7}, '<');
          tl.fromTo([p4.ball.rotation, p4.string.rotation, ], 
               {z: 0}, {z: anglePoint * 7}, '<');
          tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
               {z: 0}, {z: anglePoint * 14}, '<');
          tl.fromTo([p4.ball.rotation, p4.string.rotation, ], {z: 0}, {z: -0.015, duration: 0.02},);    
     
     // 18
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 10});     
          tl.fromTo([p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: anglePoint * 14}, '<');
          tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: 0.015, duration: 0.02});    
     
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: -anglePoint * 14});    
          tl.fromTo([p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: anglePoint * 10}, '<');
          tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {z: 0}, {z: -0.015, duration: 0.02});
     
          
     // 19
          tl.fromTo([p1.ball.rotation, p1.string.rotation, ], 
               {z: 0}, {z: -anglePoint * 9});
          tl.fromTo([ p2.ball.rotation, p2.string.rotation, ], 
               {z: 0}, {z: -anglePoint * 6}, '<');
          tl.fromTo([p3.ball.rotation, p3.string.rotation, ], 
               {z: 0}, {z: -anglePoint * 3}, '<');
          tl.fromTo([p4.ball.rotation, p4.string.rotation,], 
               {z: 0}, {z: anglePoint * 6}, '<');
          tl.fromTo([p5.ball.rotation, p5.string.rotation,], 
               {z: 0}, {z: anglePoint * 12}, '<');
          tl.fromTo([p1.ball.rotation, p1.string.rotation, ], 
                    {z: 0}, {z: 0.015, duration: 0.02},);
     
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation,], {z: 0}, {z: -anglePoint * 14});
          tl.fromTo([p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: anglePoint * 10}, '<');
          tl.fromTo([p5.ball.rotation, p5.string.rotation, ], 
               {z: 0}, {z: -0.015, duration: 0.02},);
     
          
     // 20
     
          tl.fromTo([p1.ball.rotation, p1.string.rotation,  ], 
               {z: 0}, {z: -anglePoint * 16});
          tl.fromTo([p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation,], 
               {z: 0}, {z: anglePoint * 8}, '<');
          tl.fromTo([p1.ball.rotation, p1.string.rotation,  ], 
                    {z: 0}, {z: 0.015, duration: 0.02});
     
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation,  ], 
               {z: 0}, {z: -anglePoint * 8});
          tl.fromTo([p5.ball.rotation, p5.string.rotation,], 
               {z: 0}, {z: anglePoint * 16}, '<');
          tl.fromTo([p5.ball.rotation, p5.string.rotation,  ], 
                    {z: 0}, {z: -0.015, duration: 0.02});
     
     
     //21
     
          tl.fromTo([p1.ball.rotation, p1.string.rotation,  ], 
               {z: 0}, {z: -anglePoint * 16});
          tl.fromTo([p2.ball.rotation, p2.string.rotation, ], 
               {z: 0}, {z: anglePoint * 2}, '<');
          tl.fromTo([ p3.ball.rotation, p3.string.rotation, ], 
               {z: 0}, {z: anglePoint * 4}, '<');
          tl.fromTo([p4.ball.rotation, p4.string.rotation,], 
               {z: 0}, {z: anglePoint * 6}, '<');
          tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
               {z: 0}, {z: anglePoint * 8}, '<');
     
          tl.fromTo([p1.ball.rotation, p1.string.rotation,  ], 
               {z: 0}, {z: 0.015, duration: 0.02});
     
          tl.fromTo([p1.ball.rotation, p1.string.rotation,  ], 
               {z: 0}, {z: -anglePoint * 8});
          tl.fromTo([p2.ball.rotation, p2.string.rotation, ], 
               {z: 0}, {z: -anglePoint * 6}, '<');
          tl.fromTo([ p3.ball.rotation, p3.string.rotation, ], 
               {z: 0}, {z: -anglePoint * 4}, '<');
          tl.fromTo([ p4.ball.rotation, p4.string.rotation,  ], 
               {z: 0}, {z: -anglePoint * 2}, '<');
          tl.fromTo([p5.ball.rotation, p5.string.rotation,], 
               {z: 0}, {z: anglePoint * 16}, '<');
          tl.fromTo([p5.ball.rotation, p5.string.rotation,], 
               {z: 0}, {z: -0.015, duration: 0.02},);
    
     // 22
          tl.fromTo([p1.ball.rotation, p1.string.rotation], 
               {z: 0}, {z: -anglePoint * 16});
          tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
               {z: 0}, {z: anglePoint * 16}, '<');
          tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: 0.015, duration: 0.02});     
    
     
     // 23
          tl.fromTo([p1.ball.rotation, p1.string.rotation, ], 
               {z: 0}, {z: -anglePoint * 16});
          tl.fromTo([p2.ball.rotation, p2.string.rotation, ], 
               {z: 0}, {z: -anglePoint * 12}, '<');
          tl.fromTo([ p4.ball.rotation, p4.string.rotation,], 
               {z: 0}, {z: anglePoint * 12}, '<');
          tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
               {z: 0}, {z: anglePoint * 16}, '<');
          
          tl.fromTo([ p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -0.015, duration: 0.02});      
     
     
     //24
          tl.fromTo([p1.ball.rotation, p1.string.rotation], 
               {z: 0}, {z: -anglePoint * 14});
          tl.fromTo([p2.ball.rotation, p2.string.rotation, ], 
               {z: 0}, {z: -anglePoint * 10}, '<');
               tl.fromTo([ p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: 0.012, duration: 0.02},);     
          tl.fromTo([ p4.ball.rotation, p4.string.rotation,], 
               {z: 0}, {z: anglePoint * 10}, );         
          tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
               {z: 0}, {z: anglePoint * 14}, '<');
          
          tl.fromTo([ p4.ball.rotation, p4.string.rotation, ], {z: 0}, {z: -0.012, duration: 0.02}, );     
     
      
     // 25
     
          tl.fromTo([p1.ball.rotation, p1.string.rotation], 
               {z: 0}, {z: -anglePoint * 15});
          tl.fromTo([p2.ball.rotation, p2.string.rotation, ], 
               {z: 0}, {z: -anglePoint * 12}, '<');
          tl.fromTo([ p3.ball.rotation, p3.string.rotation,], 
               {z: 0}, {z: -anglePoint * 6}, '<');
          tl.fromTo([ p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint / 4}, '<');
               tl.fromTo([ p1.ball.rotation, p1.string.rotation,], 
                    {z: 0}, {z: 0.015, duration: 0.02},);
     
          tl.fromTo([ p3.ball.rotation, p3.string.rotation], 
               {z: 0}, {z: anglePoint * 6}, );
          tl.fromTo([ p4.ball.rotation, p4.string.rotation,], 
               {z: 0}, {z: anglePoint * 9}, '<');
          tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
               {z: 0}, {z: anglePoint * 12}, '<');
          tl.fromTo([ p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation], {z: 0}, {z: -anglePoint / 4}, '<');
          tl.fromTo([ p5.ball.rotation, p5.string.rotation], 
                    {z: 0}, {z: -0.015, duration: 0.02},);
     
     // 26
     
          tl.fromTo([p1.ball.rotation, p1.string.rotation], 
               {z: 0}, {z: -anglePoint * 15});
          tl.fromTo([p2.ball.rotation, p2.string.rotation], 
               {z: 0}, {z: -anglePoint * 12}, '<');
          tl.fromTo([ p3.ball.rotation, p3.string.rotation], 
               {z: 0}, {z: -anglePoint * 6}, '<');
          tl.fromTo([ p4.ball.rotation, p4.string.rotation,], 
               {z: 0}, {z: -anglePoint * 3}, '<');
               tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
                    {z: 0}, {z: anglePoint / 4}, '<');
          tl.fromTo([ p1.ball.rotation, p1.string.rotation,], 
               {z: 0}, {z: 0.015, duration: 0.02},);
     
          tl.fromTo([ p2.ball.rotation, p2.string.rotation,], 
               {z: 0}, {z: anglePoint * 3}, );
          tl.fromTo([ p3.ball.rotation, p3.string.rotation,], 
               {z: 0}, {z: anglePoint * 6}, '<');
          tl.fromTo([ p4.ball.rotation, p4.string.rotation,], 
               {z: 0}, {z: anglePoint * 9}, '<');
          tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
               {z: 0}, {z: anglePoint * 12}, '<');
               tl.fromTo([p1.ball.rotation, p1.string.rotation, ], 
                    {z: 0}, {z: -anglePoint / 4}, '<');
          tl.fromTo([ p5.ball.rotation, p5.string.rotation], 
                    {z: 0}, {z: -0.015, duration: 0.02}, );
             
        
     //27
         
          tl.fromTo([p1.ball.rotation, p1.string.rotation, ], 
               {z: 0}, {z: -anglePoint * 15});
          tl.fromTo([p2.ball.rotation, p2.string.rotation, ], 
               {z: 0}, {z: -anglePoint * 12}, '<');
          tl.fromTo([ p3.ball.rotation, p3.string.rotation,], 
               {z: 0}, {z: -anglePoint * 9}, '<');
          tl.fromTo([ p4.ball.rotation, p4.string.rotation,], 
               {z: 0}, {z: -anglePoint * 6}, '<');
          tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
               {z: 0}, {z: -anglePoint * 3}, '<');
          tl.fromTo([ p1.ball.rotation, p1.string.rotation,], 
                    {z: 0}, {z: 0.015, duration: 0.015},);
     
          tl.fromTo([ p1.ball.rotation, p1.string.rotation,], 
               {z: 0}, {z: anglePoint * 3}, );
          tl.fromTo([ p2.ball.rotation, p2.string.rotation,], 
               {z: 0}, {z: anglePoint * 6}, '<');
          tl.fromTo([ p3.ball.rotation, p3.string.rotation,], 
               {z: 0}, {z: anglePoint * 9}, '<');
          tl.fromTo([ p4.ball.rotation, p4.string.rotation,], 
               {z: 0}, {z: anglePoint * 12}, '<');
          tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
               {z: 0}, {z: anglePoint * 15}, '<');
          tl.fromTo([ p5.ball.rotation, p5.string.rotation,], 
                    {z: 0}, {z: -0.015, duration: 0.015},);
/*    */                
}


///// ANIMATION ///////////////////////////////////

let startTime = null;

function animate(time){
     if(startTime == null){
          startTime = time;
     }
    
     const totalTime = time - startTime;
     render(totalTime);

     renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);// need for cameraFront
     renderer.render(scene, camera);
     window.requestAnimationFrame(animate);

     //for cameraFront
     renderer.clearDepth();
     renderer.setScissorTest(true);
     // front
     renderer.setScissor(window.innerWidth - insetWidth - 8,  insetHeight / 4 - 30,
          insetWidth, insetHeight);
     renderer.setViewport(window.innerWidth - insetWidth - 8,  insetHeight / 4 - 30, insetWidth, insetHeight + 16);
     renderer.render(scene, cameraFront);
     // top
     renderer.setScissor(8,  insetHeight / 4 - 30,
          insetWidth, insetHeight);
     renderer.setViewport(8,  insetHeight / 4 - 30, insetWidth, insetHeight + 16);
     renderer.render(scene, cameraTop);
     
     renderer.setScissorTest(false);
}
animate();

function render(totalTime){
     orbitControls.update();
     
     //swing option BANG??
     //swing(totalTime);
     
     //collision
     boxHelpers[0].setFromObject(ballMeshes[0]);
     boxHelpers[0].update();
     target1.setFromObject(ballMeshes[0]);
     boxHelpers[1].setFromObject(ballMeshes[1]);
     boxHelpers[1].update();
     target2.setFromObject(ballMeshes[1]);
     boxHelpers[2].setFromObject(ballMeshes[2]);
     boxHelpers[2].update();
     target3.setFromObject(ballMeshes[2]);
     boxHelpers[3].setFromObject(ballMeshes[3]);
     boxHelpers[3].update();
     target4.setFromObject(ballMeshes[3]);
     boxHelpers[4].setFromObject(ballMeshes[4]);
     boxHelpers[4].update();
     target5.setFromObject(ballMeshes[4]);
     checkCollision();
     //checkVibraphone();
    
};

function checkCollision(){
     let i = Math.floor(Math.random() * keys.length);
       //let index = i < 16 ? i + 45 : i - 16;
       //let index = i >= 45 ? i - 45 : i + 16;
       if(soundEnabled){
            if(target1.containsPoint(points1[i])){
                 let index = Math.floor(Math.random() * keys.length)
                      playKey(index);
                
                 gsap.to(balls[index].position, {y: 4, duration: 0.2, ease: 'power0.inOut'});
                           gsap.to(balls[index].position, {y: 0, delay: 0.2, duration: 0.5, ease: 'power0.inOut'});
                           gsap.to(cylinders[index].scale, {y: 5, duration: 0.2, ease: 'power0.inOut'});
                           gsap.to(cylinders[index].scale, {y: 1, duration: 0.5, delay: 0.2, ease: 'power0.inOut'});
            }
            if(target2.containsPoint(points2[i])){
                 let index = Math.floor(Math.random() * keys.length)
                 playKey(index);
  
                
                 gsap.to(balls[index].position, {y: 5, duration: 0.25, ease: 'power1'});
                 gsap.to(balls[index].position, {y: 0, delay: 0.25, duration: 0.5, ease: 'power1'});
                 gsap.to(cylinders[index].scale, {y: 7, duration: 0.2, ease: 'power0'});
                 gsap.to(cylinders[index].scale, {y: 1, duration: 0.5, delay: 0.2, ease: 'power0'});
            }
            if(target3.containsPoint(points3[i])){
                 let index = Math.floor(Math.random() * keys.length)
                 playKey(index);
  
                
                 gsap.to(balls[index].position, {y: 5, duration: 0.25, ease: 'power1'});
                 gsap.to(balls[index].position, {y: 0, delay: 0.25, duration: 0.5, ease: 'power1'});
                 gsap.to(cylinders[index].scale, {y: 7, duration: 0.2, ease: 'power0'});
                 gsap.to(cylinders[index].scale, {y: 1, duration: 0.5, delay: 0.2, ease: 'power0'});
            }
            if(target4.containsPoint(points4[i]) || target5.containsPoint(points5[i])){
                 let index = Math.floor(Math.random() * keys.length)
                 playKey(index);
  
                
                 gsap.to(balls[index].position, {y: 5, duration: 0.25, ease: 'power1'});
                 gsap.to(balls[index].position, {y: 0, delay: 0.25, duration: 0.5, ease: 'power1'});
                 gsap.to(cylinders[index].scale, {y: 7, duration: 0.2, ease: 'power0'});
                 gsap.to(cylinders[index].scale, {y: 1, duration: 0.5, delay: 0.2, ease: 'power0'});
            }
       }     
       
       //console.log(p1.ball.position.y); 
       if(collisionSoundEnabled){
          let index = Math.floor(Math.random() * 15);
            if(target1.intersectsBox(target2) && p2.ball.rotation.z == 0 ){
                      
                      clap.play();
            }    
            if(target2.intersectsBox(target3) && p3.ball.rotation.z == 0 ){
               
               clap.play();
            }    
            if(target3.intersectsBox(target2) && p2.ball.rotation.z == 0 ){
               
            }    
            if(target4.intersectsBox(target3) && p3.ball.rotation.z == 0){
               
               clap.play();
            }    
            if(target3.intersectsBox(target4) && p4.ball.rotation.z == 0){
               
               clap.play();
            }    
            if(target5.intersectsBox(target4) && p4.ball.rotation.z == 0){
               
               clap.play();
            }    
           
           
       }
       
      
  }

//// vibraphone /////

window.addEventListener('resize', () => {
     const aspect = window.innerWidth/window.innerHeight;
     camera.aspect = aspect;
     camera.updateProjectionMatrix();
     //camera.position.z = Math.max(8/aspect, 6);
     camera.lookAt(0, 0, 0);
     renderer.setSize(window.innerWidth, window.innerHeight);

     insetWidth = window.innerWidth * 0.30;
     insetHeight = window.innerWidth * 0.16;
     cameraFront.aspect = insetWidth / insetHeight;
     cameraFront.updateProjectionMatrix();
     cameraTop.aspect = insetWidth / insetHeight;
     cameraTop.updateProjectionMatrix();
});


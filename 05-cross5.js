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
     audio.currentTime = 1;
     audio.volume = 0.3;
     keys.push(audio);
}

const playKey = (index) => {
     //keys[index].currentTime = 0.5;
     
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

// vibraphone
let groupLeft = new THREE.Group();
let groupRight = new THREE.Group();
let rightCubes = [];
let leftCubes = [];
let groupFront = new THREE.Group();
let groupBack = new THREE.Group();
let frontCubes = [];
let backCubes = [];

// Pendulum Variables //
const maxPendulum = 5;
let distance = (maxPendulum - 1) * 2.1; 

//let ballRadius = 2;
let stringLength = 31;
let stringWidth = 0.18;
let a = 0;
const pendulums = [];
let amplitude = 0;
let frequency = 0.5; 

let angle = 0.2;
let duration = 2;
let angleZ = 0;

// Init Functions //
initThree();
createCylinderBalls21();
//createCylinderBalls();
createVibraphone();
createLights();
createBar();
createRing();
boomCamera();
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
     camera.position.set(25, 15, 75);
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

//camera controls

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

//Action Camera Gsap// 540s
function boomCamera(){
     let tl = gsap.timeline({repeat: 5, repeatDelay: 150});
     tl.to(camera.position, {z: 65, y: 31, duration: 30, delay: 15});
     tl.fromTo(boom.rotation, {y: Math.PI}, {y: 0, duration: 30, delay: 15, yoyo: true, ease: 'power1.inOut'});
     tl.fromTo(boom.rotation, {y: 0}, {y: Math.PI, duration: 30, delay: 15, ease: 'power1.inOut'});
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

     const pointLight = new THREE.PointLight(0xffffff, 1);
     pointLight.position.set(0, 20, 45);
     scene.add(pointLight);

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
let anglePoint = Math.PI * 2/61; //keys.length

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
          scene.add(group);
          
     }
}
createRingPoints();

//create points z
function createPointsZ(group, offset){     
     for(let i = 0; i < 61; i++ ){
          let point = new THREE.Vector3(pointRadius * Math.cos(anglePoint * i + Math.PI/2) + offset, pointRadius * Math.sin(anglePoint * i + Math.PI/2) + pointRadius, 0);
          group.push(point);
     }
};

createPointsZ(points1, 0);
createPointsZ(points2, 5.2);
createPointsZ(points3, -5.2);

//create points 
function createPointsX(group, offset){     
     for(let i = 0; i < 61; i++ ){
          let point = new THREE.Vector3(0, pointRadius * Math.sin(anglePoint * i -Math.PI/2) + pointRadius, pointRadius * Math.cos(anglePoint * i - Math.PI/2) + offset);
          group.push(point);
     }
};

createPointsX(points4, 5.2);
createPointsX(points5, -5.2);

// cylinderBalls

function createCylinderBalls21(){
     for ( let i = 0; i < 21; i++ ) {          
          let radius = 7;
          let cylinderMaterial = new THREE.MeshPhongMaterial();
          cylinderMaterial.roughness = 0.5 * Math.random();
          cylinderMaterial.metalness =  0.75;
          cylinderMaterial.color.setHSL( Math.random(), 1.0, 0.5 );

          let cylinder = new THREE.Mesh( new THREE.CylinderGeometry( 0.5, 0.25, 1, 40, 20 ), cylinderMaterial );
          cylinder.castShadow = true;
          cylinder.receiveShadow = true;
          let anglePosition = Math.PI * 2 / 21;
          cylinder.position.x = radius * Math.cos( anglePosition * i );
          cylinder.position.z = radius * Math.sin( anglePosition * i );
          cylinder.position.y = -10;
          
          // Balls
          let ballGeometry = new THREE.SphereGeometry( 0.75, 32, 16 );
          ballGeometry.translate( 0, -8.5, 0 );

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
function createCylinderBalls(){
     for ( let i = 0; i < 61; i++ ) {          
          let radius = maxPendulum * 7 - 6 ;
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

// Vibraphone //
function createCubeMesh(){
     const geometry = new THREE.BoxGeometry();
     const material = new THREE.MeshPhongMaterial({
          color: 0x999999,
          transparent: true,
          opacity:0.5
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
          cubeR.material.color = new THREE.Color(`hsla(${i*24}, 100%, 50%, 1)`);
          cubeR.scale.set(1, i * 0.25 + 2, 1);
          cubeR.position.set(1.25 * i + 10,   0, 0);
          rightCubes.push(cubeR);
          groupRight.add(cubeR);  
          groupRight.position.y = -9;
     
          const cubeL = createCubeMesh();
          cubeL.material.color = new THREE.Color(`hsla(${ i*24}, 100%, 50%, 1)`);
          cubeL.scale.set(1, i * 0.25 + 2, 1);
          cubeL.position.set(-1.25 * i - 10, 0, 0);
          leftCubes.push(cubeL);
          groupLeft.add(cubeL);  
          groupLeft.position.y = -9;

          const cubeF = createCubeMesh();
          cubeF.material.color = new THREE.Color(`hsla(${i*18}, 100%, 50%, 1)`);
          cubeF.scale.set(1, i * 0.25 + 2, 1);
          cubeF.position.set(0,   0, 1.25 * i + 10);
          frontCubes.push(cubeF);
          groupFront.add(cubeF);  
          groupFront.position.y = -9;
     
          const cubeB = createCubeMesh();
          cubeB.material.color = new THREE.Color(`hsla(${ i*18}, 100%, 50%, 1)`);
          cubeB.scale.set(1, i * 0.25 + 2, 1);
          cubeB.position.set(0, 0, -1.25 * i - 10);
          backCubes.push(cubeB);
          groupBack.add(cubeB);  
          groupBack.position.y = -9;
     } 
     scene.add(groupRight);
     scene.add(groupLeft);
     scene.add(groupBack, groupFront);
};

function createGroundMirror(){
     const geo = new THREE.CircleGeometry(40, 30, 30);
     const mat = new THREE.MeshPhongMaterial({
          color: 0x000000,
          transparent: true,
          opacity: 0.85,
     })
     const screen = new THREE.Mesh(geo, mat);
     screen.position.y = -10;
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
     bar2.position.set(0, 31.5, 0);
     bar2.rotation.y = Math.PI/2;
     scene.add(bar2);
};
// create ring//
function createRing(){
     const ringGeo = new THREE.TorusGeometry(distance - 3, 0.5, 16, 50);
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

function createBallMesh(ballRadius){
     const geometry = new THREE.SphereGeometry(ballRadius, 30, 30);
     const material = new THREE.MeshStandardMaterial({
          color: 0xdddddd,
          map: metalTextureColor,
          roughnessMap: metalTextureRoughness,
          transparent: true,
          roughness: 0.2,
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

          this.string.rotation.z = this.amplitude * Math.cos((this.frequency * totalTime)/1000);          
          this.ball.rotation.z = this.amplitude * Math.cos((this.frequency * totalTime)/1000);          
     }
};

function createPendulum(origin, frequency, amplitude, ballRadius){
     const stringMesh = createStringMesh();
     stringMesh.position.add(origin);
     stringMesh.translateY(stringLength);
     stringMesh.geometry.translate(0, -(stringLength * 0.5), 0);

     const ballMesh = createBallMesh(ballRadius);
     ballMesh.position.add(origin);
     ballMesh.translateY(stringLength);
     ballMesh.geometry.translate(0, -stringLength, 0);
     ballMesh.geometry.radius = ballRadius;
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

const pCenter = createPendulum(new THREE.Vector3(0, 0, 0), frequency, amplitude, 3);
pCenter.ball.material.color = new THREE.Color(0x999999);
const pEast = createPendulum(new THREE.Vector3(5.2, 0, 0), frequency, amplitude, 2);
//pEast.ball.material.color = new THREE.Color(0xff0000);
const pWest = createPendulum(new THREE.Vector3(-5.2, 0, 0), frequency, amplitude, 2);
//pWest.ball.material.color = new THREE.Color(0xff0000);
const pSouth = createPendulum(new THREE.Vector3(0, 0, 5.2), frequency, amplitude, 2);
//pSouth.ball.material.color = new THREE.Color(0x00ff00);
const pNorth = createPendulum(new THREE.Vector3(0, 0, -5.2), frequency, amplitude,2);
//pNorth.ball.material.color = new THREE.Color(0x00ff00);
pendulums.push(pCenter, pEast, pWest, pSouth, pNorth);

const p1 = pendulums[0];//center
const p2 = pendulums[1];// east
const p3 = pendulums[2];//west
const p4 = pendulums[3];//south
const p5 = pendulums[4];//north
const target1 = targets[0]; 
const target2 = targets[1]; 
const target3 = targets[2]; 
const target4 = targets[3]; 
const target5 = targets[4]; 

///// SWINGS /////

function swing(totalTime){
     soundEnabled = true;
     collisionSoundEnabled = false;
     a = 0.0002
     p1.update(totalTime, a);
     p2.update(totalTime, a);
     p3.update(totalTime, a);
     p4.update(totalTime, a);
     p5.update(totalTime, a);
}

duration = 1;
angleZ = 0.02;

// swing //
function swing01(){
     let tl = gsap.timeline({repeat: 0, onComplete: swing02, })
     tl.to(boom.rotation, {y: Math.PI ,delay: 2,  duration: 2})
     tl.to(boom.rotation, {y: 0 ,  duration: 2})
}
function swing02(){
     soundEnabled = true;
     collisionSoundEnabled = false;
     let tl = gsap.timeline({repeat: 1, onComplete: swing1, defaults: {repeat: 1, duration: duration, yoyo: true}});
    tl.fromTo([p1.ball.rotation, p1.string.rotation, 
     p2.ball.rotation, p2.string.rotation, 
     p3.ball.rotation, p3.string.rotation, 
     p4.ball.rotation, p4.string.rotation, 
     p5.ball.rotation, p5.string.rotation, ], {z: 0}, {z: Math.PI/3})

    tl.fromTo([p1.ball.rotation, p1.string.rotation, 
     p2.ball.rotation, p2.string.rotation, 
     p3.ball.rotation, p3.string.rotation, 
     p4.ball.rotation, p4.string.rotation, 
     p5.ball.rotation, p5.string.rotation, ], {z: 0}, {z: -Math.PI/3})     
}

// <2=3=4=5<
function swing1(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 7, delay: 0, onRepeat: myAngle , onComplete: swing2, defaults: {repeat: 1, duration: duration, yoyo: true}});
         
     tl.fromTo([p2.ball.rotation, p2.string.rotation,], {z: 0}, {z: angle})
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -angle}, '<')
     tl.fromTo([p4.ball.rotation, p4.string.rotation,], {x: 0}, {x: -angle}, '<')
     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: angle}, '<')
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: -0.015, duration: 0.02})
     tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: -0.015, duration: 0.02}, '<')
    
     tl.fromTo([p2.ball.rotation, p2.string.rotation,], {z: 0}, {z: angle * 2})
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -angle * 2}, '<')
     tl.fromTo([p4.ball.rotation, p4.string.rotation,], {x: 0}, {x: -angle * 2}, '<')
     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: angle * 2}, '<')
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: -0.015, duration: 0.02})
     tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: -0.015, duration: 0.02}, '<')
}

function myAngle(){
     angle += angleZ
}
// >2=3=4=5>
function swing2(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 7, onRepeat: myAngle , onComplete: swing3, defaults: {repeat: 1, duration: duration, yoyo: true}});

     tl.fromTo([p2.ball.rotation, p2.string.rotation,], {z: 0}, {z: Math.PI/2 - angle})
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -Math.PI/2 + angle}, '<')
     tl.fromTo([p4.ball.rotation, p4.string.rotation,], {x: 0}, {x: -Math.PI/2 + angle}, '<')
     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: Math.PI/2 - angle}, '<')
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: 0.015, duration: 0.02})
     tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: -0.015, duration: 0.02}, '<')
     tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, '<')

     tl.fromTo([p2.ball.rotation, p2.string.rotation,], {z: 0}, {z: Math.PI/3 - angle})
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -Math.PI/3 + angle}, '<')
     tl.fromTo([p4.ball.rotation, p4.string.rotation,], {x: 0}, {x: -Math.PI/3 + angle}, '<')
     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: Math.PI/3 - angle}, '<')
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: 0.015, duration: 0.02})
     tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: -0.015, duration: 0.02}, '<')
     tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, '<')
    
}

// 2=3/4=5
function swing3(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 7, onRepeat: myAngle , onComplete: swing4, defaults: {repeat: 1, duration: duration, yoyo: true}});

     tl.fromTo([p2.ball.rotation, p2.string.rotation,], {z: 0}, {z: Math.PI/3 })
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -Math.PI/3 }, '<')
     tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: -0.025}, '<')
     tl.fromTo([p5.ball.rotation, p5.string.rotation], {x: 0}, {x: 0.025,}, '<')
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {x: 0}, {x: 0.015, duration: 0.02}, '<')
   tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: -0.015, duration: 0.02})
     tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, '<')
     tl.fromTo([p4.ball.rotation, p4.string.rotation,], {x: 0}, {x: -Math.PI/3}, )
     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: Math.PI/3}, '<')  
     tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: 0.025}, '<')
     tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: -0.025}, '<')
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: -0.015, duration: 0.02}, '<')
     tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: 0.015, duration: 0.02}, )
     tl.fromTo([p5.ball.rotation, p5.string.rotation], {x: 0}, {x: -0.015, duration: 0.02}, '<')
}


// 2/3/4/5
function swing4(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onRepeat: myAngle , onComplete: swing5, defaults: {repeat: 1, duration: duration, yoyo: true}});

     tl.fromTo([p2.ball.rotation, p2.string.rotation,], {z: 0}, {z: Math.PI/3})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: -0.015, duration: 0.02 }, '<')  
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -0.025}, '<')  
     tl.fromTo([p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: -0.025}, '<')  
     tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: -0.015, duration: 0.02})

     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -Math.PI/3}, )
     tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: -0.025}, '<')
     tl.fromTo([p5.ball.rotation, p5.string.rotation], {x: 0}, {x: 0.025}, '<' ) 
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {x: -0.015, duration: 0.02}, '<' ) 
     tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02},)

     tl.fromTo([p4.ball.rotation, p4.string.rotation,], {x: 0}, {x: -Math.PI/3 }, )
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02}, '<')
     tl.fromTo([p2.ball.rotation, p2.string.rotation,], {z: 0}, {z: 0.025}, '<')
     tl.fromTo([p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: -0.025}, '<')
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: 0.025}, '<')
     tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: 0.015, duration: 0.02}, )

     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: Math.PI/3 }, )     
     tl.fromTo([p5.ball.rotation, p5.string.rotation], {x: 0}, {x: -0.015, duration: 0.02},)
}


function swing5(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, repeatDelay: 0, onRepeat: myAngle , onComplete: swing6, defaults: {repeat: 1, duration: duration, yoyo: true}});

     tl.fromTo([p2.ball.rotation, p2.string.rotation,], {z: 0}, {z: Math.PI/3}, )
     tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: -0.015, duration: 0.02})
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: -0.015, duration: 0.02}, )
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -Math.PI/3}, '-=1')
     tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02},)
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, )

     tl.fromTo([p4.ball.rotation, p4.string.rotation,], {x: 0}, {x: -Math.PI/3 }, '-=1')
     tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: 0.015, duration: 0.02}, )
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {x: 0}, {x: -0.015, duration: 0.02}, )

     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: Math.PI/3 }, '-=1')  
     tl.fromTo([p5.ball.rotation, p5.string.rotation], {x: 0}, {x: -0.015, duration: 0.02},)
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {x: 0}, {x: 0.015, duration: 0.02}, )
}
//swing 23/45
function swing6(){
     soundEnabled = true;
     collisionSoundEnabled = false;
     let tl = gsap.timeline({repeat: 3, onComplete: swing7, defaults: {duration: duration, repeat: 1, yoyo: true}});

     tl.fromTo([p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation], {x: 0}, {x: Math.PI/3})
      tl.fromTo([p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: Math.PI/3}, '<')
     tl.fromTo([p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation], {x: 0}, {x: -Math.PI/3})
     tl.fromTo([p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -Math.PI/3}, '<')
}


function swing7(){
     soundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swing8, defaults: {duration: duration, repeat: 1, yoyo: true}});

     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {x: 0}, {x: Math.PI/3})
     tl.fromTo([ p3.ball.rotation, p3.string.rotation], {x: 0}, {x: -Math.PI/3}, '<')
     tl.fromTo([p4.ball.rotation, p4.string.rotation,], {z: 0}, {z: -Math.PI/3}, '<')
     tl.fromTo([ p5.ball.rotation, p5.string.rotation], {z: 0}, {z: Math.PI/3}, '<')

     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {x: 0}, {x: -Math.PI/3}, )
     tl.fromTo([p3.ball.rotation, p3.string.rotation], {x: 0}, {x: Math.PI/3}, '<')
     tl.fromTo([p4.ball.rotation, p4.string.rotation, ], {z: 0}, {z: Math.PI/3}, '<')
     tl.fromTo([ p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -Math.PI/3}, '<')
}

function swing8(){
     soundEnabled = true;
     collisionSoundEnabled = false;
     let tl = gsap.timeline({repeat: 1, onComplete: carousel45, defaults: {repeat: 1, duration: duration, yoyo: true}});
    tl.fromTo([p1.ball.rotation, p1.string.rotation, 
     p2.ball.rotation, p2.string.rotation, 
     p3.ball.rotation, p3.string.rotation, 
     p4.ball.rotation, p4.string.rotation, 
     p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: Math.PI/3})

    tl.fromTo([p1.ball.rotation, p1.string.rotation, 
     p2.ball.rotation, p2.string.rotation, 
     p3.ball.rotation, p3.string.rotation, 
     p4.ball.rotation, p4.string.rotation, 
     p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: -Math.PI/3})
     
}
//swing0();
//swing2();
//swing3();
//swing4();

swingTotal();
//swingShorts();


///// Total Swing ///// angle use anglePoint * 30 = Math.PI
///// Total Swing ///// angle use anglePoint * 30 = Math.PI
//swingTotal(); //9min 20s

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

     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation,p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -anglePoint * 8})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation,p5.ball.rotation, p5.string.rotation], {x: 0}, {x: -anglePoint * 8}, '<')

     tl.fromTo([p1.ball.rotation, p1.string.rotation, 
          p2.ball.rotation, p2.string.rotation, 
          p3.ball.rotation, p3.string.rotation, 
          p4.ball.rotation, p4.string.rotation,p5.ball.rotation, p5.string.rotation], 
          {z: 0}, {z: anglePoint * 8,});
     tl.fromTo([p1.ball.rotation, p1.string.rotation, 
          p2.ball.rotation, p2.string.rotation, 
          p3.ball.rotation, p3.string.rotation, 
          p4.ball.rotation, p4.string.rotation,p5.ball.rotation, p5.string.rotation], 
          {x: 0}, {x: anglePoint * 8,}, '<');
}
function swingTotal3(){
     soundEnabled = true;
     collisionSoundEnabled = false;
     let tl = gsap.timeline({repeat: 0, onComplete: swingTotal4, defaults: {duration: duration, repeat: 0, ease: 'linear'}});

     tl.to([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation,p5.ball.rotation, p5.string.rotation], {z: -anglePoint * 4})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation,p5.ball.rotation, p5.string.rotation], {y: 0}, {y: Math.PI * 6, duration: 10}, )
     tl.to([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation,p5.ball.rotation, p5.string.rotation], {z: 0})


}

function swingTotal4(){
     soundEnabled = true;
     collisionSoundEnabled = false;
     let tl = gsap.timeline({repeat: 0, onComplete: swingTotal6, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}});
     tl.fromTo([p1.ball.rotation, p1.string.rotation, 
          p2.ball.rotation, p2.string.rotation, 
          p3.ball.rotation, p3.string.rotation, 
          p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], 
          {z: 0}, {z: anglePoint * 12,});

     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -anglePoint * 12})

     tl.fromTo([p1.ball.rotation, p1.string.rotation, 
          p2.ball.rotation, p2.string.rotation, 
          p3.ball.rotation, p3.string.rotation, 
          p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], 
          {z: 0}, {z: anglePoint * 12,});
}

function swingTotal5(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal7, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}});
     tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: -0.015, duration: 0.02})
     tl.fromTo([ p4.ball.rotation, p4.string.rotation, p3.ball.rotation, p3.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -anglePoint * 12})
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: -anglePoint * 6}, '<')
     tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: -0.015, duration: 0.02})
     tl.fromTo([
          
          p2.ball.rotation, p2.string.rotation, 
          p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation, ], 
          {z: 0}, {z: anglePoint * 12,});
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: anglePoint * 6}, '<')
     tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02})
}

function swingTotal6(){
     soundEnabled = true;
     collisionSoundEnabled = false;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal5, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}});

     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 12})
     tl.fromTo([p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation, ], {z: 0}, {z: anglePoint * 12}, '<')

     tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, 
          p2.ball.rotation, p2.string.rotation, 
          p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: anglePoint * 12,});   
          tl.fromTo([p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation, ], {z: 0}, {z: -anglePoint * 12}, '<')   
     tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: -0.015, duration: 0.02})
}



function swingTotal7(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal9, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}});

     tl.fromTo([p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: 0.015, duration: 0.02})
     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 12})
     tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: -anglePoint * 12}, '<')
     tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: -anglePoint * 0.5,}, '<'); 
     tl.fromTo([p5.ball.rotation, p5.string.rotation], {x: 0}, {x: anglePoint * 0.5,}, '<'); 
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: anglePoint * 0.015, duration: 0.02}, ); 
     tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: -0.015, duration: 0.02}, '<')

     tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: -anglePoint * 12,}); 
     tl.fromTo([p5.ball.rotation, p5.string.rotation], {x: 0}, {x: anglePoint * 12,}, '<');
     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 0.5}, '<')
     tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: -anglePoint * 0.5}, '<') 
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: anglePoint * 0.015, duration: 0.02}, ); 
     tl.fromTo([p5.ball.rotation, p5.string.rotation], {x: 0}, {x: -0.015, duration: 0.02}, '<')
}



function swingTotal9(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal10, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}});
    
     
     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 10}, )
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 10}, '<')   
     tl.fromTo([p4.ball.rotation, p4.string.rotation,], {x: 0}, {x: -anglePoint * 10,}, '<');
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 10,}, '<');
     
     tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: 0.015, duration: 0.02}, )
     //tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: 0.015, duration: 0.02},'<')
     tl.fromTo([p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02}, '<')
     
}
function swingTotal10(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal11, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}});
    

     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 14}, )
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 10}, '<')        
     tl.fromTo([p4.ball.rotation, p4.string.rotation,], {x: 0}, {x: -anglePoint * 6,}, '<');
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 4,}, '<');
     tl.fromTo([p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02})
     tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: 0.015, duration: 0.02}, '<')
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: 0.015, duration: 0.02},)

     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 4}, )
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 8}, '<')        
     tl.fromTo([p4.ball.rotation, p4.string.rotation,], {x: 0}, {x: -anglePoint * 12,}, '<');
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 14,}, '<');
     tl.fromTo([p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02})
     tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: 0.015, duration: 0.02}, '<')
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: 0.015, duration: 0.02},)

     
}

function swingTotal11(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 1, onComplete: swingTotal12, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}});

     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 12}, )     
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 12}, '<')
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02},);
     tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: -0.015, duration: 0.02}, '<')  

     tl.fromTo([p4.ball.rotation, p4.string.rotation,], {x: 0}, {x: -anglePoint * 12,}, '-=1.02');     
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 12,}, '<');
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02},);
     tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: 0.015, duration: 0.02}, '<')


     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 8}, '-=1.02')     
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 8}, '<')
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02},);
     tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, '<') 

     tl.fromTo([p4.ball.rotation, p4.string.rotation,], {x: 0}, {x: -anglePoint * 8,}, '-=1.02');
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 8,}, '<');
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02},);
     tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: 0.015, duration: 0.02},)

     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 6}, '-=1.02')     
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 6}, '<')
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02},);
     tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: -0.015, duration: 0.02}, '<') 

     tl.fromTo([p4.ball.rotation, p4.string.rotation,], {x: 0}, {x: -anglePoint * 6,}, '-=1.02');
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 6,}, '<');
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02},);
     tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: 0.015, duration: 0.02},'<')

     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 10}, '-=1.02')     
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 10}, '<')
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02},);
     tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, '<') 

     tl.fromTo([p4.ball.rotation, p4.string.rotation,], {x: 0}, {x: -anglePoint * 10,}, '-=1.02');
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 10,}, '<');
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02},);
     tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: 0.015, duration: 0.02}, '<')

     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 5}, '-=1.02')     
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 5}, '<')
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02},);
     tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: -0.015, duration: 0.02}, '<') 

     tl.fromTo([p4.ball.rotation, p4.string.rotation,], {x: 0}, {x: -anglePoint * 5,}, '-=1.02');
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 5,}, '<');
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02},);
     tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: 0.015, duration: 0.02}, '<')

     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 12}, '-=1.02')     
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 12}, '<')
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02},);
     tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: -0.015, duration: 0.02}, '<') 

     tl.fromTo([p4.ball.rotation, p4.string.rotation,], {x: 0}, {x: -anglePoint * 12,}, '-=1.02');
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 12,}, '<');
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02},);
     tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: 0.015, duration: 0.02}, '<')
}

//swing1234/5 1/2345
function swingTotal12(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal13, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})

    tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 12}, )     
    tl.fromTo([p1.ball.rotation, p1.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -anglePoint * 0.5}, '<')
    tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 0.75}, '<')
    tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: -0.015, duration: 0.02}, )

     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 10}, )
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p5.ball.rotation, p5.string.rotation, p4.ball.rotation, p4.string.rotation], {z: 0}, {z: -anglePoint * 7}, '<')
     tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: anglePoint, duration: 0.75}, '<');
     tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, );
   
}
function swingTotal13(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal14, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})

   
     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 10}, )
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p5.ball.rotation, p5.string.rotation, p4.ball.rotation, p4.string.rotation], {z: 0}, {z: anglePoint * 7}, '<')
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint, duration: 0.75}, '<') 
     tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: -0.015, duration: 0.02}, );
    tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 12}, ) 
    tl.fromTo([p1.ball.rotation, p1.string.rotation, p5.ball.rotation, p5.string.rotation, p4.ball.rotation, p4.string.rotation], {z: 0}, {z: anglePoint/2}, '<')
    tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: anglePoint}, '<');
    tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: 0.015, duration: 0.02}, ) 
}
;

// 1/2345
function swingTotal14(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal15, defaults: {duration: duration , repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})

     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: anglePoint * 5}, )        
     tl.fromTo([ p2.ball.rotation, p2.string.rotation,], {z: 0}, {z: anglePoint * 7}, '<')        
     tl.fromTo([ p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: anglePoint * 3}, '<')        
     tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: -anglePoint * 12}, '<');
     tl.fromTo([p5.ball.rotation, p5.string.rotation], {x: 0}, {x: anglePoint * 12}, '<');
     tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: 0.015, duration: 0.02}, );

     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 5}, )        
     tl.fromTo([ p2.ball.rotation, p2.string.rotation,], {z: 0}, {z: -anglePoint * 3}, '<')        
     tl.fromTo([ p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 7}, '<')      
     tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: -anglePoint * 12}, '<');
     tl.fromTo([p5.ball.rotation, p5.string.rotation], {x: 0}, {x: anglePoint * 12}, '<');     
     tl.fromTo([p5.ball.rotation, p5.string.rotation], {x: 0}, {x: -0.015, duration: 0.02}, );
   
}

// 12/345
function swingTotal15(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 1, onComplete: swingTotal18, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})

     
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -0.015, duration: 0.02}, )
     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 12}, )
     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: -0.015, duration: 0.02}, )
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 6}, )
     tl.fromTo([p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: -anglePoint * 4}, '<')
     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: anglePoint * 4}, '<')
     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 0.5, duration: 0.75}, '<')
     tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: -0.015, duration: 0.02}, '<')
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: 0.015, duration: 0.02})


     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 12}, )
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: 0.015, duration: 0.02}, )
     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 4}, )
     tl.fromTo([p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: -anglePoint * 6}, '<')
     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: anglePoint * 4}, '<')
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 0.5}, '<')
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: 0.015, duration: 0.02})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {x: 0}, {x: -0.015, duration: 0.02}, )

     tl.fromTo([p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: -anglePoint * 12},)
     tl.fromTo([p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: 0.015, duration: 0.02}, )
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 4}, )
     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 4}, '<')
     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: anglePoint * 6}, '<')
     tl.fromTo([p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: -anglePoint * 0.5}, '<')
     tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {x: 0}, {x: -0.015, duration: 0.02}, '<')
     tl.fromTo([p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: 0.015, duration: 0.02},)

     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: anglePoint * 12}, )
     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: -0.015, duration: 0.02}, )
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 4}, )
     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 6}, '<')
     tl.fromTo([p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: -anglePoint * 4}, '<')
     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {z: 0}, {z: anglePoint * 0.5}, '<')
     tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: 0.015, duration: 0.02}, '<')
     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: 0.015, duration: 0.02}, )


    
}


// 123/45
function swingTotal18(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal19, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})

     tl.fromTo([ p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 12},)
     tl.fromTo([ p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: -anglePoint * 2}, '<');
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 2}, '<')
     tl.fromTo([ p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: -0.015,duration: 0.02},)
     tl.fromTo([ p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: -0.015,duration: 0.02}, '<')
     
     tl.fromTo([ p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: -anglePoint * 12}, )
     tl.fromTo([ p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: -anglePoint * 2}, '<');
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 2}, '<')
     tl.fromTo([ p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02},)     
     tl.fromTo([ p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: -0.015,duration: 0.02}, '<')
     
     
}


//swing 12/(3)/45
function swingTotal19(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 7, onComplete: swingTotal20, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})

     tl.fromTo([p1.ball.rotation, p1.string.rotation,], {x: 0}, {x: -anglePoint * 10,}, )
     tl.fromTo([ p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: -anglePoint * 12,}, '<')
     tl.fromTo([ p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 12,}, '<');
     tl.fromTo([ p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 12,}, '<');
     tl.fromTo([ p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: -anglePoint * 12,}, '<');
     tl.fromTo([ p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: 0.015, duration: 0.02})
     
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {x: 0}, {x: anglePoint * 10,}, )
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 12,}, '<')
     tl.fromTo([ p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: -anglePoint * 12,}, '<');
     tl.fromTo([ p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: -anglePoint * 12,}, '<');
     tl.fromTo([ p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 12,}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: -0.015, duration: 0.02})
    
}


//swing 1>2/(3)/4<5
function swingTotal20(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal21, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     tl.fromTo([ p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 10,})
     tl.fromTo([ p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 10,}, '<')
     tl.fromTo([ p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: -anglePoint * 4,}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: anglePoint * 4,}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: -0.015, duration: 0.02});
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.015}, )

     tl.fromTo([ p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 4,})
     tl.fromTo([ p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 4,}, '<')
     tl.fromTo([ p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: -anglePoint * 10,}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: anglePoint * 10,}, '<');
     tl.fromTo([ p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: -0.015, duration: 0.02});
     tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.015}, )
}

// 1=(234)=5
function swingTotal21(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal22, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})

     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 12});
     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 12}, '<'); 
     tl.fromTo([ p4.ball.rotation, p4.string.rotation], {x: 0}, {x: -anglePoint * 1}, '<');     
     tl.fromTo([ p3.ball.rotation, p3.string.rotation], {z: 0}, {z: -anglePoint * 1}, '<');    
     tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: 0.015, duration: 0.02});
     tl.fromTo([ p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02}, );
     
     tl.fromTo([ p4.ball.rotation, p4.string.rotation], {x: 0}, {x: -anglePoint * 12});     
     tl.fromTo([ p3.ball.rotation, p3.string.rotation], {z: 0}, {z: -anglePoint * 12}, '<');  
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 1}, '<');
     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 1}, '<');      
     tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: 0.015, duration: 0.02});
     tl.fromTo([ p2.ball.rotation, p2.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02}, );
}

function swingTotal22(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal23, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})

     tl.fromTo([ p4.ball.rotation, p4.string.rotation], {x: 0}, {x: -anglePoint * 12});     
     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 12}, '<'); 
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 1}, '<');
     tl.fromTo([ p3.ball.rotation, p3.string.rotation], {z: 0}, {z: -anglePoint * 1}, '<');    
     tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: 0.015, duration: 0.02});
     tl.fromTo([ p4.ball.rotation, p4.string.rotation], {x: 0}, {x: 0.015, duration: 0.02}); 
     
     tl.fromTo([ p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 12});
     tl.fromTo([ p3.ball.rotation, p3.string.rotation], {z: 0}, {z: -anglePoint * 12}, '<');  
     tl.fromTo([ p4.ball.rotation, p4.string.rotation], {x: 0}, {x: -anglePoint * 1}, '<');     
     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 1}, '<');      
     tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: 0.015, duration: 0.02});
     tl.fromTo([ p5.ball.rotation, p5.string.rotation], {x: 0}, {x: -0.015, duration: 0.02}); 
}
// 12=(3)=45
function swingTotal23(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 2, onComplete: swingTotal24, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})

     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: anglePoint * 5});
     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 12}, '<');
     tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: -anglePoint * 0.6}, '<');
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 0.6}, '<');
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 1}, '<'); 
     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: -0.015, duration: 0.02});


     tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: -anglePoint * 6});
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 6}, '<');
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 12}, '<'); 
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: anglePoint * 0.25}, '<');
     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 1}, '<');    
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: 0.015, duration: 0.02}); 
}
function swingTotal24(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 2, onComplete: swingTotal25, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})

     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: -anglePoint * 5});
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 12}, '<');
     tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: -anglePoint * 0.6}, '<');
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 0.6}, '<');
     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 1}, '<'); 
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: 0.015, duration: 0.02});


     tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: -anglePoint * 6});
     tl.fromTo([p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 6}, '<');
     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 12}, '<'); 
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: anglePoint * 0.25}, '<');
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 1}, '<');    
     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: -0.015, duration: 0.02}); 
}

function swingTotal25(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 2, onComplete: swingTotal26, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})

     tl.fromTo([p1.ball.rotation, p1.string.rotation], {x: 0}, {x: -anglePoint * 5});
     tl.fromTo([p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: -anglePoint * 12}, '<');
     tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: anglePoint * 0.6}, '<');
     tl.fromTo([p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: -anglePoint * 0.6}, '<');
     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: anglePoint * 1}, '<'); 
     tl.fromTo([p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: 0.015, duration: 0.02});


     tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: anglePoint * 6});
     tl.fromTo([p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: -anglePoint * 6}, '<');
     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: anglePoint * 12}, '<'); 
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {x: 0}, {x: anglePoint * 0.25}, '<');
     tl.fromTo([p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: -anglePoint * 1}, '<');    
     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: -0.015, duration: 0.02}); 
}
function swingTotal26(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 2, onComplete: swingTotal27, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})

     tl.fromTo([p1.ball.rotation, p1.string.rotation], {x: 0}, {x: anglePoint * 5});
     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: anglePoint * 12}, '<');
     tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: anglePoint * 0.6}, '<');
     tl.fromTo([p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: -anglePoint * 0.6}, '<');
     tl.fromTo([p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: -anglePoint * 1}, '<'); 
     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: -0.015, duration: 0.02});


     tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: anglePoint * 6});
     tl.fromTo([p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: -anglePoint * 6}, '<');
     tl.fromTo([p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: -anglePoint * 12}, '<'); 
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {x: 0}, {x: -anglePoint * 0.25}, '<');
     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: anglePoint * 1}, '<');    
     tl.fromTo([p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: 0.015, duration: 0.02}); 
}

// 12/3<4<5
function swingTotal27(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal17, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})

     tl.fromTo([p3.ball.rotation, p3.string.rotation, p2.ball.rotation, p2.string.rotation, ], {x: 0}, {x: -anglePoint * 12}, )
     tl.fromTo([p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint * 4}, '<' );
     tl.fromTo([p3.ball.rotation, p3.string.rotation, p2.ball.rotation, p2.string.rotation, ], {x: 0}, {x: anglePoint * 12}, )        
     tl.fromTo([p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -anglePoint * 4}, '<');

     /* tl.fromTo([p4.ball.rotation, p4.string.rotation, ], {z: 0}, {z: anglePoint * 8}, '<');
     tl.fromTo([], {z: 0}, {z: anglePoint * 12}, '<');
     tl.fromTo([p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02}, ); */
}


// 123/45
function swingTotal17(){
     soundEnabled = true;
     collisionSoundEnabled = false;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal28, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})

     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: -anglePoint * 8}, )
     tl.fromTo([ p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint * 12}, '<');
     tl.fromTo([p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02}, )
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: anglePoint * 8}, )
         
     tl.fromTo([ p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -anglePoint * 12}, '<');
     tl.fromTo([p4.ball.rotation, p4.string.rotation,], {z: 0}, {z: -0.015, duration: 0.02}, )
}

// swing
function swingTotal28(){
     soundEnabled = true;
     collisionSoundEnabled = false;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal29, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}});
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -anglePoint * 5})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, 
          p2.ball.rotation, p2.string.rotation, 
          p3.ball.rotation, p3.string.rotation, 
          p4.ball.rotation, p4.string.rotation,
          p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: anglePoint * 5,});
}
// swing
function swingTotal29(){
     soundEnabled = true;
     collisionSoundEnabled = false;
     let tl = gsap.timeline({repeat: 3, onComplete: swingTotal30, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}});
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation,], {z: 0}, {z: -anglePoint * 4})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, 
          p2.ball.rotation, p2.string.rotation, 
          p3.ball.rotation, p3.string.rotation, 
          p4.ball.rotation, p4.string.rotation,
          p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: anglePoint * 4,});
}
// swing
function swingTotal30(){
     soundEnabled = true;
     collisionSoundEnabled = false;
     let tl = gsap.timeline({repeat: 3, onComplete: boomSwing, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}});
     tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation], {z: 0}, {z: -anglePoint * 3})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, 
          p2.ball.rotation, p2.string.rotation, 
          p3.ball.rotation, p3.string.rotation, 
          p4.ball.rotation, p4.string.rotation,
          p5.ball.rotation, p5.string.rotation,], 
          {z: 0}, {z: anglePoint * 3,});
}

function boomSwing(){
     gsap.to(boom.rotation,  {y: -Math.PI, delay: 4, duration: 8, repeat: 0, onComplete: carousel45, ease: 'back' });
}

//carousel
function carousel4(){             
     let tl = gsap.timeline({defaults: {duration: duration}});
     tl.to([p2.ball.rotation, p2.string.rotation], {z: Math.PI / 3 - angleZ}, )
     tl.to([p3.ball.rotation, p3.string.rotation], {z: -Math.PI / 3 + angleZ}, '<')
     tl.to([p4.ball.rotation, p4.string.rotation], {x: -Math.PI / 3 + angleZ}, '<')
     tl.to([p5.ball.rotation, p5.string.rotation], {x: Math.PI / 3 - angleZ}, '<')
     return tl;
}
function carousel5(){
     let tl = gsap.timeline({defaults: {repeat: -1,duration: duration * 12, ease: 'linear'}});
     tl.to(boom.rotation, {y: Math.PI * 25, }, )
     return tl;
}
function carousel45(){
     //gsap.to(camera.position, {z: 112, y: 15} );
     soundEnabled = true;
     angleZ += 0.09;
     let tl = gsap.timeline({repeat: 5, onComplete: carousel45, duration: duration, ease: 'linear'});
     tl.add(carousel4);
     tl.add(carousel5)
};
//carousel45();

///// swing shorts /////
function swingShorts(){
     gsap.to(camera.position, {z: 110, y: 55, x: 55});
    //5
          soundEnabled = false;
          collisionSoundEnabled = true;
          duration = 0.75;

          let tl = gsap.timeline({repeat: 0, delay: 2, defaults: {duration: duration, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}});
     /* */    
      //16
     
          tl.fromTo([p3.ball.rotation, p3.string.rotation, p2.ball.rotation, p2.string.rotation, ], {x: 0}, {x: -anglePoint * 12}, )
          tl.fromTo([p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint * 4}, '<' );
          tl.fromTo([p3.ball.rotation, p3.string.rotation, p2.ball.rotation, p2.string.rotation, ], {x: 0}, {x: anglePoint * 12}, )        
          tl.fromTo([p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -anglePoint * 4}, '<');
     
     //9         
     
          tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 10}, )
          tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 10}, '<')   
          tl.fromTo([p4.ball.rotation, p4.string.rotation,], {x: 0}, {x: -anglePoint * 10,}, '<');
          tl.fromTo([p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 10,}, '<');
          tl.fromTo([p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02})
          tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: 0.015, duration: 0.02}, '<')
          tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: 0.015, duration: 0.02},);

          tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 10}, )
          tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 10}, '<')   
          tl.fromTo([p4.ball.rotation, p4.string.rotation,], {x: 0}, {x: -anglePoint * 10,}, '<');
          tl.fromTo([p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 10,}, '<');
          tl.fromTo([p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02})
          tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: 0.015, duration: 0.02}, '<')
          tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: 0.015, duration: 0.02},)
     
     //10
     
          tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 14}, )
          tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 10}, '<')        
          tl.fromTo([p4.ball.rotation, p4.string.rotation,], {x: 0}, {x: -anglePoint * 6,}, '<');
          tl.fromTo([p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 4,}, '<');
          tl.fromTo([p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02})
          tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: 0.015, duration: 0.02}, '<')
          tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: 0.015, duration: 0.02},)
     
          tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 4}, )
          tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 8}, '<')        
          tl.fromTo([p4.ball.rotation, p4.string.rotation,], {x: 0}, {x: -anglePoint * 12,}, '<');
          tl.fromTo([p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 14,}, '<');
          tl.fromTo([p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: 0.015, duration: 0.02})
          tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: 0.015, duration: 0.02}, '<')
          tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: 0.015, duration: 0.02},)
     
        
     //11
     
                 
     //12
     
         tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 12}, )     
         tl.fromTo([p1.ball.rotation, p1.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -anglePoint * 0.5}, '<')
         tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 0.75}, '<')
         tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: -0.015, duration: 0.02}, )
     
          tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 10}, )
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p5.ball.rotation, p5.string.rotation, p4.ball.rotation, p4.string.rotation], {z: 0}, {z: -anglePoint * 7}, '<')
          tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: anglePoint, duration: 0.5}, '<');
          tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, );
        
     //13
     
        
          tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 10}, )
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p5.ball.rotation, p5.string.rotation, p4.ball.rotation, p4.string.rotation], {z: 0}, {z: anglePoint * 7}, '<')
          tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint, duration: 0.5}, '<') 
          tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: -0.015, duration: 0.02}, );
         tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 12}, ) 
         tl.fromTo([p1.ball.rotation, p1.string.rotation, p5.ball.rotation, p5.string.rotation, p4.ball.rotation, p4.string.rotation], {z: 0}, {z: anglePoint/2}, '<')
         tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: anglePoint}, '<');
         tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: 0.015, duration: 0.02}, ) 
     
    //14
     
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: anglePoint * 5}, )        
          tl.fromTo([ p2.ball.rotation, p2.string.rotation,], {z: 0}, {z: anglePoint * 7}, '<')        
          tl.fromTo([ p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: anglePoint * 3}, '<')        
          tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: -anglePoint * 12}, '<');
          tl.fromTo([p5.ball.rotation, p5.string.rotation], {x: 0}, {x: anglePoint * 12}, '<');
          tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: 0.015, duration: 0.02}, );
     
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 5}, )        
          tl.fromTo([ p2.ball.rotation, p2.string.rotation,], {z: 0}, {z: -anglePoint * 3}, '<')        
          tl.fromTo([ p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 7}, '<')      
          tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: -anglePoint * 12}, '<');
          tl.fromTo([p5.ball.rotation, p5.string.rotation], {x: 0}, {x: anglePoint * 12}, '<');     
          tl.fromTo([p5.ball.rotation, p5.string.rotation], {x: 0}, {x: -0.015, duration: 0.02}, );
        
     //15
     
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -0.015, duration: 0.02}, )
     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 12}, )
     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: -0.015, duration: 0.02}, )
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 6}, )
     tl.fromTo([p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: -anglePoint * 4}, '<')
     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: anglePoint * 4}, '<')
     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 0.5, duration: 0.75}, '<')
     tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: -0.015, duration: 0.02}, '<')
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: 0.015, duration: 0.02})


     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 12}, )
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: 0.015, duration: 0.02}, )
     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 4}, )
     tl.fromTo([p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: -anglePoint * 6}, '<')
     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: anglePoint * 4}, '<')
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 0.5}, '<')
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: 0.015, duration: 0.02})
     tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {x: 0}, {x: -0.015, duration: 0.02}, )

     tl.fromTo([p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: -anglePoint * 12},)
     tl.fromTo([p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: 0.015, duration: 0.02}, )
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 4}, )
     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 4}, '<')
     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: anglePoint * 6}, '<')
     tl.fromTo([p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: -anglePoint * 0.5}, '<')
     tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {x: 0}, {x: -0.015, duration: 0.02}, '<')
     tl.fromTo([p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: 0.015, duration: 0.02},)

     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: anglePoint * 12}, )
     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: -0.015, duration: 0.02}, )
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 4}, )
     tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 6}, '<')
     tl.fromTo([p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: -anglePoint * 4}, '<')
     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {z: 0}, {z: anglePoint * 0.5}, '<')
     tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: 0.015, duration: 0.02}, '<')
     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: 0.015, duration: 0.02}, )

     
         
     
     //18
     
          tl.fromTo([p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 2}, )
          tl.fromTo([ p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 12}, '<')
          tl.fromTo([ p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: -anglePoint * 2}, '<');
          tl.fromTo([ p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: -0.015,duration: 0.02},)
          tl.fromTo([ p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: -0.015,duration: 0.02}, '<')
          
          tl.fromTo([ p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: -anglePoint * 12}, )
          tl.fromTo([ p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: -anglePoint * 2}, '<');
          tl.fromTo([p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 2}, '<')
          tl.fromTo([ p4.ball.rotation, p4.string.rotation,], {x: 0}, {x: 0.015, duration: 0.02},)     
          tl.fromTo([ p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: -0.015,duration: 0.02}, '<')
          
     //19
     
          tl.fromTo([p1.ball.rotation, p1.string.rotation,], {x: 0}, {x: -anglePoint * 10,}, )
          tl.fromTo([ p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: -anglePoint * 12,}, '<')
          tl.fromTo([ p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 12,}, '<');
          tl.fromTo([ p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 12,}, '<');
          tl.fromTo([ p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: -anglePoint * 12,}, '<');
          tl.fromTo([ p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: 0.015, duration: 0.02})
          
          tl.fromTo([p1.ball.rotation, p1.string.rotation], {x: 0}, {x: anglePoint * 10,}, )
          tl.fromTo([ p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 12,}, '<')
          tl.fromTo([ p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: -anglePoint * 12,}, '<');
          tl.fromTo([ p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: -anglePoint * 12,}, '<');
          tl.fromTo([ p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 12,}, '<');
          tl.fromTo([ p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: -0.015, duration: 0.02})
        
     //20
          tl.fromTo([ p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 10,})
          tl.fromTo([ p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 10,}, '<')
          tl.fromTo([ p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: -anglePoint * 4,}, '<');
          tl.fromTo([ p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: anglePoint * 4,}, '<');
          tl.fromTo([ p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: -0.015, duration: 0.02});
          tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.015}, )
     
          tl.fromTo([ p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 4,})
          tl.fromTo([ p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 4,}, '<')
          tl.fromTo([ p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: -anglePoint * 10,}, '<');
          tl.fromTo([ p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: anglePoint * 10,}, '<');
          tl.fromTo([ p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: -0.015, duration: 0.02});
          tl.fromTo([p1.ball.rotation, p1.string.rotation,], {z: 0}, {z: 0.015, duration: 0.015}, )
        
     // 21
          tl.fromTo([ p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 12});
          tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 12}, '<'); 
          tl.fromTo([ p4.ball.rotation, p4.string.rotation], {x: 0}, {x: -anglePoint * 1}, '<');     
          tl.fromTo([ p3.ball.rotation, p3.string.rotation], {z: 0}, {z: -anglePoint * 1}, '<');    
          tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: 0.015, duration: 0.02});
          tl.fromTo([ p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: -0.015, duration: 0.02});
          
          tl.fromTo([ p4.ball.rotation, p4.string.rotation], {x: 0}, {x: -anglePoint * 12});     
          tl.fromTo([ p3.ball.rotation, p3.string.rotation], {z: 0}, {z: -anglePoint * 12}, '<');  
          tl.fromTo([ p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 1}, '<');
          tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 1}, '<');      
          tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: 0.015, duration: 0.02});
          tl.fromTo([ p4.ball.rotation, p4.string.rotation], {x: 0}, {x: 0.015, duration: 0.02}); 
     
     //22
     
          tl.fromTo([ p4.ball.rotation, p4.string.rotation], {x: 0}, {x: -anglePoint * 12});     
          tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 12}, '<'); 
          tl.fromTo([ p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 1}, '<');
          tl.fromTo([ p3.ball.rotation, p3.string.rotation], {z: 0}, {z: -anglePoint * 1}, '<');    
          tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: 0.015, duration: 0.02});
          tl.fromTo([ p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02});   
          
          tl.fromTo([ p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 12});
          tl.fromTo([ p3.ball.rotation, p3.string.rotation], {z: 0}, {z: -anglePoint * 12}, '<');  
          tl.fromTo([ p4.ball.rotation, p4.string.rotation], {x: 0}, {x: -anglePoint * 1}, '<');     
          tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 1}, '<');      
          tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: 0.015, duration: 0.02});
          tl.fromTo([ p5.ball.rotation, p5.string.rotation], {x: 0}, {x: -0.015, duration: 0.02}); 
     
    // 23
     
          tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: anglePoint * 5});
          tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 12}, '<');
          tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: -anglePoint * 0.6}, '<');
          tl.fromTo([p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 0.6}, '<');
          tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 1}, '<'); 
          tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: -0.015, duration: 0.02});
     
     
          tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: -anglePoint * 6});
          tl.fromTo([p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 6}, '<');
          tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 12}, '<'); 
          tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: anglePoint * 0.25}, '<');
          tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 1}, '<');    
          tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: 0.015, duration: 0.02}); 
     
     //24
     
          tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: -anglePoint * 5});
          tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 12}, '<');
          tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: -anglePoint * 0.6}, '<');
          tl.fromTo([p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 0.6}, '<');
          tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 1}, '<'); 
          tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: 0.015, duration: 0.02});
     
     
          tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: -anglePoint * 6});
          tl.fromTo([p5.ball.rotation, p5.string.rotation,], {x: 0}, {x: anglePoint * 6}, '<');
          tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 12}, '<'); 
          tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: anglePoint * 0.25}, '<');
          tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 1}, '<');    
          tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: -0.015, duration: 0.02}); 
      
     //25
     
          tl.fromTo([p1.ball.rotation, p1.string.rotation], {x: 0}, {x: -anglePoint * 5});
          tl.fromTo([p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: -anglePoint * 12}, '<');
          tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: anglePoint * 0.6}, '<');
          tl.fromTo([p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: -anglePoint * 0.6}, '<');
          tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: anglePoint * 1}, '<'); 
          tl.fromTo([p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: 0.015, duration: 0.02});
     
     
          tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: anglePoint * 6});
          tl.fromTo([p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: -anglePoint * 6}, '<');
          tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: anglePoint * 12}, '<'); 
          tl.fromTo([p1.ball.rotation, p1.string.rotation], {x: 0}, {x: anglePoint * 0.25}, '<');
          tl.fromTo([p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: -anglePoint * 1}, '<');    
          tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: -0.015, duration: 0.02}); 
     

      //16
     
      tl.fromTo([p3.ball.rotation, p3.string.rotation, p2.ball.rotation, p2.string.rotation, ], {x: 0}, {x: -anglePoint * 12}, )
      tl.fromTo([p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: anglePoint * 4}, '<' );
      tl.fromTo([p3.ball.rotation, p3.string.rotation, p2.ball.rotation, p2.string.rotation, ], {x: 0}, {x: anglePoint * 12}, )        
      tl.fromTo([p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -anglePoint * 4}, '<');     
  /*       //26
          tl.fromTo([p1.ball.rotation, p1.string.rotation], {x: 0}, {x: anglePoint * 5});
          tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: anglePoint * 12}, '<');
          tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: anglePoint * 0.6}, '<');
          tl.fromTo([p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: -anglePoint * 0.6}, '<');
          tl.fromTo([p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: -anglePoint * 1}, '<'); 
          tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: -0.015, duration: 0.02});
     
     
          tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: anglePoint * 6});
          tl.fromTo([p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: -anglePoint * 6}, '<');
          tl.fromTo([p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: -anglePoint * 12}, '<'); 
          tl.fromTo([p1.ball.rotation, p1.string.rotation], {x: 0}, {x: -anglePoint * 0.25}, '<');
          tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: anglePoint * 1}, '<');    
          tl.fromTo([p4.ball.rotation, p4.string.rotation, ], {x: 0}, {x: 0.015, duration: 0.02}); 
    
             tl.fromTo([ p4.ball.rotation, p4.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -anglePoint * 12})
          tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: -anglePoint * 6}, '<')
          tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: -0.015, duration: 0.02})
          tl.fromTo([ p2.ball.rotation, p2.string.rotation, 
               p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation, ], {z: 0}, {z: anglePoint * 12,});
          tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: anglePoint * 6}, '<')
          tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02});    

          tl.fromTo([ p4.ball.rotation, p4.string.rotation, p3.ball.rotation, p3.string.rotation, p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation], {z: 0}, {z: -anglePoint * 12})
          tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: -anglePoint * 6}, '<')
          tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: -0.015, duration: 0.02})
          tl.fromTo([ p2.ball.rotation, p2.string.rotation, 
               p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation, ], {z: 0}, {z: anglePoint * 12,});
          tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: anglePoint * 6}, '<')
          tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02});             
              
 
          //6
      
          tl.fromTo([ p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 12})
          tl.fromTo([p1.ball.rotation, p1.string.rotation, ], {z: 0}, {z: -anglePoint * 10}, '<')
          tl.fromTo([ p2.ball.rotation, p2.string.rotation,], {z: 0}, {z: -anglePoint * 8}, '<')
          tl.fromTo([p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation, ], {z: 0}, {z: anglePoint * 12}, '<')
     
          tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02})
          tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: anglePoint * 12});   
          tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: anglePoint * 10}, '<');   
          tl.fromTo([ p3.ball.rotation, p3.string.rotation,], {z: 0}, {z: anglePoint * 8}, '<');   
          tl.fromTo([p4.ball.rotation, p4.string.rotation, p5.ball.rotation, p5.string.rotation, ], {z: 0}, {z: -anglePoint * 12}, '<')   
          tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: -0.015, duration: 0.02});
     
          //7
     
          tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 12})
          tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: -anglePoint * 12}, '<')
          tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: -anglePoint * 0.2,}, '<'); 
          tl.fromTo([p5.ball.rotation, p5.string.rotation], {x: 0}, {x: anglePoint * 0.2,}, '<'); 
          tl.fromTo([p1.ball.rotation, p1.string.rotation], {x: 0}, {x: anglePoint * 0.015, duration: 0.02}, ); 
          tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: -0.015, duration: 0.02})
     
          tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: -anglePoint * 12,}); 
          tl.fromTo([p5.ball.rotation, p5.string.rotation], {x: 0}, {x: anglePoint * 12,}, '<');
          tl.fromTo([p2.ball.rotation, p2.string.rotation, ], {z: 0}, {z: anglePoint * 0.2}, '<')
          tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: -anglePoint * 0.2}, '<') 
          tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: anglePoint * 0.015, duration: 0.02}, ); 
          tl.fromTo([p5.ball.rotation, p5.string.rotation], {x: 0}, {x: -0.015, duration: 0.02})
 */  
}

///// Swing Long / time variable /////
let dura = 0;


function swingAction(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, delay: 0, onRepeat: myAction , onComplete: swingAction, defaults: {repeat: 1, duration: duration - dura, yoyo: true}});
         
     tl.fromTo([p2.ball.rotation, p2.string.rotation,], {z: 0}, {z: angle})
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -angle}, '<')
     tl.fromTo([p4.ball.rotation, p4.string.rotation,], {x: 0}, {x: -angle}, '<')
     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: angle}, '<')
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: -0.015, duration: 0.02})
     tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: -0.015, duration: 0.02}, '<')
    
     tl.fromTo([p2.ball.rotation, p2.string.rotation,], {z: 0}, {z: angle * 2})
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -angle * 2}, '<')
     tl.fromTo([p4.ball.rotation, p4.string.rotation,], {x: 0}, {x: -angle * 2}, '<')
     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: angle * 2}, '<')
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: -0.015, duration: 0.02})
     tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, '<')
}

function swingAction2(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({repeat: 3, delay: 0, onRepeat: myAction , onComplete: swingAction2, defaults: {repeat: 1, duration: duration - dura, yoyo: true}});
         
     tl.fromTo([p2.ball.rotation, p2.string.rotation,], {z: 0}, {z: Math.PI / 2 - angle})
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -Math.PI / 2 + angle}, '<')
     tl.fromTo([p4.ball.rotation, p4.string.rotation,], {x: 0}, {x: -Math.PI / 2 + angle}, '<')
     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: Math.PI / 2 - angle}, '<')
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: -0.015, duration: 0.02})
     tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: -0.015, duration: 0.012}, '<')
    
     tl.fromTo([p2.ball.rotation, p2.string.rotation,], {z: 0}, {z: Math.PI / 4 - angle/2})
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -Math.PI / 4 + angle/2}, '<')
     tl.fromTo([p4.ball.rotation, p4.string.rotation,], {x: 0}, {x: -Math.PI / 4 + angle / 2}, '<')
     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: Math.PI / 4 - angle / 2}, '<')
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: -0.015, duration: 0.02})
     tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.012}, '<')
}
function swingAction3(){
     soundEnabled = true;
     collisionSoundEnabled = true;
     let tl = gsap.timeline({ repeat: 1, delay: 0, onRepeat: myAction , onComplete: swingAction3, defaults: {timeScale: 1,repeat: 1, duration: duration - dura, yoyo: true}});
         
     tl.fromTo([p2.ball.rotation, p2.string.rotation,], {z: 0}, {z: Math.PI / 2 - angle})
     tl.fromTo([p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -Math.PI / 2 + angle}, '<')
     tl.fromTo([p4.ball.rotation, p4.string.rotation,], {x: 0}, {x: -Math.PI / 2 + angle}, '<')
     tl.fromTo([p5.ball.rotation, p5.string.rotation, ], {x: 0}, {x: Math.PI / 2 - angle}, '<')
     tl.fromTo([p1.ball.rotation, p1.string.rotation], {z: 0}, {z: -0.015, duration: 0.015})
     tl.fromTo([p2.ball.rotation, p2.string.rotation], {z: 0}, {z: -0.015, duration: 0.02}, '<')
     tl.fromTo([p3.ball.rotation, p3.string.rotation], {z: 0}, {z: 0.015, duration: 0.02}, '<')
     tl.fromTo([p5.ball.rotation, p2.string.rotation], {x: 0}, {x: -0.015, duration: 0.002}, '<')
     tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: 0.015, duration: 0.002}, '<');
     return tl;
}

function myAction(){
     angle += 0.02;
     dura += 0.02;
}

function swingAction4(){
     
          soundEnabled = true;
          collisionSoundEnabled = true;
          let tl = gsap.timeline({repeat: 3, onRepeat: myAction,  onComplete: swingAction4, defaults: {duration: duration - dura, repeat: 1, yoyo: true, ease: 'Power1.easeOutIn'}})
     
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: anglePoint * 5}, )        
          tl.fromTo([ p2.ball.rotation, p2.string.rotation,], {z: 0}, {z: anglePoint * 7}, '<')        
          tl.fromTo([ p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: anglePoint * 3}, '<')        
          tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: -anglePoint * 12}, '<');
          tl.fromTo([p5.ball.rotation, p5.string.rotation], {x: 0}, {x: anglePoint * 12}, '<');
          tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: 0.015, duration: 0.02}, );
     
          tl.fromTo([p1.ball.rotation, p1.string.rotation, p2.ball.rotation, p2.string.rotation, p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 5}, )        
          tl.fromTo([ p2.ball.rotation, p2.string.rotation,], {z: 0}, {z: -anglePoint * 3}, '<')        
          tl.fromTo([ p3.ball.rotation, p3.string.rotation, ], {z: 0}, {z: -anglePoint * 7}, '<')      
          tl.fromTo([p4.ball.rotation, p4.string.rotation], {x: 0}, {x: -anglePoint * 12}, '<');
          tl.fromTo([p5.ball.rotation, p5.string.rotation], {x: 0}, {x: anglePoint * 12}, '<');     
          tl.fromTo([p5.ball.rotation, p5.string.rotation], {x: 0}, {x: -0.015, duration: 0.02}, );
        
     
}

//swingAction();
//swingAction2();
//swingAction3();
//swingAction4();


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
};

function checkCollision(){
     let i = Math.floor(Math.random() * 61);       
     if(soundEnabled){            
          if(target1.containsPoint(points1[i])){
               let index = Math.floor(Math.random() * 21)
               playKey(index);
          gsap.to([rightCubes[index].material, leftCubes[index].material], {opacity: 1, duration: 0.15});
               gsap.to([rightCubes[index].material, leftCubes[index].material], {opacity: 0.4, duration: 1, delay: 0.5});                
          }
          if(target2.containsPoint(points2[i])){
               let index = Math.floor(Math.random() * 21)
               playKey(index);
          gsap.to([rightCubes[index].material, leftCubes[index].material, frontCubes[index].material, backCubes[index].material], {opacity: 1, duration: 0.15});
               gsap.to([rightCubes[index].material, leftCubes[index].material, frontCubes[index].material, backCubes[index].material], {opacity: 0.4, duration: 1, delay: 0.5});                
          }

          if(target3.containsPoint(points3[i]) ){
               let index = Math.floor(Math.random() * 21)
               playKey(index);
          gsap.to([rightCubes[index].material, leftCubes[index].material], {opacity: 1, duration: 0.15});
          gsap.to([rightCubes[index].material, leftCubes[index].material], {opacity: 0.4, duration: 1, delay: 0.5});  
          }   
          if(target4.containsPoint(points4[i])){
               let index = Math.floor(Math.random() * 21)
               playKey(index);
          gsap.to([frontCubes[index].material, backCubes[index].material], {opacity: 1, duration: 0.15});
               gsap.to([frontCubes[index].material, backCubes[index].material], {opacity: 0.4, duration: 1, delay: 0.5});                
          }

          if(target5.containsPoint(points5[i]) ){
               let index = Math.floor(Math.random() * 21)
               playKey(index);
          gsap.to([frontCubes[index].material, backCubes[index].material], {opacity: 1, duration: 0.15});
               gsap.to([frontCubes[index].material, backCubes[index].material], {opacity: 0.4, duration: 1, delay: 0.5});  
          }   
     }     
       
     //console.log(p1.ball.position.y); 
     if(collisionSoundEnabled){            
          if(target2.intersectsBox(target1) && p1.ball.rotation.x == 0 && p2.ball.rotation.x == 0){
                    clap.currentTime = 0;
                    let index = Math.floor(Math.random() * 21);
                    clap.play();
                    
                    gsap.to(balls[index].position, {y: 2, duration: 0.12, ease: 'power0.inOut'});
                         gsap.to(balls[index].position, {y: 0, delay: 0.12, duration: 0.25, ease: 'power0.inOut'});
                         gsap.to(cylinders[index].scale, {y: 2.5, duration: 0.12, ease: 'power0.inOut'});
                         gsap.to(cylinders[index].scale, {y: 1, duration: 0.25, delay: 0.12, ease: 'power0.inOut'});
          }    
          if(target3.intersectsBox(target1) && p1.ball.rotation.x == 0 && p3.ball.rotation.x == 0){
               clap.currentTime = 0;
               let index = Math.floor(Math.random() * 21);
                    clap.play();
                    
                    gsap.to(balls[index].position, {y: 2, duration: 0.12, ease: 'power0.inOut'});
                         gsap.to(balls[index].position, {y: 0, delay: 0.12, duration: 0.25, ease: 'power0.inOut'});
                         gsap.to(cylinders[index].scale, {y: 2.5, duration: 0.12, ease: 'power0.inOut'});
                         gsap.to(cylinders[index].scale, {y: 1, duration: 0.25, delay: 0.12, ease: 'power0.inOut'});
          }    
          if(target4.intersectsBox(target1) && p1.ball.rotation.x == 0 && p4.ball.rotation.z == 0){
               clap.currentTime = 0;
               let index = Math.floor(Math.random() * 21);
                    clap.play();
                    
                    gsap.to(balls[index].position, {y: 2, duration: 0.12, ease: 'power0.inOut'});
                         gsap.to(balls[index].position, {y: 0, delay: 0.12, duration: 0.25, ease: 'power0.inOut'});
                         gsap.to(cylinders[index].scale, {y: 2.5, duration: 0.12, ease: 'power0.inOut'});
                         gsap.to(cylinders[index].scale, {y: 1, duration: 0.25, delay: 0.12, ease: 'power0.inOut'});
          }    
          if(target5.intersectsBox(target1) && p1.ball.rotation.x == 0 && p5.ball.rotation.z == 0){
               clap.currentTime = 0;
               let index = Math.floor(Math.random() * 21);
               clap.play();
               bass[index].play();
               gsap.to(balls[index].position, {y: 2, duration: 0.12, ease: 'power0.inOut'});
               gsap.to(balls[index].position, {y: 0, delay: 0.12, duration: 0.25, ease: 'power0.inOut'});
               gsap.to(cylinders[index].scale, {y: 2.5, duration: 0.12, ease: 'power0.inOut'});
               gsap.to(cylinders[index].scale, {y: 1, duration: 0.25, delay: 0.12, ease: 'power0.inOut'});
          }    
     }
}

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


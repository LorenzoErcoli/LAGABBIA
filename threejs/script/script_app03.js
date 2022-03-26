console.log("miao_script_app03")

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.localClippingEnabled = true;
document.body.appendChild( renderer.domElement)

 
const color = 0xFFFFFF;
const intensity = 0.9;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(400, -800, 600);
const light_2 = new THREE.DirectionalLight(color, intensity);
light_2.position.set(-600, -400, 600);
scene.add(light);
//scene.add(light_2);

camera.position.set(0, 10, 600);

let a = 1;
let x;
let up = true


const clipPlanes = [
				new THREE.Plane( new THREE.Vector3( 1, -1, -1 ), 60 ),
				// new THREE.Plane( new THREE.Vector3( 1, - 1, 0 ), 0 ),
				// new THREE.Plane( new THREE.Vector3( 0, 0, - 1 ), 0 )
			];



const radius = 102;  // ui: radius
const detail = 10;  // ui: detail
const geometry = new THREE.DodecahedronGeometry(radius, detail);
// const material = new THREE.MeshLambertMaterial({
//   color: 0xFFFFFF,    // red (can also use a CSS color string here)
//   //flatShading: false,
//   //wireframe: false,
//   clippingPlanes: clipPlanes,
//   clipIntersection: true,
// });

const material = new THREE.MeshPhysicalMaterial({
  color: 0xFFFFFF,    // red (can also use a CSS color string here)
  //flatShading: false,
  //wireframe: false,
  emissive: 0x000000,
  metalness: 0.5,
  roughness: 0.4,
  clippingPlanes: clipPlanes,
  clipIntersection: true,
});



const radius_2 = 98;  // ui: radius
const detail_2 = 3;  // ui: detail
const geometry_2 = new THREE.DodecahedronGeometry(radius_2, detail_2);
const material_2 = new THREE.MeshStandardMaterial({
  color: 0x8EECC1,    // red (can also use a CSS color string here)
  flatShading: true,
  wireframe: true,
  clippingPlanes: clipPlanes
});


const radius_3 = 70;  // ui: radius
const detail_3 = 2;  // ui: detail
const geometry_3 = new THREE.DodecahedronGeometry(radius_3, detail_3);
const material_3 = new THREE.MeshStandardMaterial({
  color: 0xC65CFF,    // red (can also use a CSS color string here)
  flatShading: true,
  wireframe: false
});




const sfera = new THREE.Mesh(geometry, material);
const sfera_2 = new THREE.Mesh(geometry_2, material_2);
const sfera_3 = new THREE.Mesh(geometry_3, material_3);

scene.add(sfera);
scene.add(sfera_2);
scene.add(sfera_3);

function animate() {
	requestAnimationFrame( animate );
	
	sfera_3.rotation.x += 0.001;
	sfera_3.rotation.y += 0.001;

	sfera_2.rotation.x += 0.005;
	sfera_2.rotation.y += 0.005;

	// let inc = + 0.01

	// if (clipPlanes[0].normal.y = 2) {
	// 	let inc = - 0.01
	// }else{
	// 	let inc = + 0.01
	// }



	// clipPlanes[0].normal.y += inc
	if(up == true){
		
		if (clipPlanes[0].constant > -29){
			clipPlanes[0].constant -= 0.1
		}else{
			up = false}
		}else{
		if (clipPlanes[0].constant < 60){
			clipPlanes[0].constant += 0.1
		}else{
			up = true
		}
	}




	renderer.render( scene, camera);
}

animate()

const helpers = new THREE.Group();
				helpers.add( new THREE.PlaneHelper( clipPlanes[ 0 ], 2, 0xff0000 ) );
				helpers.visible = false;
				scene.add( helpers );

console.log(geometry)
console.log(clipPlanes[0].constant)
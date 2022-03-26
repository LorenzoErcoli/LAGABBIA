console.log("miao_script_app02")

// DISEGNO LINEE


//SETTAGGIO


const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement)


const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1 , 500);
camera.position.set(0,0,100);
camera.lookAt(0,0,0);


const scene = new THREE.Scene()


const material = new THREE.LineBasicMaterial({color: 0x202ef})

const points = []


for (var i = 0; i < 1; i++) {
	

	points.push( new THREE.Vector3(-10, 0+i, 0));
	points.push( new THREE.Vector3(0, 10, 0+i));
	points.push( new THREE.Vector3(10+i, 0, 0+i));

}


const geometry = new THREE.BufferGeometry().setFromPoints(points);

const line = new THREE.Line( geometry, material)


scene.add( line )


function animate() {
	requestAnimationFrame( animate );
	
	line.rotation.x += 0.01;
	line.rotation.y += 0.01;

	renderer.render( scene, camera);
}

animate()
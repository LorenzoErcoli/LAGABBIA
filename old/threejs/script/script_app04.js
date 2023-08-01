<!DOCTYPE html>
<html lang="en">
	<head>
		<title>three.js webgl - geometry - terrain</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
		<link type="text/css" rel="stylesheet" href="main.css">
		<style>
			body {
				background-color: #bfd1e5;
				color: #beff00;
				/*font-family: "Sinistre";*/
				font-family: "Ortica Bold";
			}
			a {
				color: #a06851;
			}

			h1{
				font-size: 100px;
				line-height: 1;
				margin: 20px
			}

			h5{
				font-size: 20px;
				margin: 10px
			}



			.block_text {
				position: absolute;
				top: 40%;
				left: 25%;
				width: 50%;
				text-align: center;
				z-index: 100;
				display:block;

			}
		</style>
	</head>
	<body>

		<div id="container"></div>
		


		<div class = "block_text">
			<h1>FRANA <br> ·</h1>
			<h5>la Gabbia</h5>
		</div>
		


		<script type="module">

			import * as THREE from '../build/three.module.js';

			import Stats from './jsm/libs/stats.module.js';

			import { OrbitControls } from './jsm/controls/OrbitControls.js';
			import { ImprovedNoise } from './jsm/math/ImprovedNoise.js';
			



			let container, stats;

			let camera, controls, scene, renderer;

			let mesh, mesh_2, texture;

			let up = true

			const worldWidth = 256, worldDepth = 300,
				worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;

			let helper;

			const raycaster = new THREE.Raycaster();
			const pointer = new THREE.Vector2();

			const clipPlanes = [
				new THREE.Plane( new THREE.Vector3( 0, -1, 0 ), 1400 ),
				// new THREE.Plane( new THREE.Vector3( 1, - 1, 0 ), 0 ),
				// new THREE.Plane( new THREE.Vector3( 0, 0, - 1 ), 0 )
			];

			init();
			animate();







			function init() {

				container = document.getElementById( 'container' );
				container.innerHTML = '';

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0x000033 );

				const color_light = 0xFFFFFF;
				const intensity = 0.6;
				const light = new THREE.DirectionalLight(color_light, intensity);
				light.position.set(100, 1000, 100);

				scene.add(light);

				camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 10, 20000 );

				controls = new OrbitControls( camera, renderer.domElement );
				controls.minDistance = 1000;
				controls.maxDistance = 10000;


				//controls.maxPolarAngle = Math.PI / 2;

				//

				const data = generateHeight( worldWidth, worldDepth );

				controls.target.y = data[ worldHalfWidth + worldHalfDepth * worldWidth ] + 500;
				camera.position.y = controls.target.y + 2000;
				camera.position.x = 9000;
				controls.update();

				const geometry = new THREE.PlaneGeometry( 10000, 10000, worldWidth - 0, worldDepth - 0 );

				geometry.rotateX( - Math.PI / 2 );

				const vertices = geometry.attributes.position.array;

				for ( let i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {

					vertices[ j + 1 ] = data[ i ] * 10;

				}

				geometry.computeFaceNormals(); // needed for helper
				

				//

				texture = new THREE.CanvasTexture( generateTexture( data, worldWidth, worldDepth ) );
				texture.wrapS = THREE.ClampToEdgeWrapping;
				texture.wrapT = THREE.ClampToEdgeWrapping;

				//mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: texture } ) );

				mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial({
				  color: 0xbeff00,    // red (can also use a CSS color string here)
				  flatShading: true,
				  wireframe: true})				
				);

				mesh_2 = new THREE.Mesh( geometry, new THREE.MeshPhysicalMaterial({
				  color: 0xD8007A,    // red (can also use a CSS color string here)
				  flatShading: true,
				  wireframe: false,
				  clippingPlanes: clipPlanes,
  				  clipIntersection: true,})
				);



				scene.add( mesh );
				mesh_2.position.y = 10
				scene.add( mesh_2 );





				const geometryHelper = new THREE.ConeGeometry( 20, 100, 3 );
				geometryHelper.translate( 0, 50, 0 );
				geometryHelper.rotateX( Math.PI / 2 );
				helper = new THREE.Mesh( geometryHelper, new THREE.MeshNormalMaterial() );
				//scene.add( helper );
				
				container.addEventListener( 'pointermove', onPointerMove );

				stats = new Stats();
				container.appendChild( stats.dom );

				//

				window.addEventListener( 'resize', onWindowResize );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function generateHeight( width, height ) {

				const size = width * height, data = new Uint8Array( size ),
					perlin = new ImprovedNoise(), z = Math.random() * 100;

				let quality = 1;

				for ( let j = 0; j < 4; j ++ ) {

					for ( let i = 0; i < size; i ++ ) {

						const x = i % width, y = ~ ~ ( i / width );
						data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );

					}

					quality *= 5;

				}

				return data;

			}

			function generateTexture( data, width, height ) {

				// bake lighting into texture

				let context, image, imageData, shade;

				const vector3 = new THREE.Vector3( 0, 0, 0 );

				const sun = new THREE.Vector3( 1, 1, 1 );
				sun.normalize();

				const canvas = document.createElement( 'canvas' );
				canvas.width = width;
				canvas.height = height;

				context = canvas.getContext( '2d' );
				context.fillStyle = '#000';
				context.fillRect( 0, 0, width, height );

				image = context.getImageData( 0, 0, canvas.width, canvas.height );
				imageData = image.data;

				for ( let i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {

					vector3.x = data[ j - 2 ] - data[ j + 2 ];
					vector3.y = 2;
					vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
					vector3.normalize();

					shade = vector3.dot( sun );

					//imageData[ i ] = ( 96 + shade * 128 ) * ( 0.5 + data[ j ] * 0.007 );
					//imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
					//imageData[ i + 2 ] = ( shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );

				}

				context.putImageData( image, 0, 0 );

				// Scaled 4x

				const canvasScaled = document.createElement( 'canvas' );
				canvasScaled.width = width * 4;
				canvasScaled.height = height * 4;

				context = canvasScaled.getContext( '2d' );
				context.scale( 4, 4 );
				context.drawImage( canvas, 0, 0 );

				image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
				imageData = image.data;

				for ( let i = 0, l = imageData.length; i < l; i += 4 ) {

					const v = ~ ~ ( Math.random() * 5 );

					imageData[ i ] += v;
					imageData[ i + 1 ] += v;
					imageData[ i + 2 ] += v;

				}

				context.putImageData( image, 0, 0 );

				return canvasScaled;

			}

			//

			function animate() {

				mesh.rotation.y += 0.001;
				mesh_2.rotation.y += 0.001;

				if(up == true){
		
					if (clipPlanes[0].constant > 500){
						clipPlanes[0].constant -= 0.8
					}else{
						up = false}
					}else{
					if (clipPlanes[0].constant < 1500){
						clipPlanes[0].constant += 0.8
					}else{
						up = true
					}


				}

				requestAnimationFrame( animate );

				render();
				stats.update();

			}

			function render() {

				renderer.localClippingEnabled = true
				renderer.render( scene, camera );

			}

			function onPointerMove( event ) {

				pointer.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
				pointer.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
				raycaster.setFromCamera( pointer, camera );

				// See if the ray from the camera into the world hits one of our meshes
				const intersects = raycaster.intersectObject( mesh );

				// Toggle rotation bool for meshes that we clicked
				if ( intersects.length > 0 ) {

					helper.position.set( 0, 0, 0 );
					helper.lookAt( intersects[ 0 ].face.normal );

					helper.position.copy( intersects[ 0 ].point );

				}

			}



			
		</script>

	</body>
</html>

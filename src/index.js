import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


const loader = new GLTFLoader();

loader.load('assets/free_1975_porsche_911_930_turbo.glb', function ( gltf ) {

    function component(argScene) {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xffff00 );
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
        const renderer = new THREE.WebGLRenderer();
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
				renderer.toneMappingExposure = 1;
				renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
    
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        var ambientLight = new THREE.AmbientLight( 0xffffff );
        ambientLight.position.x += 50;

        scene.add( ambientLight );
        argScene.position.y = -1.2;
        scene.add(argScene);
        const light = new THREE.AmbientLight( 0x000000 ); // soft white light
        light.position.x += 1;
        light.position.y += 1;
        
        scene.add( light );

    
        camera.position.z = 5;

        function animate() {
            requestAnimationFrame(animate);
            
            scene.traverse( child => {

                if ( child.material ) child.material.metalness = 0;
            
            } );

            argScene.rotation.y += 0.001;

            light.rotation.x += 0.01;
            light.rotation.y += 0.01;

            renderer.render(scene, camera);
        };
    
        animate();
        
        
    
        return renderer.domElement;
    }

    document.body.appendChild(component(gltf.scene));

}, undefined, function ( error ) {

    console.error( error );

} );


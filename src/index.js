import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import x2 from '@upscalerjs/esrgan-thick/2x';
import Upscaler from "upscaler";
const upscaler = new Upscaler({
    model:x2,
  })
const loader = new GLTFLoader();
const button = document.getElementById('photo');


button.onclick = function(){
    console.log('onclick');
    var showCanvas = document.getElementById('video-canvas');
    upscaler.upscale(showCanvas.toDataURL()).then(upscaledImage => {

        var canvas = document.getElementById('car-canvas');
        const innerWidth = 640;//window.innerWidth;
        const innerHeight = 480;//window.innerHeight;
        const finalDimensions = applyScale(innerHeight, innerWidth, 10)
        canvas.height = finalDimensions.height;
        canvas.width = finalDimensions.width;
        var context = canvas.getContext('2d');
        
        var image = new Image();
        image.height = finalDimensions.height;
        image.width = finalDimensions.width;
        image.onload = function() {
            context.drawImage(image, 0,0,finalDimensions.width,finalDimensions.height);
        };
        image.src = upscaledImage;
        console.log('upscale');
         
    });
};

function applyScale(height, width, scale){

    const selectedHeight = height;
    const selectedWidth = width;

    const pixels = selectedWidth * selectedHeight * scale/100;

    const wRatio = selectedHeight / selectedWidth;
    const hRatio = selectedWidth / selectedHeight;

    const finalWidth = Math.sqrt(pixels / wRatio);
    const finalHeight = Math.sqrt(pixels / hRatio);

    return {
        height: finalHeight,
        width: finalWidth
    }
  }

loader.load('assets/free_1975_porsche_911_930_turbo.glb', function ( gltf) {

    function component(argScene) {
        const innerWidth = 640;//window.innerWidth;
        const innerHeight = 480;//window.innerHeight;

        const finalDimensions = applyScale(innerHeight,innerWidth,5);
        const scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xffff00 );

        const camera = new THREE.PerspectiveCamera(75, finalDimensions.width / finalDimensions.height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            preserveDrawingBuffer: true 
        });
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        renderer.outputEncoding = THREE.sRGBEncoding;
        
        renderer.setSize(finalDimensions.width, finalDimensions.height);
        document.body.appendChild(renderer.domElement);
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
        
        renderer.domElement.id = 'video-canvas';
        return renderer.domElement;
    }

    document.body.appendChild(component(gltf.scene));

}, undefined, function ( error ) {

    console.error( error );

} );


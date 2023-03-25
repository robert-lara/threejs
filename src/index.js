import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as models from '@upscalerjs/esrgan-slim';
import Upscaler from "upscaler";
const upscaler = new Upscaler({
    model: models.x2,
  });
const loader = new GLTFLoader();
const button = document.getElementById('photo');
const canvas = document.getElementById('car-canvas');
canvas.style.backgroundColor = '#ffff00';
const context = canvas.getContext('2d');
const scaleStart = 5; //Resoluition scale animation is rendered with
const scaleEnd = 5; //Resolution scale of Upscaled animation

const finalDimensionsForImage = applyScale(480, 640, scaleEnd)
const finalDimensions = applyScale(480,640,scaleStart);
canvas.height = finalDimensionsForImage.height;
canvas.width = finalDimensionsForImage.width;

button.onclick = function(){

    const videoCanvas = document.getElementById('video-canvas');

    function step(){

        upscaler.upscale(videoCanvas.toDataURL()).then(upscaledImage => {

            var image = new Image(finalDimensionsForImage.width,finalDimensionsForImage.height);
            image.onload = function() {
                context.drawImage(image, 0,0,finalDimensionsForImage.width,finalDimensionsForImage.height);
                window.requestAnimationFrame(step);
            };
            image.src = upscaledImage;
        });

    }

    window.requestAnimationFrame(step);

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

loader.load('assets/carlowres.glb', function ( gltf) {

    function component(argScene) {

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


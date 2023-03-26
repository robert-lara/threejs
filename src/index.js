import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as tf from '@tensorflow/tfjs';
import * as models from '@upscalerjs/esrgan-slim';
import { BloomEffect, EffectComposer, EffectPass, RenderPass, SMAAEffect } from "postprocessing";
import Upscaler from "upscaler";
const upscaler = new Upscaler({
    model: models.x2,
});
const loader = new GLTFLoader();
const button = document.getElementById('photo');
const carCanvas = document.getElementById('car-canvas');
carCanvas.style.backgroundColor = '#ffff00';
const context = carCanvas.getContext('2d');
const resolutionHeight = 720;
const resolutionWidth = 1280;
const scaleStart = 100; //Resoluition scale animation is rendered with
const scaleEnd = 100; //Resolution scale of Upscaled animation
const finalDimensionsForImage = applyScale(resolutionHeight, resolutionWidth, scaleEnd)
const finalDimensions = applyScale(resolutionHeight, resolutionWidth, scaleStart);
carCanvas.height = finalDimensionsForImage.height;
carCanvas.width = finalDimensionsForImage.width;

button.onclick = function () {

    
    function step() {

        upscaler.upscale(document.getElementById('video-canvas').toDataURL()).then(upscaledImage => {

            var image = new Image(finalDimensionsForImage.width, finalDimensionsForImage.height);
            image.onload = function () {

                context.drawImage(image, 0, 0, finalDimensionsForImage.width, finalDimensionsForImage.height);
                window.requestAnimationFrame(step);
            };
            image.src = upscaledImage;
        });

    }

    //window.requestAnimationFrame(step);



};

function applyScale(height, width, scale) {

    const selectedHeight = height;
    const selectedWidth = width;

    const pixels = selectedWidth * selectedHeight * scale / 100;

    const wRatio = selectedHeight / selectedWidth;
    const hRatio = selectedWidth / selectedHeight;

    const finalWidth = Math.sqrt(pixels / wRatio);
    const finalHeight = Math.sqrt(pixels / hRatio);

    return {
        height: finalHeight,
        width: finalWidth
    }
}

loader.load('assets/free_1975_porsche_911_930_turbo.glb', function (gltf) {



    function component(argScene) {

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffff00);

        const camera = new THREE.PerspectiveCamera(75, finalDimensions.width / finalDimensions.height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            antialias: false,
            stencil: false,
            depth: false
        });
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        renderer.outputEncoding = THREE.sRGBEncoding;

        renderer.setSize(finalDimensions.width, finalDimensions.height);
        document.body.appendChild(renderer.domElement);
        var ambientLight = new THREE.AmbientLight(0xffffff, 5);
        ambientLight.position.x += 50;

        scene.add(ambientLight);
        argScene.position.y = -1.2;
        scene.add(argScene);
        const light = new THREE.AmbientLight(0x000000); // soft white light
        light.position.x += 1;
        light.position.y += 1;
        scene.add(light);
        camera.position.z = 5;
        scene.traverse(child => {

            if (child.material) child.material.metalness = 0;

        });

        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        composer.addPass(new EffectPass(camera, new SMAAEffect()));

        

        function animate() {

            argScene.rotation.y += 0.001;
            // renderer.render(scene, camera);
            requestAnimationFrame(animate);
            composer.render();
        };

        requestAnimationFrame(animate);

        renderer.domElement.id = 'video-canvas';
        renderer.domElement.style.height = finalDimensions.height;
        renderer.domElement.style.width = finalDimensions.width;
        return renderer.domElement;
    }

    document.body.appendChild(component(gltf.scene));

    const canvas = document.getElementById('video-canvas');
    const video = document.querySelector('video');

    const stream = canvas.captureStream();
    video.srcObject = stream;

}, undefined, function (error) {

    console.error(error);

});


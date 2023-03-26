# threejs
Sample project used to test and review ideas with threejs

## Compile Application

This command will use webpack to compile the application and place it into the dist/ folder
```
npx webpack 
```

Note: Do not forget to add the dist_index.html file to the dist/ directory and remove the "dist_" from the name. Here is the code incase you want to just make it and not copy it

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Getting Started</title>
    <style>
      video {
        width: 50% !important;
        height: auto !important;
        margin-top: auto;
        margin-bottom: auto;
      }

      #video-canvas, #car-canvas {
        width: 50% !important;
        height: auto !important;
        margin-top: auto;
        margin-bottom: auto;
      }

      html {
        height: 100%;
        width: 100%;
      }

      body{
        display: flex;
        flex-direction: row;
        height: 100%;
        width: 100%;
        justify-content: center;
        vertical-align: middle;
        margin: 0px;
        overflow: hidden;
      }

      canvas {
        border-left: solid 1px black;
      }
      </style>
  </head>
  <body>
    <button id="photo" class="button" hidden>Begin Upscale Animation</button>
    <canvas id="car-canvas" hidden></canvas>
    <video playsinline autoplay muted></video>
   <script src="main.js"></script>
  </body>
</html>
```

To run the application, launch your server and reference the dist directory. You can use Live Server extension with Visual Studio Code

-   Name: Live Server
-   Id: ritwickdey.LiveServer
-   Description: Launch a development local Server with live reload feature for static & dynamic pages
-   Version: 5.7.9
-   Publisher: Ritwick Dey
-   VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer
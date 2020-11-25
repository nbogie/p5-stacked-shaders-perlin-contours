// Master copy at https://github.com/nbogie/p5-stacked-shaders-perlin-contours
// and live at https://p5-stacked-shaders-perlin-contours.netlify.app/

// Inspiration from https://www.instagram.com/p/B_s_qWvhyje/ by Jacob Joaquin
// More documentation here: https://www.notion.so/neillzero/Layers-of-noise-bbb01a3a1b394b04a332adc55b8fbcfa
// 
"use strict";

let myShaders = [];
let myTextures = [];
let numTextures = 8;


let shouldAutoRotate = false;

function preload() {
  // Instantiate the shader multiple times (not sure if this is strictly necessary)
  for (let i = 0; i < numTextures; i++) {
    var s0 = loadShader("shader.vert", "shader.frag");
    myShaders.push(s0);
  }
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent("theContainer");

  const dim = min(width, height);
  for (let i = 0; i < numTextures; i++) {
    myTextures.push(createGraphics(dim, dim, WEBGL));
  }

  let cam = createCamera();
  cam.setPosition(100, -50, 400);
  cam.lookAt(0, 0, 0);
  // debugMode();
}
//Draw a stack of quads (squares in 3d space), each of which will be rendered with an instance of our pixel shader
//We'll parameterise each shader differently (u_time, u_layer) though they are running the same algorithm independently.
//Uniform variables are used for this purpose.

function draw() {
  background("#8fcfd1")
  //#f6efa6

  orbitControl(5, 5, 0.1);
  const dim = min(width, height)
  const time = millis() / 1000.0;

  for (let i = 0; i < numTextures; i++) {
    myTextures[i].shader(myShaders[i]);
    myTextures[i].rect(0, 0, dim, dim);

    myShaders[i].setUniform('u_resolution', [dim, dim]);
    myShaders[i].setUniform('u_time', time);
    myShaders[i].setUniform('u_layer', i);
  }

  noStroke();
  rotateX(-PI * 1.4);
  rotateY(PI);
  const yStep = 40;
  translate(0, -yStep * numTextures * 0.5, 0);

  const sz = 150;
  for (let i = 0; i < numTextures; i++) {
    texture(myTextures[i]);
    quad(
      -sz, 0, sz,
      sz, 0, sz,
      sz, 0, -sz,
      -sz, 0, -sz,
    )

    if (shouldAutoRotate) {
      const angle = i * PI / 16 * map(sin(frameCount / 100), -1, 1, -1, 1);
      rotateY(angle)
    };
    translate(0, 40, 0);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}



function keyPressed() {
  if (key === "r") {
    shouldAutoRotate = !shouldAutoRotate;
  }
}
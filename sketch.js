//"use strict";
let myShaders = [];
let myTextures = [];
let numTextures = 8;

function preload() {
  // load the shader multiple times
  for (let i = 0; i < numTextures; i++) {
    var s0 = loadShader('./shader.vert', './shader.frag')
    myShaders.push(s0);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  const dim = min(width, height);
  for (let i = 0; i < numTextures; i++) {
    myTextures.push(createGraphics(dim, dim, WEBGL));
  }
  setAttributes('antialias', true);
  
  createEasyCam({distance:400});
} 


function draw(){
  background(8);
  noStroke();
  
  ambientLight(50);
  directionalLight(200,200,200, -1,-1,-1);
  pointLight(200,200,200,0,50,150);
  
  ambientMaterial(255);
  const dim = min(width, height)

  for (let i = 0; i < numTextures; i++) {
    const time = millis() / 1000.0;
    myTextures[i].shader(myShaders[i]);
    myTextures[i].rect(0, 0, dim, dim);

    myShaders[i].setUniform('u_resolution', [dim, dim]);
    myShaders[i].setUniform('u_time', time);
    myShaders[i].setUniform('u_layer', i);
  }

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
    translate(0, 40, 0);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

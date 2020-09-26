"use strict";
// a shader variable
let myShaders = [];
let myTextures = [];
let numTextures = 8;

function preload() {
  // load the shader
  console.log("preloading shader")
  for(let i =0; i < numTextures;i++){
    var s0 = loadShader('./shader.vert', './shader.frag')
    console.log(`loaded shader #${i}`)
    myShaders.push(s0);
    console.log(`pushed shader #${i} to list`)
  }
  console.log("done loadShader")
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  const dim = min(width, height);
  for(let i =0 ; i < numTextures; i++){

    myTextures.push(createGraphics(dim, dim, WEBGL));
  }
}

function draw() {
  background("#8fcfd1")
  //#f6efa6

  orbitControl();

  for(let i =0 ; i < numTextures; i++){
    const time = millis() / 1000.0;
    const dim = min(width, height)
    myTextures[i].shader(myShaders[i]);
    myTextures[i].rect(0,0,dim, dim);

    myShaders[i].setUniform('u_resolution', [dim, dim]);
    myShaders[i].setUniform('u_time', time);
    myShaders[i].setUniform('u_layer', i);
  }
    
  strokeWeight(1);
  //stroke(1);
  noStroke();
  //rotateX(-PI*1.4);
  //rotateY(frameCount/30);
  const yStep = 40;
  translate(0, -yStep * numTextures * 0.5, 0);

  const sz = 150;
  for (let i = 0; i < numTextures; i++){
  texture(myTextures[i]);
    quad(
      -sz, 0, sz,
      sz, 0, sz, 
      sz, 0, -sz, 
      -sz, 0, -sz, 
      )
    // rotateY(PI/16)
    translate(0, 40, 0);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
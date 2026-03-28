// Master copy at https://github.com/nbogie/p5-stacked-shaders-perlin-contours
// and live at https://p5-stacked-shaders-perlin-contours.netlify.app/

//TODO: report: setUniform before applying shader gets rubbish error message

// Inspiration from https://www.instagram.com/p/B_s_qWvhyje/ by Jacob Joaquin
// More documentation here: https://www.notion.so/neillzero/Layers-of-noise-bbb01a3a1b394b04a332adc55b8fbcfa
//
// "use strict";

let theShader;
let shouldAutoRotate = false;
const numTextures = 8; //8

async function setup() {
    const canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    canvas.parent("theContainer");
    pixelDensity(1);
    theShader = await loadShader("shader.vert", "shader.frag");
    let cam = createCamera();
    cam.setPosition(100, -50, 400);
    cam.lookAt(0, 0, 0);
    // debugMode();
    // console.log("frag src: ", theShader.fragSrc());
}

//Draw a stack of quads (squares in 3d space), each of which will be rendered with an instance of our pixel shader
//We'll parameterise each shader differently (u_time, u_layer) though they are running the same algorithm independently.
//Uniform variables are used for this purpose.

function draw() {
    background("#8fcfd1");
    push();
    //#f6efa6

    orbitControl(5, 5, 0.3);
    const dim = min(width, height);
    const time = millis() / 1000.0;
    noStroke();
    rotateX(-PI * 1.4);
    rotateY(PI);
    const yStep = 80;
    translate(0, -yStep * numTextures * 0.5, 0);

    const sz = 300;
    for (let i = 0; i < numTextures; i++) {
        shader(theShader);
        theShader.setUniform("u_resolution", [dim, dim]);
        theShader.setUniform("u_time", time);
        theShader.setUniform("u_layer", i);
        quad(-sz, 0, sz, sz, 0, sz, sz, 0, -sz, -sz, 0, -sz);

        if (shouldAutoRotate) {
            const angle = i * PI / 32 * map(sin(millis() / 2000), -1, 1, -1, 1);
            rotateY(angle);
        }
        translate(0, yStep, 0);
    }
    pop();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
    if (key === "r") {
        shouldAutoRotate = !shouldAutoRotate;
    }
}

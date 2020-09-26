#ifdef GL_ES
precision mediump float;
#endif

//Noise functions from this sketch: https://www.shadertoy.com/view/4sfGzS have this license: 
// The MIT License
// Copyright © 2013 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

float hash(vec3 p)  // replace this by something better
{
    p  = fract( p*0.3183099+.1 );
	p *= 17.0;
    return fract( p.x*p.y*p.z*(p.x+p.y+p.z) );
}

float noise( in vec3 x )
{
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
	
    return mix(mix(mix( hash(i+vec3(0,0,0)), 
                        hash(i+vec3(1,0,0)),f.x),
                   mix( hash(i+vec3(0,1,0)), 
                        hash(i+vec3(1,1,0)),f.x),f.y),
               mix(mix( hash(i+vec3(0,0,1)), 
                        hash(i+vec3(1,0,1)),f.x),
                   mix( hash(i+vec3(0,1,1)), 
                        hash(i+vec3(1,1,1)),f.x),f.y),f.z);
}

const mat3 m = mat3( 0.00,  0.80,  0.60,
                    -0.80,  0.36, -0.48,
                    -0.60, -0.48,  0.64 );


float octaveNoise(in vec2 realuv, in float time){
  float f = 0.0;
  //scale
  vec2 uv = realuv * 8.0;
  mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
  f  = 0.7 * noise( vec3(uv, time*0.6)  ); 
  uv = m*uv;    
	f += 0.3 * noise( vec3(uv, time*0.2+100.)  ); 
	return 0.5 + 0.5*f;
}

float findEdgeOfNoise(in float n, in float a, in float b, in float borderWidth){
  float f1 = smoothstep( a, b, n);
	float f2 = smoothstep( b, b+borderWidth, n);
	return f1 - f2;
}

uniform vec2 u_resolution; // This is passed in as a uniform from the sketch.js file
uniform float u_time; // This is passed in as a uniform from the sketch.js file
uniform int u_layer; // makes each shader (layer) distinct

float Line(float v, float ctr, float end){
  return smoothstep(ctr, ctr+end, v);
}
void main() {
  // position of the pixel divided by resolution, to get normalized positions on the canvas
  //vec2 uv = gl_FragCoord.xy / u_resolution.xy / 2.;
  vec2 uv = (gl_FragCoord.xy - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  
  vec4 col = vec4(0.0, 0.0, 0., 0.);

  float time = u_time;

  float layerSpacing = 0.5 / 8.0;

  vec3 plateCol = vec3(0.);
  
  //there is no plate offset in x or y terms, only in 3ds dimension (time)
  //vec2 plateOffset = vec2(0., 3.45-layerSpacing * float(u_layer));

  vec2 apparentUV = 0.3*uv.xy; // + plateOffset;
  //TODO: layers should all be running with the same time input to noise
  float apparentTime = time*1. +  0.3 * float(u_layer);

  //generate noise, find the stepped body of it, find the edge of it.
  float f = octaveNoise(apparentUV, apparentTime);	
  float n1 = smoothstep( 0.79, 0.791, f);
  float n2 = smoothstep(0.681, 0.68, smoothstep( 0.62, 0.621, f));

        
  //float nBorder = findEdgeOfNoise(f, 0.782, 0.79, 0.0001);
  float nBorder1 = findEdgeOfNoise(f, 0.79, 0.791, 0.002);
  float nBorder2 = findEdgeOfNoise(f, 0.62, 0.621, 0.002);

  vec4 c1 = vec4(246, 171, 108, 255)/255.0;
  vec4 c2 = vec4(223, 94, 136, 255)/255.0;
  vec4 c3 = vec4(143, 207, 209, 255)/255.0;
  
  col = mix(col, c1, n1);
  col = mix(col, c2, n2);
  col = mix(col, vec4(0., 0.,  0., 1.0), nBorder1);
  col = mix(col, vec4(0., 0.,  0., 1.0), nBorder2);
  float frame = 0.;
  float edge = 0.98;
  frame += Line(uv.x, edge, 0.01);
  frame += Line(uv.x, -edge, -0.01);
  frame += Line(uv.y, edge, 0.01);
  frame += Line(uv.y, -edge, -0.01);
  
  col = mix(col, vec4(0., 0.,  0., 1.0), frame);
  
  gl_FragColor = col; // R,G,B,A
}

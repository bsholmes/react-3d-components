import react, { useState } from 'react';
import Canvas from '../common/Canvas';
import LimeCat from '../../static/lime-cat.jpg';
import {
  CreateAndLinkProgramWithShaders,
  SphereModel,
  IdentityMatrix,
  ProjectionMatrix,
  ViewMatrix
} from '../common/utils';
import { mat4Mult } from '../common/vectorMath';
import panoVertexShader from '../shaders/panoVertexShader.glsl';
import panoFragmentShader from '../shaders/panoFragmentShader.glsl';

const FLOAT_BYTE_SIZE = 4;
const USHORT_BYTE_SIZE = 2;

export default () => {
  const [indexCount, setIndexCount] = useState(0);
  const draw = (gl) => {
    if (gl === null) {
      alert('WebGL not supported');
    }

    // TODO:
    // any time we set an alpha value for the clear color we need to set the element's opacity to the same value
    // but that won't work if we're actually rendering anything
    // because it will be transparent too

    // is there any way to blend with the elements behind?

    let alpha = 0.5;//(Math.sin(Date.now() / 1000) + 1) / 2;
    gl.clearColor(0, 1, 0, alpha);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.canvas.style.opacity = alpha;

    // draw a sphere with the given image as its texture with a spherical projection
    gl.drawArrays(gl.TRIANGLES, 0, indexCount);
  };

  const init = (gl) => {
    // load program
    const program = CreateAndLinkProgramWithShaders(gl, panoVertexShader, panoFragmentShader);
    gl.useProgram(program);

    // set uniforms, attributes, etc.
    const mvpUniform = gl.getUniformLocation(program, 'uMVP');
    gl.uniformMatrix4fv(
      mvpUniform,
      false,
      mat4Mult(
        ProjectionMatrix(90, 1.5, 0.0001, 100),
        ViewMatrix([0, 0, -1, 0], [0, 0, 0, 0], [0, 1, 0, 0])
      )
    );

    // load model
    const { vertData, indices } = SphereModel();

    // Create array buffer
    const sphereGeoBuffer = gl.createBuffer();
    const indexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, sphereGeoBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertData), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.bindAttribLocation(program, 0, 'aVertPos');
    gl.vertexAttribPointer(0, FLOAT_BYTE_SIZE, gl.FLOAT, false, 4 * FLOAT_BYTE_SIZE, 0);
    // gl.enableVertexAttribArray(1);
    // gl.bindAttribLocation(program, 1, 'aTexCoords');
    // gl.vertexAttribPointer(1, USHORT_BYTE_SIZE, gl.UNSIGNED_SHORT, false, 4 * FLOAT_BYTE_SIZE + 2 * USHORT_BYTE_SIZE, 4);

    setIndexCount(indices.length);

    // load texture
    // get width and height of image
    let img = new Image();
    img.src = LimeCat;

    img.onload = () => {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      const texWidth = this.width;
      const texHeight = this.height;
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texWidth, texHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, img);

      const texUniform = gl.getUniformLocation(program, 'uTex2d');
    };
    

    // bind things
  };

  return <Canvas draw={draw} options={{ contextType: 'webgl', init }}/>;
};
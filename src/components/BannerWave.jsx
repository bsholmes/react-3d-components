import { useState } from 'react';
import Canvas from '../common/Canvas';
import {
  CreateAndLinkProgramWithShaders,
  LoadTexture,
  LoadGeometry,
  getViewWidthHeightAtZ
} from '../common/utils';
import { PlaneModel } from '../common/geometry/proceduralMeshes';
import {
  mat4Mult,
  ProjectionMatrix,
  ViewMatrix,
} from '../common/vectorMath';
import panoVertexShader from '../shaders/panoVertexShader.glsl';
import panoFragmentShader from '../shaders/panoFragmentShader.glsl';

// plane mesh with several horizontal segments
// animate waving

const CAM_POS = [0, 0, -0.1, 0];
const CAM_TARGET = [0, 0, 1, 0];
const CAM_UP = [0, 1, 0, 0];

export default ({ image, ...rest }) => {
  const [indexCount, setIndexCount] = useState(0);
  const [glProgram, setGLProgram] = useState(null);
  const [planeModelVerts, setPlaneModelVerts] = useState([]);

  const draw = (gl) => {
    if (gl === null) {
      window.alert('WebGL not supported');
    }

    // clear to transparent black so we can blend with background elements
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (glProgram) {
      const { width, height } = getViewWidthHeightAtZ(90, gl.canvas.width / gl.canvas.height, 1);

      // animate vert data
      let animatedVerts = [...planeModelVerts];
      const widthScale = (2 / width);
      const heightScale = (1 / height);
      for (let i = 2; i < planeModelVerts.length; i += 6) {
        animatedVerts[i - 2] = planeModelVerts[i - 2] + Math.sin((Date.now() / 500) + planeModelVerts[i - 2] * 0.7 * widthScale) * 0.05;
        animatedVerts[i - 1] = planeModelVerts[i - 1] + Math.sin((Date.now() / 500) + planeModelVerts[i - 1] * 0.7 * heightScale) * 0.05;
        animatedVerts[i] = planeModelVerts[i] + Math.sin(
          ((Date.now() / 500) - 
          (planeModelVerts[i - 2] * 2 * widthScale)) + 
          (planeModelVerts[i - 1] * 0.66 * heightScale)
        ) * 0.25 +
        // smaller ripple
        Math.max(Math.sin(
          (Date.now() / 200) -
          (planeModelVerts[i - 2] * 4 * widthScale)
        ), 0) * 0.1
        ;
      }
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(animatedVerts), gl.STATIC_DRAW);
    }

    // draw a sphere with the given image as its texture with a spherical projection
    gl.drawElements(gl.TRIANGLE_STRIP, indexCount, gl.UNSIGNED_SHORT, 0);
  };

  const init = (gl) => {
    // load program
    // TODO: write shaders that use lighting, and generate normals
    const program = CreateAndLinkProgramWithShaders(gl, panoVertexShader, panoFragmentShader);
    gl.useProgram(program);
    setGLProgram(program);

    // set uniforms, attributes, etc.
    const mvpUniform = gl.getUniformLocation(program, 'uMVP');
    gl.uniformMatrix4fv(
      mvpUniform,
      false,
      new Float32Array(
        mat4Mult(
          ViewMatrix(CAM_POS, CAM_TARGET, CAM_UP),
          ProjectionMatrix(90, gl.canvas.width / gl.canvas.height, 0.00000001, 1000)
        )
      )
    );

    // load model
    // make extents match the view frustum at the given z-pos
    // so the banner matches the canvas size
    const { width, height } = getViewWidthHeightAtZ(90, gl.canvas.width / gl.canvas.height, 1);
    const { vertData, indices } = PlaneModel(18, 18, [width * 1.75, height * 1.5, 1]);

    setPlaneModelVerts(vertData);

    LoadGeometry(gl, program, vertData, indices);

    setIndexCount(indices.length);

    // load texture
    LoadTexture(gl, program, image, 0);
  };

  return <Canvas draw={draw} options={{ contextType: 'webgl', init }} width={400} height={400} {...rest} />;
};
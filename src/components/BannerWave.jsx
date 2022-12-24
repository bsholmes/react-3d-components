import { useState } from 'react';
import Canvas from '../common/Canvas';
import {
  CreateAndLinkProgramWithShaders,
  PlaneModel,
  LoadTexture,
  LoadGeometry
} from '../common/utils';
import {
  IdentityMatrix,
  mat4Mult,
  ProjectionMatrix,
  RotationMatrix,
  ViewMatrix
} from '../common/vectorMath';
import panoVertexShader from '../shaders/panoVertexShader.glsl';
import panoFragmentShader from '../shaders/panoFragmentShader.glsl';

// plane mesh with several horizontal segments
// animate waving

export default ({ image, ...rest }) => {
  const [indexCount, setIndexCount] = useState(0);
  const [glProgram, setGLProgram] = useState(null);
  const draw = (gl) => {
    if (gl === null) {
      window.alert('WebGL not supported');
    }

    // clear to transparent black so we can blend with background elements
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (glProgram) {
      // TODO: only set MVP if it has changed since last draw
      const mvpUniform = gl.getUniformLocation(glProgram, 'uMVP');
      gl.uniformMatrix4fv(
        mvpUniform,
        false,
        new Float32Array(
          mat4Mult(
            ViewMatrix([0, 0, -1, 0], [0, 0, 1, 0], [0, 1, 0, 0]),
            ProjectionMatrix(90, gl.canvas.width / gl.canvas.height, 0.00000001, 1000)
          )
        )
      );
    }

    // draw a sphere with the given image as its texture with a spherical projection
    gl.drawElements(gl.TRIANGLE_STRIP, indexCount, gl.UNSIGNED_SHORT, 0);
  };

  const init = (gl) => {
    // load program
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
          ViewMatrix([0, 0, -1, 0], [0, 0, 1, 0], [0, 1, 0, 0]),
          ProjectionMatrix(90, gl.canvas.width / gl.canvas.height, 0.00000001, 1000)
        )
      )
    );

    // load model
    const { vertData, indices } = PlaneModel(2, 2, [9, 3, 1]);

    LoadGeometry(gl, program, vertData, indices);

    setIndexCount(indices.length);

    // load texture
    LoadTexture(gl, program, image, 0);
  };

  return <Canvas draw={draw} options={{ contextType: 'webgl', init }} width={400} height={400} {...rest} />;
};
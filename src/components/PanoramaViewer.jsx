import { useState, useRef } from 'react';
import Canvas from '../common/Canvas';
import Example360 from '../../static/360_2.jpg';
import {
  CreateAndLinkProgramWithShaders,
  SphereModel,
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

const MOUSE_ROT_SPEED = 0.5;
const Y_ROT_MIN_DEGREES = -75;

export default () => {
  const [indexCount, setIndexCount] = useState(0);
  const [mouseDown, _setMouseDown] = useState(false);
  const [mouseDownPos, _setMouseDownPos] = useState([]);
  const [rotXY, _setRotXY] = useState([0, 0]);
  const [sphereTransformMatrix, _setSphereTransformMatrix] = useState(IdentityMatrix());
  const [glProgram, setGLProgram] = useState(null);

  const mouseDownRef = useRef(mouseDown);
  const setMouseDown = down => {
    mouseDownRef.current = down;
    _setMouseDown(down);
  };

  const mouseDownPosRef = useRef(mouseDownPos);
  const setMouseDownPos = pos => {
    mouseDownPosRef.current = pos;
    _setMouseDownPos(pos);
  };

  const rotXYRef = useRef(rotXY);
  const setRotXY = rot => {
    rotXYRef.current = rot;
    _setRotXY(rot);
  };

  const sphereTransformMatrixRef = useRef(sphereTransformMatrix);
  const setSphereTransformMatrix = mat => {
    sphereTransformMatrixRef.current = mat;
    _setSphereTransformMatrix(mat);
  };

  const mouseDownHandler = (event) => {
    event.preventDefault();
    setMouseDown(true);
    setMouseDownPos([event.clientX, event.clientY]);
  };

  const mouseUpHandler = (event) => {
    setRotXY([
      rotXYRef.current[0] + (event.clientX - mouseDownPosRef.current[0]),
      Math.max(
        rotXYRef.current[1] + (event.clientY - mouseDownPosRef.current[1]),
        Y_ROT_MIN_DEGREES / MOUSE_ROT_SPEED
      )
    ]);
    setMouseDown(false);
  };

  const mouseOutHandler = (event) => {
    if (mouseDownRef.current) {
      setRotXY([
        rotXYRef.current[0] + (event.clientX - mouseDownPosRef.current[0]),
        Math.max(
          rotXYRef.current[1] + (event.clientY - mouseDownPosRef.current[1]),
          Y_ROT_MIN_DEGREES / MOUSE_ROT_SPEED
        )
      ]);
      setMouseDown(false);
    }
  };

  const mouseOverHandler = (event) => {
    if (event.buttons === 1 && event.button === 0) {
      setMouseDown(true);
      setMouseDownPos([event.clientX, event.clientY]);
    }
  };

  const mouseMoveHandler = (event) => {
    if (mouseDownRef.current) {
      // set sphereTransformMatrix rotation by mouse delta
      const dMouse = [
        event.clientX - mouseDownPosRef.current[0],
        event.clientY - mouseDownPosRef.current[1]
      ];

      // don't allow rotation past -75 in x
      setSphereTransformMatrix(
        mat4Mult(
          RotationMatrix((dMouse[0] + rotXYRef.current[0]) * MOUSE_ROT_SPEED, [0, 1, 0]),
          RotationMatrix(Math.max((dMouse[1] + rotXYRef.current[1]) * MOUSE_ROT_SPEED, Y_ROT_MIN_DEGREES), [1, 0, 0])
        )
      );
    }
  };

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
            sphereTransformMatrix,
            mat4Mult(
              ViewMatrix([0, 0, -1, 0], [0, 0, 1, 0], [0, 1, 0, 0]),
              ProjectionMatrix(90, gl.canvas.width / gl.canvas.height, 0.00000001, 1000)
            )
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
          sphereTransformMatrix,
          mat4Mult(
            ViewMatrix([0, 0, -1, 0], [0, 0, 1, 0], [0, 1, 0, 0]),
            ProjectionMatrix(90, gl.canvas.width / gl.canvas.height, 0.00000001, 1000)
          )
        )
      )
    );

    // load model
    const { vertData, indices } = SphereModel(32, 32, 10);

    LoadGeometry(gl, program, vertData, indices);

    setIndexCount(indices.length);

    // load texture
    LoadTexture(gl, program, Example360, 0);

    gl.canvas.addEventListener('mousedown', mouseDownHandler);
    gl.canvas.addEventListener('mouseup', mouseUpHandler);
    gl.canvas.addEventListener('mouseout', mouseOutHandler);
    gl.canvas.addEventListener('mouseover', mouseOverHandler);
    gl.canvas.addEventListener('mousemove', mouseMoveHandler);
  };

  // TODO:
  // accept component(s) in props that can render over the 360 pano
  // converting image space positions to polar coordinate positions
  // so they can be placed over the 360 correctly and can move when the sphere is rotated
  return <Canvas draw={draw} options={{ contextType: 'webgl', init }} width={400} height={400} />;
};

import { useState, useRef } from 'react';
import Canvas from '../common/Canvas';
import {
  CreateAndLinkProgramWithShaders,
  LoadTexture,
  LoadGeometry
} from '../common/utils';
import { SphereModel } from '../common/geometry/proceduralMeshes';
import objLoader from '../common/geometry/objLoader';
import {
  IdentityMatrix,
  mat4Mult,
  ProjectionMatrix,
  ViewMatrix,
  RotationMatrix,
  TranslationMatrix
} from '../common/vectorMath';
import panoVertexShader from '../shaders/panoVertexShader.glsl';
import panoFragmentShader from '../shaders/panoFragmentShader.glsl';

const CAM_POS = [0, 2, -1, 0];
const CAM_TARGET = [0, 2, 1, 0];
const CAM_UP = [0, 1, 0, 0];

const MOUSE_ROT_SPEED = 0.5;

export default ({ model, image, ...rest }) => {
  const [indexCount, setIndexCount] = useState(0);
  const [mouseDown, _setMouseDown] = useState(false);
  const [mouseDownPos, _setMouseDownPos] = useState([]);
  const [rotY, _setRotY] = useState(0);
  const [modelTransformMatrix, _setModelTransformMatrix] = useState(TranslationMatrix([0, 0, 10]));
  const [modelPos, _setModelPos] = useState([0, 0, 0]);
  const [modelTransformDirty, setModelTransformDirty] = useState(true);
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

  const rotYRef = useRef(rotY);
  const setRotY = rot => {
    rotYRef.current = rot;
    _setRotY(rot);
  };

  const modelTransformMatrixRef = useRef(modelTransformMatrix);
  const setModelTransformMatrix = mat => {
    modelTransformMatrixRef.current = mat;
    _setModelTransformMatrix(mat);
  };

  const modelPosRef = useRef(modelPos);
  const setModelPos = pos => {
    modelPosRef.current = pos;
    _setModelPos(pos);
  };

  const mouseDownHandler = (event) => {
    event.preventDefault();
    setMouseDown(true);
    setMouseDownPos([event.clientX, event.clientY]);
  };

  const mouseUpHandler = (event) => {
    setRotY(
      rotYRef.current + (event.clientX - mouseDownPosRef.current[0]),
    );
    setMouseDown(false);
  };

  const mouseOutHandler = (event) => {
    if (mouseDownRef.current) {
      setRotY(
        rotYRef.current + (event.clientX - mouseDownPosRef.current[0])
      );
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
      // set modelTransformMatrix rotation by mouse delta
      const dMouse = [
        event.clientX - mouseDownPosRef.current[0],
        event.clientY - mouseDownPosRef.current[1]
      ];

      setModelTransformMatrix(
        mat4Mult(
          RotationMatrix((dMouse[0] + rotYRef.current) * MOUSE_ROT_SPEED, [0, 1, 0]),
          TranslationMatrix(modelPosRef.current)
        )
      );
      setModelTransformDirty(true);
    }
  };

  const draw = (gl) => {
    if (gl === null) {
      window.alert('WebGL not supported');
    }

    // clear to transparent black so we can blend with background elements
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (glProgram && modelTransformDirty) {
      // only set MVP if it has changed since last draw

      // TODO: change cam pos based on model bounding box size
      const mvpUniform = gl.getUniformLocation(glProgram, 'uMVP');
      gl.uniformMatrix4fv(
        mvpUniform,
        false,
        new Float32Array(
          mat4Mult(
            modelTransformMatrix,
            mat4Mult(
              ViewMatrix(CAM_POS, CAM_TARGET, CAM_UP),
              ProjectionMatrix(90, gl.canvas.width / gl.canvas.height, 0.001, 1000)
            )
          )
        )
      );
      setModelTransformDirty(false);
    }

    gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);
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
    // which formats should we support?
    // obj, glb, fbx?
    // need to be able to support models with and without
          // texcoords, normals, tangents
          // possibly with different idices for each
          // so lets use different buffers for each
    const {
      position,
      texcoord,
      normal,
      min,
      max
    } = objLoader(model);

    const size = [max[0] - min[0], max[1] - min[1], max[2] - min[2]];
    const pos = [0, -size[1] / 2, Math.max(size[0], size[2]) * 1.5]
    setModelPos(pos);

    setModelTransformMatrix(TranslationMatrix(pos));
    setModelTransformDirty(true);

    let vertData = [];
    
    // interlaxe UVs
    for (let i = 0; i < position.length; i += 3) {
      vertData.push(position[i]);
      vertData.push(position[i + 1]);
      vertData.push(position[i + 2]);
      vertData.push(texcoord[i]);
      vertData.push(texcoord[i + 1]);
    }

    const indices = [...Array(position.length / 3).keys()];

    LoadGeometry(gl, program, vertData, indices, 3, 2);

    setIndexCount(indices.length);

    // load texture
    LoadTexture(gl, program, image, 0);

    gl.canvas.addEventListener('mousedown', mouseDownHandler);
    gl.canvas.addEventListener('mouseup', mouseUpHandler);
    gl.canvas.addEventListener('mouseout', mouseOutHandler);
    gl.canvas.addEventListener('mouseover', mouseOverHandler);
    gl.canvas.addEventListener('mousemove', mouseMoveHandler);
  };

  return <Canvas draw={draw} options={{ contextType: 'webgl', init }} width={400} height={400} {...rest} />;
};
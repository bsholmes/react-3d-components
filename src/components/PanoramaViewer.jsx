import react, { useState, useRef   } from 'react';
import Canvas from '../common/Canvas';
// import Example360 from '../../static/360_1.jpg';
import Example360 from '../../static/example_360.jpeg';
import {
  CreateAndLinkProgramWithShaders,
  SphereModel,
  isPowerOfTwo
} from '../common/utils';
import {
  IdentityMatrix,
  mat4Mult,
  ProjectionMatrix,
  RotationMatrix,
  ViewMatrix,
} from '../common/vectorMath';
import panoVertexShader from '../shaders/panoVertexShader.glsl';
import panoFragmentShader from '../shaders/panoFragmentShader.glsl';

const FLOAT_BYTE_SIZE = 4;

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
          RotationMatrix((dMouse[0] + rotXYRef.current[0]) * MOUSE_ROT_SPEED, [0,1,0]),
          RotationMatrix(Math.max((dMouse[1] + rotXYRef.current[1]) * MOUSE_ROT_SPEED, Y_ROT_MIN_DEGREES), [1,0,0])
        )
      );
    }
  };

  const draw = (gl) => {
    if (gl === null) {
      alert('WebGL not supported');
    }

    // TODO:
    // is there any way to blend with the elements behind?

    gl.clearColor(0.2, 0.2, 0.2, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (glProgram) {
      //TODO: only set MVP if it has changed since last draw
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

    // Create array buffer
    const sphereGeoBuffer = gl.createBuffer();
    const indexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, sphereGeoBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertData), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    const vertPosIndex = gl.getAttribLocation(program, "aVertPos");
    gl.enableVertexAttribArray(vertPosIndex);
    gl.vertexAttribPointer(vertPosIndex, 4, gl.FLOAT, false, 6 * FLOAT_BYTE_SIZE, 0);

    const texCoordsIndex = gl.getAttribLocation(program, "aTexCoords");
    gl.enableVertexAttribArray(texCoordsIndex);
    gl.vertexAttribPointer(texCoordsIndex, 2, gl.FLOAT, false, 6 * FLOAT_BYTE_SIZE, 4 * FLOAT_BYTE_SIZE);

    setIndexCount(indices.length);

    // load texture
    // get width and height of image
    let img = new Image();
    img.src = Example360;

    img.onload = () => {
      const texture = gl.createTexture();
      const texWidth = img.width;
      const texHeight = img.height;

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        img
      );

      // WebGL1 has different requirements for power of 2 images
      // vs non power of 2 images so check if the image is a
      // power of 2 in both dimensions.
      if (isPowerOfTwo(texWidth) && isPowerOfTwo(texHeight)) {
        // Yes, it's a power of 2. Generate mips.
        gl.generateMipmap(gl.TEXTURE_2D);
      } else {
        // No, it's not a power of 2. Turn off mips and set
        // wrapping to clamp to edge
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }

      const texUniformIndex = gl.getUniformLocation(program, 'uTex2d');
      
      gl.uniform1i(texUniformIndex, 0);
    };

    gl.canvas.addEventListener('mousedown', mouseDownHandler);
    gl.canvas.addEventListener('mouseup', mouseUpHandler);
    gl.canvas.addEventListener('mouseout', mouseOutHandler);
    gl.canvas.addEventListener('mouseover', mouseOverHandler);
    gl.canvas.addEventListener('mousemove', mouseMoveHandler);
  };

  return <Canvas draw={draw} options={{ contextType: 'webgl', init }} width={400} height={400}/>;
};
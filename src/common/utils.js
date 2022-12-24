import { DEG_TO_RAD } from './vectorMath';
import {
  TEXTURE_SLOTS,
  FLOAT_BYTE_SIZE
} from './constants';

export const isPowerOfTwo = (x) => {
  return (Math.log(x)/Math.log(2)) % 1 === 0;
}

// Creates sphere vertex data given a number of segments and rings
export const SphereModel = (segments, rings, radius) => {
  let vertData = [];
  let indices = [];

  if (segments < 3 || rings < 3) {
    throw new Error("Sphere must have at least 3 segments and rings");
  }

  const dSegment = (180 / segments) * DEG_TO_RAD;
  const dRing = (360 / rings) * DEG_TO_RAD;
  
  for (let i = 0; i <= rings; ++i)
  {
    for (let j = 0; j <= segments; ++j)
    {
      let v = [
        Math.sin(i * dSegment) * Math.cos(j * dRing),
        -Math.cos(i * dSegment),
        Math.sin(i * dSegment) * Math.sin(j * dRing)
      ];

      vertData = [
        ...vertData,
        ...[
          radius * v[0],
          radius * v[1],
          radius * v[2],
          1,
          j / segments,
          i / rings
        ]
      ];

      if ((i * rings + j) === 0) {
        indices = [...indices, (i + 1) * rings + j]; 
      }

      indices = [...indices, i * segments + j];
      indices = [...indices, (i + 1) * segments + j + 1];
    }
  }

  return { vertData, indices };
};

export const PlaneModel = (extent = 1) => {
  // verts and uvs
  vertData = [
    extent,  extent,  0, 1, 1, 1,
    extent,  -extent, 0, 1, 1, 0,
    -extent, -extent, 0, 1, 0, 0,
    -extent, extent,  0, 1, 0, 1
  ];

  indices = [
    1, 2, 0, 3,
  ];
};

// generates a cube mesh at the origin
export const CubeModel = (sideLength) => {
  let halfLength = sideLength / 2;
  let vertData = [
    // front
    halfLength,   -halfLength,   halfLength,  1, 1, 0,
    halfLength,   halfLength,    halfLength,  1, 1, 1,
    -halfLength,  -halfLength,   halfLength,  1, 0, 0,
    -halfLength,  halfLength,    halfLength,  1, 0, 1,

    // left
    -halfLength,  -halfLength,   halfLength,  1, 1, 0,
    -halfLength,  halfLength,    halfLength,  1, 1, 1,
    -halfLength,  -halfLength,   -halfLength, 1, 0, 0,
    -halfLength,  halfLength,    -halfLength, 1, 0, 1,

    // back
    -halfLength,  -halfLength,   -halfLength, 1, 1, 0,
    -halfLength,  halfLength,    -halfLength, 1, 1, 1,
    halfLength,   -halfLength,   -halfLength, 1, 0, 0,
    halfLength,   halfLength,    -halfLength, 1, 0, 1,

    // right
    halfLength,   -halfLength,   -halfLength, 1, 0, 1,
    halfLength,   halfLength,    -halfLength, 1, 1, 1,
    halfLength,   -halfLength,   halfLength,  1, 0, 0,
    halfLength,   halfLength,    halfLength,  1, 1, 0,

    // top
    halfLength,   halfLength,    -halfLength, 1, 1, 0,
    -halfLength,  halfLength,    -halfLength, 1, 1, 1,
    halfLength,   halfLength,    halfLength,  1, 0, 0,
    -halfLength,  halfLength,    halfLength,  1, 0, 1,

    // bottom
    halfLength,   -halfLength,   halfLength,  1, 1, 1,
    -halfLength,  -halfLength,   -halfLength, 1, 1, 0,
    -halfLength,  -halfLength,   halfLength,  1, 0, 0,
    halfLength,   -halfLength,   -halfLength, 1, 0, 1,
  ];
  let indices = [
    0, 1, 2, 3,
    4, 5, 6, 7,
    8, 9, 10, 11,
    12, 13, 14, 15,
    16, 17, 18, 19,
    20, 21, 22, 23
  ];

  // TODO:
  // front, half of left, bottom, back, right, top, second half of left
  return { vertData, indices };
};

export const CreateAndCompileShader = (glContext, shaderSource, shaderType) => {
  const shader = glContext.createShader(shaderType);
  glContext.shaderSource(shader, shaderSource);
  glContext.compileShader(shader);

  let shaderCompileStatus = glContext.getShaderParameter(shader, glContext.COMPILE_STATUS);

  if (!shaderCompileStatus) {
    let shaderInfoLog = glContext.getShaderInfoLog(shader);

    console.error(`shader failed to compile \n\n${shaderInfoLog}`);
  }

  return shader;
};

export const CreateAndLinkProgramWithShaders = (glContext, vertShaderSource, fragShaderSource) => {
  const program = glContext.createProgram();

  let vertexShader = CreateAndCompileShader(glContext, vertShaderSource, glContext.VERTEX_SHADER);
  let fragmentShader = CreateAndCompileShader(glContext, fragShaderSource, glContext.FRAGMENT_SHADER);

  // Attach pre-existing shaders
  glContext.attachShader(program, vertexShader);
  glContext.attachShader(program, fragmentShader);
  
  glContext.linkProgram(program);

  if (!glContext.getProgramParameter(program, glContext.LINK_STATUS)) {
    const info = glContext.getProgramInfoLog(program);
    throw new Error(`Could not compile WebGL program. \n\n${info}`);
  }

  return program;
};

export const LoadTexture = (gl, program, image, textureIndex = 0) => {
  // load texture
  // get width and height of image
  let img = new Image();
  img.src = image;

  img.onload = () => {
    const texture = gl.createTexture();
    const texWidth = img.width;
    const texHeight = img.height;

    gl.activeTexture(TEXTURE_SLOTS[textureIndex]);
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
    
    gl.uniform1i(texUniformIndex, textureIndex);
  };
};

// currently supports 4-component verts interlaced with 2-component UVs
// add normals, tangents, colors, etc?
export const LoadGeometry = (gl, program, vertData, indices) => {
  // Create array buffer
  const geoBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, geoBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertData), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  const vertPosIndex = gl.getAttribLocation(program, "aVertPos");
  gl.enableVertexAttribArray(vertPosIndex);
  gl.vertexAttribPointer(vertPosIndex, 4, gl.FLOAT, false, 6 * FLOAT_BYTE_SIZE, 0);

  const texCoordsIndex = gl.getAttribLocation(program, "aTexCoords");
  gl.enableVertexAttribArray(texCoordsIndex);
  gl.vertexAttribPointer(texCoordsIndex, 2, gl.FLOAT, false, 6 * FLOAT_BYTE_SIZE, 4 * FLOAT_BYTE_SIZE);
};
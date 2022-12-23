import { DEG_TO_RAD } from "./vectorMath";

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
  
  // TODO:
  // has problems with more than 15 segments/rings... why?
  for (let i = 0; i <= rings; ++i)
  {
    for (let j = 0; j <= segments; ++j)
    {
      let v = [
        Math.sin(i * dSegment) * Math.cos(j * dRing),
        -Math.cos(i * dSegment),
        Math.sin(i * dSegment) * Math.sin(j * dRing)
      ];

      // console.log(`(${i}, ${j}) pos: [${v[0]}, ${v[1]}, ${v[2]}]`);
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

      if (((i + 1) * rings + j) === 0) {
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
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

  // TODO: finish sphere geo

  // first vert at the bottom
  // calculate uvs
  vertData = [0, -radius, -radius, -10, 0.5, 0];
  indices = [0];
  // vertData = [...vertData, ...[radius, radius, -radius, 0, 1, 1]];
  // indices = [...indices, 1];
  // vertData = [...vertData, ...[0, radius, -radius, 0, 0.5, 1]];
  // indices = [...indices, 2];

  const dSegment = 180 / segments;
  const dRing = 360 / rings;
  
  for (let i = 0; i < segments; ++i)
  {
    for (let j = 0; j < rings; ++j)
    {
      // one poly per-segment, per-ring
      // the polys at the first and last ring are tris, the rest are quads
      // or we can implement them as quads where several of the verts are in the same spot

      // for each ring evenly divide the verts 
      // sin and cos for positions?
      vertData = [
        ...vertData,
        ...[
          radius * Math.sin(i * dSegment * DEG_TO_RAD) * Math.sin(j * dRing * DEG_TO_RAD),
          radius * Math.cos(j * dRing * DEG_TO_RAD),
          radius * Math.sin(i * dSegment * DEG_TO_RAD) * Math.cos(j * dRing * DEG_TO_RAD) - 10,
          0,
          (j * dRing) / 360,
          (i * dSegment) / 180
        ]
      ];
      indices = [...indices, [i * segments + rings]];
      indices = [...indices, [i + 1 * segments + rings]]; 
      indices = [...indices, [i * segments + rings + 1]]; 
      
    }
  }
  vertData = [...vertData, ...[0, radius, -10, 0, 0.5, 1]];
  indices = [...indices, [segments * rings]];

  // // verts and uvs
  // vertData = [
  //   1, 1, -1, 1, 1, 1,
  //   1, -1, -1, 1, 1, 0,
  //   -1, -1, -1, 1, 0, 0,
  //   -1, 1, -1, 1, 0, 1
  // ];

  // indices = [
  //   1, 2, 0, 3,
  // ];

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
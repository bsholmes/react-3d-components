import {
  vec4Cross,
  vec4Sub,
  vec4Normalize
} from './vectorMath';

// Creates sphere vertex data given a number of segments and rings
export const SphereModel = (segments, rings) => {
  let vertData = [];
  let indices = [];

  // for (let i = 0; i < segments; ++i)
  // {
  //   for (let j = 0; j < rings; ++j)
  //   {
      
  //   }
  // }

  // vertData[0] = { position: [1, 1, 0], texCoord: [1, 1] };
  // vertData[1] = { position: [1, 0, 0], texCoord: [1, 0] };
  // vertData[2] = { position: [0, 0, 0], texCoord: [0, 0] };

  // vertData[0] = 1;
  // vertData[1] = 1;
  // vertData[2] = 0;
  // vertData[3] = 0;
  // vertData[4] = 1;
  // vertData[5] = 1;

  // vertData[6] = 1;
  // vertData[7] = 0;
  // vertData[8] = 0;
  // vertData[9] = 0;
  // vertData[10] = 1;
  // vertData[11] = 0;

  // vertData[12] = 0;
  // vertData[13] = 0;
  // vertData[14] = 0;
  // vertData[15] = 0;
  // vertData[16] = 0;
  // vertData[17] = 0;

  vertData[0] = 10;
  vertData[1] = 10;
  vertData[2] = 0;
  vertData[3] = 0;

  vertData[4] = 10;
  vertData[5] = -10;
  vertData[6] = 0;
  vertData[7] = 0;

  vertData[8] = -10;
  vertData[9] = -10;
  vertData[10] = 0;
  vertData[11] = 0;

  indices[0] = 0;
  indices[1] = 1;
  indices[2] = 2;

  return { vertData, indices };
};

export const IdentityMatrix = () => {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 0
  ];
}

export const ViewMatrix = (camPos, viewPos, upDir) => {
  const forwardVec = vec4Normalize(vec4Sub(camPos, viewPos));
	const s = -vec4Normalize(vec4Cross(forwardVec, upDir));
	const t = vec4Normalize(vec4Cross(forwardVec,s));

  return [
    forwardVec[0], forwardVec[1], forwardVec[2], forwardVec[3],
    s[0], s[1], s[2], s[3],
    t[0], t[1], t[2], t[3],
    -camPos[0], -camPos[1], -camPos[2], -camPos[3]
  ];
};

export const ProjectionMatrix = (fov, aspect, near, far) => {
  const f = 1 / Math.tan(fov/2);
  return [
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) / (near + far), (2 * far * near) / (near - far),
    0, 0, -1, 0
  ];
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
// Creates sphere vertex data given a number of segments and rings
export const SphereModel = (segments, rings) => {

};

export const CreateAndCompileShader = (glContext, shaderSource, shaderType) => {
  const shader = glContext.createShader(shaderType);
  glContext.shaderSource(shader, shaderSource);
  return glContext.compileShader(shader);
};

export const CreateAndLinkProgramWithShaders = (glContext, vertShaderSource, fragShaderSource) => {
  const program = glContext.createProgram();

  let vertexShader = CreateAndCompileShader(glContext, vertShaderSource, glContext.VERTEX_SHADER);
  let fragmentShader = CreateAndCompileShader(glContext, fragShaderSource, glContext.FRAGMENT_SHADER);

  // Attach pre-existing shaders
  glContext.attachShader(program, vertexShader);
  glContext.attachShader(program, fragmentShader);
  
  glContext.linkProgram(program);

  if (!glContext.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = glContext.getProgramInfoLog(program);
    throw new Error(`Could not compile WebGL program. \n\n${info}`);
  }
};
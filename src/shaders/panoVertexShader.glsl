uniform mat4 uMVP;

attribute vec4 aVertPos;
attribute vec2 aTexCoords;

varying vec2 vTexCoords;

void main()
{
  gl_Position = uMVP * aVertPos;
  vTexCoords = aTexCoords;
}
import react from 'react';
import Canvas from '../common/Canvas';
import LimeCat from '../../static/lime-cat.jpg';
import { CreateAndLinkProgramWithShaders } from '../common/utils';
import panoVertexShader from '../shaders/panoVertexShader.glsl';
import panoFragmentShader from '../shaders/panoFragmentShader.glsl';

export default () => {
  const draw = (gl) => {
    if (gl === null) {
      alert('WebGL not supported');
    }

    // TODO:
    // any time we set an alpha value for the clear color we need to set the element's opacity to the same value
    // but that won't work if we're actually rendering anything
    // because it will be transparent too

    // is there any way to blend with the elements behind?

    let alpha = 0.5;//(Math.sin(Date.now() / 1000) + 1) / 2;
    gl.clearColor(0, 1, 0, alpha);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.canvas.style.opacity = alpha;

    // draw a sphere with the given image as its texture with a spherical projection

    
  };

  const init = (gl) => {
    // load program
    CreateAndLinkProgramWithShaders(gl, panoVertexShader, panoFragmentShader);

    // load model

    // load texture
    // get width and height of image
    let img = new Image();
    img.src = LimeCat;

    img.onload = () => {
      let texWidth = this.width;
      let texHeight = this.height;
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texWidth, texHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, img);
    };
    

    // bind things
  };

  return <Canvas draw={draw} options={{ contextType: 'webgl', init }}/>;
};
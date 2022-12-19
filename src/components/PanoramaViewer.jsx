import react from 'react';
import Canvas from '../common/Canvas';
import LimeCat from '../../static/lime-cat.jpg';

export default () => {
  const draw = (gl, image) => {
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

    // load program
    // load model
    // load texture

    // bind things
  };

  return <Canvas draw={(ctx) => draw(ctx, LimeCat)} options={{contextType: 'webgl'}}/>;
};
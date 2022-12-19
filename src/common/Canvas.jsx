import react from 'react';
import useCanvas from './useCanvas';
import { resizeCanvasToDisplaySize } from './canvasUtils';

const _preDraw = (ctx, canvas) => {
  // if (ctx) {
  //   ctx.save();
  //   resizeCanvasToDisplaySize(ctx, canvas);
  //   const { width, height } = ctx.canvas;
  //   ctx.clearRect(0, 0, width, height);
  // }
};

const _postDraw = () => {
  // index++;
  // ctx.restore();
};

export default ({ draw, options = {}, ...rest }) => {

  const canvasRef = useCanvas(draw, {preDraw: _preDraw, postDraw: _postDraw, ...options});

  return <canvas ref={canvasRef} {...rest} />;
};
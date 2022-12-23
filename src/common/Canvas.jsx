import react, { useEffect } from 'react';
import useCanvas from './useCanvas';
import { resizeCanvasToDisplaySize } from './canvasUtils';

const _preDraw = (ctx, canvas) => {
};

const _postDraw = () => {
};

export default ({ draw, options = {}, ...rest }) => {
  const canvasRef = useCanvas(draw, {preDraw: _preDraw, postDraw: _postDraw, ...options});

  return <canvas ref={canvasRef} {...rest} />;
};
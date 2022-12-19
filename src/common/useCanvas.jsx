import { useRef, useEffect } from 'react';

const DEFAULT_CONTEXT_TYPE = '2d';

const useCanvas = (draw, options = {}) => {
  const canvasRef = useRef(null);
  const { contextType, preDraw, postDraw } = options;
  
  useEffect(() => {
    if (canvasRef) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext(contextType || DEFAULT_CONTEXT_TYPE);
      let frameCount = 0;
      let animationFrameId;
      
      const render = () => {
        frameCount++;
        preDraw && preDraw();
        draw(ctx, frameCount);
        postDraw && postDraw();
        animationFrameId = window.requestAnimationFrame(render);
      };
      render();
      
      return () => {
        window.cancelAnimationFrame(animationFrameId);
      };
    }
  }, [draw]);

  useEffect(() => {
    if (canvasRef) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext(DEFAULT_CONTEXT_TYPE);

      // if (ctx) {
      //   // initial draw, transparent rect
      //   ctx.globalAlpha = 0;
      //   ctx.fillStyle = '#000000';
      //   ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      //   ctx.globalAlpha = 1.0;
      // }
    }
  }, [canvasRef]);
  
  return canvasRef;
}

export default useCanvas;
import React from 'react';
import Example360 from '../../static/360_2.jpg';
import PanoramaViewer from './PanoramaViewer';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'PanoramaViewer',
  component: PanoramaViewer
};

export const Pano = () => <PanoramaViewer image={Example360} />;

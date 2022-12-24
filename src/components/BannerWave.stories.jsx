import React from 'react';
import Example360 from '../../static/example_360.jpeg';
import BannerWave from './BannerWave';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'BannerWave',
  component: BannerWave
};

export const Banner = () => <BannerWave image={Example360} />;

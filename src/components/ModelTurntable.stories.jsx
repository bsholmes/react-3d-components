import React from 'react';
import ModelTurntable from './ModelTurntable';
import Walnut from '../../static/walnut.jpg';
import Faucet from '../../static/faucet/faucet_lowPoly.obj';

// model
// texture(s)

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'ModelTurntable',
  component: ModelTurntable
};

export const Turntable = () => <ModelTurntable model={Faucet} image={Walnut} width={300} height={300} />;

import React from 'react';
import { render } from 'react-dom';
import Base from '@blippar/ardp-banner/components/base';
import config from './config';

const assets = [
  config.url('/ardp_generic_ad_300x50-expanded.js'),
];

render(
  <Base
    metrics={config.metrics}
    assets={assets}
    assetSize={0}
    blipparIconSrc={config.url('/assets/blippar-logo.png')}
    loaderImgSrc={config.url('/assets/loader.gif')}
  />,
  document.getElementById('container'));

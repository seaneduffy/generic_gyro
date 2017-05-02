import React from 'react';
import { render } from 'react-dom';
import Ad from '@blippar/ardp-banner/components/ad';
import { gyroAvailable } from '@blippar/ardp-viewer';
import config from './config';

const assets = [
  config.url('/assets/3d/car.obj'),
  config.url('/assets/3d/car.mtl'),
  config.url('/assets/3d/world.obj'),
  config.url('/assets/3d/world.mtl'),
];

const scenes = [
  {
    id: 'default',
    cameraDistance: 0,
    cameraPosition: 'interior',
    models: [
      {
        id: 'car',
        objPath: config.url('/assets/3d/car.obj'),
        mtlPath: config.url('/assets/3d/car.mtl'),
        position: {
          x: 0,
          y: 0,
          z: 0,
        },
        rotation: {
          x: 0, y: Math.PI * 0.9, z: 0,
        },
        scale: 100,
      },
      {
        id: 'world',
        objPath: config.url('/assets/3d/world.obj'),
        mtlPath: config.url('/assets/3d/world.mtl'),
        position: {
          x: 0,
          y: 0,
          z: 0,
        },
        rotation: {
          x: 0, y: 0, z: 0,
        },
        scale: 150,
      },
    ],
  },
];

gyroAvailable().then((available) => {
  scenes.forEach((scene) => {
    if (available) {
      scene.gyro = scene.cameraPosition;
    } else {
      scene.drag = scene.cameraPosition;
    }
  });
  render(
    <Ad
      assets={assets}
      assetSize={328342 + 113339}
      metrics={config.metrics}
      promptImgSrc={config.url('/assets/prompt/cameraPrompt.png')}
      promptYesImgSrc={config.url('/assets/prompt/yes.png')}
      promptNoImgSrc={config.url('/assets/prompt/no.png')}
      viewfinderImgSrc={config.url('/assets/viewfinder.png')}
      loaderImgSrc={config.url('/assets/loader.gif')}
      scenes={scenes}
    />,
    document.getElementById('ad'));
});

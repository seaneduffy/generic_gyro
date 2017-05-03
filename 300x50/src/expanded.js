import React from 'react';
import { render } from 'react-dom';
import Ad from '@blippar/ardp-banner/components/ad';
import { gyroAvailable } from '@blippar/ardp-viewer';
import Camera from '@blippar/ardp-viewer/components/camera';
import Prompt from '@blippar/ardp-banner/components/prompt';
import timeout from '@blippar/ardp-viewer/lib/timeout';
import config from './config';

const assets = [
  config.url('/assets/3d/car.obj'),
  config.url('/assets/3d/car.mtl'),
  config.url('/assets/3d/world.obj'),
  config.url('/assets/3d/world.mtl')];

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
          x: 0, y: Math.PI * 0.85, z: 0,
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
          x: Math.PI * 0.02, y: Math.PI * 0.91, z: 0,
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


  let promptContainer = null;
  let cameraContainer = null;
  let camera = null;
  let ad = null;

  function promptYes() {
    cameraContainer.style.display = 'block';
    promptContainer.style.display = 'none';
    ad.removeModel('default', 'world');
  }

  function promptNo() {
    promptContainer.style.display = 'none';
  }

  render(
    <Ad
      ref={a => ad = a}
      assets={assets}
      assetSize={334 + 328000 + 339 + 114000}
      assetSizeStart={0}
      metrics={config.metrics}
      viewfinderBorderImgSrc={config.url('/assets/viewfinderBorder.png')}
      viewfinderBodyImgSrc={config.url('/assets/viewfinderBody.png')}
      loaderImgSrc={config.url('/assets/loader.gif')}
      scenes={scenes}
    >
      <div
        ref={pc => promptContainer = pc}
        style={{
          display: 'none',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 99,
        }}
      >
        <Prompt
          onYes={() => promptYes()}
          onNo={() => promptNo()}
          background={config.url('/assets/prompt/cameraPrompt.png')}
          yesGraphic={config.url('/assets/prompt/yes.png')}
          noGraphic={config.url('/assets/prompt/no.png')}
        />
      </div>
      <div
        ref={cc => cameraContainer = cc}
        style={{
          display: 'none',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      >
        <Camera
          ref={c => camera = c}
        />
      </div>
    </Ad>,
    document.getElementById('ad'));

  camera.cameraAvailable().then(() => {
    timeout(5000, () => {
      promptContainer.style.display = 'block';
    });
  });
  
});

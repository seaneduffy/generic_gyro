import metrics from '@blippar/ardp-viewer/lib/metrics';
import { onResize } from '@blippar/ardp-viewer/lib/ardp-resize';
import config from './config';

document.addEventListener('DOMContentLoaded', () => {

  metrics.setBaseUrl(config.metrics.url);

  const ctaSrc = config.url('/assets/banner-300x50.jpg');
  const closeBtnSrc = config.url('/assets/closeBtn.png');
  const experienceSrc = config.url('/expanded.html');
  const closeBtnStyle = {
    zIndex: 999,
    width: '32px',
    height: '32px',
    position: 'absolute',
    top: '1px',
    right: '0px',
    padding: '9px',
  };
  const scripts = document.getElementsByTagName('script');
  const index = scripts.length - 1;
  const banner = document.createElement('img');
  const closeButton = document.createElement('img');
  const adFrame = document.createElement('iframe');
  const adDiv = document.createElement('div');
  const windowDimensions = {};

  let container = scripts[index].parentNode;
  const body = document.body;
  let content = null;
  let sFlag = false;
  let inExp = false;
  let outerFrame = null;
  let origWidth = 0;
  let origHeight = 0;
  let expandable = true;

  const expandBanner = function (styleFlag) {
    let w = windowDimensions.innerWidth;
    let h = windowDimensions.innerHeight;

    if ((window.orientation === 90 || window.orientation === -90) && w < h) {
      const tempHeight = h;
      h = w;
      w = tempHeight;
    }

    if (styleFlag) {
      content.style.width = `${w}px`;
      content.style.height = `${h}px`;
    } else {
      content.width = w;
      content.height = h;
    }

    adFrame.height = h;
    adFrame.width = w;
    adDiv.style.height = h;
    adDiv.style.width = w;
  };

  const createIframe = function (expSrc, closeFlag) {
    banner.style.display = 'none';
    adFrame.src = expSrc;
    if (closeFlag) {
      adDiv.appendChild(closeButton);
    } else {
      body.appendChild(closeButton);
    }
    body.appendChild(adDiv);
  };

  const collapseBanner = function (styleFlag) {
    if (styleFlag) {
      content.style.width = `${origWidth}px`;
      content.style.height = `${origHeight}px`;
    } else {
      content.width = origWidth;
      content.height = origHeight;
    }
  };

  const cleanUp = function (closeFlag) {
    if (closeFlag) {
      adDiv.removeChild(closeButton);
    } else {
      body.removeChild(closeButton);
    }
    body.removeChild(adDiv);
    banner.style.display = 'inline';
  };

  metrics.send('50006', config.metrics.campaign, config.metrics.creative, config.metrics.id, config.metrics.publisher);

  banner.src = ctaSrc;

  closeButton.src = closeBtnSrc;
  Object.keys(closeBtnStyle).forEach((prop) => {
    closeButton.style[prop] = closeBtnStyle[prop];
  });

  adFrame.style.width = '100%';
  adFrame.style.height = '100%';
  adFrame.style.overflow = 'hidden';
  adFrame.style.border = 'none';
  adFrame.frameborder = '0px';
  adFrame.id = 'adFrame';

  adDiv.style.position = 'relative';
  adDiv.appendChild(adFrame);

  try {
    const frames = parent.document.getElementsByTagName('iframe');
    if (frames.length > 0) {
      for (let i = 0; i < frames.length; i += 1) {
        if (frames[i].width !== '100%') {
          outerFrame = frames[i];
          break;
        }
      }
    } else {
      outerFrame = frames[0];
    }
  } catch (e) {
    expandable = false;
    container = document.getElementsByTagName('html')[0];
  }

  if (expandable) {
    if (outerFrame) {
      origWidth = outerFrame.width;
      origHeight = outerFrame.height;
      content = outerFrame;

      banner.addEventListener('click', () => {
        metrics.send('50007', config.metrics.campaign, config.metrics.creative, config.metrics.id, config.metrics.publisher);
        expandBanner(sFlag, false);
        createIframe(experienceSrc, sFlag);
        inExp = true;
      }, false);

      closeButton.addEventListener('click', () => {
        metrics.send('50014', config.metrics.campaign, config.metrics.creative, config.metrics.id, config.metrics.publisher);
        collapseBanner(content, sFlag);
        cleanUp(sFlag);
        inExp = false;
      }, false);
    } else {
      sFlag = true;
      origWidth = container.width;
      origHeight = container.height;
      content = adFrame;

      banner.addEventListener('click', () => {
        metrics.send('50007', config.metrics.campaign, config.metrics.creative, config.metrics.id, config.metrics.publisher);
        expandBanner(sFlag, false);
        createIframe(experienceSrc, sFlag);
        inExp = true;
      }, false);

      closeButton.addEventListener('click', () => {
        metrics.send('50014', config.metrics.campaign, config.metrics.creative, config.metrics.id, config.metrics.publisher);
        collapseBanner(sFlag);
        cleanUp(sFlag);
        inExp = false;
      }, false);
    }

    container.appendChild(banner);

    onResize((dimensions) => {
      Object.keys(dimensions).forEach((prop) => {
        windowDimensions[prop] = dimensions[prop];
      });
      if (inExp) {
        setTimeout(() => {
          expandBanner(sFlag, true);
        }, 300);
      }
    });
  } else {
    container.insertBefore(banner, container.firstChild);
  }
});

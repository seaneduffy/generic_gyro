import env_config from '../.tmp/config';

const config = {
  url_root: '/',
  url(path) {
    let p = path;
    if (this.url_root.endsWith('/') && path.startsWith('/')) {
      p = p.substring(1);
    }
    return this.url_root + p;
  },
  metrics: {
    url: 'http://google.com',
    campaign: '0',
    creative: '1',
    id: '2',
    publisher: '3',
  },
};

Object.keys(env_config).forEach((key) => {
  config[key] = env_config[key];
});

export default config;

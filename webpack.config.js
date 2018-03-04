module.exports = env => {
  switch (env.target) {
    default:
    case 'renderer':
      return require('./webpack/config.renderer');
    case 'main':
      return require('./webpack/config.main');
  }
};

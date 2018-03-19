module.exports = (env, argv) => {
  process.env.NODE_ENV = argv.mode;
  switch (env.target) {
    default:
    case 'renderer':
      return require('./webpack/config.renderer');
    case 'main':
      return require('./webpack/config.main');
  }
};

module.exports = (env, argv) => {
  switch (env.target) {
    default:
    case 'renderer':
      return require('./webpack/config.renderer')(env, argv);
    case 'main':
      return require('./webpack/config.main')(env, argv);
  }
};

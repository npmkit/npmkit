module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: process.env.NODE_ENV === 'test' ? 'commonjs' : false,
        targets: { electron: '3' },
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    process.env.NODE_ENV === 'development' && 'react-hot-loader/babel',
    ['babel-plugin-root-import', { rootPathSuffix: 'app/src' }],
    'babel-plugin-react-require',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
  ].filter(Boolean),
};

import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from './webpack/renderer.development';

const app = express();
const compiler = webpack(config);
const PORT = 3000;

app.use(webpackDevMiddleware(compiler, {
	publicPath: config.output.publicPath,
	noInfo: true,
	stats: {
		colors: true
	}
}));

app.use(webpackHotMiddleware(compiler));

/* eslint-disable no-console */
app.listen(PORT, 'localhost', (error) => {
	if (error) {
		console.error(error);

		return;
	}

	console.log(`Listening at http://localhost:${PORT}`);
});
/* eslint-enable no-console */

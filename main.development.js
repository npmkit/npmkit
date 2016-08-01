import App from './app';

if (process.env.NODE_ENV === 'development') {
	require('electron-debug')(); // eslint-disable-line global-require
}

const app = App.run();

// Keep only instance of app
if (app.isShouldQuit()) {
	App.quit();
}

import { setAppProtocol } from './MainProcessUtils';
import RootApplication from './RootApplication';

if (process.env.NODE_ENV === 'development') {
	require('electron-debug')(); // eslint-disable-line global-require
}

setAppProtocol();

// Keep only instance of root app
if (RootApplication.run().isShouldQuit()) {
	RootApplication.quit();
}

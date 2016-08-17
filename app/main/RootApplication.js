import path from 'path';
import { app, BrowserWindow } from 'electron';

/**
 * @type {boolean}
 */
const isMacOS = process.platform === 'darwin';

/**
 * @type {boolean}
 */
let canQuite = false;

/**
 * @param {string} url
 * @return {boolean}
 */
// function isValidUrl (url) {
// 	let isUrl = false;
//
// 	try {
// 		new URL(url); // eslint-disable-line no-new
// 		isUrl = true;
// 	} catch (error) {
// 		isUrl = false;
// 	}
//
// 	return isUrl;
// }

/**
 * Global Application class
 */
export default class RootApplication {

	/**
	 * @type {?RootApplication}
	 */
	static instance = null;

	/**
	 * @type {?Object}
	 */
	window = null;

	/**
	 * @type {boolean}
	 */
	loaded = false;

	/**
	 * @type {Array<string>}
	 */
	urlQueue = [];

	/**
	 * Quite whole app
	 */
	static quit () {
		app.quit();
	}

	/**
	 * @return {RootApplication}
	 */
	static run () {
		if (RootApplication.instance === null) {
			RootApplication.instance = new RootApplication();
		}

		return RootApplication.instance;
	}

	/**
	 * Creates new app instance
	 */
	constructor () {

		// Open urls on hot start on macOS
		app.on('open-url', (event, url) => {
			event.preventDefault();

			this.openUrl(url);
		});

		// Quite app once all windows are closed
		app.on('window-all-closed', () => {
			if (process.platform !== 'darwin') {
				RootApplication.quit();
			}
		});

		// Show window on macOS once clicked in Dock
		app.on('activate', () => {
			this.window.show();
		});

		// Allow to quite app on macOS
		app.on('before-quit', () => {
			canQuite = true;
		});

		// Create window once app is ready
		app.on('ready', () => {
			const window = new BrowserWindow({
				show: false
			});

			const htmlPath = path.resolve(
				__dirname,
				process.env.NODE_ENV === 'development' ? '../renderer' : 'build',
				'app.html'
			);

			window.loadURL(`file://${htmlPath}`);

			// Show and focus on app one loaded
			window.webContents.once('did-finish-load', () => {
				this.showAndFocus();
				this.loaded = true;

				// Open urls on cold start on macOS
				this.flushUrlQueue();
			});

			// Prevent window being closed on macOS
			window.on('close', (event) => {
				if (isMacOS && !canQuite) {
					event.preventDefault();
					window.hide();
				}
			});

			window.on('closed', () => {
				this.window = null;
			});

			// Open dev tools if required
			if (process.env.NODE_ENV === 'development') {
				window.openDevTools();
			}

			this.window = window;
		});
	}

	/**
	 * Opens dev tools
	 */
	openDevTools () {
		this.window.openDevTools();
	}

	/**
	 * Shows and sends focus to app
	 */
	showAndFocus () {
		this.window.show();
		this.window.focus();
	}

	/**
	 * @return {boolean}
	 */
	isShouldQuit () {
		return app.makeSingleInstance(commandLine => {

			// Open url on hot start on Windows
			this.openUrl(commandLine[1]);

			// Focus on window
			if (this.loaded) {
				if (this.window.isMinimized()) {
					this.window.restore();
				}

				this.showAndFocus();
			}
		});
	}

	/**
	 * Opens protocol url
	 *
	 * @todo(sbekrin) fix url check
	 */
	openUrl (url) {
		// if (!isValidUrl(url)) {
		// 	return;
		// }

		this.urlQueue.push(url);
		this.flushUrlQueue();
	}

	/**
	 * Opens urls in queue
	 */
	flushUrlQueue () {
		if (!this.loaded) {
			return;
		}

		while (this.urlQueue.length) {
			this.window.webContents.send('protocol-open', this.urlQueue.pop());
		}
	}
}

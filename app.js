import { app, BrowserWindow } from 'electron';
import { name as protocol } from './package.json';

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
export default class App {

	/**
	 * @type {?App}
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
	 * @type {boolean}
	 */
	canQuite = false;

	/**
	 * Registers `npmkit://` protocol
	 */
	static setDefaultProtocol () {
		if (!app.isDefaultProtocolClient(protocol)) {
			app.setAsDefaultProtocolClient(protocol);
		}
	}

	/**
	 * Quite whole app
	 */
	static quit () {
		app.quit();
	}

	/**
	 * @return {App}
	 */
	static run () {
		if (App.instance === null) {
			App.instance = new App();
		}

		App.setDefaultProtocol();

		return App.instance;
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
				App.quit();
			}
		});

		// Show window on macOS once clicked in Dock
		app.on('activate', () => {
			this.window.show();
		});

		// Allow to quite app on macOS
		app.on('before-quite', () => {
			this.canQuite = true;
		});

		// Create window once app is ready
		app.on('ready', () => {
			const window = new BrowserWindow({
				show: false
			});

			window.loadURL(`file://${__dirname}/${process.env.NODE_ENV === 'development' ? 'app' : 'dist'}/app.html`);

			// Show and focus on app one loaded
			window.webContents.on('ready-to-show', () => {
				this.showAndFocus();
				this.loaded = true;

				// Open urls on cold start on macOS
				this.flushUrlQueue();
			});

			// Prevent window being closed on macOS
			window.on('close', (event) => {
				if ((process.platform !== 'darwin') ||
					(process.platform === 'darwin' && this.canQuite)) {
					this.window = null;
				} else {
					event.preventDefault();
					window.hide();
				}
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

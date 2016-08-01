import path from 'path';
import chromedriver from 'chromedriver';
import webdriver from 'selenium-webdriver';
import electronPath from 'electron-prebuilt';

chromedriver.start(); // on port 9515
process.on('exit', chromedriver.stop);

const delay = time => new Promise(resolve => setTimeout(resolve, time));

describe('main window', function spec () {
	before(async () => {
		await delay(1000);

		this.driver = new webdriver.Builder()
			.usingServer('http://localhost:9515')
			.withCapabilities({
				chromeOptions: {
					binary: electronPath,
					args: [ `app=${path.resolve()}` ]
				}
			})
			.forBrowser('electron')
			.build();
	});

	after(async () => {
		await this.driver.quit();
	});
});

import electron from 'electron';

const { remote } = electron;
const { Menu, MenuItem } = remote;

export default class ContextMenu {
	menu = null;

	constructor () {
		this.menu = new Menu();
	}

	itemIf (condition = true, label, callback = () => null, options = {}) {
		if (condition === true) {
			this.item(label, callback, options);
		}

		return this;
	}

	item (label, callback = () => null, options = {}) {
		this.menu.append(new MenuItem({
			...options,
			label,
			click: () => callback()
		}));

		return this;
	}

	separator () {
		this.menu.append(new MenuItem({ type: 'separator' }));

		return this;
	}

	sub (label, menu) {
		this.menu.append(new MenuItem({
			label,
			type: 'submenu',
			submenu: menu.build()
		}));
	}

	build () {
		return this.menu;
	}
}

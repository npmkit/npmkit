import installExtension, {
	REACT_DEVELOPER_TOOLS,
	REDUX_DEVTOOLS
} from 'electron-devtools-installer';

export function installDevTools () {
	installExtension(REACT_DEVELOPER_TOOLS);
	installExtension(REDUX_DEVTOOLS);
}

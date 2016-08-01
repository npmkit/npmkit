import React from 'react';
import { createDevTools } from 'redux-devtools';
import DockMonitor from 'redux-devtools-dock-monitor';
import Inspector from 'redux-devtools-inspector';

export default createDevTools(
	<DockMonitor
		changePositionKey='ctrl-q'
		defaultIsVisible={false}
		toggleVisibilityKey='ctrl-h'
	>
		<Inspector />
	</DockMonitor>
);

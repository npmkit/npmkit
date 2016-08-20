import { remote } from 'electron';

const { app } = remote;

export const APP_NAME = app.getName();
export const APP_VERSION = app.getVersion();

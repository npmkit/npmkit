import os from 'os';

import { name } from '../../package.json';

const HOME_DIRECTORY = os.homedir();

export const META_DIRECTORY = `${HOME_DIRECTORY}/.${name}`;
export const META_PROJECTS_FILE = 'projects.json';
export const META_CONFIG_FILE = 'config.json';
export const PACKAGE_JSON_FILE = 'package.json';
export const NODE_MODULES_DIRECTORY = 'node_modules';
export const NPM_EXECUTABLE_NAME = os.type() === 'Windows_NT' ? 'npm.cmd' : 'npm';

import { remote } from 'electron';

const userHomePath = remote.app.getPath('home');

export default function formatPath(inputPath = '') {
  return inputPath.replace(userHomePath, '~');
}

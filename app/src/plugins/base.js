import { join, dirname } from 'path';
import preferences from '~/preferences';

const PLUGINS_DIR = '.npmkit_plugins';

export default function getPluginsDir(mod) {
  const base = join(dirname(preferences.path), PLUGINS_DIR);
  return mod ? join(base, 'node_modules', mod) : base;
}

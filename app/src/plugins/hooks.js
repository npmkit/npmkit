import preferences from '~/preferences';
import get from './get';

export default function getPluginHooks(name) {
  return preferences
    .get('plugins')
    .map(get)
    .map(plugin => (plugin.hasOwnProperty(name) ? plugin[name] : false))
    .filter(Boolean);
}

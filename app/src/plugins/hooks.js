import preferences from '~/preferences';
import base from './base';

export default function getPluginHooks(name) {
  return preferences
    .get('plugins')
    .map(name => __non_webpack_require__(base(name)))
    .map(plugin => (plugin.hasOwnProperty(name) ? plugin[name] : false))
    .filter(Boolean);
}

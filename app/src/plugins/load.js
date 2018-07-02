import install from './install';
import getPluginsDir from './base';

export default async function loadPlugin(pluginName) {
  let mod;
  try {
    mod = __non_webpack_require__(getPluginsDir(pluginName));
  } catch (reason) {
    if (/Cannot find module/.test(reason.toString())) {
      mod = await install(pluginName);
    } else {
      throw reason;
    }
  }
  return mod.default ? mod.default : mod;
}

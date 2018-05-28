const path = require('path');
const fs = require('fs-extra');

// Update package version inside of app's package.json
module.exports = async ({ pkgRoot }, version) => {
  const basePath = path.resolve(pkgRoot || '.', 'app');
  const pkgJsonPath = path.join(basePath, 'package.json');
  const pkgJsonData = require(pkgJsonPath);
  const nextPkgJsonData = { ...pkgJsonData, version };
  const options = { spaces: 2, EOL: '\n' };
  await fs.writeJson(pkgJsonPath, nextPkgJsonData, options);
};

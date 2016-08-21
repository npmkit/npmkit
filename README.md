![npmkit logo](https://github.com/sergeybekrin/npmkit/raw/master/.github/npmkit-logo.png)
# npmkit

Control your npm chaos with ease

[![Linux Build Status](https://img.shields.io/travis/sergeybekrin/npmkit/master.svg)](https://travis-ci.org/sergeybekrin/npmkit)
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/sergeybekrin/npmkit?svg=true)](https://ci.appveyor.com/project/sergeybekrin/npmkit/branch/master)
[![Dependencies status](https://img.shields.io/david/sergeybekrin/npmkit.svg?maxAge=2592000?style=plastic)](https://david-dm.org/sergeybekrin/npmkit)
[![devDependencies status](https://img.shields.io/david/dev/sergeybekrin/npmkit.svg?maxAge=2592000?style=plastic)](https://david-dm.org/sergeybekrin/npmkit?type=dev)
[![License](https://img.shields.io/github/license/sergeybekrin/npmkit.svg?maxAge=2592000)](https://github.com/sergeybekrin/npmkit/blob/master/LICENSE.md)

## About

npmkit is a cross-platform GUI app built with [Electron](https://github.com/electron/electron),
[React](https://github.com/facebook/react) and [Redux](https://github.com/reactjs/redux). So far
it allows to add existing projects to it, edit package.json info, run scripts and manage dependencies.

## Building and packaging

To build production bundle use:
```
npm run build
```

To start built bundle use:
```
npm run start
```

To make executables for all possible systems use:
```
npm run dist-all
```

Also, OS-specific `npm run dist-win`, `npm run dist-linux` and `npm run dist-macos` tasks available.

## Development

Run this command to start both development server and Electron dev instance. Please note, that while development
app name and version would be taken from `electron` (ex-`electron-prebuilt`) package.
```
npm run dev
```

This project is originally based on [electron-react-boilerplate](https://github.com/chentsulin/electron-react-boilerplate) project.

## CI Integration
Currently Travis CI and AppVeyor are enabled to run builds.
Automatic deployment is disabled due too CI configuration limitations and done manually.

## Testing

To run unit tests use:
```
npm run test
```

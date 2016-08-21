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

Built production bundle located under ./dist
To build it yourself run:
```
npm run build
```

And to run production electron app use:
```
npm run start
```

Packaged and executable app located under ./releases/%platform%/%architecture%/
To create it yourself for current platform use:
```
npm run package
```

Or, if you wish to build for all possible platforms, run:
```
npm run package-all
```

## Development

For development process you'll need both webpack server and electron
instance. It's easier to keep track of errors by running next commands
in separate terminal tabs/windows:

Run hot reload server:
```
npm run hot-server
```

Run electron instance:
```
npm run start-hot
```

This project based on [electron-react-boilerplate](https://github.com/chentsulin/electron-react-boilerplate) project.

## Testing

To run unit tests use:
```
npm run test
```

## Features roadmap

- [x] Add or remove projects
- [x] Quick search projects
- [x] Edit project info
- [x] Run and stop tasks
- [ ] Run tasks under sudo
- [ ] Add or edit tasks
- [x] View dependencies
- [x] Update or install dependencies
- [x] Basic dependency search
- [ ] *epic* Full dependency search
- [x] Handle npmkit://install protocol action
- [ ] Handle npmkit://install-dev protocol action
- [ ] Handle npmkit://create protocol action
- [ ] Handle npmkit://clone protocol action
- [ ] Separate modules view
- [ ] *epic* New project wizard
- [ ] *epic* Move redux-store to main process and make sub-apps to use different browser windows
- [ ] *epic* Add npm-specific actions (publish, version bump, etc.)
- [ ] Add unit tests
- [ ] Add e2e tests

import { app } from 'electron';

if (global.process.env.NODE_ENV === 'test') {
  // Point userData to temp directory
  app.setPath('userData', app.getPath('temp'));
  // Make sure visual snapshots are the same on CI
  app.commandLine.appendSwitch('high-dpi-support', 'true');
  app.commandLine.appendSwitch('force-device-scale-factor', '2');
}

import { mount } from 'enzyme';
import { Provider } from 'unstated';

const mockedElectron = {
  remote: {
    app: {
      getPath() {
        return '/fake/path';
      },
    },
  },
  ipcRenderer: {
    on() {},
    send() {},
  },
};

const mockedStore = class MockedStore {
  set() {}
  get() {}
};

describe('<Projects />', () => {
  beforeAll(() => {
    jest.mock('electron', () => mockedElectron);
    jest.mock('electron-store', () => mockedStore);
  });

  afterAll(() => {
    jest.unmock('electron');
    jest.unmock('electron-store');
  });

  it('matches snapshot', () => {
    const AppContainer = require('~/common/app-container').default;
    const Projects = require('./').default;
    expect(
      mount(
        <Provider inject={[new AppContainer()]}>
          <Projects />
        </Provider>
      ).html()
    ).toMatchSnapshot();
  });
});

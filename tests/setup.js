global.console = {
  log: jest.fn(), // console.log are ignored in tests
  warn: jest.fn(),
  error: jest.fn(),
};

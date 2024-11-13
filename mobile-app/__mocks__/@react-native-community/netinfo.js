export default {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    fetch: jest.fn().mockResolvedValue({ isConnected: true }),
    configure: jest.fn(),
  };
  
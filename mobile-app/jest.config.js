module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^react-native-gesture-handler$':
      '<rootDir>/__mocks__/react-native-gesture-handler.js',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': 'identity-obj-proxy',
    'react-native-vector-icons/(.*)':
      '<rootDir>/__mocks__/react-native-vector-icons.js',
  },
  transform: {
    '^.+\\.(js|ts|tsx)$': 'babel-jest',
  },
  testPathIgnorePatterns: ['/node_modules/', '/build/'],

  coverageThreshold: {
    global: {
      lines: 90,
    },
  },

  testTimeout: 10000,

  coverageReporters: ['text', 'lcov'],
};

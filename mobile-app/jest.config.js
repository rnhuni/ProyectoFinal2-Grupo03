module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^react-native-gesture-handler$':
      '<rootDir>/__mocks__/react-native-gesture-handler.js',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss)$': 'identity-obj-proxy', // Unificación de CSS y SCSS
    'react-native-vector-icons/(.*)':
      '<rootDir>/__mocks__/react-native-vector-icons.js',
  },
  setupFiles: ['<rootDir>/__mocks__/react-native-fs.js'],
  transform: {
    '^.+\\.(js|ts|tsx)$': 'babel-jest',
  },

  testPathIgnorePatterns: ['/node_modules/', '/build/'],

  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/hooks/',         
    'Schema\\.ts$',    
  ],

  coverageThreshold: {
    global: {
      lines: 90,
    },
  },

  testTimeout: 40000,

  coverageReporters: ['text', 'lcov'],

  maxWorkers: 2,

  verbose: false,
};

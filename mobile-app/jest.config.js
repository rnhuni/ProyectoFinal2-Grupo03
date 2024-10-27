module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^react-native-gesture-handler$':
      '<rootDir>/__mocks__/react-native-gesture-handler.js',
    // Mapea imágenes a un módulo vacío
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
    // Mapea otros activos según sea necesario
    '\\.(css|less)$': 'identity-obj-proxy',
    'react-native-vector-icons/(.*)':
      '<rootDir>/__mocks__/react-native-vector-icons.js',
  },
  transform: {
    // Transforma los archivos .js y .ts para Jest
    '^.+\\.(js|ts|tsx)$': 'babel-jest',
  },
  testPathIgnorePatterns: ['/node_modules/', '/build/'], // Ignorar node_modules y build

  // Configuración de umbrales de cob ertura
  coverageThreshold: {
    global: {
      lines: 90,
    },
  },
};

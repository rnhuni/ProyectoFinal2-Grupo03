// __mocks__/react-native-fs.js

const RNFS = {
  writeFile: jest.fn(() => Promise.resolve('File written')),
  readFile: jest.fn(() => Promise.resolve('File content')),
  exists: jest.fn(() => Promise.resolve(true)),
  mkdir: jest.fn(() => Promise.resolve('Directory created')),
  // Agrega más funciones según sea necesario
};

export default RNFS;

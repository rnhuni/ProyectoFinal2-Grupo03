export default {
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: {
      lines: 90
    },
  },
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/hooks/",
    "Schema\\.ts$"
  ],
};

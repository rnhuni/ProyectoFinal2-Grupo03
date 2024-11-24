export default {
  coverageReporters: ["text-summary", "html", "lcov"],
  coverageThreshold: {
    global: {
      lines: 80
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

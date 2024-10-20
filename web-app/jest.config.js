export default {
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  collectCoverage: true, // Habilita la recolección de cobertura
  coverageReporters: ["text", "lcov"], // Agrega 'lcov' para generar el reporte en HTML
  coverageDirectory: "coverage", // Directorio donde se guardará la cobertura
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}", // Define los archivos de los cuales se recopila cobertura
    "!src/**/*.d.ts", // Excluye archivos de declaración
  ],
};

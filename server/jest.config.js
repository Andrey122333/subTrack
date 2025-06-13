module.exports = {
  collectCoverage: true,
  coverageReporters: ['lcov', 'text'],
  collectCoverageFrom: ['src/**/*.js'],
  testEnvironment: 'node',
//   coverageThreshold: {
//     global: {
//       lines: 80
//     }
//   }
};

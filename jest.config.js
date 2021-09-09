/* eslint-env node */
module.exports = {
  "roots": [
    "<rootDir>/tests"
  ],
  "testMatch": [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "preset": "ts-jest/presets/js-with-ts-esm",
  "transformIgnorePatterns": [
    "node_modules/(?!ts2gas/.*)"
  ]
}

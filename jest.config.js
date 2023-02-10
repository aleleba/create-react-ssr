module.exports = {
  setupFilesAfterEnv: ['<rootDir>/setupTest.ts'],
  "testEnvironment": "jsdom",
  moduleNameMapper: {
    "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/src/__mocks__/fileMock.ts",
    "@components": "<rootDir>/src/frontend/components/",
    "@styles": "<rootDir>/src/frontend/styles/",
    "@config": "<rootDir>/config/",
    "\\.(css|sass|scss|less)$": "identity-obj-proxy"
  },
};
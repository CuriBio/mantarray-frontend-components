module.exports = {
  globalSetup: "<rootDir>/jest.setup-nuxt-store.js", //  (Eli 2/24/20) adapted from https://medium.com/@brandonaaskov/how-to-test-nuxt-stores-with-jest-9a5d55d54b28
  setupFilesAfterEnv: [
    "<rootDir>/node_modules/@curi-bio/frontend-test-utils/src/jest.setup-failure-on-warnings.js",
    "<rootDir>/tests/setup.js",
  ], // (Eli 3/2/20) adapted from https://medium.com/@chris.washington_60485/vue-jest-properly-catch-unhandledpromiserejectionwarning-and-vue-warn-errors-in-jest-unit-tests-fcc45269146b
  moduleNameMapper: {
    // we can use "@/components/item.vue" to access components in a simpler way
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/tests/unit/__mocks__/file_mock.js",
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "typeface-roboto": "identity-obj-proxy", // adapted from https://www.gitmemory.com/issue/facebook/jest/8605/505507227
    "typeface-muli": "identity-obj-proxy", // adapted from https://www.gitmemory.com/issue/facebook/jest/8605/505507227
    "typeface-anonymous-pro": "identity-obj-proxy",
  },
  moduleDirectories: ["node_modules"],

  // the file types we want jest to accept
  moduleFileExtensions: [
    "js",
    "json",
    // tell Jest to handle `*.vue` files
    "vue",
    "ts",
    "tsx",
  ],
  // transformations we want jest to apply
  transform: {
    // process `*.vue` files with `vue-jest`
    "^.+\\.vue$": "vue-jest",
    // process js files with jest
    "^.+\\.js$": "babel-jest",
    ".+\\.(css|styl|less|sass|scss)$": "jest-transform-css",
    // process assets with transform stub
    ".+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$": "jest-transform-stub",
  },
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.ubuntu_codebuild_cache/"],
  // we will use this to create snapshot tests
  snapshotSerializers: ["jest-serializer-vue"],
  // used for jsdom to mimic a real browser with a real url
  testURL: "http://localhost/",
  // we should collect coverage
  collectCoverage: true,
  // set a directory for coverage cache
  coverageDirectory: "<rootDir>/tests/__coverage__",

  // test logging
  testResultsProcessor: "./node_modules/jest-html-reporter",

  // set patterns to ignore for coverage
  coveragePathIgnorePatterns: ["/node_modules", "test_utils", "/.nuxt", "/dist", "/.ubuntu_codebuild_cache"],
};

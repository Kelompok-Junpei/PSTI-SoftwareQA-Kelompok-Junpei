const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');

setHeadlessWhen(process.env.HEADLESS);

setCommonPlugins();

/** @type {CodeceptJS.MainConfig} */
exports.config = {
  tests: './tests/e2e/**/*_test.js',
  output: './tests/output',
  helpers: {
    Playwright: {
      url: 'https://npcstore.vercel.app',
      show: true,
      browser: 'chromium',
      windowSize: '1280x720',
      waitForTimeout: 15000,
      waitForAction: 500,
      waitForNavigation: 'networkidle0'
    }
  },
  include: {
    I: './tests/steps_file.js'
  },
  bootstrap: null,
  mocha: {},
  name: 'npcstore-testing',
  plugins: {
    tryTo: {
      enabled: true
    },
    retryTo: {
      enabled: true
    },
    pauseOnFail: {},
    retryFailedStep: {
      enabled: true
    },
    screenshotOnFail: {
      enabled: true
    }
  }
}; 
require('dotenv').config();
import '@testing-library/jest-dom';

jest.setTimeout(30000);

// expect.extend({
//   customMatcher(received, argument) {
//     // custom matcher implementation
//   }
// });

// Mock console methods in tests if needed
global.console = {
  ...console,
  // Uncomment to ignore specific console methods
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
}; 
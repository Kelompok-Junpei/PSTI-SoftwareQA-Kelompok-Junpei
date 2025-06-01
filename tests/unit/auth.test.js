const { describe, test, expect, beforeEach, afterEach } = require('@jest/globals');

class AuthHelper {
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password) {
    if (!password || password.length < 8) {
      return { valid: false, message: 'Password harus minimal 8 karakter' };
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { valid: false, message: 'Password harus mengandung huruf besar, kecil, dan angka' };
    }
    return { valid: true, message: 'Password valid' };
  }

  static formatLoginData(email, password) {
    return {
      email: email.toLowerCase().trim(),
      password: password,
      timestamp: new Date().toISOString()
    };
  }

  static generateAuthToken(userData) {
    return `token_${userData.email}_${Date.now()}`;
  }
}

describe('Auth Helper Functions', () => {
  describe('validateEmail', () => { 
    test('should return true for valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.id',
        'admin+test@website.org'
      ];

      validEmails.forEach(email => {
        expect(AuthHelper.validateEmail(email)).toBe(true);
      });
    });

    test('should return false for invalid email addresses', () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user.domain.com',
        '',
        null,
        undefined
      ];

      invalidEmails.forEach(email => {
        expect(AuthHelper.validateEmail(email)).toBe(false);
      });
    });
  });

  describe('validatePassword', () => {
    test('should return valid for strong passwords', () => {
      const strongPasswords = [
        'Password123',
        'MySecure1Pass',
        'Testing123ABC'
      ];

      strongPasswords.forEach(password => {
        const result = AuthHelper.validatePassword(password);
        expect(result.valid).toBe(true);
        expect(result.message).toBe('Password valid');
      });
    });

    test('should return invalid for weak passwords', () => {
      const weakPasswords = [
        'short',
        'password',
        'PASSWORD',
        '12345678',
        'Pass123'
      ];

      weakPasswords.forEach(password => {
        const result = AuthHelper.validatePassword(password);
        expect(result.valid).toBe(false);
        expect(result.message).toContain('Password');
      });
    });

    test('should handle empty or null passwords', () => {
      const emptyPasswords = ['', null, undefined];

      emptyPasswords.forEach(password => {
        const result = AuthHelper.validatePassword(password);
        expect(result.valid).toBe(false);
      });
    });
  });

  describe('formatLoginData', () => {
    test('should format login data correctly', () => {
      const email = '  Test@Example.Com  ';
      const password = 'MyPassword123';

      const result = AuthHelper.formatLoginData(email, password);

      expect(result.email).toBe('test@example.com');
      expect(result.password).toBe(password);
      expect(result.timestamp).toBeDefined();
      expect(new Date(result.timestamp)).toBeInstanceOf(Date);
    });

    test('should handle various email formats', () => {
      const testCases = [
        { input: 'USER@DOMAIN.COM', expected: 'user@domain.com' },
        { input: '  admin@test.org  ', expected: 'admin@test.org' },
        { input: 'MiXeD@CaSe.CoM', expected: 'mixed@case.com' }
      ];

      testCases.forEach(({ input, expected }) => {
        const result = AuthHelper.formatLoginData(input, 'password');
        expect(result.email).toBe(expected);
      });
    });
  });

  describe('generateAuthToken', () => {
    test('should generate unique tokens for different users', () => {
      const user1 = { email: 'user1@test.com', id: 1 };
      const user2 = { email: 'user2@test.com', id: 2 };

      const token1 = AuthHelper.generateAuthToken(user1);
      const token2 = AuthHelper.generateAuthToken(user2);

      expect(token1).not.toBe(token2);
      expect(token1).toContain('user1@test.com');
      expect(token2).toContain('user2@test.com');
    });

    test('should generate tokens with consistent format', () => {
      const userData = { email: 'test@example.com', id: 123 };
      const token = AuthHelper.generateAuthToken(userData);

      expect(token).toMatch(/^token_.*_\d+$/);
      expect(token).toContain(userData.email);
    });
  });
});

describe('Auth Integration Tests', () => {
  let loginData;

  beforeEach(() => {
    loginData = {
      email: 'test@example.com',
      password: 'ValidPass123'
    };
  });

  afterEach(() => {
    loginData = null;
  });

  test('should complete full login validation flow', () => {
    const emailValid = AuthHelper.validateEmail(loginData.email);
    expect(emailValid).toBe(true);

    const passwordResult = AuthHelper.validatePassword(loginData.password);
    expect(passwordResult.valid).toBe(true);

    const formattedData = AuthHelper.formatLoginData(loginData.email, loginData.password);
    expect(formattedData.email).toBe(loginData.email.toLowerCase());

    const token = AuthHelper.generateAuthToken({ email: formattedData.email });
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  test('should reject invalid login data in full flow', () => {
    const invalidData = {
      email: 'invalid-email',
      password: 'weak'
    };

    const emailValid = AuthHelper.validateEmail(invalidData.email);
    const passwordResult = AuthHelper.validatePassword(invalidData.password);

    expect(emailValid).toBe(false);
    expect(passwordResult.valid).toBe(false);
  });
}); 
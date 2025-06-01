const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 NPC Store Testing Suite');
console.log('==========================\n');

const args = process.argv.slice(2);
const testType = args[0] || 'help';

function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', reject);
  });
}

async function runTests() {
  try {
    switch (testType) {
      case 'unit':
        console.log('📋 Running All Unit Tests...\n');
        await runCommand('npm', ['test']);
        break;

      case 'unit-auth':
        console.log('🔐 Running Auth Unit Tests...\n');
        await runCommand('npx', ['jest', 'tests/unit/auth.test.js']);
        break;

      case 'unit-products':
        console.log('📦 Running Products Unit Tests...\n');
        await runCommand('npx', ['jest', 'tests/unit/product.test.js']);
        break;

      case 'unit-cart':
        console.log('🛒 Running Cart Unit Tests...\n');
        await runCommand('npx', ['jest', 'tests/unit/cart.test.js']);
        break;

      case 'unit-profile':
        console.log('👤 Running Profile Unit Tests...\n');
        await runCommand('npx', ['jest', 'tests/unit/profileManagement.test.js']);
        break;

      case 'unit-orders':
        console.log('📋 Running Orders Unit Tests...\n');
        await runCommand('npx', ['jest', 'tests/unit/orderManagement.test.js']);
        break;

      case 'unit-checkout':
        console.log('💳 Running Checkout Unit Tests...\n');
        await runCommand('npx', ['jest', 'tests/unit/checkout.test.js']);
        break;

      case 'e2e':
        console.log('🌐 Running All E2E Tests...\n');
        await runCommand('npx', ['codeceptjs', 'run']);
        break;

      case 'e2e-headless':
        console.log('🌐 Running E2E Tests (Headless)...\n');
        await runCommand('npx', ['codeceptjs', 'run'], { env: { ...process.env, HEADLESS: 'true' } });
        break;

      case 'auth':
        console.log('🔐 Running Auth E2E Tests...\n');
        await runCommand('npx', ['codeceptjs', 'run', 'tests/e2e/auth/*_test.js']);
        break;

      case 'auth-login':
        console.log('🔐 Running Login Tests...\n');
        await runCommand('npx', ['codeceptjs', 'run', 'tests/e2e/auth/login_test.js']);
        break;

      case 'auth-logout':
        console.log('🔐 Running Logout Tests...\n');
        await runCommand('npx', ['codeceptjs', 'run', 'tests/e2e/auth/logout_test.js']);
        break;

      case 'products':
        console.log('📦 Running Product E2E Tests...\n');
        await runCommand('npx', ['codeceptjs', 'run', 'tests/e2e/products/*_test.js']);
        break;

      case 'products-display':
        console.log('📦 Running Product Display Tests...\n');
        await runCommand('npx', ['codeceptjs', 'run', 'tests/e2e/products/product_display_test.js']);
        break;

      case 'products-detail':
        console.log('📦 Running Product Detail Tests...\n');
        await runCommand('npx', ['codeceptjs', 'run', 'tests/e2e/products/product_detail_test.js']);
        break;

      case 'products-search':
        console.log('📦 Running Product Search Tests...\n');
        await runCommand('npx', ['codeceptjs', 'run', 'tests/e2e/products/product_search_test.js']);
        break;

      case 'cart':
        console.log('🛒 Running Cart E2E Tests...\n');
        await runCommand('npx', ['codeceptjs', 'run', 'tests/e2e/cart/*_test.js']);
        break;

      case 'cart-add':
        console.log('🛒 Running Cart Add Tests...\n');
        await runCommand('npx', ['codeceptjs', 'run', 'tests/e2e/cart/cart_add_items_test.js']);
        break;

      case 'cart-manage':
        console.log('🛒 Running Cart Management Tests...\n');
        await runCommand('npx', ['codeceptjs', 'run', 'tests/e2e/cart/cart_management_test.js']);
        break;

      case 'cart-calc':
        console.log('🛒 Running Cart Calculations Tests...\n');
        await runCommand('npx', ['codeceptjs', 'run', 'tests/e2e/cart/cart_calculations_test.js']);
        break;

      case 'profile':
        console.log('👤 Running Profile E2E Tests...\n');
        await runCommand('npx', ['codeceptjs', 'run', 'tests/e2e/profile/*_test.js']);
        break;

      case 'orders':
        console.log('📋 Running Order E2E Tests...\n');
        await runCommand('npx', ['codeceptjs', 'run', 'tests/e2e/orders/*_test.js']);
        break;

      case 'checkout':
        console.log('💳 Running Checkout E2E Tests...\n');
        await runCommand('npx', ['codeceptjs', 'run', 'tests/e2e/checkout/*_test.js']);
        break;

      case 'all':
        console.log('🎯 Running All Tests...\n');
        console.log('1. Unit Tests...');
        await runCommand('npm', ['test']);
        console.log('\n2. E2E Tests...');
        await runCommand('npx', ['codeceptjs', 'run'], { env: { ...process.env, HEADLESS: 'true' } });
        break;

      case 'all-auth':
        console.log('🔐 Running All Auth Tests...\n');
        await runCommand('npx', ['jest', 'tests/unit/auth.test.js']);
        await runCommand('npx', ['codeceptjs', 'run', 'tests/e2e/auth/*_test.js']);
        break;

      case 'all-products':
        console.log('📦 Running All Product Tests...\n');
        await runCommand('npx', ['jest', 'tests/unit/product.test.js']);
        await runCommand('npx', ['codeceptjs', 'run', 'tests/e2e/products/*_test.js']);
        break;

      case 'all-cart':
        console.log('🛒 Running All Cart Tests...\n');
        await runCommand('npx', ['jest', 'tests/unit/cart.test.js']);
        await runCommand('npx', ['codeceptjs', 'run', 'tests/e2e/cart/*_test.js']);
        break;

      case 'all-profile':
        console.log('👤 Running All Profile Tests...\n');
        await runCommand('npx', ['jest', 'tests/unit/profileManagement.test.js']);
        await runCommand('npx', ['codeceptjs', 'run', 'tests/e2e/profile/*_test.js']);
        break;

      case 'all-orders':
        console.log('📋 Running All Order Tests...\n');
        await runCommand('npx', ['jest', 'tests/unit/orderManagement.test.js']);
        await runCommand('npx', ['codeceptjs', 'run', 'tests/e2e/orders/*_test.js']);
        break;

      case 'all-checkout':
        console.log('💳 Running All Checkout Tests...\n');
        await runCommand('npx', ['jest', 'tests/unit/checkout.test.js']);
        await runCommand('npx', ['codeceptjs', 'run', 'tests/e2e/checkout/*_test.js']);
        break;

      case 'help':
      default:
        console.log('🚀 NPC Store Testing Commands\n');
        
        console.log('📋 UNIT TESTS:');
        console.log('  unit              - All unit tests');
        console.log('  unit-auth         - Auth unit tests');
        console.log('  unit-products     - Products unit tests');
        console.log('  unit-cart         - Cart unit tests');
        console.log('  unit-profile      - Profile unit tests');
        console.log('  unit-orders       - Orders unit tests');
        console.log('  unit-checkout     - Checkout unit tests\n');
        
        console.log('🌐 E2E TESTS:');
        console.log('  e2e               - All E2E tests');
        console.log('  e2e-headless      - All E2E tests (headless)\n');
        
        console.log('🔐 AUTH TESTS:');
        console.log('  auth              - All auth E2E tests');
        console.log('  auth-login        - Login tests');
        console.log('  auth-logout       - Logout tests\n');
        
        console.log('📦 PRODUCT TESTS:');
        console.log('  products          - All product E2E tests');
        console.log('  products-display  - Product display tests');
        console.log('  products-detail   - Product detail tests');
        console.log('  products-search   - Product search tests\n');
        
        console.log('🛒 CART TESTS:');
        console.log('  cart              - All cart E2E tests');
        console.log('  cart-add          - Cart add items tests');
        console.log('  cart-manage       - Cart management tests');
        console.log('  cart-calc         - Cart calculations tests\n');
        
        console.log('👤 PROFILE TESTS:');
        console.log('  profile           - Profile E2E tests\n');
        
        console.log('📋 ORDER TESTS:');
        console.log('  orders            - Order E2E tests\n');
        
        console.log('💳 CHECKOUT TESTS:');
        console.log('  checkout          - Checkout E2E tests\n');
        
        console.log('🎯 COMBINED TESTS:');
        console.log('  all               - All tests (unit + E2E)');
        console.log('  all-auth          - All auth tests');
        console.log('  all-products      - All product tests');
        console.log('  all-cart          - All cart tests');
        console.log('  all-profile       - All profile tests');
        console.log('  all-orders        - All order tests');
        console.log('  all-checkout      - All checkout tests\n');
        
        console.log('Usage: node run-tests.js [command]');
        return;
    }

    console.log('\n✅ Tests completed successfully!');
  } catch (error) {
    console.error('\n❌ Tests failed:', error.message);
    process.exit(1);
  }
}

runTests(); 
 
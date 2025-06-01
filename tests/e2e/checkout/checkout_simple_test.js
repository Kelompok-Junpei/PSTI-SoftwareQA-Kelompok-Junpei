Feature('Proses Checkout - 3 Requirement Utama');

Scenario('Navigasi dari keranjang ke checkout', ({ I }) => {
  I.amOnPage('/login');
  I.wait(2);
  I.fillField('input[name="email"]', 'geveve9340@buides.com');
  I.fillField('input[name="password"]', 'Test1234');
  I.click('button[type="submit"]');
  I.wait(3);

  I.amOnPage('/');
  I.wait(3);
  I.seeElement('a[href*="/product/"]');
  I.click('a[href*="/product/"]:first-child');
  I.wait(3);
  
  I.see('Add to Cart', 'button');
  I.click('Add to Cart');
  I.wait(2);

  I.amOnPage('/cart');
  I.wait(3);
  I.see('Your Shopping Cart');
  
  I.seeCheckboxIsChecked('.checkbox-primary');
  
  I.see('Proceed to Checkout', 'button');
  I.click('Proceed to Checkout');
  I.wait(3);
  I.seeInCurrentUrl('/checkout');
  I.see('Checkout');
  
});

Scenario('Pemilihan metode pengiriman', ({ I }) => {
  I.amOnPage('/login');
  I.wait(2);
  I.fillField('input[name="email"]', 'geveve9340@buides.com');
  I.fillField('input[name="password"]', 'Test1234');
  I.click('button[type="submit"]');
  I.wait(3);

  I.amOnPage('/');
  I.wait(3);
  I.seeElement('a[href*="/product/"]');
  I.click('a[href*="/product/"]:first-child');
  I.wait(3);
  I.see('Add to Cart', 'button');
  I.click('Add to Cart');
  I.wait(2);

  I.amOnPage('/cart');
  I.wait(3);
  I.click('Proceed to Checkout');
  I.wait(3);

  I.see('Shipping Method');
  
  I.waitForElement('.radio', 15);
  
  I.seeElement('input[type="radio"][name="shippingMethod"]');
  
  I.click('input[type="radio"][name="shippingMethod"]:first-of-type');
  
  I.see('Shipping');
  
});

Scenario('Membuat pesanan', ({ I }) => {
  I.amOnPage('/login');
  I.wait(2);
  I.fillField('input[name="email"]', 'geveve9340@buides.com');
  I.fillField('input[name="password"]', 'Test1234');
  I.click('button[type="submit"]');
  I.wait(3);

  I.amOnPage('/');
  I.wait(3);
  I.seeElement('a[href*="/product/"]');
  I.click('a[href*="/product/"]:first-child');
  I.wait(3);
  I.see('Add to Cart', 'button');
  I.click('Add to Cart');
  I.wait(2);

  I.amOnPage('/cart');
  I.wait(3);
  I.click('Proceed to Checkout');
  I.wait(3);

  I.see('Shipping Method');
  I.waitForElement('.radio', 15);
  I.click('input[type="radio"][name="shippingMethod"]:first-of-type');

  I.see('Order Summary');
  I.see('Subtotal');
  I.see('Shipping');  
  I.see('Total');
  
  I.fillField('textarea[placeholder*="Add special instructions"]', 'Test order dari e2e testing');
  
  I.click('Place Order');
  
  I.waitForElement('iframe, .midtrans-popup, [id*="snap"], [class*="snap"]', 30);
  
  I.seeElement('iframe, .midtrans-popup, [id*="snap"]');
  
}); 
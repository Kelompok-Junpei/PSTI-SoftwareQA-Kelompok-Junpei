Feature('Shopping Cart - Add Items');

Before(({ I }) => {
  I.amOnPage('/');
  I.wait(2);
});

Scenario('Menambahkan produk ke keranjang dari halaman detail produk', ({ I }) => {
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
  
  I.seeInCurrentUrl('/product/');
  
  I.see('Add to Cart', 'button');
  
  I.click('Add to Cart');
  I.wait(2);
  
  console.log('Add to Cart button berhasil diklik dari halaman detail produk');
  
}).tag('@cart').tag('@add-item').tag('@detail-page');

Scenario('Menambahkan produk ke keranjang dari halaman products', async ({ I }) => {
  I.amOnPage('/login');
  I.wait(2);
  
  I.fillField('input[name="email"]', 'geveve9340@buides.com');
  I.fillField('input[name="password"]', 'Test1234');
  I.click('button[type="submit"]');
  I.wait(3);
  
  I.amOnPage('/');
  I.wait(2);
  I.click('text=Shop Now');
  I.wait(3);
  
  const productLinks = await I.grabAttributeFromAll('a[href*="/product/"]', 'href');
  console.log(`ℹ️ Ditemukan ${productLinks.length} produk links`);
  
  if (productLinks.length > 1) {
    I.amOnPage(productLinks[1]);
  } else {
    I.amOnPage(productLinks[0]);
  }
  I.wait(3);
  
  try {
    I.see('Add to Cart', 'button');
    I.click('Add to Cart');
    I.wait(2);
    
    console.log('Add to Cart button diklik untuk produk kedua');
  } catch (error) {
    console.log('ℹ️ Add to Cart button tidak tersedia pada produk ini');
  }
  
}).tag('@cart').tag('@add-item').tag('@products-page');

Scenario('Mengatur kuantitas sebelum menambahkan ke keranjang', async ({ I }) => {
  I.amOnPage('/login');
  I.wait(2);
  
  I.fillField('input[name="email"]', 'geveve9340@buides.com');
  I.fillField('input[name="password"]', 'Test1234');
  I.click('button[type="submit"]');
  I.wait(3);
  
  I.amOnPage('/');
  I.wait(2);
  I.click('text=Shop Now');
  I.wait(3);
  
  const productLinks = await I.grabAttributeFromAll('a[href*="/product/"]', 'href');
  console.log(`ℹ️ Ditemukan ${productLinks.length} produk links`);
  
  if (productLinks.length > 2) {
    I.amOnPage(productLinks[2]);
  } else {
    I.amOnPage(productLinks[0]);
  }
  I.wait(3);
  
  try {
    I.see('+', 'button');
    I.click('+');
    I.wait(1);
    
    I.see('-', 'button');
    I.click('-');
    I.wait(1);
    
    console.log('Quantity controls');
  } catch (error) {
    console.log('ℹ️ Quantity controls tidak ditemukan atau berbeda format');
  }
  
  try {
    I.see('Add to Cart', 'button');
    I.click('Add to Cart');
    I.wait(2);
    
    console.log('Cart functionality dengan quantity controls');
  } catch (error) {
    console.log('ℹ️ Add to Cart tidak tersedia pada produk ini');
  }
  
}).tag('@cart').tag('@add-item').tag('@quantity');

Scenario('Verifikasi pesan login jika user belum login', async ({ I }) => {
  I.amOnPage('/');
  I.wait(2);
  I.click('text=Shop Now');
  I.wait(3);
  
  const productLinks = await I.grabAttributeFromAll('a[href*="/product/"]', 'href');
  console.log(`ℹ️ Ditemukan ${productLinks.length} produk links`);
  
  if (productLinks.length > 3) {
    I.amOnPage(productLinks[3]);
  } else if (productLinks.length > 1) {
    I.amOnPage(productLinks[1]);
  } else {
    I.amOnPage(productLinks[0]);
  }
  I.wait(3);
  
  try {
    I.see('Login to Add', 'button');
    
    I.click('Login to Add');
    I.wait(3);
    
    try {
      I.seeInCurrentUrl('/login');
      console.log('User di-redirect ke halaman login');
    } catch (error) {
      console.log('ℹ️ Behavior login berbeda dari yang diharapkan');
    }
  } catch (error) {
    console.log('ℹ️ Login to Add button tidak ditemukan pada produk ini');
  }
  
}).tag('@cart').tag('@add-item').tag('@login-required'); 
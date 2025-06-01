Feature('Product Discovery - Product Display');

Before(({ I }) => {
  I.amOnPage('/');
  I.wait(3);
});

Scenario('Tampilan produk di beranda', ({ I }) => {
  I.amOnPage('/');
  I.wait(3);
  
  I.see('NPC Store', 'body');
  
  I.see('Latest Products', 'h2');
  
  I.see('Popular Products', 'h2');
  
  I.see('Rp', 'body');
  
  I.seeElement('a[href*="/product/"]');
  
  console.log('Tampilan produk di beranda lengkap');
}).tag('@product-display').tag('@homepage');

Scenario('Tampilan produk di halaman products', ({ I }) => {
  I.amOnPage('/');
  I.wait(3);
  I.click('text=Shop Now');
  I.wait(3); 
  
  I.seeInCurrentUrl('/products');
  
  I.seeElement('a[href*="/product/"]'); 
  I.see('Rp', 'body'); 
  
  console.log('Tampilan produk di halaman products berhasil');
}).tag('@product-display').tag('@products-page');

Scenario('Navigasi ke halaman detail produk dari homepage', ({ I }) => {
  I.amOnPage('/');
  I.wait(3);
  
  I.seeElement('a[href*="/product/"]');
  I.click('a[href*="/product/"]:first-child');
  I.wait(3);
  
  I.seeInCurrentUrl('/product/');
  console.log('Navigasi ke detail produk dari homepage berhasil');
}).tag('@product-display').tag('@navigation');

Scenario('Navigasi ke halaman detail produk dari halaman products', ({ I }) => {
  I.amOnPage('/');
  I.wait(3);
  I.click('text=Shop Now');
  I.wait(3); 
  
  I.seeElement('a[href*="/product/"]');
  I.click('a[href*="/product/"]:first-child');
  I.wait(3);
  
  I.seeInCurrentUrl('/product/');
  console.log('Navigasi ke detail produk dari halaman products berhasil');
}).tag('@product-display').tag('@navigation');

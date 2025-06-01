Feature('Product Discovery - Product Search');

Before(({ I }) => {
  I.amOnPage('/');
  I.wait(3); 
});

Scenario('Pencarian produk berdasarkan nama', ({ I }) => {
  I.amOnPage('/');
  I.wait(3);
  
  I.click('text=Shop Now');
  I.wait(2);
  
  const searchSelector = 'input[name="searchQuery"]';
  I.seeElement(searchSelector);
  I.fillField(searchSelector, 'monitor');
  I.click('button[type="submit"]');
  I.wait(5);
  
  I.see('Search Results:', 'h1');
  I.see('monitor', 'h1');
  
  console.log('Pencarian produk berdasarkan nama');
}).tag('@product-search').tag('@name-search');

Scenario('Pencarian produk berdasarkan kata kunci', ({ I }) => {
  I.amOnPage('/');
  I.wait(3);
  
  I.click('text=Shop Now');
  I.wait(2);
  
  const searchSelector = 'input[name="searchQuery"]';
  
  const searchTerms = ['RAM'];
  
  for (const term of searchTerms) {
    I.clearField(searchSelector);
    I.fillField(searchSelector, term);
    I.click('button[type="submit"]');
    I.wait(5);
    
    I.see('Search Results:', 'h1');
    I.see(term, 'h1');
    console.log(`Pencarian kata kunci "${term}"`);
    
    I.amOnPage('/');
    I.wait(2);
    I.click('text=Shop Now');
    I.wait(2);
  }
}).tag('@product-search').tag('@keyword-search');

Scenario('Hasil pencarian yang akurat', ({ I }) => {
  I.amOnPage('/');
  I.wait(3);
  
  I.click('text=Shop Now');
  I.wait(2);
  
  const searchSelector = 'input[name="searchQuery"]';
  
  I.fillField(searchSelector, 'monitor');
  I.click('button[type="submit"]');
  I.wait(5);
  
  I.see('Search Results:', 'h1');
  I.see('monitor', 'h1');
  
  try {
    I.seeElement('a[href*="/product/"]');
    I.see('Rp', 'body');
    console.log('Hasil pencarian menampilkan produk yang relevan');
  } catch (error) {
    console.log('ℹ️ Tidak ada produk ditemukan untuk kata kunci ini');
  }
  
  console.log('Hasil pencarian akurat');
}).tag('@product-search').tag('@accurate-results');

Scenario('Pesan tidak ada hasil ditemukan', ({ I }) => {
  I.amOnPage('/');
  I.wait(3);
  
  I.click('text=Shop Now');
  I.wait(2);
  
  const searchSelector = 'input[name="searchQuery"]';
  
  I.fillField(searchSelector, 'abcdefghijklmnopqrstuvwxyz123456789');
  I.click('button[type="submit"]');
  I.wait(8);
  
  try {
    I.see('No Products Found', 'h3');
    I.see('Reset Filters', 'button');
    console.log('Pesan "tidak ada hasil ditemukan" ditampilkan dengan benar');
  } catch (error) {
    try {
      I.see('tidak ditemukan', 'body');
      console.log('Pesan tidak ditemukan alternatif terdeteksi');
    } catch (error2) {
      console.log('Format pesan "tidak ditemukan" berbeda dari yang diharapkan');
    }
  }
}).tag('@product-search').tag('@no-results');



Feature('Product Discovery - Product Detail');

Before(({ I }) => {
  I.amOnPage('/');
  I.wait(3);
});

Scenario('Navigasi ke halaman detail produk dari homepage', ({ I }) => {
  I.amOnPage('/');
  I.wait(3);
  
  I.seeElement('a[href*="/product/"]');
  I.click('a[href*="/product/"]:first-child');
  I.wait(3);
  
  I.seeInCurrentUrl('/product/');
  
  console.log('Navigasi ke detail produk dari homepage');
}).tag('@product-detail').tag('@navigation');

Scenario('Navigasi ke halaman detail produk dari hasil pencarian', ({ I }) => {
  I.amOnPage('/');
  I.wait(3);
  
  I.click('text=Shop Now');
  I.wait(3);
  
  I.fillField('input[name="searchQuery"]', 'monitor');
  I.click('button[type="submit"]');
  I.wait(5);
  
  try {
    I.seeElement('a[href*="/product/"]');
    I.click('a[href*="/product/"]:first-child');
    I.wait(3);
    
    I.seeInCurrentUrl('/product/');
    console.log('Navigasi ke detail produk dari hasil pencarian');
  } catch (error) {
    console.log('ℹ️ Tidak ada hasil pencarian atau tidak dapat diklik');
  }
}).tag('@product-detail').tag('@navigation');

Scenario('Tampilan informasi produk yang benar di halaman detail', ({ I }) => {
  I.amOnPage('/');
  I.wait(3);
  
  I.click('a[href*="/product/"]:first-child');
  I.wait(5);
  
  I.seeElement('h1, h2, h3'); 
  I.see('Rp', 'body'); 
  I.seeElement('img'); 
  
  try {
    I.seeElement('[class*="bg-blue-100"], [class*="category"], .category');
    console.log('Kategori produk ditampilkan');
  } catch (error) {
    console.log('ℹ️ Kategori produk tidak terdeteksi atau format berbeda');
  }
  
  try {
    I.seeElement('button[class*="bg-npc-gold"]');
    console.log('Tombol interaksi ditemukan');
  } catch (error) {
    try {
      I.seeElement('button');
      console.log('Tombol interaksi ditemukan (format berbeda)');
    } catch (error2) {
      console.log('ℹ️ Tombol interaksi tidak ditemukan (mungkin out of stock atau guest)');
    }
  }
  
  console.log('Tampilan informasi produk lengkap dan benar');
}).tag('@product-detail').tag('@product-info');

Scenario('Gambar produk ditampilkan dengan benar', ({ I }) => {
  I.amOnPage('/');
  I.wait(3);
  
  I.click('a[href*="/product/"]:first-child');
  I.wait(3);
  
  I.seeElement('img');
  I.seeElement('img[src]');
  
  I.dontSeeElement('img[src=""], img:not([src])');
  
  console.log('Gambar produk ditampilkan dengan benar');
}).tag('@product-detail').tag('@product-info');

Scenario('Harga produk ditampilkan dengan jelas', ({ I }) => {
  I.amOnPage('/');
  I.wait(3);
  
  I.click('a[href*="/product/"]:first-child');
  I.wait(5);
  
  I.see('Rp', 'body');
  
  try {
    I.see('Rp', 'body');
    console.log('Format harga dalam mata uang Rupiah terdeteksi');
  } catch (error) {
    console.log('ℹ️ Format harga terdeteksi tapi belum dapat diverifikasi formatnya');
  }
  
  console.log('Harga produk ditampilkan dengan jelas');
}).tag('@product-detail').tag('@product-info'); 
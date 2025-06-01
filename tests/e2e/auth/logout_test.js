Feature('User Authentication - Logout');

const testData = {
  validUser: {
    email: 'geveve9340@buides.com', 
    password: 'Test1234'
  }
};

Before(({ I }) => {
  I.amOnPage('/');
  I.wait(3);
  
  I.click('//a[contains(text(), "Login")]');
  I.wait(3);
  
  I.fillField('input[type="email"]', testData.validUser.email);
  I.fillField('input[type="password"]', testData.validUser.password);
  I.click('button[type="submit"]');
  I.wait(5);
  
  I.dontSeeCurrentUrlEquals('/login');
});

Scenario('Logout pengguna berhasil', ({ I }) => {
  I.amOnPage('/');
  I.wait(3);
  
  I.click('.profile-menu-container');
  I.wait(2);
  
  I.click('//button[contains(text(), "Logout")]');
  I.wait(3);
  
  I.seeElement('//a[contains(text(), "Login")]');
  
  console.log('Logout');
}).tag('@logout').tag('@positive');

Scenario('Validasi session setelah logout', ({ I }) => {
  I.amOnPage('/');
  I.wait(3);
  
  I.click('.profile-menu-container');
  I.wait(2);
  I.click('//button[contains(text(), "Logout")]');
  I.wait(3);
  
  I.amOnPage('/');
  I.wait(3);
  
  I.seeElement('//a[contains(text(), "Login")]');
  
  console.log('Session cleared setelah logout');
}).tag('@logout').tag('@session');

Scenario('Navigasi ke login setelah logout', ({ I }) => {
  I.amOnPage('/');
  I.wait(3);
  
  I.click('.profile-menu-container');
  I.wait(2);
  I.click('//button[contains(text(), "Logout")]');
  I.wait(3);
  
  I.click('//a[contains(text(), "Login")]');
  I.wait(3);
  
  I.seeInCurrentUrl('login');
  I.seeElement('input[type="email"]');
  I.seeElement('input[type="password"]');
  
  console.log('Navigasi ke Login');
}).tag('@logout').tag('@navigation'); 
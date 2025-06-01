Feature('User Authentication - Login');

const testData = {
  validUser: {
    email: 'geveve9340@buides.com', 
    password: 'Test1234'
  },
  adminUser: {
    email: 'admin@npc.com',  
    password: 'admin123'
  },
  invalidUser: {
    email: 'invalid@test.com',
    password: 'wrongpassword'
  },
  emptyCredentials: {
    email: '',
    password: ''
  }
};

Before(({ I }) => {
  I.amOnPage('/');
  I.wait(3);
});

Scenario('Login berhasil dengan kredensial buyer yang valid', ({ I }) => {
  I.click('//a[contains(text(), "Login")]');
  I.wait(3);
  I.seeInCurrentUrl('login');
  
  I.fillField('input[type="email"]', testData.validUser.email);
  I.fillField('input[type="password"]', testData.validUser.password);
  I.click('button[type="submit"]');
  I.wait(5);
  
  I.dontSeeCurrentUrlEquals('/login');
  
  console.log('Login Buyer');
}).tag('@login').tag('@positive').tag('@buyer');

Scenario('Login berhasil dengan kredensial admin yang valid', ({ I }) => {
  I.click('//a[contains(text(), "Login")]');
  I.wait(3);
  I.seeInCurrentUrl('login');
  
  I.fillField('input[type="email"]', testData.adminUser.email);
  I.fillField('input[type="password"]', testData.adminUser.password);
  I.click('button[type="submit"]');
  I.wait(5);
  
  I.dontSeeCurrentUrlEquals('/login');
  
  console.log('Login Admin');
}).tag('@login').tag('@positive').tag('@admin');

Scenario('Kegagalan login dengan email yang tidak valid', ({ I }) => {
  I.click('//a[contains(text(), "Login")]');
  I.wait(3);
  
  I.fillField('input[type="email"]', testData.invalidUser.email);
  I.fillField('input[type="password"]', testData.validUser.password);
  I.click('button[type="submit"]');
  I.wait(3);
  
  I.seeInCurrentUrl('login');
  
  console.log('Login gagal dengan email invalid');
}).tag('@login').tag('@negative');

Scenario('Kegagalan login dengan password yang salah', ({ I }) => {
  I.click('//a[contains(text(), "Login")]');
  I.wait(3);
  
  I.fillField('input[type="email"]', testData.validUser.email);
  I.fillField('input[type="password"]', testData.invalidUser.password);
  I.click('button[type="submit"]');
  I.wait(3);
  
  I.seeInCurrentUrl('login');
  
  console.log('Login gagal dengan password salah');
}).tag('@login').tag('@negative');

Scenario('Kegagalan login dengan kredensial kosong', ({ I }) => {
  I.click('//a[contains(text(), "Login")]');
  I.wait(3);
  
  I.click('button[type="submit"]');
  I.wait(2);
  
  I.seeInCurrentUrl('login');
  
  console.log('Login gagal dengan kredensial kosong');
}).tag('@login').tag('@negative');

Scenario('Navigasi ke halaman login dari homepage', ({ I }) => {
  I.see('NPC Store', 'body');
  
  I.click('//a[contains(text(), "Login")]');
  I.wait(2);
  
  I.seeInCurrentUrl('login');
  I.seeElement('input[type="email"]');
  I.seeElement('input[type="password"]');
  
  console.log('Navigasi ke Login');
}).tag('@login').tag('@navigation'); 
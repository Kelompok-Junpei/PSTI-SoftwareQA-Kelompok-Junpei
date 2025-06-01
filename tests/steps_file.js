module.exports = function() {
  return actor({

    loginAsUser: function(email, password) {
      this.click('[data-testid="login-button"], .login-btn, a[href*="login"]');
      this.waitForElement('input[name="email"], input[type="email"], #email', 10);
      this.fillField('input[name="email"], input[type="email"], #email', email);
      this.fillField('input[name="password"], input[type="password"], #password', password);
      this.click('button[type="submit"], .submit-btn, .login-submit');
    },

    searchForProduct: function(searchTerm) {
      this.click('input[name="search"], .search-input, [placeholder*="search"], [placeholder*="cari"]');
      this.fillField('input[name="search"], .search-input, [placeholder*="search"], [placeholder*="cari"]', searchTerm);
      this.pressKey('Enter');
    },

    viewProductDetails: function(productName) {
      this.click(`//a[contains(text(), "${productName}")] | //div[contains(text(), "${productName}")]`);
    },

    seeUserLoggedIn: function() {
      this.see('Dashboard', 'body');
      this.dontSee('Login', 'body');
    },

    seeUserLoggedOut: function() {
      this.see('Login', 'body');
      this.dontSee('Dashboard', 'body');
    },

    seeSearchResults: function(searchTerm) {
      this.waitForElement('.product-item, .search-result, .product-card', 10);
      this.see(searchTerm, '.product-name, .product-title, .search-result');
    },

    seeNoResultsMessage: function() {
      this.see('tidak ditemukan', 'body');
    },

    goToPage: function(pageName) {
      const pageUrls = {
        'home': '/',
        'login': '/login',
        'register': '/register',
        'products': '/products',
        'search': '/search'
      };
      
      if (pageUrls[pageName]) {
        this.amOnPage(pageUrls[pageName]);
      } else {
        this.click(`a[href*="${pageName}"], .nav-${pageName}, [data-page="${pageName}"]`);
      }
    },

    waitAndRefresh: function(seconds = 3) {
      this.wait(seconds);
      this.refreshPage();
    }

  });
}; 
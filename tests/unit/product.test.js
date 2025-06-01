const { describe, test, expect, beforeEach, afterEach } = require('@jest/globals');

class ProductHelper {
  static normalizeSearchTerm(searchTerm) {
    if (!searchTerm || typeof searchTerm !== 'string') {
      return '';
    }
    return searchTerm.toLowerCase().trim();
  }

  static filterProducts(products, searchTerm) {
    if (!searchTerm) return products;
    
    const normalizedTerm = this.normalizeSearchTerm(searchTerm);
    
    return products.filter(product => {
      const title = (product.title || '').toLowerCase();
      const description = (product.description || '').toLowerCase();
      const category = (product.category || '').toLowerCase();
      
      return title.includes(normalizedTerm) || 
             description.includes(normalizedTerm) || 
             category.includes(normalizedTerm);
    });
  }

  static formatPrice(price) {
    if (typeof price !== 'number' || isNaN(price) || price < 0) {
      return 'Rp 0';
    }
    return `Rp ${price.toLocaleString('id-ID')}`;
  }

  static validateProductData(product) {
    const errors = [];
    
    if (!product.title || product.title.trim() === '') {
      errors.push('Title is required');
    }
    
    if (typeof product.price !== 'number' || product.price < 0) {
      errors.push('Valid price is required');
    }
    
    if (!product.category || product.category.trim() === '') {
      errors.push('Category is required');
    }
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  static sortProducts(products, sortBy = 'name') {
    const sortedProducts = [...products];
    
    switch (sortBy.toLowerCase()) {
      case 'name':
      case 'title':
        return sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
      
      case 'price_low':
        return sortedProducts.sort((a, b) => a.price - b.price);
      
      case 'price_high':
        return sortedProducts.sort((a, b) => b.price - a.price);
      
      case 'category':
        return sortedProducts.sort((a, b) => a.category.localeCompare(b.category));
      
      default:
        return sortedProducts;
    }
  }
}

describe('Product Helper Functions', () => {
  
  describe('normalizeSearchTerm', () => {
    test('should normalize search terms correctly', () => {
      expect(ProductHelper.normalizeSearchTerm('  LAPTOP  ')).toBe('laptop');
      expect(ProductHelper.normalizeSearchTerm('Gaming Phone')).toBe('gaming phone');
      expect(ProductHelper.normalizeSearchTerm('MacBook Pro')).toBe('macbook pro');
    });

    test('should handle invalid inputs', () => {
      expect(ProductHelper.normalizeSearchTerm('')).toBe('');
      expect(ProductHelper.normalizeSearchTerm(null)).toBe('');
      expect(ProductHelper.normalizeSearchTerm(undefined)).toBe('');
      expect(ProductHelper.normalizeSearchTerm(123)).toBe('');
    });
  });

  describe('filterProducts', () => {
    let mockProducts;

    beforeEach(() => {
      mockProducts = [
        { id: 1, title: 'Gaming Laptop', description: 'High-end gaming laptop', category: 'Electronics', price: 15000000 },
        { id: 2, title: 'Office Mouse', description: 'Wireless office mouse', category: 'Accessories', price: 200000 },
        { id: 3, title: 'Smartphone', description: 'Latest Android phone', category: 'Electronics', price: 8000000 },
        { id: 4, title: 'Gaming Keyboard', description: 'Mechanical gaming keyboard', category: 'Accessories', price: 1500000 }
      ];
    });

    test('should filter products by title', () => {
      const result = ProductHelper.filterProducts(mockProducts, 'gaming');
      expect(result).toHaveLength(2);
      expect(result[0].title).toContain('Gaming');
      expect(result[1].title).toContain('Gaming');
    });

    test('should filter products by description', () => {
      const result = ProductHelper.filterProducts(mockProducts, 'wireless');
      expect(result).toHaveLength(1);
      expect(result[0].description).toContain('Wireless');
    });

    test('should filter products by category', () => {
      const result = ProductHelper.filterProducts(mockProducts, 'electronics');
      expect(result).toHaveLength(2);
      expect(result.every(p => p.category === 'Electronics')).toBe(true);
    });

    test('should return all products when no search term', () => {
      expect(ProductHelper.filterProducts(mockProducts, '')).toHaveLength(4);
      expect(ProductHelper.filterProducts(mockProducts, null)).toHaveLength(4);
      expect(ProductHelper.filterProducts(mockProducts, undefined)).toHaveLength(4);
    });

    test('should return empty array when no matches', () => {
      const result = ProductHelper.filterProducts(mockProducts, 'notfound');
      expect(result).toHaveLength(0);
    });

    test('should be case insensitive', () => {
      const result1 = ProductHelper.filterProducts(mockProducts, 'GAMING');
      const result2 = ProductHelper.filterProducts(mockProducts, 'gaming');
      const result3 = ProductHelper.filterProducts(mockProducts, 'Gaming');
      
      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
    });
  });

  describe('formatPrice', () => {
    test('should format prices correctly', () => {
      expect(ProductHelper.formatPrice(1000000)).toBe('Rp 1.000.000');
      expect(ProductHelper.formatPrice(50000)).toBe('Rp 50.000');
      expect(ProductHelper.formatPrice(999)).toBe('Rp 999');
    });

    test('should handle invalid prices', () => {
      expect(ProductHelper.formatPrice(null)).toBe('Rp 0');
      expect(ProductHelper.formatPrice(undefined)).toBe('Rp 0');
      expect(ProductHelper.formatPrice('invalid')).toBe('Rp 0');
      expect(ProductHelper.formatPrice(NaN)).toBe('Rp 0');
    });

    test('should handle zero and negative prices', () => {
      expect(ProductHelper.formatPrice(0)).toBe('Rp 0');
      expect(ProductHelper.formatPrice(-1000)).toBe('Rp 0');
    });
  });

  describe('validateProductData', () => {
    test('should validate correct product data', () => {
      const validProduct = {
        title: 'Gaming Laptop',
        price: 15000000,
        category: 'Electronics',
        description: 'High-end gaming laptop'
      };

      const result = ProductHelper.validateProductData(validProduct);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should catch missing required fields', () => {
      const invalidProduct = {
        title: '',
        price: -100,
        category: ''
      };

      const result = ProductHelper.validateProductData(invalidProduct);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Title is required');
      expect(result.errors).toContain('Valid price is required');
      expect(result.errors).toContain('Category is required');
    });

    test('should validate price correctly', () => {
      const products = [
        { title: 'Test', price: 'invalid', category: 'Test' },
        { title: 'Test', price: null, category: 'Test' },
        { title: 'Test', price: -500, category: 'Test' }
      ];

      products.forEach(product => {
        const result = ProductHelper.validateProductData(product);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Valid price is required');
      });
    });
  });

  describe('sortProducts', () => {
    let mockProducts;

    beforeEach(() => {
      mockProducts = [
        { id: 1, title: 'Zebra Product', price: 1000000, category: 'B-Category' },
        { id: 2, title: 'Alpha Product', price: 500000, category: 'A-Category' },
        { id: 3, title: 'Beta Product', price: 1500000, category: 'C-Category' }
      ];
    });

    test('should sort by name/title alphabetically', () => {
      const sorted = ProductHelper.sortProducts(mockProducts, 'name');
      expect(sorted[0].title).toBe('Alpha Product');
      expect(sorted[1].title).toBe('Beta Product');
      expect(sorted[2].title).toBe('Zebra Product');
    });

    test('should sort by price low to high', () => {
      const sorted = ProductHelper.sortProducts(mockProducts, 'price_low');
      expect(sorted[0].price).toBe(500000);
      expect(sorted[1].price).toBe(1000000);
      expect(sorted[2].price).toBe(1500000);
    });

    test('should sort by price high to low', () => {
      const sorted = ProductHelper.sortProducts(mockProducts, 'price_high');
      expect(sorted[0].price).toBe(1500000);
      expect(sorted[1].price).toBe(1000000);
      expect(sorted[2].price).toBe(500000);
    });

    test('should sort by category', () => {
      const sorted = ProductHelper.sortProducts(mockProducts, 'category');
      expect(sorted[0].category).toBe('A-Category');
      expect(sorted[1].category).toBe('B-Category');
      expect(sorted[2].category).toBe('C-Category');
    });

    test('should not modify original array', () => {
      const originalLength = mockProducts.length;
      const originalFirst = mockProducts[0].title;
      
      ProductHelper.sortProducts(mockProducts, 'name');
      
      expect(mockProducts).toHaveLength(originalLength);
      expect(mockProducts[0].title).toBe(originalFirst);
    });

    test('should handle invalid sort parameters', () => {
      const sorted = ProductHelper.sortProducts(mockProducts, 'invalid');
      expect(sorted).toHaveLength(mockProducts.length);
    });
  });
});

describe('Product Integration Tests', () => {
  let mockProducts;

  beforeEach(() => {
    mockProducts = [
      { id: 1, title: 'Gaming Laptop ASUS', description: 'High-end gaming laptop', category: 'Electronics', price: 15000000 },
      { id: 2, title: 'Office Mouse Logitech', description: 'Wireless office mouse', category: 'Accessories', price: 200000 },
      { id: 3, title: 'Gaming Phone Samsung', description: 'Latest gaming phone', category: 'Electronics', price: 8000000 }
    ];
  });

  test('should perform complete search and sort workflow', () => {
    const searchResults = ProductHelper.filterProducts(mockProducts, 'gaming');
    expect(searchResults).toHaveLength(2);

    const sortedResults = ProductHelper.sortProducts(searchResults, 'price_low');
    expect(sortedResults[0].price).toBeLessThan(sortedResults[1].price);

    const formattedResults = sortedResults.map(product => ({
      ...product,
      formattedPrice: ProductHelper.formatPrice(product.price)
    }));

    expect(formattedResults[0].formattedPrice).toContain('Rp');
    expect(formattedResults[1].formattedPrice).toContain('Rp');
  });

  test('should handle empty search results gracefully', () => {
    const searchResults = ProductHelper.filterProducts(mockProducts, 'notfound');
    expect(searchResults).toHaveLength(0);

    const sortedResults = ProductHelper.sortProducts(searchResults, 'price_low');
    expect(sortedResults).toHaveLength(0);
  });
}); 